import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { getCategories, createCategory } from '@/lib/api'

export async function GET() {
  const categories = await getCategories()
  return NextResponse.json(categories)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const result = await createCategory(body)
  if (result.ok) {
    revalidateTag('categories')
    revalidateTag('products')
  }
  return NextResponse.json(result.data, { status: result.ok ? 201 : 400 })
}
