import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { updateProduct, deleteProduct } from '@/lib/api'

type Params = { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params
  const body = await req.json()
  const ok = await updateProduct(id, body)
  if (ok) revalidateTag('products')
  return ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const ok = await deleteProduct(id)
  if (ok) revalidateTag('products')
  return ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: 'Error al eliminar' }, { status: 500 })
}
