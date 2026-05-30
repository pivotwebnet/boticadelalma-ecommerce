import { notFound } from 'next/navigation';
import { getCategories } from '@/lib/api';
import PLPClient from '@/components/plp/PLPClient';

interface PageProps {
  params: Promise<{ cat: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { cat } = await params;
  const categories = await getCategories();
  const exists = categories.some(c => c.id === cat);
  if (!exists) notFound();
  return <PLPClient cat={cat} />;
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map(c => ({ cat: c.id }));
}
