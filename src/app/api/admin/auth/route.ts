import { NextRequest, NextResponse } from 'next/server'
import { createSessionToken, SESSION_COOKIE } from '@/lib/admin-auth'
import { credentialsExist, readCredentials, verifyPassword } from '@/lib/admin-credentials'

export async function POST(req: NextRequest) {
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
    return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 })
  }

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
