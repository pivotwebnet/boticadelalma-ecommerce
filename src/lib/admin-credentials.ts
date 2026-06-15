import fs from 'fs'
import path from 'path'

const CREDS_FILE = path.join(process.cwd(), 'data', 'admin.json')

export interface AdminCredentials {
  hash: string
  salt: string
}

export function credentialsExist(): boolean {
  try { return fs.existsSync(CREDS_FILE) } catch { return false }
}

export function readCredentials(): AdminCredentials | null {
  try { return JSON.parse(fs.readFileSync(CREDS_FILE, 'utf-8')) } catch { return null }
}

export function writeCredentials(creds: AdminCredentials): void {
  const dir = path.dirname(CREDS_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(CREDS_FILE, JSON.stringify(creds, null, 2), 'utf-8')
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
}

function fromHex(hex: string): Uint8Array {
  return new Uint8Array((hex.match(/.{2}/g) ?? []).map(h => parseInt(h, 16)))
}

export async function hashPassword(password: string): Promise<AdminCredentials> {
  const saltBuf = new ArrayBuffer(16)
  const salt = new Uint8Array(saltBuf)
  crypto.getRandomValues(salt)
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'],
  )
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: saltBuf, iterations: 100_000, hash: 'SHA-256' }, key, 256,
  )
  return { hash: toHex(new Uint8Array(bits)), salt: toHex(salt) }
}

export async function verifyPassword(password: string, creds: AdminCredentials): Promise<boolean> {
  try {
    const saltBuf = fromHex(creds.salt).buffer as ArrayBuffer
    const key = await crypto.subtle.importKey(
      'raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'],
    )
    const bits = await crypto.subtle.deriveBits(
      { name: 'PBKDF2', salt: saltBuf, iterations: 100_000, hash: 'SHA-256' }, key, 256,
    )
    return toHex(new Uint8Array(bits)) === creds.hash
  } catch { return false }
}
