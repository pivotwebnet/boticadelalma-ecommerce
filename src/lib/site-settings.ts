import fs from 'fs'
import path from 'path'
import { DATA_DIR } from '@/lib/storage'

// Configuración editable de la tienda (la maneja la dueña desde el panel).
// Vive en el volumen persistente, igual que las credenciales del admin.
const SETTINGS_FILE = path.join(DATA_DIR, 'site-settings.json')

export interface SiteSettings {
  // Imagen de fondo del banner principal de la home. Si es null/undefined,
  // la tienda usa la imagen por defecto (/banner3.jpg).
  heroImageUrl?: string | null
}

export function readSiteSettings(): SiteSettings {
  try {
    return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8')) as SiteSettings
  } catch {
    return {}
  }
}

export function writeSiteSettings(patch: Partial<SiteSettings>): SiteSettings {
  const next = { ...readSiteSettings(), ...patch }
  const dir = path.dirname(SETTINGS_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(next, null, 2), 'utf-8')
  return next
}
