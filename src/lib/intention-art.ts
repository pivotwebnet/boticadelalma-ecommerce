// Arte de las tarjetas de intención del inicio: presets "de fábrica" + resolución.
// Sin dependencias de servidor: lo usan el carrusel (cliente) y el panel admin.
import { slugify } from '@/lib/utils'

// Lo que la dueña puede personalizar por intención desde el panel.
export interface IntentionArt {
  subtitle?: string
  iconUrl?: string   // '/icons/<slug>.svg' (uno de los provistos) o '/api/media/<archivo>' (subido)
  bg?: string
  hoverBg?: string
  hoverText?: string
}

export interface ResolvedCard {
  id: string
  title: string
  subtitle: string
  iconSrc: string | null
  bg: string
  hoverBg: string
  hoverText: string
}

// Arte curado de las 9 intenciones originales (subtítulo + paleta), por slug.
export const INTENTION_PRESETS: Record<string, { subtitle: string; bg: string; hoverBg: string; hoverText: string }> = {
  'crecimiento-personal': { subtitle: 'Evolucionar y florecer',    bg: '#F6FAF2', hoverBg: '#C2E0AC', hoverText: '#2D5A2D' },
  'amor':                 { subtitle: 'Conectar emocionalmente',   bg: '#FCF8F8', hoverBg: '#F6C9CF', hoverText: '#8A5A55' },
  'abundancia':           { subtitle: 'Expandir lo que tenés',     bg: '#F8FBF3', hoverBg: '#DCEBA8', hoverText: '#5A6A35' },
  'prosperidad':          { subtitle: 'Atraer riqueza y fortuna',  bg: '#FCFAF3', hoverBg: '#F2E2A8', hoverText: '#7A6335' },
  'escudos-y-proteccion': { subtitle: 'Resguardar tu energía',     bg: '#F4F8FC', hoverBg: '#BFDCF0', hoverText: '#3A4D5C' },
  'calma-y-paz-interior': { subtitle: 'Bajar el ruido mental',     bg: '#F4FBF8', hoverBg: '#B6E2D2', hoverText: '#3E5C52' },
  'concrecion':           { subtitle: 'Materializar tus metas',    bg: '#FCF9F3', hoverBg: '#F2CFA6', hoverText: '#5C4D3A' },
  'comunicacion':         { subtitle: 'Expresar con claridad',     bg: '#F4F9FC', hoverBg: '#B5DDE7', hoverText: '#3A4D5A' },
  'sanacion-y-procesos':  { subtitle: 'Restaurar el equilibrio',   bg: '#FBF7FB', hoverBg: '#E2BFDC', hoverText: '#5A3A55' },
}

// Íconos SVG provistos en /public/icons. Una intención toma el suyo por nombre
// si coincide; también sirven como galería para elegir en el panel.
export const BUILTIN_ICONS = [
  'abundancia', 'amor', 'anclaje', 'calma-y-paz-interior', 'calma', 'comunicacion',
  'concrecion', 'crecimiento-personal', 'escudos-y-proteccion', 'escudos', 'limpieza',
  'prosperidad', 'proteccion', 'sanacion-y-procesos', 'sanacion',
]

// Paletas suaves por defecto para intenciones nuevas sin preset (se ciclan).
export const FALLBACK_PALETTE = [
  { bg: '#F7F5F0', hoverBg: '#E4DAC8', hoverText: '#6A5A3E' },
  { bg: '#F3F7F8', hoverBg: '#CDE0E2', hoverText: '#3E5559' },
  { bg: '#F8F4F6', hoverBg: '#E6C9D6', hoverText: '#6B4658' },
  { bg: '#F5F8F3', hoverBg: '#D4E4C0', hoverText: '#4E6238' },
  { bg: '#F7F5FA', hoverBg: '#D6CBE6', hoverText: '#4E4266' },
]

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

// Ícono SVG por defecto para una intención (por nombre), o null si no hay match.
export function builtinIconFor(id: string): string | null {
  return BUILTIN_ICONS.includes(id) ? `/icons/${id}.svg` : null
}

// Resuelve la tarjeta final: arte guardado por la dueña > preset de fábrica >
// paleta/ícono por defecto. `art` es lo guardado para esta intención (o undefined).
export function resolveCard(name: string, index: number, art?: IntentionArt): ResolvedCard {
  const id = slugify(name)
  const preset = INTENTION_PRESETS[id]
  const pal = FALLBACK_PALETTE[index % FALLBACK_PALETTE.length]
  return {
    id,
    title: capitalize(name),
    subtitle: art?.subtitle ?? preset?.subtitle ?? '',
    iconSrc: art?.iconUrl ?? builtinIconFor(id),
    bg: art?.bg ?? preset?.bg ?? pal.bg,
    hoverBg: art?.hoverBg ?? preset?.hoverBg ?? pal.hoverBg,
    hoverText: art?.hoverText ?? preset?.hoverText ?? pal.hoverText,
  }
}
