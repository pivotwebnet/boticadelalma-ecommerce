import { NextRequest, NextResponse } from 'next/server'
import { updateOrderStatus } from '@/lib/api'

type Params = { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params
  const { status } = await req.json()
  const ok = await updateOrderStatus(id, status)
  return ok
    ? NextResponse.json({ ok: true })
    : NextResponse.json({ error: 'Error al actualizar estado' }, { status: 500 })
}
