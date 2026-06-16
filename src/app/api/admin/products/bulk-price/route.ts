import { NextRequest, NextResponse } from 'next/server'
import { bulkAdjustPrices } from '@/lib/api'

// Ajuste masivo de precios (descuento/aumento) sobre una selección de productos.
export async function POST(req: NextRequest) {
  const { productIds, percent, mode } = await req.json()

  if (!Array.isArray(productIds) || productIds.length === 0) {
    return NextResponse.json({ error: 'Elegí al menos un producto.' }, { status: 400 })
  }
  if (mode !== 'discount' && mode !== 'increase') {
    return NextResponse.json({ error: 'Modo inválido.' }, { status: 400 })
  }
  const pct = Number(percent)
  if (!Number.isFinite(pct) || pct < 1) {
    return NextResponse.json({ error: 'El porcentaje debe ser mayor a 0.' }, { status: 400 })
  }

  const result = await bulkAdjustPrices(productIds, pct, mode)
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }
  return NextResponse.json({ updated: result.updated })
}
