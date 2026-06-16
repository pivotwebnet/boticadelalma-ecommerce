export const SESSION_COOKIE = 'botica-admin-session'

// Duración de la sesión (7 días). El token lleva su propia expiración firmada,
// así que ya no es un valor estático que vale para siempre.
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7

function getSecret(): string {
  return process.env.ADMIN_SESSION_SECRET ?? 'dev-secret-change-me'
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
  const pad = b64.length % 4 === 0 ? '' : '='.repeat(4 - (b64.length % 4))
  const norm = b64.replace(/-/g, '+').replace(/_/g, '/') + pad
  return atob(norm)
}

async function sign(payload: string): Promise<string> {
  const key = await getKey()
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload))
  return toBase64Url(new Uint8Array(sig))
}

export async function createSessionToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const payload = strToBase64Url(JSON.stringify({ iat: now, exp: now + SESSION_TTL_SECONDS }))
  const sig = await sign(payload)
  return `${payload}.${sig}`
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false
  try {
    const [payload, sig] = token.split('.')
    if (!payload || !sig) return false

    // Verifica la firma.
    const expectedSig = await sign(payload)
    if (sig !== expectedSig) return false

    // Verifica la expiración.
    const data = JSON.parse(base64UrlToStr(payload)) as { exp?: number }
    if (typeof data.exp !== 'number') return false
    return data.exp > Math.floor(Date.now() / 1000)
  } catch {
    return false
  }
}
