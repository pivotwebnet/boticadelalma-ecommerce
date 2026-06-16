import { NextRequest, NextResponse } from 'next/server'
import { createSessionToken, SESSION_COOKIE } from '@/lib/admin-auth'
import { credentialsExist, readCredentials, verifyPassword } from '@/lib/admin-credentials'

// Rate limiting simple en memoria: bloquea tras varios intentos fallidos por IP.
const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000 // 15 minutos
const attempts = new Map<string, { count: number; first: number }>()

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for')
  return fwd ? fwd.split(',')[0].trim() : 'local'
}

function checkLocked(ip: string): boolean {
  const rec = attempts.get(ip)
  if (!rec) return false
  if (Date.now() - rec.first > WINDOW_MS) { attempts.delete(ip); return false }
  return rec.count >= MAX_ATTEMPTS
}

function registerFailure(ip: string): void {
  const rec = attempts.get(ip)
  if (!rec || Date.now() - rec.first > WINDOW_MS) {
    attempts.set(ip, { count: 1, first: Date.now() })
  } else {
    rec.count++
  }
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req)
  if (checkLocked(ip)) {
    return NextResponse.json(
      { error: 'Demasiados intentos fallidos. Esperá unos minutos e intentá de nuevo.' },
      { status: 429 },
    )
  }

  const { password } = await req.json()

  if (!password) {
    return NextResponse.json({ error: 'Contraseña requerida' }, { status: 400 })
  }

  let valid = false
  const stored = credentialsExist() ? readCredentials() : null

  if (stored) {
    // El cliente ya configuró su propia contraseña — el env var queda ignorado
    valid = await verifyPassword(password, stored)
  } else if (process.env.ADMIN_PASSWORD) {
    // Acceso inicial con contraseña temporal del .env
    valid = password === process.env.ADMIN_PASSWORD
  } else {
    return NextResponse.json(
      { error: 'Configuración inicial requerida', setupRequired: true },
      { status: 403 },
    )
  }

  if (!valid) {
    registerFailure(ip)
    return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 })
  }

  attempts.delete(ip) // login exitoso: limpia el contador
  const token = await createSessionToken()
  const res = NextResponse.json({ ok: true })
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.delete(SESSION_COOKIE)
  return res
}
