import { NextRequest, NextResponse } from 'next/server'
import { createOrder } from '@/lib/api'
import { tooMany } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  // Anti-spam / anti-agotamiento de stock: máx 8 órdenes por minuto por IP + tope global.
  if (tooMany(req, 'orders', 8, 60_000)) {
    return NextResponse.json(
      { error: 'Demasiados intentos. Esperá un momento e intentá de nuevo.' },
      { status: 429 },
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Petición inválida' }, { status: 400 })
  }
  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 })
  }

  const b = body as Record<string, unknown>
  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')

  const customerName = str(b.customerName)
  const customerEmail = str(b.customerEmail)
  const items = b.items

  if (!customerName || !customerEmail || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 })
  }

  // Topes defensivos contra payloads absurdos (una orden real no tiene 1000 ítems
  // ni nombres de 5000 caracteres). El backend igual revalida y recalcula precios.
  if (customerName.length > 200 || customerEmail.length > 200 || items.length > 100) {
    return NextResponse.json({ error: 'Datos fuera de rango' }, { status: 400 })
  }

  // Normalizamos cada ítem: solo productId (string) y quantity (entero 1..999). El
  // precio y el nombre los recalcula el backend desde la DB, así que ignoramos
  // cualquier pricePaid/productName que mande el navegador (no se puede abaratar).
  const cleanItems: { productId: string; quantity: number }[] = []
  for (const raw of items) {
    if (typeof raw !== 'object' || raw === null) {
      return NextResponse.json({ error: 'Ítem inválido' }, { status: 400 })
    }
    const it = raw as Record<string, unknown>
    const productId = typeof it.productId === 'string' ? it.productId.trim() : ''
    const quantity = Number(it.quantity)
    if (!productId || !Number.isInteger(quantity) || quantity < 1 || quantity > 999) {
      return NextResponse.json({ error: 'Ítem inválido' }, { status: 400 })
    }
    cleanItems.push({ productId, quantity })
  }

  // Reenviamos SOLO campos en whitelist (nada de `status` ni claves extra que un
  // atacante pudiera colar): la orden nace "pending" siempre en el checkout público.
  const dto = {
    customerName,
    customerEmail,
    customerPhone: str(b.customerPhone),
    address: str(b.address),
    city: str(b.city),
    notes: str(b.notes) || undefined,
    items: cleanItems,
  }

  const result = await createOrder(dto)

  if (!result.ok) {
    const data = result.data as { error?: string } | string
    const error = typeof data === 'string'
      ? data
      : (data?.error ?? 'Error al procesar la orden. Intentá de nuevo.')
    return NextResponse.json({ error }, { status: 400 })
  }

  return NextResponse.json(result.data, { status: 201 })
}
