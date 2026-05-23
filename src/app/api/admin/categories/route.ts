import { NextRequest, NextResponse } from 'next/server'
import { getCategories, createCategory } from '@/lib/api'

export async function GET() {
  const categories = await getCategories()
  return NextResponse.json(categories)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const result = await createCategory(body)
  return NextResponse.json(result.data, { status: result.ok ? 201 : 400 })
}
