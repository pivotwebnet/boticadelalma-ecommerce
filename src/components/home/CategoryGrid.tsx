'use client';

import Link from 'next/link';
import { useCategories } from '@/hooks/useApiData';
import Icon from '@/components/ui/Icon';
import ProductPlaceholder from '@/components/ui/ProductPlaceholder';

const TONES = ['sage', 'clay', 'indigo', 'moss', 'cream', 'ember'];

export default function CategoryGrid() {
  const categories = useCategories();
  return (
    <section className="section">
      <header className="section-head">
        <span className="eyebrow">Categorías</span>
        <h2>Elegí por categoría</h2>
      </header>
      <div className="cat-grid">
        {categories.map((c, i) => (
          <Link key={c.id} href={`/categoria/${c.id}`} className="cat-tile">
            <div className="cat-media">
              <ProductPlaceholder
                tone={TONES[i % TONES.length]}
                label={c.name.toLowerCase()}
                aspectRatio={4 / 5}
              />
            </div>
            <div className="cat-caption">
              <span className="cat-name">{c.name}</span>
              <span className="cat-count">
                {c.count} piezas <Icon name="arrow-r" size={12} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
