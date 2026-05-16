'use client';

import { useState } from 'react';
import Hero from '@/components/home/Hero';
import IntentionCarousel from '@/components/home/IntentionCarousel';
import CategoryGrid from '@/components/home/CategoryGrid';
import Featured from '@/components/home/Featured';
import CollectionBanner from '@/components/home/CollectionBanner';
import Icon from '@/components/ui/Icon';
import { PRODUCTS } from '@/lib/data';

export default function HomeClient() {
  const [intention, setIntention] = useState<string | null>(null);

  return (
    <main className="home">
      <Hero />
      <IntentionCarousel selected={intention} onSelect={setIntention} />
      <CategoryGrid />
      <Featured products={PRODUCTS} intentionFilter={intention} />
      <CollectionBanner />
      <section className="section editorial">
        <div className="ed-quote">
          <Icon name="moon" size={28} stroke={1.2} />
          <blockquote>
            &ldquo;Cada objeto que llega a tus manos fue elegido con cuidado. Son piezas pequeñas, con historia.&rdquo;
          </blockquote>
          <cite>— Valentina, curaduría</cite>
        </div>
      </section>
    </main>
  );
}
