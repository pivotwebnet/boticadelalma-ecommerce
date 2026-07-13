// Rate limiting simple en memoria, por (clave + IP), para endpoints públicos de
// escritura (crear orden, dejar reseña). Frena spam/abuso desde el lado Next, que
// es donde se ve la IP real del cliente (vía x-forwarded-for de Cloudflare/Coolify).
//
// Nota: es por instancia del servidor. La defensa escalable/edge es Cloudflare
// (rate limiting + Bot Fight Mode); esto es defensa en profundidad. Ver CONTEXTO.md.

type Bucket = { count: number; first: number }
const buckets = new Map<string, Bucket>()

// Devuelve true si la petición está PERMITIDA, false si superó el límite.
export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now()
  const b = buckets.get(key)
  if (!b || now - b.first > windowMs) {
    buckets.set(key, { count: 1, first: now })
    return true
  }
  b.count++
  return b.count <= max
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
