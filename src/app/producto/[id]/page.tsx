import { notFound } from 'next/navigation';
import { getProduct, getProducts } from '@/lib/api';
import PDPClient from '@/components/pdp/PDPClient';
import { Product } from '@/lib/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const p = await getProduct(id);
  if (!p) notFound();

  const product: Product = {
    id: p.id,
    cat: p.categoryId,
    name: p.name,
    price: p.price,
    was: p.originalPrice,
    tone: p.tone,
    label: p.label,
    tags: p.tags || [],
    rating: p.rating,
    reviews: p.reviews,
    new: p.isNew,
  };

  return <PDPClient product={product} />;
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map(p => ({ id: p.id }));
}
