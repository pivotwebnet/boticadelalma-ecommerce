'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCategories, useProducts } from '@/hooks/useApiData';
import { fmt } from '@/lib/utils';
import Icon from '@/components/ui/Icon';
import ProductPlaceholder from '@/components/ui/ProductPlaceholder';

const TRENDING = ['palo santo', 'amatista', 'tarot', 'vela ritual'];

export default function SearchBox() {
  const router = useRouter();
  const categories = useCategories();
  const products = useProducts();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const needle = q.trim().toLowerCase();
  const prodMatches = needle
    ? products.filter(
        p =>
          p.name.toLowerCase().includes(needle) ||
          p.tags.some(t => t.toLowerCase().includes(needle))
      ).slice(0, 5)
    : [];
  const catMatches = needle
    ? categories.filter(c => c.name.toLowerCase().includes(needle)).slice(0, 3)
    : [];

  const goToProduct = (id: string) => {
    router.push(`/producto/${id}`);
    setOpen(false);
    setQ('');
  };

  const goToCategory = (id: string) => {
    router.push(`/categoria/${id}`);
    setOpen(false);
    setQ('');
  };

  return (
    <div className="search-wrap" ref={ref}>
      <div className={`search-input${open ? ' focused' : ''}`}>
        <Icon name="search" size={16} />
        <input
          type="text"
          placeholder="Buscar por nombre, intención, material…"
          value={q}
          onChange={e => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
        />
        {q && (
          <button className="clear-search" onClick={() => setQ('')}>
            <Icon name="close" size={14} />
          </button>
        )}
      </div>

      {open && (
        <div className="search-dropdown">
          {needle ? (
            <>
              {prodMatches.length > 0 && (
                <div className="sd-group">
                  <div className="sd-head">Productos</div>
                  {prodMatches.map(p => (
                    <button key={p.id} className="sd-item" onClick={() => goToProduct(p.id)}>
                      <div className="sd-thumb">
                        <ProductPlaceholder tone={p.tone} label="" aspectRatio={1} />
                      </div>
                      <div className="sd-body">
                        <span className="sd-name">{p.name}</span>
                        <span className="sd-meta">{fmt(p.price)}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {catMatches.length > 0 && (
                <div className="sd-group">
                  <div className="sd-head">Categorías</div>
                  {catMatches.map(c => (
                    <button key={c.id} className="sd-item sd-link" onClick={() => goToCategory(c.id)}>
                      <Icon name="arrow-r" size={14} />
                      <span>{c.name} — {c.count} piezas</span>
                    </button>
                  ))}
                </div>
              )}
              {prodMatches.length === 0 && catMatches.length === 0 && (
                <div className="sd-empty">
                  No encontramos resultados para <b>&ldquo;{q}&rdquo;</b>
                </div>
              )}
            </>
          ) : (
            <div className="sd-group">
              <div className="sd-head">Búsquedas frecuentes</div>
              <div className="sd-trending">
                {TRENDING.map(t => (
                  <button key={t} className="trending-chip" onClick={() => setQ(t)}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
