'use client';

import { useMemo, useState, useEffect } from 'react';
import { INTENTIONS, MATERIALS } from '@/lib/data';
import { useCategories, useProducts } from '@/hooks/useApiData';
import { fmt } from '@/lib/utils';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Icon from '@/components/ui/Icon';
import ProductCard from '@/components/ui/ProductCard';

type SortKey = 'relevance' | 'price-asc' | 'price-desc' | 'rating';
type ViewMode = 'grid' | 'rows';

export default function CatalogClient() {
  const categories = useCategories();
  const products = useProducts();
  const [catSel, setCatSel] = useState<string[]>([]);
  const [sort, setSort] = useState<SortKey>('relevance');
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [matSel, setMatSel] = useState<string[]>([]);
  const [intSel, setIntSel] = useState<string[]>([]);
  const [onlyNew, setOnlyNew] = useState(false);
  const [view, setView] = useState<ViewMode>('grid');
  const [sortOpen, setSortOpen] = useState(false);

  // Calculate absolute max price from all products
  const absoluteMax = useMemo(() => {
    const prices = products.map(p => p.price);
    return prices.length > 0 ? Math.ceil(Math.max(...prices) / 1000) * 1000 : 100000;
  }, [products]);

  // Close dropdown on click outside
  useEffect(() => {
    if (!sortOpen) return;
    const h = () => setSortOpen(false);
    window.addEventListener('click', h);
    return () => window.removeEventListener('click', h);
  }, [sortOpen]);

  const toggle = <T,>(arr: T[], val: T, set: (v: T[]) => void) =>
    set(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);

  const sortOptions: { key: SortKey; label: string }[] = [
    { key: 'relevance', label: 'Relevancia' },
    { key: 'price-asc', label: 'Precio: menor a mayor' },
    { key: 'price-desc', label: 'Precio: mayor a menor' },
    { key: 'rating', label: 'Mejor valorados' },
  ];

  const currentSortLabel = sortOptions.find(o => o.key === sort)?.label;

  const filtered = useMemo(() => {
    let list = products;

    if (catSel.length) {
      list = list.filter(p => catSel.includes(p.cat));
    }
    
    // Dynamic price filtering
    list = list.filter(p => p.price <= maxPrice);

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
  }, [products, catSel, maxPrice, matSel, intSel, onlyNew, sort]);

  const activeFilters =
    catSel.length + (maxPrice < absoluteMax ? 1 : 0) + matSel.length + intSel.length + (onlyNew ? 1 : 0);

  const clearFilters = () => {
    setCatSel([]);
    setMaxPrice(absoluteMax);
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

            {/* Joyería – grupo colapsable */}
            {(() => {
              const joyas = categories.filter(c => c.group === 'Joyería');
              const rest  = categories.filter(c => !c.group);
              return (
                <>
                  {joyas.length > 0 && (
                    <>
                      <span className="filter-subgroup-label">Joyería</span>
                      {joyas.map(c => (
                        <label key={c.id} className="check-row check-indent">
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
                    </>
                  )}
                  {rest.map(c => (
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
                </>
              );
            })()}
          </div>

          {/* Precio */}
          <div className="filter-group">
            <div className="flex justify-between items-end mb-4">
              <h4>Precio</h4>
              <span className="text-[13px] font-medium text-stone-900 bg-stone-100/80 px-2 py-0.5 rounded border border-stone-200">
                Hasta {fmt(maxPrice)}
              </span>
            </div>
            <div className="relative px-1 pt-2 pb-6">
              {/* Native Price Slider */}
              <input
                type="range"
                min={0}
                max={absoluteMax}
                step={500}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="elite-price-slider"
                style={{ 
                  '--progress': `${(maxPrice / absoluteMax) * 100}%` 
                } as React.CSSProperties}
              />
              <div className="flex justify-between mt-3 text-[10px] uppercase tracking-[0.2em] text-stone-400 font-bold">
                <span>$0</span>
                <span>{fmt(absoluteMax)}</span>
              </div>
            </div>
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
              <div className={`sort-dropdown${sortOpen ? ' open' : ''}`} onClick={(e) => e.stopPropagation()}>
                <button className="sort-trigger" onClick={() => setSortOpen(!sortOpen)}>
                  <span>{currentSortLabel}</span>
                  <Icon name="chevron-d" size={14} className="dl-chevron" />
                </button>
                <div className="sort-menu">
                  {sortOptions.map(opt => (
                    <button
                      key={opt.key}
                      className={`sort-item${sort === opt.key ? ' active' : ''}`}
                      onClick={() => {
                        setSort(opt.key);
                        setSortOpen(false);
                      }}
                    >
                      {opt.label}
                      {sort === opt.key && <Icon name="check" size={14} className="check-mark" />}
                    </button>
                  ))}
                </div>
              </div>
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
                const cat = categories.find(c => c.id === id)!;
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
