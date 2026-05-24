import { NextRequest, NextResponse } from 'next/server'
import { getProducts } from '@/lib/api'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const categoryId = searchParams.get('categoryId') ?? undefined
  const search = searchParams.get('search') ?? undefined
  const products = await getProducts({ categoryId, search })
  return NextResponse.json(products)
}
