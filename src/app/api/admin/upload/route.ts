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

// Verifica los "magic bytes": que el contenido REAL sea una imagen del tipo que dice
// ser, no solo el Content-Type (que el cliente puede mentir). Evita subir, por
// ejemplo, un HTML/script disfrazado de .png.
function sniffMatches(ext: string, buf: Buffer): boolean {
  const b = buf
  switch (ext) {
    case 'jpg':
      return b.length > 2 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff
    case 'png':
      return (
        b.length > 7 &&
        b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 &&
        b[4] === 0x0d && b[5] === 0x0a && b[6] === 0x1a && b[7] === 0x0a
      )
    case 'webp':
      return (
        b.length > 11 &&
        b.toString('ascii', 0, 4) === 'RIFF' &&
        b.toString('ascii', 8, 12) === 'WEBP'
      )
    case 'avif':
      return (
        b.length > 11 &&
        b.toString('ascii', 4, 8) === 'ftyp' &&
        b.toString('ascii', 8, 12).toLowerCase().startsWith('avi')
      )
    default:
      return false
  }
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

  const bytes = Buffer.from(await file.arrayBuffer())

  // El contenido real debe coincidir con el tipo declarado (no confiar en el MIME).
  if (!sniffMatches(ext, bytes)) {
    return NextResponse.json({ error: 'El archivo no es una imagen válida.' }, { status: 400 })
  }

  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true })

  const filename = `prod-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  fs.writeFileSync(path.join(UPLOADS_DIR, filename), bytes)

  return NextResponse.json({ url: `/api/media/${filename}` })
}
