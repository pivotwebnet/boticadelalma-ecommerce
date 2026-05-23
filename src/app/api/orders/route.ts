import { NextRequest, NextResponse } from 'next/server'
import { createOrder } from '@/lib/api'

export async function POST(req: NextRequest) {
  const body = await req.json()

  const { customerName, customerEmail, items } = body
  if (!customerName || !customerEmail || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 })
  }

  const result = await createOrder(body)

  if (!result.ok) {
    return NextResponse.json(result.data, { status: 500 })
  }

  return NextResponse.json(result.data, { status: 201 })
}
