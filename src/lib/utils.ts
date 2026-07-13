export const fmt = (n: number): string =>
  '$' + Math.round(n).toLocaleString('es-AR');

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
