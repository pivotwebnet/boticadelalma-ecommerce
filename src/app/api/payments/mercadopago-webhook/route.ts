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
//
// SEGURIDAD (defensa en profundidad): esta URL es pública y sin autenticar, así
// que cualquiera puede POSTearla. Si definís MERCADOPAGO_WEBHOOK_SECRET (la clave
// secreta del webhook que da MP en el panel), acá validamos la firma `x-signature`
// y descartamos notificaciones falsas ANTES de tocar el backend. El backend igual
// DEBE re-consultar el pago a la API de MP y no confiar en el payload: esto es una
// capa extra, no la única.

export const runtime = 'nodejs'

const API_URL = process.env.API_URL ?? 'http://localhost:5066'
const WEBHOOK_SECRET = process.env.MERCADOPAGO_WEBHOOK_SECRET ?? ''

// Tope defensivo: un webhook legítimo de MP es chico. Cortamos cualquier cuerpo
// desmesurado para no reenviar payloads gigantes al backend (anti-DoS).
const MAX_BODY_BYTES = 64 * 1024

function hex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

// Comparación de firmas en tiempo constante.
function safeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

// Valida la firma `x-signature: ts=...,v1=...` según el esquema de Mercado Pago.
// Manifest = `id:<data.id>;request-id:<x-request-id>;ts:<ts>;` firmado con HMAC-SHA256.
async function signatureValid(req: NextRequest): Promise<boolean> {
  const xSignature = req.headers.get('x-signature')
  const xRequestId = req.headers.get('x-request-id') ?? ''
  if (!xSignature) return false

  let ts = ''
  let v1 = ''
  for (const part of xSignature.split(',')) {
    const [rawK, rawV] = part.split('=')
    const k = rawK?.trim()
    const v = rawV?.trim()
    if (k === 'ts') ts = v ?? ''
    else if (k === 'v1') v1 = v ?? ''
  }
  if (!ts || !v1) return false

  // El id del recurso viaja en el query (`data.id`, o `id` en algunos topics).
  // MP indica usarlo en minúsculas cuando es alfanumérico.
  const dataId = (
    req.nextUrl.searchParams.get('data.id') ??
    req.nextUrl.searchParams.get('id') ??
    ''
  ).toLowerCase()

  const manifest =
    (dataId ? `id:${dataId};` : '') +
    (xRequestId ? `request-id:${xRequestId};` : '') +
    `ts:${ts};`

  try {
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(WEBHOOK_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign'],
    )
    const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(manifest))
    return safeEqualHex(hex(sig), v1)
  } catch {
    return false
  }
}

async function forward(req: NextRequest) {
  // Conserva los query params (topic, id, type, data.id) que MP manda en la URL.
  const search = req.nextUrl.search
  const body = await req.text()

  if (body.length > MAX_BODY_BYTES) {
    return new NextResponse(null, { status: 413 })
  }

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
  // Si hay secreto configurado, exigimos firma válida y descartamos lo falso.
  // Devolvemos 200 igual (no le damos pistas a un atacante ni provocamos
  // reintentos infinitos de MP ante una notificación que no vamos a procesar).
  if (WEBHOOK_SECRET && !(await signatureValid(req))) {
    return new NextResponse(null, { status: 200 })
  }
  return forward(req)
}

// Algunas integraciones de MP hacen un GET de validación al configurar la URL.
export async function GET() {
  return new NextResponse(null, { status: 200 })
}
