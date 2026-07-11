import { NextRequest, NextResponse } from 'next/server'
import { getPublicOrder } from '@/lib/api'

type Params = { params: Promise<{ id: string }> }

// Comprobante público de una orden. La pantalla de éxito del carrito
// (src/app/carrito/page.tsx) la consulta para mostrar los productos, el total y
// el estado de la orden recién creada.
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params

  const order = await getPublicOrder(id)
  if (!order) {
    return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 })
  }

  return NextResponse.json(order)
}
