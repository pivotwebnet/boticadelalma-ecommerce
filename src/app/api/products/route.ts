import { NextRequest, NextResponse } from 'next/server'
import { getProducts } from '@/lib/api'
import { tooMany } from '@/lib/rate-limit'

export async function GET(req: NextRequest) {
  // Lectura cara: reenvía al backend/DB. Limitamos para que un bot no lo martille.
  if (tooMany(req, 'products', 120, 60_000)) {
    return NextResponse.json(
      { error: 'Demasiadas peticiones. Esperá un momento.' },
      { status: 429 },
    )
  }

  const { searchParams } = new URL(req.url)
  const categoryId = searchParams.get('categoryId') ?? undefined
  const search = searchParams.get('search') ?? undefined
  const products = await getProducts({ categoryId, search })
  return NextResponse.json(products)
}
