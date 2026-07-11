import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { getProducts, getCategories } from '@/lib/api';

// Sitemap dinámico: páginas fijas + una entrada por producto y por categoría
// activos del catálogo. Se regenera con los datos del backend en cada build/ISR.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`,                       lastModified: now, changeFrequency: 'daily',   priority: 1 },
    { url: `${SITE_URL}/catalogo`,               lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${SITE_URL}/nuestra-historia`,       lastModified: now, changeFrequency: 'yearly',  priority: 0.5 },
    { url: `${SITE_URL}/como-comprar`,           lastModified: now, changeFrequency: 'yearly',  priority: 0.5 },
    { url: `${SITE_URL}/cuidados`,               lastModified: now, changeFrequency: 'yearly',  priority: 0.4 },
    { url: `${SITE_URL}/envios-y-devoluciones`,  lastModified: now, changeFrequency: 'yearly',  priority: 0.4 },
    { url: `${SITE_URL}/preguntas-frecuentes`,   lastModified: now, changeFrequency: 'yearly',  priority: 0.4 },
    { url: `${SITE_URL}/contacto`,               lastModified: now, changeFrequency: 'yearly',  priority: 0.4 },
  ];

  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${SITE_URL}/categoria/${c.id}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/producto/${p.id}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
