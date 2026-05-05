import { notFound } from 'next/navigation';
import { CATEGORIES } from '@/lib/data';
import PLPClient from '@/components/plp/PLPClient';

interface PageProps {
  params: Promise<{ cat: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { cat } = await params;
  const exists = CATEGORIES.some(c => c.id === cat);
  if (!exists) notFound();
  return <PLPClient cat={cat} />;
}

export function generateStaticParams() {
  return CATEGORIES.map(c => ({ cat: c.id }));
}
