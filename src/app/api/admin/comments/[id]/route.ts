import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { deleteComment } from '@/lib/api'

type Params = { params: Promise<{ id: string }> }

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const ok = await deleteComment(id)
  if (ok) revalidateTag('products')
  return ok
    ? NextResponse.json({ ok: true })
    : NextResponse.json({ error: 'Error al eliminar' }, { status: 500 })
}
