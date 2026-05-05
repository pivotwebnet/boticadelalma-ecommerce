import { notFound } from 'next/navigation';
import { PRODUCTS } from '@/lib/data';
import PDPClient from '@/components/pdp/PDPClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) notFound();
  return <PDPClient product={product} />;
}

export function generateStaticParams() {
  return PRODUCTS.map(p => ({ id: p.id }));
}
