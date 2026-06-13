'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCategories, useProducts } from '@/hooks/useApiData';
import { fmt } from '@/lib/utils';
import Icon from '@/components/ui/Icon';
import ProductPlaceholder from '@/components/ui/ProductPlaceholder';

const TRENDING = ['plata', 'amatista', 'collar', 'ojo turco'];

const EASE = [0.22, 1, 0.36, 1] as const;

// Forma de una hoja, dibujada desde su base (0,0) apuntando hacia arriba,
// con una nervadura central sutil.
const LEAF_D = 'M0 0 C 5 -2 9 -7 7 -14 C 4 -8 -3 -5 0 0 Z';

// Hojas pegadas al tallo. x/y en coordenadas del viewBox (0 0 480 30), repartidas a
// lo largo de toda la barra. `s` = tamaño, rot ~160° = hoja colgando hacia abajo.
// `delay` sincroniza cada brote con el avance del trazo.
const LEAVES: { x: number; y: number; rot: number; s: number; delay: number }[] = [
  { x: 30,  y: 13, rot: -30, s: 0.9,  delay: 0.25 },
  { x: 66,  y: 9,  rot: -8,  s: 1.15, delay: 0.38 },
  { x: 110, y: 15, rot: 28,  s: 0.8,  delay: 0.50 },
  { x: 186, y: 27, rot: 165, s: 1.0,  delay: 0.64 },
  { x: 246, y: 18, rot: -18, s: 0.85, delay: 0.78 },
  { x: 306, y: 9,  rot: 6,   s: 1.15, delay: 0.90 },
  { x: 350, y: 15, rot: 28,  s: 0.8,  delay: 1.02 },
  { x: 426, y: 27, rot: 158, s: 1.0,  delay: 1.14 },
  { x: 470, y: 17, rot: 22,  s: 1.05, delay: 1.24 },
];

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
      {/* Enredadera: se dibuja sola al entrar a la página y recorre toda la barra */}
      <svg
        className="search-vine"
        viewBox="0 0 480 30"
        fill="none"
        aria-hidden="true"
      >
        {/* Balanceo suave de toda la rama, como si la moviera el viento */}
        <motion.g
          style={{ originX: 0, originY: 1 }}
          animate={{ rotate: [0, 0.8, 0, -0.8, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1.7 }}
        >
          {/* Tallo */}
          <motion.path
            d="M6 18 C 46 6 86 6 126 18 C 166 30 206 30 246 18 C 286 6 326 6 366 18 C 406 30 446 30 474 18"
            stroke="#7C8A54"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.4, ease: EASE }}
          />

          {/* Zarcillo en espiral al final de la rama */}
          <motion.path
            d="M474 18 c 9 -1 13 6 8 11 c -3 3 -9 1 -8 -4"
            stroke="#7C8A54"
            strokeWidth="1.6"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 1.35, ease: EASE }}
          />

          {/* Hojas */}
          {LEAVES.map((l, i) => (
            <motion.path
              key={i}
              d={LEAF_D}
              fill={i % 2 === 0 ? '#8A9A5B' : '#6F7D45'}
              initial={{ scale: 0, opacity: 0 }}
              style={{ x: l.x, y: l.y, rotate: l.rot, originX: 0.5, originY: 1 }}
              animate={{ scale: l.s, opacity: 1 }}
              transition={{
                scale: { type: 'spring', stiffness: 320, damping: 13, delay: l.delay },
                opacity: { duration: 0.25, delay: l.delay },
              }}
            />
          ))}
        </motion.g>
      </svg>

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
