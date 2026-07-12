import { NextRequest, NextResponse } from 'next/server'
import { readSiteSettings, writeSiteSettings, SiteSettings } from '@/lib/site-settings'

export const runtime = 'nodejs'

// Campos de texto editables desde el panel (Apariencia → Textos de la home).
const TEXT_FIELDS = [
  'editorialQuote',
  'limitedOverline',
  'limitedTitle',
  'limitedText',
  'limitedCtaText',
] as const

// Nombres visibles de cada campo, para armar mensajes de error claros.
const FIELD_LABELS: Record<(typeof TEXT_FIELDS)[number], string> = {
  editorialQuote: 'Frase del final',
  limitedOverline: 'Sobretítulo',
  limitedTitle: 'Título',
  limitedText: 'Párrafo',
  limitedCtaText: 'Texto del botón',
}

const MAX_LEN = 600

export async function GET() {
  return NextResponse.json(readSiteSettings())
}

// Guarda los textos de la home. Un campo vacío se guarda como null: así el
// componente vuelve a mostrar su texto por defecto (nunca queda en blanco).
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Datos inválidos.' }, { status: 400 })
  }

  const patch: Partial<SiteSettings> = {}
  for (const key of TEXT_FIELDS) {
    if (!(key in body)) continue
    const raw = body[key]
    if (raw === null || raw === undefined) { patch[key] = null; continue }
    if (typeof raw !== 'string') {
      return NextResponse.json({ error: `El campo ${key} debe ser texto.` }, { status: 400 })
    }
    const trimmed = raw.trim()
    if (trimmed.length > MAX_LEN) {
      return NextResponse.json({ error: `El texto de "${FIELD_LABELS[key]}" es demasiado largo (máximo ${MAX_LEN} caracteres).` }, { status: 400 })
    }
    patch[key] = trimmed === '' ? null : trimmed
  }

  const next = writeSiteSettings(patch)
  return NextResponse.json(next)
}
