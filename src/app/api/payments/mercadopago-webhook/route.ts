import { NextRequest, NextResponse } from 'next/server'

// Proxy del webhook de Mercado Pago.
//
// Mercado Pago notifica los pagos a una URL PÚBLICA. En este proyecto solo el
// frontend Next.js se expone a internet; el backend .NET vive en red interna
// (ver CONTEXTO.md → Seguridad / Despliegue). Por eso la notificación entra acá
// y se reenvía al backend, que valida el pago contra la API de Mercado Pago y
// marca la orden como pagada.
//
// La preferencia se crea con notification_url = {SiteUrl}/api/payments/mercadopago-webhook
// (ver backend OrdersController.TryGenerateMercadoPagoPreference).

const API_URL = process.env.API_URL ?? 'http://localhost:5066'

async function forward(req: NextRequest) {
  // Conserva los query params (topic, id, type, data.id) que MP manda en la URL.
  const search = req.nextUrl.search
  const body = await req.text()

  try {
    const res = await fetch(`${API_URL}/api/payments/mercadopago-webhook${search}`, {
      method: 'POST',
      headers: { 'Content-Type': req.headers.get('content-type') ?? 'application/json' },
      body: body || undefined,
    })
    // Devolvemos el mismo código; MP solo necesita un 200 para dejar de reintentar.
    return new NextResponse(null, { status: res.ok ? 200 : res.status })
  } catch {
    // 500 → Mercado Pago reintenta más tarde (fallo transitorio de red).
    return new NextResponse(null, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  return forward(req)
}

// Algunas integraciones de MP hacen un GET de validación al configurar la URL.
export async function GET() {
  return new NextResponse(null, { status: 200 })
}
