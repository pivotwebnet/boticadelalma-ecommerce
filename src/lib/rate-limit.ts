// Rate limiting simple en memoria, por (clave + IP), para endpoints públicos de
// escritura (crear orden, dejar reseña) y para las lecturas caras que reenvían al
// backend (catálogo, comprobante). Frena spam/abuso desde el lado Next.
//
// Límites de diseño (a propósito): es POR INSTANCIA del servidor y se resetea en
// cada redeploy. La defensa real contra bots/DDoS es el borde (Cloudflare: Rate
// Limiting Rules + Bot Fight Mode + cache del catálogo). Esto es defensa en
// profundidad, no la primera línea. Ver CONTEXTO.md.

type Bucket = { count: number; first: number }
const buckets = new Map<string, Bucket>()

// Tope de memoria del Map: ante un bot que rota millones de IPs, el Map no puede
// crecer sin fin. Al pasarse, podamos lo vencido y, si aún sobra, evictamos lo más
// viejo (FIFO — Map conserva el orden de inserción).
const MAX_BUCKETS = 20_000

// Ventana global de ráfaga: tope TOTAL de peticiones/segundo por instancia, sumando
// todas las IPs. El límite por-IP no frena un pico distribuido (5000 IPs distintas);
// este sí pone un techo agregado para que el backend no se caiga. Alto para no
// molestar al tráfico legítimo de una tienda chica.
const GLOBAL_MAX_PER_SEC = 300

// Máxima antigüedad posible de un bucket (todas nuestras ventanas son ≤ 15 min):
// pasado esto, seguro está vencido y se puede borrar sin mirar su ventana propia.
const MAX_AGE_MS = 60 * 60 * 1000

let lastPrune = 0

function prune(now: number): void {
  // Poda barata: como mucho una vez por minuto, salvo que el Map esté creciendo.
  if (buckets.size < MAX_BUCKETS && now - lastPrune < 60_000) return
  lastPrune = now
  for (const [k, b] of buckets) {
    if (now - b.first > MAX_AGE_MS) buckets.delete(k)
  }
  // Si tras podar lo vencido todavía estamos sobre el tope, es un ataque con muchas
  // IPs vivas: evictamos las entradas más viejas hasta volver bajo el límite.
  while (buckets.size > MAX_BUCKETS) {
    const oldest = buckets.keys().next().value
    if (oldest === undefined) break
    buckets.delete(oldest)
  }
}

// Devuelve true si la petición está PERMITIDA, false si superó el límite.
export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now()
  const b = buckets.get(key)
  if (!b || now - b.first > windowMs) {
    prune(now)
    buckets.set(key, { count: 1, first: now })
    return true
  }
  b.count++
  return b.count <= max
}

// Tope global de ráfaga por instancia (todas las IPs juntas). Se comparte una sola
// entrada '__global__' con ventana de 1 segundo.
export function globalLimit(): boolean {
  return rateLimit('__global__', GLOBAL_MAX_PER_SEC, 1_000)
}

// IP real del cliente. Preferimos los headers que setea el proxy de borde y que el
// cliente NO puede falsificar (Cloudflare `cf-connecting-ip`, Akamai/otros
// `true-client-ip`). `x-forwarded-for` es el último recurso porque el cliente puede
// inyectarlo si la app queda expuesta sin proxy: solo se usa si no hay nada mejor.
// Ver CONTEXTO.md → detrás de Cloudflare/Coolify.
export function clientIp(req: Request): string {
  const cf = req.headers.get('cf-connecting-ip')?.trim()
  if (cf) return cf
  const tci = req.headers.get('true-client-ip')?.trim()
  if (tci) return tci
  const fwd = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim()
  return fwd || 'local'
}

// Guard combinado: aplica el tope global de ráfaga Y el límite por-IP. Devuelve true
// si hay que BLOQUEAR (responder 429), false si se puede seguir.
export function tooMany(req: Request, key: string, max: number, windowMs: number): boolean {
  if (!globalLimit()) return true
  if (!rateLimit(`${key}:${clientIp(req)}`, max, windowMs)) return true
  return false
}
