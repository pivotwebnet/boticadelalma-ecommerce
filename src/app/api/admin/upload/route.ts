import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { UPLOADS_DIR } from '@/lib/storage'

export const runtime = 'nodejs'

const MAX_BYTES = 6 * 1024 * 1024 // 6 MB
const ALLOWED: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
}

// Subida genérica de una imagen (fotos de productos). Devuelve la URL pública
// /api/media/<archivo>. Protegida por el middleware (requiere sesión admin).
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

  const bytes = Buffer.from(await file.arrayBuffer())
  const filename = `prod-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  fs.writeFileSync(path.join(UPLOADS_DIR, filename), bytes)

  return NextResponse.json({ url: `/api/media/${filename}` })
}
