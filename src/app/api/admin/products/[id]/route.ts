import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { updateProduct, deleteProduct } from '@/lib/api'

type Params = { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params
  const body = await req.json()
  const result = await updateProduct(id, body)
  if (result.ok) revalidateTag('products')
  return result.ok
    ? NextResponse.json({ ok: true })
    : NextResponse.json({ error: result.error ?? 'Error al actualizar' }, { status: 400 })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const result = await deleteProduct(id)
  if (result.ok) revalidateTag('products')
  return result.ok
    ? NextResponse.json({ ok: true, softDeleted: result.softDeleted, message: result.message })
    : NextResponse.json({ error: 'Error al eliminar' }, { status: 500 })
}
