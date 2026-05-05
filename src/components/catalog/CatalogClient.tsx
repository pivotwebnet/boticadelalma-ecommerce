'use client';

import { useMemo, useState } from 'react';
import { CATEGORIES, INTENTIONS, MATERIALS, PRICE_RANGES, PRODUCTS } from '@/lib/data';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Icon from '@/components/ui/Icon';
import ProductCard from '@/components/ui/ProductCard';

type SortKey = 'relevance' | 'price-asc' | 'price-desc' | 'rating';
type ViewMode = 'grid' | 'rows';

export default function CatalogClient() {
  const [catSel, setCatSel] = useState<string[]>([]);
  const [sort, setSort] = useState<SortKey>('relevance');
  const [priceSel, setPriceSel] = useState<string[]>([]);
  const [matSel, setMatSel] = useState<string[]>([]);
  const [intSel, setIntSel] = useState<string[]>([]);
  const [onlyNew, setOnlyNew] = useState(false);
  const [view, setView] = useState<ViewMode>('grid');

  const toggle = <T,>(arr: T[], val: T, set: (v: T[]) => void) =>
    set(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);

  const filtered = useMemo(() => {
    let list = PRODUCTS;

    if (catSel.length) {
      list = list.filter(p => catSel.includes(p.cat));
    }
    if (priceSel.length) {
      list = list.filter(p =>
        priceSel.some(id => {
          const r = PRICE_RANGES.find(x => x.id === id)!;
          return p.price >= r.min && p.price < r.max;
        })
      );
    }
    if (matSel.length) {
      list = list.filter(p =>
        matSel.some(m => p.tags.some(t => t.toLowerCase().includes(m.toLowerCase())))
      );
    }
    if (intSel.length) {
      list = list.filter(p =>
        intSel.some(i => p.tags.some(t => t.toLowerCase().includes(i.toLowerCase())))
      );
    }
    if (onlyNew) list = list.filter(p => p.new);
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);

    return list;
  }, [catSel, priceSel, matSel, intSel, onlyNew, sort]);

  const activeFilters =
    catSel.length + priceSel.length + matSel.length + intSel.length + (onlyNew ? 1 : 0);

  const clearFilters = () => {
    setCatSel([]);
    setPriceSel([]);
    setMatSel([]);
    setIntSel([]);
    setOnlyNew(false);
  };

  return (
    <main className="plp">
      <Breadcrumb items={[{ label: 'Inicio', href: '/' }, { label: 'Catálogo' }]} />

      <header className="plp-head">
        <h1>Catálogo completo</h1>
        <p>{filtered.length} piezas · seleccionadas a mano</p>
      </header>

      <div className="plp-body">
        {/* Sidebar */}
        <aside className="filters">
          <div className="filter-head">
            <Icon name="filter" size={14} />
            <span>Filtros</span>
            {activeFilters > 0 && (
              <button className="filter-clear" onClick={clearFilters}>
                Limpiar ({activeFilters})
              </button>
            )}
          </div>

          {/* Categorías */}
          <div className="filter-group">
            <h4>Categoría</h4>
            {CATEGORIES.map(c => (
              <label key={c.id} className="check-row">
                <input
                  type="checkbox"
                  checked={catSel.includes(c.id)}
                  onChange={() => toggle(catSel, c.id, setCatSel)}
                />
                <span>{c.name}</span>
                <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--fg-soft)' }}>
                  {c.count}
                </span>
              </label>
            ))}
          </div>

          {/* Precio */}
          <div className="filter-group">
            <h4>Precio</h4>
            {PRICE_RANGES.map(r => (
              <label key={r.id} className="check-row">
                <input
                  type="checkbox"
                  checked={priceSel.includes(r.id)}
                  onChange={() => toggle(priceSel, r.id, setPriceSel)}
                />
                <span>{r.label}</span>
              </label>
            ))}
          </div>

          {/* Material */}
          <div className="filter-group">
            <h4>Material</h4>
            {MATERIALS.map(m => (
              <label key={m} className="check-row">
                <input
                  type="checkbox"
                  checked={matSel.includes(m)}
                  onChange={() => toggle(matSel, m, setMatSel)}
                />
                <span>{m}</span>
              </label>
            ))}
          </div>

          {/* Intención */}
          <div className="filter-group">
            <h4>Intención</h4>
            <div className="chip-group">
              {INTENTIONS.map(i => (
                <button
                  key={i}
                  className={`chip${intSel.includes(i) ? ' chip-on' : ''}`}
                  onClick={() => toggle(intSel, i, setIntSel)}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          {/* Solo novedades */}
          <div className="filter-group">
            <label className="check-row">
              <input
                type="checkbox"
                checked={onlyNew}
                onChange={e => setOnlyNew(e.target.checked)}
              />
              <span>Solo novedades</span>
            </label>
          </div>
        </aside>

        {/* Grid */}
        <section className="plp-main">
          <div className="plp-toolbar">
            <div className="toolbar-sort">
              <label>Ordenar:</label>
              <select value={sort} onChange={e => setSort(e.target.value as SortKey)}>
                <option value="relevance">Relevancia</option>
                <option value="price-asc">Precio: menor a mayor</option>
                <option value="price-desc">Precio: mayor a menor</option>
                <option value="rating">Mejor valorados</option>
              </select>
            </div>
            <div className="view-toggle">
              <button className={view === 'grid' ? 'on' : ''} onClick={() => setView('grid')}>
                <Icon name="grid" size={14} />
              </button>
              <button className={view === 'rows' ? 'on' : ''} onClick={() => setView('rows')}>
                <Icon name="rows" size={14} />
              </button>
            </div>
          </div>

          {/* Chips de categorías activas */}
          {catSel.length > 0 && (
            <div className="active-cats">
              {catSel.map(id => {
                const cat = CATEGORIES.find(c => c.id === id)!;
                return (
                  <button
                    key={id}
                    className="chip chip-on"
                    onClick={() => toggle(catSel, id, setCatSel)}
                  >
                    {cat.name} ✕
                  </button>
                );
              })}
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="empty-state">
              <Icon name="search" size={32} stroke={1} />
              <p>No hay piezas con esos filtros.</p>
              <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className={`product-grid view-${view}`}>
              {filtered.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
