import { NextRequest, NextResponse } from 'next/server'
import { credentialsExist, writeCredentials, hashPassword } from '@/lib/admin-credentials'

export async function GET() {
  // Setup requerido solo si no hay contraseña configurada de ninguna forma
  const setupRequired = !credentialsExist() && !process.env.ADMIN_PASSWORD
  return NextResponse.json({ setupRequired })
}

export async function POST(req: NextRequest) {
  if (credentialsExist() || process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: 'La configuración inicial ya fue completada' },
      { status: 403 },
    )
  }

  const { password, confirm } = await req.json()

  if (!password || password.length < 8) {
    return NextResponse.json(
      { error: 'La contraseña debe tener al menos 8 caracteres' },
      { status: 400 },
    )
  }

  if (password !== confirm) {
    return NextResponse.json({ error: 'Las contraseñas no coinciden' }, { status: 400 })
  }

  const creds = await hashPassword(password)
  writeCredentials(creds)

  return NextResponse.json({ ok: true })
}
