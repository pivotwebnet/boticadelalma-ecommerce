import { NextRequest, NextResponse } from 'next/server'
import { createOrder } from '@/lib/api'

export async function POST(req: NextRequest) {
  const body = await req.json()

  const { customerName, customerEmail, items } = body
  if (!customerName || !customerEmail || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 })
  }

  // El checkout público nunca define el estado: se descarta cualquier `status` que
  // venga del navegador para que la orden nazca "pending" (defensa en profundidad;
  // el backend además lo fuerza para peticiones sin clave admin).
  delete body.status

  const result = await createOrder(body)

  if (!result.ok) {
    const data = result.data as { error?: string } | string
    const error = typeof data === 'string'
      ? data
      : (data?.error ?? 'Error al procesar la orden. Intentá de nuevo.')
    return NextResponse.json({ error }, { status: 400 })
  }

  return NextResponse.json(result.data, { status: 201 })
}
