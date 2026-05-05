'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { CATEGORIES, COLLECTIONS } from '@/lib/data';
import Icon from '@/components/ui/Icon';

export default function CategoryDrawer() {
  const router = useRouter();
  const pathname = usePathname();
  const drawerOpen = useStore(s => s.drawerOpen);
  const setDrawerOpen = useStore(s => s.setDrawerOpen);

  const isActive = (catId: string) => pathname === `/categoria/${catId}`;
  const isCatalog = pathname === '/catalogo';

  const goTo = (path: string) => {
    router.push(path);
    setDrawerOpen(false);
  };

  return (
    <>
      <div
        className={`drawer-scrim${drawerOpen ? ' open' : ''}`}
        onClick={() => setDrawerOpen(false)}
      />
      <aside
        className={`drawer drawer-left${drawerOpen ? ' open' : ''}`}
        aria-hidden={!drawerOpen}
      >
        <header className="drawer-head">
          <div>
            <span className="drawer-eyebrow">Explorar</span>
            <h3>Todas las categorías</h3>
          </div>
          <button
            className="icon-btn"
            onClick={() => setDrawerOpen(false)}
            aria-label="Cerrar"
          >
            <Icon name="close" size={18} />
          </button>
        </header>

        <nav className="drawer-nav">
          <ul>
            <li>
              <button
                className={`drawer-link${isCatalog ? ' active' : ''}`}
                onClick={() => goTo('/catalogo')}
              >
                <span className="dl-name">Todos los productos</span>
                <span className="dl-meta">
                  {CATEGORIES.reduce((s, c) => s + c.count, 0)} <Icon name="chev-r" size={14} />
                </span>
              </button>
            </li>
          </ul>

          <div className="drawer-divider">Categorías</div>
          <ul>
            {CATEGORIES.map(c => (
              <li key={c.id}>
                <button
                  className={`drawer-link${isActive(c.id) ? ' active' : ''}`}
                  onClick={() => goTo(`/categoria/${c.id}`)}
                >
                  <span className="dl-name">{c.name}</span>
                  <span className="dl-meta">
                    {c.count} <Icon name="chev-r" size={14} />
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div className="drawer-divider">Colecciones</div>
          <ul>
            {COLLECTIONS.map(c => (
              <li key={c.id}>
                <button className="drawer-link subtle" onClick={() => goTo('cristales')}>
                  <span className="dl-name">{c.name}</span>
                  <span className="dl-sub">{c.subtitle}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <footer className="drawer-foot">
          <Icon name="moon" size={16} stroke={1.2} />
          <span>La Botica del Alma</span>
        </footer>
      </aside>
    </>
  );
}
