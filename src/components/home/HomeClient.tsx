'use client';

import Hero from '@/components/home/Hero';
import IntentionCarousel from '@/components/home/IntentionCarousel';
import CategoryGrid from '@/components/home/CategoryGrid';
import Featured from '@/components/home/Featured';
import CollectionBanner from '@/components/home/CollectionBanner';
import EditorialQuote from '@/components/home/EditorialQuote';
import { useProducts } from '@/hooks/useApiData';

export default function HomeClient() {
  const products = useProducts();

  return (
    <main className="home">
      <Hero />
      <IntentionCarousel />
      <CategoryGrid />
      <Featured products={products} intentionFilter={null} />
      <CollectionBanner />
      <EditorialQuote />
    </main>
  );
}
