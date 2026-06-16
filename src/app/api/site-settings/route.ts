import { NextResponse } from 'next/server'
import { readSiteSettings } from '@/lib/site-settings'

// Configuración pública de la tienda (la lee la home para el banner, etc.).
export const dynamic = 'force-dynamic'

export async function GET() {
  // Sin caché: así un cambio de banner se ve al instante (Cloudflare no lo guarda).
  return NextResponse.json(readSiteSettings(), {
    headers: { 'Cache-Control': 'no-store' },
  })
}
