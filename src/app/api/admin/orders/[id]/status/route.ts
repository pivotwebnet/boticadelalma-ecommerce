import { NextRequest, NextResponse } from 'next/server'
import { updateOrderStatus } from '@/lib/api'

type Params = { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params
  const { status } = await req.json()
  const result = await updateOrderStatus(id, status)
  return result.ok
    ? NextResponse.json({ ok: true })
    : NextResponse.json({ error: result.error ?? 'Error al actualizar estado' }, { status: 400 })
}
