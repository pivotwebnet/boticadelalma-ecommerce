export const SESSION_COOKIE = 'botica-admin-session'

// Duración de la sesión (7 días). El token lleva su propia expiración firmada,
// así que ya no es un valor estático que vale para siempre.
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7

function getSecret(): string {
  const s = process.env.ADMIN_SESSION_SECRET
  if (s && s.length > 0) return s
  // En producción NUNCA usamos un secreto por defecto: sin secreto propio, un
  // atacante que conozca el default podría firmar sus propias sesiones y entrar
  // al panel. Fallamos cerrado (se deniega todo /admin) hasta que se configure.
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'ADMIN_SESSION_SECRET no está definido: es obligatorio en producción para firmar las sesiones del panel.',
    )
  }
  return 'dev-secret-change-me'
}

async function getKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  )
}

function toBase64Url(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function strToBase64Url(s: string): string {
  return toBase64Url(new TextEncoder().encode(s))
}

function base64UrlToStr(b64: string): string {
  return new TextDecoder().decode(base64UrlToBytes(b64))
}

function base64UrlToBytes(b64: string): Uint8Array<ArrayBuffer> {
  const pad = b64.length % 4 === 0 ? '' : '='.repeat(4 - (b64.length % 4))
  const norm = b64.replace(/-/g, '+').replace(/_/g, '/') + pad
  const bin = atob(norm)
  const bytes = new Uint8Array(new ArrayBuffer(bin.length))
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return bytes
}

async function sign(payload: string): Promise<string> {
  const key = await getKey()
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload))
  return toBase64Url(new Uint8Array(sig))
}

// Verificación de firma en tiempo constante: crypto.subtle.verify no filtra por
// timing (a diferencia de comparar dos strings con !==), así que evita ataques de
// canal lateral sobre la firma HMAC. Cualquier firma malformada devuelve false.
async function verifySignature(payload: string, sig: string): Promise<boolean> {
  try {
    const key = await getKey()
    return await crypto.subtle.verify(
      'HMAC',
      key,
      base64UrlToBytes(sig),
      new TextEncoder().encode(payload),
    )
  } catch {
    return false
  }
}

export async function createSessionToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const payload = strToBase64Url(JSON.stringify({ iat: now, exp: now + SESSION_TTL_SECONDS }))
  const sig = await sign(payload)
  return `${payload}.${sig}`
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token || typeof token !== 'string') return false
  try {
    // Debe ser exactamente "payload.firma": ni más partes ni menos.
    const parts = token.split('.')
    if (parts.length !== 2) return false
    const [payload, sig] = parts
    if (!payload || !sig) return false

    // Verifica la firma en tiempo constante.
    if (!(await verifySignature(payload, sig))) return false

    // Verifica la expiración (rechaza exp no numérico, infinito o NaN).
    const data = JSON.parse(base64UrlToStr(payload)) as { exp?: unknown }
    if (typeof data.exp !== 'number' || !Number.isFinite(data.exp)) return false
    return data.exp > Math.floor(Date.now() / 1000)
  } catch {
    return false
  }
}
