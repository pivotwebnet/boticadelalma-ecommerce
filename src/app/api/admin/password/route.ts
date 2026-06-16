import { NextRequest, NextResponse } from 'next/server'
import {
  credentialsExist, readCredentials, writeCredentials,
  hashPassword, verifyPassword,
} from '@/lib/admin-credentials'

// Cambio de contraseña del panel. Protegido por el middleware (requiere sesión).
export async function POST(req: NextRequest) {
  const { currentPassword, newPassword, confirm } = await req.json()

  if (!newPassword || newPassword.length < 8) {
    return NextResponse.json({ error: 'La nueva contraseña debe tener al menos 8 caracteres.' }, { status: 400 })
  }
  if (newPassword !== confirm) {
    return NextResponse.json({ error: 'Las contraseñas no coinciden.' }, { status: 400 })
  }

  // Verifica la contraseña actual contra el archivo o, si todavía no existe, contra el .env.
  const stored = credentialsExist() ? readCredentials() : null
  let currentOk = false
  if (stored) {
    currentOk = await verifyPassword(currentPassword ?? '', stored)
  } else if (process.env.ADMIN_PASSWORD) {
    currentOk = (currentPassword ?? '') === process.env.ADMIN_PASSWORD
  } else {
    // No hay credenciales aún: no debería llegar acá (lo cubre /setup).
    return NextResponse.json({ error: 'No hay una contraseña configurada todavía.' }, { status: 400 })
  }

  if (!currentOk) {
    return NextResponse.json({ error: 'La contraseña actual es incorrecta.' }, { status: 401 })
  }

  const creds = await hashPassword(newPassword)
  writeCredentials(creds)

  return NextResponse.json({ ok: true })
}
