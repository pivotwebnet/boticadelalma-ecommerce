'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { useCategories, useIntentions } from '@/hooks/useApiData';
import Icon from '@/components/ui/Icon';
import Image from 'next/image';
import SearchBox from './SearchBox';

function toSlug(s: string) {
  return s
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '-');
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function CategoryDrawer() {
  const router = useRouter();
  const pathname = usePathname();
  const drawerOpen = useStore(s => s.drawerOpen);
  const setDrawerOpen = useStore(s => s.setDrawerOpen);
  const categories = useCategories();
  const intentions = useIntentions();
  const cart = useStore(s => s.cart);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  // L0: expanded groups; L1: expanded categories
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set(['joyeria']));
  const [openCats, setOpenCats] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!drawerOpen) {
      setTimeout(() => {
        setOpenGroups(new Set(['joyeria']));
        setOpenCats(new Set());
      }, 300);
    }
  }, [drawerOpen]);

  const goTo = (path: string) => {
    router.push(path);
    setDrawerOpen(false);
  };

  const toggleGroup = (id: string) => {
    setOpenGroups(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  };

  const toggleCat = (id: string) => {
    setOpenCats(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  };

  const joyas = categories.filter(c => c.group === 'Joyería');
  const piedras = categories.filter(c => c.id === 'piedras');
  const complementos = categories.filter(c => c.id === 'complementos');

  const isCatalog = pathname === '/catalogo';

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
            <h3>Categorías</h3>
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
          {/* Search Box on mobile/tablets */}
          <div className="lg:hidden" style={{ padding: '0 24px 16px' }}>
            <SearchBox />
          </div>

          {/* Carrito shortcut */}
          <ul style={{ marginBottom: 12 }}>
            <li>
              <button
                className={`drawer-link${pathname === '/carrito' ? ' active' : ''}`}
                onClick={() => goTo('/carrito')}
              >
                <span className="dl-name" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon name="bag" size={16} />
                  Ver mi carrito
                </span>
                <span className="dl-meta">
                  {cartCount > 0 ? `${cartCount} ${cartCount === 1 ? 'pieza' : 'piezas'}` : 'Vacío'}
                  <Icon name="chev-r" size={14} />
                </span>
              </button>
            </li>
          </ul>

          {/* All products shortcut */}
          <ul style={{ marginBottom: 4 }}>
            <li>
              <button
                className={`drawer-link${isCatalog ? ' active' : ''}`}
                onClick={() => goTo('/catalogo')}
              >
                <span className="dl-name">Todo el catálogo</span>
                <span className="dl-meta">
                  {categories.reduce((s, c) => s + c.count, 0)}
                  <Icon name="chev-r" size={14} />
                </span>
              </button>
            </li>
          </ul>

          {/* ── JOYERÍA ─────────────────────────────────── */}
          <GroupSection
            label="Joyería"
            open={openGroups.has('joyeria')}
            onToggle={() => toggleGroup('joyeria')}
          >
            {joyas.map(cat => (
              <CatSection
                key={cat.id}
                catName={cat.name}
                open={openCats.has(cat.id)}
                onToggle={() => toggleCat(cat.id)}
                onViewAll={() => goTo(`/catalogo?cat=${cat.id}`)}
              >
                {cat.subcategories?.map(sub => (
                  <button
                    key={sub.id}
                    className="drawer-link subtle"
                    onClick={() => goTo(`/catalogo?cat=${cat.id}&subcat=${sub.id}`)}
                  >
                    <span className="dl-name">{sub.name}</span>
                    <Icon name="chev-r" size={12} className="dl-chevron" />
                  </button>
                ))}
              </CatSection>
            ))}
          </GroupSection>

          {/* ── PIEDRAS NATURALES ───────────────────────── */}
          <GroupSection
            label="Piedras Naturales"
            open={openGroups.has('piedras')}
            onToggle={() => toggleGroup('piedras')}
          >
            {piedras.map(cat => (
              <CatSection
                key={cat.id}
                catName={cat.name}
                open={openCats.has(cat.id)}
                onToggle={() => toggleCat(cat.id)}
                onViewAll={() => goTo(`/catalogo?cat=${cat.id}`)}
              >
                {cat.subcategories?.map(sub => (
                  <button
                    key={sub.id}
                    className="drawer-link subtle"
                    onClick={() => goTo(`/catalogo?cat=${cat.id}&subcat=${sub.id}`)}
                  >
                    <span className="dl-name">{sub.name}</span>
                    <Icon name="chev-r" size={12} className="dl-chevron" />
                  </button>
                ))}
              </CatSection>
            ))}
          </GroupSection>

          {/* ── COMPLEMENTOS ────────────────────────────── */}
          <GroupSection
            label="Complementos"
            open={openGroups.has('complementos')}
            onToggle={() => toggleGroup('complementos')}
          >
            {complementos.map(cat => (
              <CatSection
                key={cat.id}
                catName={cat.name}
                open={openCats.has(cat.id)}
                onToggle={() => toggleCat(cat.id)}
                onViewAll={() => goTo(`/catalogo?cat=${cat.id}`)}
              >
                {cat.subcategories?.map(sub => (
                  <button
                    key={sub.id}
                    className="drawer-link subtle"
                    onClick={() => goTo(`/catalogo?cat=${cat.id}&subcat=${sub.id}`)}
                  >
                    <span className="dl-name">{sub.name}</span>
                    <Icon name="chev-r" size={12} className="dl-chevron" />
                  </button>
                ))}
              </CatSection>
            ))}
          </GroupSection>

          {/* ── POR INTENCIÓN ───────────────────────────── */}
          <GroupSection
            label="Por Intención"
            open={openGroups.has('intencion')}
            onToggle={() => toggleGroup('intencion')}
          >
            <div className="intention-grid">
              {intentions.map(intent => (
                <button
                  key={intent}
                  className="intention-pill"
                  onClick={() => goTo(`/catalogo?intencion=${toSlug(intent)}`)}
                >
                  <Image
                    src={`/icons/${toSlug(intent)}.svg`}
                    alt={intent}
                    width={18}
                    height={18}
                    className="intention-icon"
                    style={{ objectFit: 'contain' }}
                  />
                  <span>{capitalize(intent)}</span>
                </button>
              ))}
            </div>
          </GroupSection>
        </nav>

        <footer className="drawer-foot">
          <Icon name="moon" size={16} stroke={1.2} />
          <span>La Botica del Alma</span>
        </footer>
      </aside>
    </>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function GroupSection({
  label, open, onToggle, children,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="drawer-group">
      <button
        className={`drawer-group-header${open ? ' open' : ''}`}
        onClick={onToggle}
        aria-expanded={open}
      >
        <span className="dgh-label">{label}</span>
        <span className={`dgh-chevron${open ? ' open' : ''}`}>
          <Icon name="chev-r" size={13} stroke={2} />
        </span>
      </button>
      <div className={`submenu-wrapper${open ? ' expanded' : ''}`}>
        <div className="submenu-content">
          {children}
        </div>
      </div>
    </div>
  );
}

function CatSection({
  catName, open, onToggle, onViewAll, children,
}: {
  catName: string;
  open: boolean;
  onToggle: () => void;
  onViewAll: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="drawer-cat-group">
      <div className="drawer-cat-row">
        <button
          className="drawer-cat-name"
          onClick={onViewAll}
        >
          {catName}
        </button>
        <button
          className={`drawer-cat-toggle${open ? ' open' : ''}`}
          onClick={onToggle}
          aria-label={`Expandir ${catName}`}
        >
          <Icon name="chev-r" size={12} stroke={2} />
        </button>
      </div>
      <div className={`submenu-wrapper${open ? ' expanded' : ''}`}>
        <div className="submenu-content drawer-subcats">
          <button
            className="drawer-subcat ver-todo"
            onClick={onViewAll}
          >
            Ver todo
          </button>
          {children}
        </div>
      </div>
    </div>
  );
}
