import { NextRequest, NextResponse } from 'next/server'
import { createOrder } from '@/lib/api'
import { rateLimit, clientIp } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  // Anti-spam / anti-agotamiento de stock: máx 8 órdenes por minuto por IP.
  if (!rateLimit(`orders:${clientIp(req)}`, 8, 60_000)) {
    return NextResponse.json(
      { error: 'Demasiados intentos. Esperá un momento e intentá de nuevo.' },
      { status: 429 },
    )
  }

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
