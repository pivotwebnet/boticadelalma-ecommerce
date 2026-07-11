// URL pública del sitio, usada por metadataBase, sitemap, robots y las OG images.
// En producción definir la env `NEXT_PUBLIC_SITE_URL` con el dominio real
// (ej: https://laboticadelalma.com). El fallback es solo para desarrollo.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://laboticadelalma.com'
).replace(/\/+$/, '');

// Nombre y descripción canónicos de la marca (reutilizados en metadatos).
export const SITE_NAME = 'La Botica del Alma';
export const SITE_DESCRIPTION =
  'Joyería artesanal, piedras naturales y complementos energéticos. Seleccionados uno por uno. Envíos a todo el país.';
