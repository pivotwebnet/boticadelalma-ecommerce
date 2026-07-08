'use client';

import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { INTENTIONS, MATERIALS } from '@/lib/data';
import { useCategories, useProducts } from '@/hooks/useApiData';
import { fmt } from '@/lib/utils';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Icon from '@/components/ui/Icon';
import ProductCard from '@/components/ui/ProductCard';
import { motion } from 'framer-motion';

type SortKey = 'relevance' | 'price-asc' | 'price-desc' | 'rating';
type ViewMode = 'grid' | 'rows';

const SLUG_TO_INTENTION: Record<string, string> = {
  'amor':                 'amor',
  'prosperidad':          'prosperidad',
  'abundancia':           'abundancia',
  'escudos-y-proteccion': 'escudos y protección',
  'calma-y-paz-interior': 'calma y paz interior',
  'crecimiento-personal': 'crecimiento personal',
  'concrecion':           'concreción',
  'comunicacion':         'comunicación',
  'sanacion-y-procesos':  'sanación y procesos',
  'proteccion':           'escudos y protección',
  'escudos':              'escudos y protección',
  'calma':                'calma y paz interior',
  'sanacion':             'sanación y procesos',
};

export default function CatalogClient() {
  const categories = useCategories();
  const products = useProducts();
  const searchParams = useSearchParams();
  const [catSel, setCatSel] = useState<string[]>([]);
  const [subcatSel, setSubcatSel] = useState<string>('');
  const [sort, setSort] = useState<SortKey>('relevance');
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [matSel, setMatSel] = useState<string[]>([]);
  const [intSel, setIntSel] = useState<string[]>([]);
  const [sizeSel, setSizeSel] = useState<string[]>([]);
  const [onlyNew, setOnlyNew] = useState(false);
  const [view, setView] = useState<ViewMode>('grid');
  const [sortOpen, setSortOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [catSel, subcatSel, maxPrice, matSel, intSel, sizeSel, onlyNew, sort]);

  // Sync filters from URL params — re-runs on every navigation (incl. desde el menú)
  useEffect(() => {
    const catParam    = searchParams.get('cat');
    const subcatParam = searchParams.get('subcat');
    const intencion   = searchParams.get('intencion');

    setCatSel(catParam ? [catParam] : []);
    setSubcatSel(subcatParam ?? '');

    const intention = intencion ? SLUG_TO_INTENTION[intencion] : undefined;
    setIntSel(intention && INTENTIONS.includes(intention) ? [intention] : []);
  }, [searchParams]);

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

  // Materiales e Intenciones disponibles dinámicamente según la categoría/subcategoría activa
  const { availableMaterials, availableIntentions } = useMemo(() => {
    let list = products;
    if (catSel.length) {
      list = list.filter(p => catSel.includes(p.cat));
    }
    if (subcatSel) {
      list = list.filter(p => p.subcat === subcatSel);
    }

    const availMats = MATERIALS.filter(m =>
      list.some(p => p.tags.some(t => t.toLowerCase().includes(m.toLowerCase())))
    );

    const availInts = INTENTIONS.filter(i =>
      list.some(p => p.tags.some(t => t.toLowerCase().includes(i.toLowerCase())))
    );

    return {
      availableMaterials: availMats,
      availableIntentions: availInts,
    };
  }, [products, catSel, subcatSel]);

  // Limpiar selecciones de materiales o intenciones que dejan de estar disponibles
  useEffect(() => {
    setMatSel(prev => prev.filter(m => availableMaterials.includes(m)));
    setIntSel(prev => prev.filter(i => availableIntentions.includes(i)));
  }, [availableMaterials, availableIntentions]);

  const filtered = useMemo(() => {
    let list = products;

    if (catSel.length) list = list.filter(p => catSel.includes(p.cat));
    if (subcatSel)     list = list.filter(p => p.subcat === subcatSel);

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
    if (sizeSel.length) {
      list = list.filter(p =>
        sizeSel.some(s => {
          const nameLower = p.name.toLowerCase();
          const labelLower = p.label.toLowerCase();
          const sLower = s.toLowerCase();
          if (sLower === 'pequeña') {
            return nameLower.includes('pequeñ') || labelLower.includes('pequeñ') || p.tags.some(t => t.toLowerCase().includes('pequeñ'));
          }
          if (sLower === 'mediana') {
            return nameLower.includes('median') || labelLower.includes('median') || p.tags.some(t => t.toLowerCase().includes('median'));
          }
          if (sLower === 'grande') {
            return nameLower.includes('grand') || labelLower.includes('grand') || p.tags.some(t => t.toLowerCase().includes('grand'));
          }
          return false;
        })
      );
    }
    if (onlyNew) list = list.filter(p => p.new);
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);

    return list;
  }, [products, catSel, subcatSel, maxPrice, matSel, intSel, sizeSel, onlyNew, sort]);

  const activeFilters =
    catSel.length + (subcatSel ? 1 : 0) + (maxPrice < absoluteMax ? 1 : 0) + matSel.length + intSel.length + sizeSel.length + (onlyNew ? 1 : 0);

  const clearFilters = () => {
    setCatSel([]);
    setSubcatSel('');
    setMaxPrice(absoluteMax);
    setMatSel([]);
    setIntSel([]);
    setSizeSel([]);
    setOnlyNew(false);
  };

  const PRODUCTS_PER_PAGE = 12;
  const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filtered.slice(start, start + PRODUCTS_PER_PAGE);
  }, [filtered, currentPage]);

  const renderPageButtons = () => {
    const buttons = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(i);
      }
    } else {
      buttons.push(1);
      if (currentPage > 3) {
        buttons.push('ellipsis-start');
      }
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (!buttons.includes(i)) {
          buttons.push(i);
        }
      }
      
      if (currentPage < totalPages - 2) {
        buttons.push('ellipsis-end');
      }
      if (!buttons.includes(totalPages)) {
        buttons.push(totalPages);
      }
    }

    return buttons.map((b, idx) => {
      if (b === 'ellipsis-start' || b === 'ellipsis-end') {
        return (
          <li key={`ell-${idx}`} className="page-item disabled">
            <span className="page-link border-none bg-transparent hover:bg-transparent select-none cursor-default">
              ...
            </span>
          </li>
        );
      }
      return (
        <li key={`page-${b}`} className={`page-item ${currentPage === b ? 'active' : ''}`}>
          <button
            onClick={() => {
              setCurrentPage(b as number);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="page-link"
          >
            {b}
          </button>
        </li>
      );
    });
  };

  return (
    <main className="plp">
      <Breadcrumb items={[{ label: 'Inicio', href: '/' }, { label: 'Catálogo' }]} />

      <header className="plp-head">
        <h1>Catálogo</h1>
        <p>{filtered.length} piezas · seleccionadas a mano</p>
      </header>

      <div className="max-w-6xl mx-auto px-4 lg:px-0">
        <button
          type="button"
          className="filters-toggle-btn"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Icon name="filter" size={14} />
          <span>{showFilters ? 'Ocultar filtros' : 'Filtrar productos'}</span>
          {activeFilters > 0 && (
            <span className="filters-badge-count">{activeFilters}</span>
          )}
        </button>
      </div>

      <div className="plp-body">
        {/* Sidebar */}
        <aside className={`filters${showFilters ? ' show' : ''}`}>
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
          {availableMaterials.length > 0 && (
            <div className="filter-group">
              <h4>Material</h4>
              {availableMaterials.map(m => (
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
          )}

          {/* Tamaño (Solo si se filtra piedras o en general si hay piedras) */}
          {(catSel.length === 0 || catSel.includes('piedras')) && (
            <div className="filter-group">
              <h4>Tamaño</h4>
              {['Pequeña', 'Mediana', 'Grande'].map(s => (
                <label key={s} className="check-row">
                  <input
                    type="checkbox"
                    checked={sizeSel.includes(s)}
                    onChange={() => toggle(sizeSel, s, setSizeSel)}
                  />
                  <span>{s}</span>
                </label>
              ))}
            </div>
          )}

          {/* Intención */}
          {availableIntentions.length > 0 && (
            <div className="filter-group">
              <h4>Intención</h4>
              <div className="chip-group">
                {availableIntentions.map(i => (
                  <button
                    key={i}
                    className={`chip capitalize${intSel.includes(i) ? ' chip-on' : ''}`}
                    onClick={() => toggle(intSel, i, setIntSel)}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>
          )}

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
              <button 
                className={view === 'grid' ? 'on' : ''} 
                onClick={() => setView('grid')}
                data-tooltip="Vista en cuadrícula"
                aria-label="Vista en cuadrícula"
              >
                <Icon name="grid" size={14} />
              </button>
              <button 
                className={view === 'rows' ? 'on' : ''} 
                onClick={() => setView('rows')}
                data-tooltip="Vista en lista"
                aria-label="Vista en lista"
              >
                <Icon name="rows" size={14} />
              </button>
            </div>
          </div>

          {/* Active filter chips */}
          {activeFilters > 0 && (
            <div className="active-cats">
              {catSel.map(id => {
                const cat = categories.find(c => c.id === id)!;
                return (
                  <button
                    key={id}
                    className="chip chip-on"
                    onClick={() => { toggle(catSel, id, setCatSel); setSubcatSel(''); }}
                  >
                    {cat.name} ✕
                  </button>
                );
              })}
              {subcatSel && (() => {
                const cat = categories.find(c => c.subcategories?.some(s => s.id === subcatSel));
                const sub = cat?.subcategories?.find(s => s.id === subcatSel);
                return sub ? (
                  <button
                    key={subcatSel}
                    className="chip chip-on"
                    onClick={() => setSubcatSel('')}
                  >
                    {sub.name} ✕
                  </button>
                ) : null;
              })()}
              {matSel.map(m => (
                <button
                  key={`mat-${m}`}
                  className="chip chip-on"
                  onClick={() => toggle(matSel, m, setMatSel)}
                >
                  {m} ✕
                </button>
              ))}
              {sizeSel.map(s => (
                <button
                  key={`size-${s}`}
                  className="chip chip-on"
                  onClick={() => toggle(sizeSel, s, setSizeSel)}
                >
                  {s} ✕
                </button>
              ))}
              {intSel.map(i => (
                <button
                  key={`int-${i}`}
                  className="chip chip-on capitalize"
                  onClick={() => toggle(intSel, i, setIntSel)}
                >
                  {i} ✕
                </button>
              ))}
              {maxPrice < absoluteMax && (
                <button
                  className="chip chip-on"
                  onClick={() => setMaxPrice(absoluteMax)}
                >
                  Hasta {fmt(maxPrice)} ✕
                </button>
              )}
              {onlyNew && (
                <button
                  className="chip chip-on"
                  onClick={() => setOnlyNew(false)}
                >
                  Novedades ✕
                </button>
              )}
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
            <>
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className={`product-grid view-${view}`}
              >
                {paginatedProducts.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </motion.div>

              {totalPages > 1 && (
                <nav aria-label="Page navigation example" className="mt-12 py-6 border-t border-stone-100 flex justify-center">
                  <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button
                        onClick={() => {
                          setCurrentPage(prev => Math.max(1, prev - 1));
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        disabled={currentPage === 1}
                        className="page-link"
                        aria-label="Página anterior"
                        data-tooltip="Página anterior"
                      >
                        <span aria-hidden="true">&lsaquo;</span>
                        <span className="sr-only">Anterior</span>
                      </button>
                    </li>

                    {renderPageButtons()}

                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button
                        onClick={() => {
                          setCurrentPage(prev => Math.min(totalPages, prev + 1));
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        disabled={currentPage === totalPages}
                        className="page-link"
                        aria-label="Página siguiente"
                        data-tooltip="Página siguiente"
                      >
                        <span aria-hidden="true">&rsaquo;</span>
                        <span className="sr-only">Siguiente</span>
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}
