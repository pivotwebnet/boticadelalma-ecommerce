import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';

// Content-Security-Policy. En dev, el HMR de Next necesita 'unsafe-eval'; en prod
// lo quitamos. 'unsafe-inline' en styles es necesario por los estilos inline y
// framer-motion. La app no usa dangerouslySetInnerHTML, así que el riesgo de XSS
// que 'unsafe-inline' en scripts habilitaría es bajo, pero igual lo acotamos.
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "img-src 'self' data: blob: https://images.unsplash.com https://*.cdninstagram.com https://*.fbcdn.net",
  "style-src 'self' 'unsafe-inline'",
  `script-src 'self' 'unsafe-inline'${isProd ? '' : " 'unsafe-eval'"}`,
  "font-src 'self' data:",
  "connect-src 'self'",
  "upgrade-insecure-requests",
].join('; ');

const securityHeaders = [
  // Evita que la página se embeba en un iframe (clickjacking).
  { key: 'X-Frame-Options', value: 'DENY' },
  // Evita el MIME-sniffing (que el navegador reinterprete un archivo como otro tipo).
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // No filtrar la URL completa (con GUIDs de orden, etc.) a terceros vía Referer.
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Corta el acceso a APIs sensibles del navegador que la tienda no usa.
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Content-Security-Policy', value: csp },
];

// HSTS solo tiene sentido en prod (sobre HTTPS); en http local los navegadores lo ignoran.
if (isProd) {
  securityHeaders.push({
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  });
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '**.cdninstagram.com' },
      { protocol: 'https', hostname: '**.fbcdn.net' },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
