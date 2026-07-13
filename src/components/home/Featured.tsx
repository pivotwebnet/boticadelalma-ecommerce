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

  // Sin filtro y sin productos = toda la tienda está vacía (todavía no se cargó
  // el catálogo). Es distinto a "esta intención puntual no tiene piezas".
  const storeEmpty = !intentionFilter && products.length === 0;

  return (
    <section className="section">
      <header className="section-head section-head-row">
        <div>
          <h2>
            {storeEmpty ? 'Nuestra colección' : intentionFilter ? `Piezas para ${intentionFilter}` : 'Piezas destacadas'}
          </h2>
          <VineDecoration className="vine-decor--left" />
          <span className="eyebrow">
            {storeEmpty ? 'Muy pronto' : intentionFilter ? `Intención · ${intentionFilter}` : 'Lo más querido'}
          </span>
        </div>
        {!storeEmpty && (
          <Link href="/catalogo" className="link-arrow">
            Ver todo <Icon name="arrow-r" size={14} />
          </Link>
        )}
      </header>

      {filtered.length > 0 ? (
        <div key={intentionFilter ?? 'all'} className="product-grid grid-regular featured-animated">
          {filtered.slice(0, 8).map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="featured-empty">
          <span className="featured-empty-icon">
            <Icon name="sparkle" size={30} stroke={1.2} />
          </span>
          {storeEmpty ? (
            <>
              <h3 className="featured-empty-title">Estamos preparando la colección</h3>
              <p className="featured-empty-msg">
                Muy pronto vas a encontrar acá nuestras piezas, elegidas y armadas una por una.
                Si buscás algo especial, escribinos y te ayudamos.
              </p>
              <a
                href="https://wa.me/5493492274535"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
              >
                Consultar por WhatsApp
              </a>
            </>
          ) : (
            <>
              <h3 className="featured-empty-title">Próximamente</h3>
              <p className="featured-empty-msg">
                Todavía no tenemos piezas para <em>{intentionFilter}</em>. Estamos sumando nuevas creaciones.
              </p>
              <Link href="/catalogo" className="btn btn-ghost btn-sm">
                Ver todo el catálogo
              </Link>
            </>
          )}
        </div>
      )}
    </section>
  );
}
