export const fmt = (n: number): string =>
  '$' + Math.round(n).toLocaleString('es-AR');

// Convierte un texto a slug URL-safe: sin acentos, minúsculas, guiones.
// "Escudos y protección" → "escudos-y-proteccion". Estable, para links de intención.
export function slugify(s: string): string {
  return s
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Escapa caracteres especiales de HTML. Úsalo SIEMPRE al interpolar texto que viene
// del usuario dentro del HTML de un email (u otro HTML crudo): evita que alguien
// inyecte etiquetas o links (por ej. phishing en la bandeja del admin).
export function escapeHtml(input: unknown): string {
  return String(input ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
