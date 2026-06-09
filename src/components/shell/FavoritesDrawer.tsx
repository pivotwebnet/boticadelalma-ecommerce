'use client';

import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { useProducts } from '@/hooks/useApiData';
import { fmt } from '@/lib/utils';
import Icon from '@/components/ui/Icon';
import Button from '@/components/ui/Button';
import ProductPlaceholder from '@/components/ui/ProductPlaceholder';

export default function FavoritesDrawer() {
  const router = useRouter();
  const favsOpen = useStore(s => s.favsOpen);
  const setFavsOpen = useStore(s => s.setFavsOpen);
  const favs = useStore(s => s.favs);
  const toggleFav = useStore(s => s.toggleFav);
  const addToCart = useStore(s => s.addToCart);
  const allProducts = useProducts();

  const items = allProducts.filter(p => favs.includes(p.id));

  const go = (path: string) => {
    setFavsOpen(false);
    router.push(path);
  };

  return (
    <>
      <div
        className={`drawer-scrim${favsOpen ? ' open' : ''}`}
        onClick={() => setFavsOpen(false)}
      />
      <aside
        className={`drawer drawer-right${favsOpen ? ' open' : ''}`}
        aria-hidden={!favsOpen}
      >
        <header className="drawer-head">
          <div>
            <span className="drawer-eyebrow">Tu lista</span>
            <h3>{items.length} {items.length === 1 ? 'favorito' : 'favoritos'}</h3>
          </div>
          <button className="icon-btn" onClick={() => setFavsOpen(false)} aria-label="Cerrar">
            <Icon name="close" size={18} />
          </button>
        </header>

        <div className="cart-items">
          {items.length === 0 ? (
            <div className="empty-state cart-empty">
              <Icon name="heart" size={32} stroke={1} />
              <p>Todavía no guardaste favoritos</p>
              <button className="btn btn-ghost btn-sm" onClick={() => go('/catalogo')}>
                Explorar catálogo
              </button>
            </div>
          ) : (
            items.map(p => (
              <div key={p.id} className="cart-item">
                <div
                  className="ci-thumb"
                  onClick={() => go(`/producto/${p.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="object-cover w-full h-full" />
                  ) : (
                    <ProductPlaceholder tone={p.tone} label="" aspectRatio={1} />
                  )}
                </div>
                <div className="ci-body">
                  <span className="ci-name">{p.name}</span>
                  <span className="ci-meta">{p.label}</span>
                  <div className="ci-controls">
                    <button className="btn btn-ghost btn-sm" onClick={() => addToCart(p)}>
                      <Icon name="bag" size={13} /> Agregar
                    </button>
                    <button className="ci-remove" onClick={() => toggleFav(p.id)}>
                      Quitar
                    </button>
                  </div>
                </div>
                <div className="ci-price">{fmt(p.price)}</div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <footer className="cart-foot">
            <Button
              variant="primary"
              size="md"
              full
              iconRight="arrow-r"
              onClick={() => go('/favoritos')}
            >
              Ver todos mis favoritos
            </Button>
          </footer>
        )}
      </aside>
    </>
  );
}
