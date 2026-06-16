import { NextRequest } from 'next/server'
import fs from 'fs'
import path from 'path'
import { UPLOADS_DIR } from '@/lib/storage'

export const runtime = 'nodejs'

const TYPES: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  avif: 'image/avif',
}

// Sirve las imágenes subidas (banner) desde el volumen persistente.
// Cache "immutable": el filename lleva timestamp, así que nunca cambia el
// contenido de una misma URL → Cloudflare la cachea y un banner nuevo es otra URL.
export async function GET(_req: NextRequest, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params

  // Evita path traversal: solo nombres de archivo simples.
  if (!/^[a-zA-Z0-9._-]+$/.test(name)) {
    return new Response('Not found', { status: 404 })
  }
  const ext = name.split('.').pop()?.toLowerCase() ?? ''
  const type = TYPES[ext]
  if (!type) {
    return new Response('Not found', { status: 404 })
  }

  try {
    const buf = await fs.promises.readFile(path.join(UPLOADS_DIR, name))
    return new Response(new Uint8Array(buf), {
      headers: {
        'Content-Type': type,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    return new Response('Not found', { status: 404 })
  }
}
