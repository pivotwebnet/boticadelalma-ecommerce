import { NextRequest, NextResponse } from 'next/server'
import { getProducts, createProduct } from '@/lib/api'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const products = await getProducts({
    categoryId: searchParams.get('categoryId') ?? undefined,
    search: searchParams.get('search') ?? undefined,
  })
  return NextResponse.json(products)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const result = await createProduct(body)
  return NextResponse.json(result.data, { status: result.ok ? 201 : 400 })
}
