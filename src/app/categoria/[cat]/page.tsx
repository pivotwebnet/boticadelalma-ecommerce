import { notFound } from 'next/navigation';
import { getCategories } from '@/lib/api';
import { CATEGORIES } from '@/lib/data';
import PLPClient from '@/components/plp/PLPClient';

interface PageProps {
  params: Promise<{ cat: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { cat } = await params;
  const apiCategories = await getCategories();
  const exists =
    apiCategories.some(c => c.id === cat) ||
    CATEGORIES.some(c => c.id === cat);
  if (!exists) notFound();
  return <PLPClient cat={cat} />;
}

export async function generateStaticParams() {
  const apiCategories = await getCategories();
  const source = apiCategories.length > 0 ? apiCategories : CATEGORIES;
  return source.map(c => ({ cat: c.id }));
}
