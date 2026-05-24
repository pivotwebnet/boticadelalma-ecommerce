import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { updateCategory, deleteCategory } from '@/lib/api'

type Params = { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params
  const body = await req.json()
  const ok = await updateCategory(id, body)
  if (ok) {
    revalidateTag('categories')
    revalidateTag('products')
  }
  return ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const result = await deleteCategory(id)
  if (result.ok) {
    revalidateTag('categories')
    revalidateTag('products')
    return NextResponse.json({ ok: true })
  }
  return NextResponse.json({ error: result.error ?? 'Error al eliminar' }, { status: 400 })
}
