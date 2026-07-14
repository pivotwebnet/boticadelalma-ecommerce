import { NextRequest, NextResponse } from 'next/server'
import { readTaxonomy, writeSiteSettings, SiteSettings } from '@/lib/site-settings'
import type { IntentionArt } from '@/lib/intention-art'
import { slugify } from '@/lib/utils'

export const runtime = 'nodejs'

// Listas editables desde el panel (Filtros): materiales, intenciones y tamaños.
const KEYS = ['materials', 'intentions', 'sizes'] as const
const MAX_ITEMS = 40
const MAX_LEN = 60
const MAX_SUBTITLE = 80
const HEX = /^#[0-9a-fA-F]{3,8}$/

// Sanea el arte por intención: solo campos válidos (subtítulo corto, colores hex,
// ícono de /icons o /api/media). Descarta lo inválido y las entradas vacías.
function cleanArt(v: unknown): Record<string, IntentionArt> | null {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return null
  const out: Record<string, IntentionArt> = {}
  for (const [k, raw] of Object.entries(v as Record<string, unknown>)) {
    if (!raw || typeof raw !== 'object') continue
    const r = raw as Record<string, unknown>
    const art: IntentionArt = {}
    if (typeof r.subtitle === 'string') {
      const t = r.subtitle.trim().slice(0, MAX_SUBTITLE)
      if (t) art.subtitle = t
    }
    if (typeof r.iconUrl === 'string' && (r.iconUrl.startsWith('/icons/') || r.iconUrl.startsWith('/api/media/'))) {
      art.iconUrl = r.iconUrl
    }
    for (const c of ['bg', 'hoverBg', 'hoverText'] as const) {
      if (typeof r[c] === 'string' && HEX.test(r[c] as string)) art[c] = r[c] as string
    }
    if (Object.keys(art).length) out[slugify(k)] = art
  }
  return out
}

export async function GET() {
  return NextResponse.json(readTaxonomy())
}

// Normaliza una lista: strings recortados, sin vacíos ni duplicados (ignorando
// mayúsculas), con un tope de cantidad. Devuelve null si no era una lista.
function clean(arr: unknown): string[] | null {
  if (!Array.isArray(arr)) return null
  const out: string[] = []
  const seen = new Set<string>()
  for (const raw of arr) {
    if (typeof raw !== 'string') continue
    const t = raw.trim()
    if (!t) continue
    const key = t.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push(t)
    if (out.length >= MAX_ITEMS) break
  }
  return out
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Datos inválidos.' }, { status: 400 })
  }

  const patch: Partial<SiteSettings> = {}
  for (const key of KEYS) {
    if (!(key in body)) continue
    // null = restablecer a la lista por defecto.
    if (body[key] === null) { patch[key] = null; continue }
    const cleaned = clean(body[key])
    if (cleaned === null) {
      return NextResponse.json({ error: `"${key}" debe ser una lista.` }, { status: 400 })
    }
    if (cleaned.some(s => s.length > MAX_LEN)) {
      return NextResponse.json({ error: `Cada valor puede tener hasta ${MAX_LEN} caracteres.` }, { status: 400 })
    }
    patch[key] = cleaned
  }

  // Arte por intención (opcional). null = limpiar todo.
  if ('intentionArt' in body) {
    if (body.intentionArt === null) {
      patch.intentionArt = null
    } else {
      const cleanedArt = cleanArt(body.intentionArt)
      if (cleanedArt === null) {
        return NextResponse.json({ error: '"intentionArt" debe ser un objeto.' }, { status: 400 })
      }
      patch.intentionArt = cleanedArt
    }
  }

  writeSiteSettings(patch)
  return NextResponse.json(readTaxonomy())
}
