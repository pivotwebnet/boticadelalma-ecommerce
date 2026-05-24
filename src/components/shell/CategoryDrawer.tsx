'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { COLLECTIONS } from '@/lib/data';
import { useCategories } from '@/hooks/useApiData';
import { Category } from '@/lib/types';
import Icon from '@/components/ui/Icon';

export default function CategoryDrawer() {
  const router = useRouter();
  const pathname = usePathname();
  const drawerOpen = useStore(s => s.drawerOpen);
  const setDrawerOpen = useStore(s => s.setDrawerOpen);
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set());
  const categories = useCategories();

  // Reset expanded categories when drawer closes
  useEffect(() => {
    if (!drawerOpen) {
      setTimeout(() => setExpandedCats(new Set()), 300);
    }
  }, [drawerOpen]);

  const isActive = (catId: string) => pathname === `/categoria/${catId}`;
  const isCatalog = pathname === '/catalogo';

  const goTo = (path: string) => {
    router.push(path);
    setDrawerOpen(false);
  };

  const toggleExpand = (catId: string) => {
    setExpandedCats(prev => {
      const next = new Set(prev);
      if (next.has(catId)) next.delete(catId);
      else next.add(catId);
      return next;
    });
  };

  const handleCatClick = (c: Category) => {
    if (c.subcategories && c.subcategories.length > 0) {
      toggleExpand(c.id);
    } else {
      goTo(`/categoria/${c.id}`);
    }
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
                  {categories.reduce((s, c) => s + c.count, 0)} <Icon name="chev-r" size={14} />
                </span>
              </button>
            </li>
          </ul>

          <div className="drawer-divider">Categorías</div>
          <ul>
            {categories.map(c => {
              const isExpanded = expandedCats.has(c.id);
              const hasSubs = c.subcategories && c.subcategories.length > 0;

              return (
                <li key={c.id} className="drawer-item-group">
                  <button
                    className={`drawer-link${isActive(c.id) ? ' active' : ''}${isExpanded ? ' expanded' : ''}`}
                    onClick={() => handleCatClick(c)}
                  >
                    <span className="dl-name">{c.name}</span>
                    <span className="dl-meta">
                      {c.count} 
                      {hasSubs ? (
                        <span className="dl-chevron">
                          <Icon name="chev-r" size={14} />
                        </span>
                      ) : (
                        <Icon name="chev-r" size={14} />
                      )}
                    </span>
                  </button>

                  {hasSubs && (
                    <div className={`submenu-wrapper${isExpanded ? ' expanded' : ''}`}>
                      <div className="submenu-content">
                        <ul>
                          <li>
                            <button
                              className="drawer-link subtle ver-todo"
                              onClick={() => goTo(`/categoria/${c.id}`)}
                            >
                              <span className="dl-name">Ver todo</span>
                            </button>
                          </li>
                          {c.subcategories?.map(sub => (
                            <li key={sub.id}>
                              <button
                                className="drawer-link subtle"
                                onClick={() => goTo(`/categoria/${c.id}?sub=${sub.id}`)}
                              >
                                <span className="dl-name">{sub.name}</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
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
