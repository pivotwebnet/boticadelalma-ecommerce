import { NextRequest, NextResponse } from 'next/server'
import { getCategories } from '@/lib/api'
import { tooMany } from '@/lib/rate-limit'

export async function GET(req: NextRequest) {
  if (tooMany(req, 'categories', 120, 60_000)) {
    return NextResponse.json(
      { error: 'Demasiadas peticiones. Esperá un momento.' },
      { status: 429 },
    )
  }

  const categories = await getCategories()
  return NextResponse.json(categories)
}
