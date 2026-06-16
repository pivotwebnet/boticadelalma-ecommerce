import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { readSiteSettings, writeSiteSettings } from '@/lib/site-settings'
import { UPLOADS_DIR } from '@/lib/storage'

export const runtime = 'nodejs'

const MAX_BYTES = 6 * 1024 * 1024 // 6 MB
const ALLOWED: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
}

// Las imágenes se sirven por esta ruta (no por /public): el filename va con
// timestamp, así que Cloudflare/el navegador pueden cachearlas para siempre y
// un banner nuevo (filename distinto) invalida la caché solo.
const MEDIA_PREFIX = '/api/media/'

// Borra el archivo de un banner subido anterior (si lo hubiera).
function removeIfUploaded(url: string | null | undefined) {
  if (url && url.startsWith(MEDIA_PREFIX)) {
    const name = url.slice(MEDIA_PREFIX.length)
    try { fs.unlinkSync(path.join(UPLOADS_DIR, name)) } catch { /* ya no existe */ }
  }
}

export async function GET() {
  return NextResponse.json(readSiteSettings())
}

// Sube una imagen y la deja como fondo del banner principal.
export async function POST(req: NextRequest) {
  const form = await req.formData().catch(() => null)
  const file = form?.get('file')

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No se recibió ninguna imagen.' }, { status: 400 })
  }
  const ext = ALLOWED[file.type]
  if (!ext) {
    return NextResponse.json({ error: 'Formato no permitido. Usá JPG, PNG, WebP o AVIF.' }, { status: 400 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'La imagen supera el máximo de 6 MB.' }, { status: 400 })
  }

  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true })

  // Borra el banner subido anterior (no toca la imagen por defecto del repo).
  removeIfUploaded(readSiteSettings().heroImageUrl)

  const bytes = Buffer.from(await file.arrayBuffer())
  const filename = `hero-${Date.now()}.${ext}`
  fs.writeFileSync(path.join(UPLOADS_DIR, filename), bytes)

  const heroImageUrl = `${MEDIA_PREFIX}${filename}`
  writeSiteSettings({ heroImageUrl })
  return NextResponse.json({ heroImageUrl })
}

// Vuelve al banner por defecto.
export async function DELETE() {
  removeIfUploaded(readSiteSettings().heroImageUrl)
  writeSiteSettings({ heroImageUrl: null })
  return NextResponse.json({ heroImageUrl: null })
}
