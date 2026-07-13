import { NextRequest, NextResponse } from 'next/server'
import { getPublicOrder } from '@/lib/api'
import type { ApiOrder } from '@/lib/api'
import { tooMany } from '@/lib/rate-limit'

type Params = { params: Promise<{ id: string }> }

// El id de orden es un GUID. Validamos el formato antes de tocar el backend para
// no reenviar basura (y frenar sondeos con ids arbitrarios).
const GUID_RE = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/

// Enmascara un email: "sofia@gmail.com" → "so***@gmail.com".
function maskEmail(email: string): string {
  const [user, domain] = email.split('@')
  if (!domain) return '***'
  const visible = user.slice(0, 2)
  return `${visible}${'*'.repeat(Math.max(1, user.length - 2))}@${domain}`
}

// Versión redactada del comprobante: muestra lo justo para que el comprador
// reconozca su compra (items, total, estado, ciudad, nombre) SIN exponer datos
// sensibles (teléfono, dirección exacta, notas, email completo). Se devuelve
// cuando quien consulta no prueba pertenencia con el email correcto.
function redact(order: ApiOrder) {
  return {
    id: order.id,
    status: order.status,
    total: order.total,
    customerName: order.customerName,
    customerEmail: order.customerEmail ? maskEmail(order.customerEmail) : '',
    city: order.city,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    items: order.items,
    redacted: true,
  }
}

// Comprobante público de una orden. La pantalla de éxito del carrito
// (src/app/carrito/page.tsx) la consulta para mostrar los productos, el total y
// el estado de la orden recién creada.
//
// SEGURIDAD: el GUID por sí solo NO es un secreto (viaja en URLs, historial, etc.),
// así que sin verificación devolvería datos personales (teléfono, dirección) a
// cualquiera que consiga el id. Por eso los datos completos solo se entregan si
// se pasa `?email=` y coincide con el de la orden (pertenencia); de lo contrario
// se devuelve una versión redactada.
export async function GET(req: NextRequest, { params }: Params) {
  // Lectura que reenvía al backend y, además, frena sondeos de IDs por fuerza bruta.
  if (tooMany(req, 'order-public', 60, 60_000)) {
    return NextResponse.json(
      { error: 'Demasiadas peticiones. Esperá un momento.' },
      { status: 429 },
    )
  }

  const { id } = await params

  if (!GUID_RE.test(id)) {
    return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 })
  }

  const order = await getPublicOrder(id)
  if (!order) {
    return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 })
  }

  const email = req.nextUrl.searchParams.get('email')?.trim().toLowerCase() ?? ''
  const owner = email.length > 0 && email === (order.customerEmail ?? '').trim().toLowerCase()

  return NextResponse.json(owner ? order : redact(order))
}
