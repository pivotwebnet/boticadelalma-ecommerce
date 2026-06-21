import Link from 'next/link';
import { Product } from '@/lib/types';
import ProductCard from '@/components/ui/ProductCard';
import Icon from '@/components/ui/Icon';
import VineDecoration from '@/components/ui/VineDecoration';

interface FeaturedProps {
  products: Product[];
  intentionFilter?: string | null;
}

export default function Featured({ products, intentionFilter }: FeaturedProps) {
  const filtered = intentionFilter
    ? products.filter(p =>
        p.tags.some(t => t.toLowerCase() === intentionFilter.toLowerCase())
      )
    : products;

  return (
    <section className="section">
      <header className="section-head section-head-row">
        <div>
          <h2>
            {intentionFilter ? `Piezas para ${intentionFilter}` : 'Piezas destacadas'}
          </h2>
          <span className="eyebrow">
            {intentionFilter ? `Intención · ${intentionFilter}` : 'Lo más querido'}
          </span>
          <VineDecoration className="vine-decor--left" />
        </div>
        <Link href="/catalogo" className="link-arrow">
          Ver todo <Icon name="arrow-r" size={14} />
        </Link>
      </header>

      {filtered.length > 0 ? (
        <div key={intentionFilter ?? 'all'} className="product-grid grid-regular featured-animated">
          {filtered.slice(0, 8).map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div key={intentionFilter} className="featured-empty featured-animated">
          <Icon name="sparkle" size={28} stroke={1.2} />
          <p>Próximamente piezas para <em>{intentionFilter}</em>.</p>
          <Link href="/catalogo" className="btn btn-ghost btn-sm">
            Ver todo el catálogo
          </Link>
        </div>
      )}
    </section>
  );
}
