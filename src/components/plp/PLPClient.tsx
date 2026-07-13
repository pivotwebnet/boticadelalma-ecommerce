'use client';

import { useMemo, useState, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { INTENTIONS, MATERIALS } from '@/lib/data';
import { useCategories, useProducts } from '@/hooks/useApiData';
import { fmt } from '@/lib/utils';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Icon from '@/components/ui/Icon';
import ProductCard from '@/components/ui/ProductCard';

interface PLPClientProps {
  cat: string;
}

type SortKey = 'relevance' | 'price-asc' | 'price-desc' | 'rating';
type ViewMode = 'grid' | 'rows';

export default function PLPClient({ cat }: PLPClientProps) {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <PLPInner cat={cat} />
    </Suspense>
  );
}

function PLPInner({ cat }: PLPClientProps) {
  const searchParams = useSearchParams();
  const sub = searchParams.get('sub');
  const categories = useCategories();
  const products = useProducts();

  const category = categories.find(c => c.id === cat) ?? categories[0];
  const subCategory = category?.subcategories?.find(s => s.id === sub);

  const [sort, setSort] = useState<SortKey>('relevance');
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [matSel, setMatSel] = useState<string[]>([]);
  const [intSel, setIntSel] = useState<string[]>([]);
  const [onlyNew, setOnlyNew] = useState(false);
  const [view, setView] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 12;

  const absoluteMax = useMemo(() => {
    const prices = products.filter(p => p.cat === cat).map(p => p.price);
    return prices.length > 0 ? Math.ceil(Math.max(...prices) / 1000) * 1000 : 100000;
  }, [products, cat]);

  useEffect(() => {
    if (maxPrice === 100000 && absoluteMax !== 100000) {
      setMaxPrice(absoluteMax);
    }
  }, [absoluteMax, maxPrice]);

  const toggle = <T,>(arr: T[], val: T, set: (v: T[]) => void) =>
    set(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);

  const filtered = useMemo(() => {
    let list = products.filter(p => p.cat === cat);

    if (subCategory) {
      const subName = subCategory.name.toLowerCase();
      list = list.filter(p => 
        p.tags.some(t => t.toLowerCase().includes(subName)) ||
        p.label.toLowerCase().includes(subName)
      );
    }

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
  }, [products, cat, subCategory, maxPrice, matSel, intSel, onlyNew, sort]);

  const activeFilters =
    (maxPrice < absoluteMax ? 1 : 0) + matSel.length + intSel.length + (onlyNew ? 1 : 0);

  const clearFilters = () => {
    setMaxPrice(absoluteMax);
    setMatSel([]);
    setIntSel([]);
    setOnlyNew(false);
  };

  // Paginación: se renderizan solo PRODUCTS_PER_PAGE por página (antes se
  // pintaban TODAS las tarjetas de la categoría de una — con Dijes eran 382).
  const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filtered.slice(start, start + PRODUCTS_PER_PAGE);
  }, [filtered, currentPage]);

  // Al cambiar de categoría/subcategoría/filtros/orden, volver a la página 1.
  useEffect(() => { setCurrentPage(1); }, [cat, sub, maxPrice, matSel, intSel, onlyNew, sort]);

  const renderPageButtons = () => {
    const buttons: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) buttons.push(i);
    } else {
      buttons.push(1);
      if (currentPage > 3) buttons.push('ellipsis-start');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) if (!buttons.includes(i)) buttons.push(i);
      if (currentPage < totalPages - 2) buttons.push('ellipsis-end');
      if (!buttons.includes(totalPages)) buttons.push(totalPages);
    }
    return buttons.map((b, idx) => {
      if (b === 'ellipsis-start' || b === 'ellipsis-end') {
        return (
          <li key={`ell-${idx}`} className="page-item disabled">
            <span className="page-link border-none bg-transparent hover:bg-transparent select-none cursor-default">...</span>
          </li>
        );
      }
      return (
        <li key={`page-${b}`} className={`page-item ${currentPage === b ? 'active' : ''}`}>
          <button
            onClick={() => { setCurrentPage(b as number); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="page-link"
          >
            {b}
          </button>
        </li>
      );
    });
  };

  const breadcrumbItems = [
    { label: 'Inicio', href: '/' },
    { label: category?.name ?? cat, href: sub ? `/catalogo?cat=${cat}` : undefined },
  ];
  if (subCategory) {
    breadcrumbItems.push({ label: subCategory.name, href: undefined });
  }

  return (
    <main className="plp">
      <Breadcrumb items={breadcrumbItems} />

      <header className="plp-head">
        <h1>{subCategory ? subCategory.name : (category?.name ?? cat)}</h1>
        <p>{filtered.length} {filtered.length === 1 ? 'pieza' : 'piezas'} · seleccionadas a mano</p>
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
              <div className={`product-grid view-${view}`}>
                {paginated.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {totalPages > 1 && (
                <nav aria-label="Paginación" className="mt-12 py-6 border-t border-stone-100 flex justify-center">
                  <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button
                        onClick={() => { setCurrentPage(prev => Math.max(1, prev - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
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
                        onClick={() => { setCurrentPage(prev => Math.min(totalPages, prev + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
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
