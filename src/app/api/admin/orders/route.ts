import { NextRequest, NextResponse } from 'next/server'
import { getAllOrders, createOrder } from '@/lib/api'

export async function GET() {
  const orders = await getAllOrders()
  return NextResponse.json(orders)
}

// Carga de ventas manuales (WhatsApp / presencial) desde el panel.
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { customerName, customerEmail, items } = body
  if (!customerName || !customerEmail || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'Faltan datos requeridos (cliente y al menos un producto).' }, { status: 400 })
  }

  const result = await createOrder(body, { admin: true })
  if (!result.ok) {
    const data = result.data as { error?: string } | string
    const error = typeof data === 'string' ? data : (data?.error ?? 'No se pudo crear la orden')
    return NextResponse.json({ error }, { status: 400 })
  }
  return NextResponse.json(result.data, { status: 201 })
}
