import fs from 'fs'
import path from 'path'
import { DATA_DIR } from '@/lib/storage'

// Vive en el volumen persistente: así la contraseña sobrevive a los redeploys.
const CREDS_FILE = path.join(DATA_DIR, 'admin.json')

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

// Comparación en tiempo constante: recorre SIEMPRE la longitud del valor esperado
// y acumula diferencias con XOR, sin cortar al primer byte distinto. Así el tiempo
// de respuesta no filtra cuántos caracteres coincidieron (evita timing attacks).
export function safeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder()
  const ba = enc.encode(a)
  const bb = enc.encode(b)
  let diff = ba.length ^ bb.length
  for (let i = 0; i < bb.length; i++) {
    diff |= ba[i % ba.length] ^ bb[i]
  }
  return diff === 0
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
    return safeEqual(toHex(new Uint8Array(bits)), creds.hash)
  } catch { return false }
}
