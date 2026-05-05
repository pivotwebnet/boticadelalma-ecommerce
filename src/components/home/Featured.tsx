import Link from 'next/link';
import { Product } from '@/lib/types';
import ProductCard from '@/components/ui/ProductCard';
import Icon from '@/components/ui/Icon';

interface FeaturedProps {
  products: Product[];
}

export default function Featured({ products }: FeaturedProps) {
  return (
    <section className="section">
      <header className="section-head section-head-row">
        <div>
          <span className="eyebrow">Lo más querido</span>
          <h2>Piezas destacadas</h2>
        </div>
        <Link href="/catalogo" className="link-arrow">
          Ver todo <Icon name="arrow-r" size={14} />
        </Link>
      </header>
      <div className="product-grid grid-regular">
        {products.slice(0, 8).map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
