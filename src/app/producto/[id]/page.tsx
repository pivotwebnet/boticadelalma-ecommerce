import { notFound } from 'next/navigation';
import { getProduct, getProducts, getComments } from '@/lib/api';
import { PRODUCTS } from '@/lib/data';
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

  const staticProduct = PRODUCTS.find(p => p.id === id);
  if (!apiProduct && !staticProduct) notFound();

  const avgRating = comments.length
    ? Math.round((comments.reduce((s, c) => s + c.rating, 0) / comments.length) * 10) / 10
    : 0;

  const product: Product = apiProduct
    ? {
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
        image: apiProduct.imageUrl ?? staticProduct?.image,
      }
    : {
        ...staticProduct!,
        rating: avgRating,
        reviews: comments.length,
      };

  return <PDPClient product={product} />;
}

export async function generateStaticParams() {
  const apiProducts = await getProducts();
  const source = apiProducts.length > 0 ? apiProducts : PRODUCTS;
  return source.map(p => ({ id: p.id }));
}
