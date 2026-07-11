import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { importProducts, ImportProductRow } from '@/lib/api'

export async function POST(req: NextRequest) {
  const rows = (await req.json()) as ImportProductRow[]
  const result = await importProducts(rows)
  if (result.ok) revalidateTag('products')
  return NextResponse.json(result.ok ? result.data : { error: result.error }, { status: result.ok ? 200 : 400 })
}
