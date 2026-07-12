import { notFound } from 'next/navigation';
import { getProduct, getProducts, getComments } from '@/lib/api';
import PDPClient from '@/components/pdp/PDPClient';
import { Product } from '@/lib/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const [apiProduct, comments] = await Promise.all([
    getProduct(id),
    getComments(id),
  ]);

  // La base es la única fuente: si el producto no existe (o está inactivo), 404.
  if (!apiProduct) notFound();

  const avgRating = comments.length
    ? Math.round((comments.reduce((s, c) => s + c.rating, 0) / comments.length) * 10) / 10
    : 0;

  const product: Product = {
    id: apiProduct.id,
    cat: apiProduct.categoryId,
    name: apiProduct.name,
    price: apiProduct.price,
    was: apiProduct.originalPrice,
    tone: apiProduct.tone,
    label: apiProduct.label,
    tags: apiProduct.tags || [],
    rating: avgRating,
    reviews: comments.length,
    new: apiProduct.isNew,
    image: apiProduct.imageUrl,
    images: apiProduct.images,
    description: apiProduct.description,
    howToUse: apiProduct.howToUse,
    care: apiProduct.care,
    shipping: apiProduct.shipping,
  };

  return <PDPClient product={product} />;
}

export async function generateStaticParams() {
  // Solo los productos reales de la base; si no hay, no se pre-renderiza ninguno.
  const apiProducts = await getProducts();
  return apiProducts.map(p => ({ id: p.id }));
}
