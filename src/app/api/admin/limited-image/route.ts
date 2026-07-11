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

const MEDIA_PREFIX = '/api/media/'

function removeIfUploaded(url: string | null | undefined) {
  if (url && url.startsWith(MEDIA_PREFIX)) {
    const name = url.slice(MEDIA_PREFIX.length)
    try { fs.unlinkSync(path.join(UPLOADS_DIR, name)) } catch { /* ya no existe */ }
  }
}

export async function GET() {
  return NextResponse.json(readSiteSettings())
}

// Sube la imagen de la sección "Edición Limitada".
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

  // Borra la imagen subida anterior (no toca la imagen por defecto).
  removeIfUploaded(readSiteSettings().limitedImageUrl)

  const bytes = Buffer.from(await file.arrayBuffer())
  const filename = `limited-${Date.now()}.${ext}`
  fs.writeFileSync(path.join(UPLOADS_DIR, filename), bytes)

  const limitedImageUrl = `${MEDIA_PREFIX}${filename}`
  writeSiteSettings({ limitedImageUrl })
  return NextResponse.json({ limitedImageUrl })
}

// Vuelve a la imagen por defecto.
export async function DELETE() {
  removeIfUploaded(readSiteSettings().limitedImageUrl)
  writeSiteSettings({ limitedImageUrl: null })
  return NextResponse.json({ limitedImageUrl: null })
}
