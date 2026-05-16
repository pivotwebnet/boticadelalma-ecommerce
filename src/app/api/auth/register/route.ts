import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email y contraseña son requeridos' }, { status: 400 })
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: 'La contraseña debe tener al menos 6 caracteres' },
      { status: 400 }
    )
  }

  try {
    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        name: name?.trim() || null,
        email: email.toLowerCase().trim(),
        password: hashed,
      },
    })
    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 })
  } catch (err: unknown) {
    if (
      err &&
      typeof err === 'object' &&
      'code' in err &&
      (err as { code: string }).code === 'P2002'
    ) {
      return NextResponse.json(
        { error: 'Ya existe una cuenta con ese email' },
        { status: 409 }
      )
    }
    throw err
  }
}
