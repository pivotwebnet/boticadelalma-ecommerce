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
  { x: 28,  y: 14, rot: -34, s: 1.0,  delay: 0.25 },
  { x: 64,  y: 10, rot: -10, s: 1.3,  delay: 0.38 },
  { x: 104, y: 15, rot: 24,  s: 0.95, delay: 0.50 },
  { x: 158, y: 24, rot: 168, s: 1.25, delay: 0.64 },
  { x: 222, y: 17, rot: -22, s: 1.05, delay: 0.78 },
  { x: 286, y: 11, rot: 8,   s: 1.35, delay: 0.90 },
  { x: 360, y: 24, rot: 150, s: 1.0,  delay: 1.02 },
  { x: 420, y: 13, rot: 30,  s: 1.2,  delay: 1.14 },
  { x: 452, y: 24, rot: 158, s: 1.0,  delay: 1.24 },
  { x: 478, y: 12, rot: 18,  s: 1.25, delay: 1.34 },
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
    router.push(`/catalogo?cat=${id}`);
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
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* Balanceo suave de toda la rama, como si la moviera el viento */}
        <motion.g
          style={{ originX: 0, originY: 1 }}
          animate={{ rotate: [0, 0.8, 0, -0.8, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1.7 }}
        >
          {/* Tallo — curvas irregulares, sin patrón repetido */}
          <motion.path
            d="M4 20 C 30 11 64 9 96 14 C 124 18 158 25 188 22 C 222 19 252 6 286 11 C 320 16 360 25 392 19 C 420 14 452 9 476 13"
            stroke="#7C8A54"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.4, ease: EASE }}
          />

          {/* Zarcillo en espiral al final de la rama */}
          <motion.path
            d="M476 13 c 9 -1 13 6 8 11 c -3 3 -9 1 -8 -4"
            stroke="#7C8A54"
            strokeWidth="1.6"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 1.35, ease: EASE }}
          />

          {/* Hojas */}
          {LEAVES.map((l, i) => (
            <g
              key={i}
              transform={`translate(${l.x}, ${l.y}) rotate(${l.rot})`}
            >
              <motion.path
                d={LEAF_D}
                fill={i % 2 === 0 ? '#8A9A5B' : '#6F7D45'}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: l.s, opacity: 1 }}
                style={{ originX: '0px', originY: '0px' }}
                transition={{
                  scale: { type: 'spring', stiffness: 320, damping: 13, delay: l.delay },
                  opacity: { duration: 0.25, delay: l.delay },
                }}
              />
            </g>
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
          <button 
            className="clear-search" 
            onClick={() => setQ('')}
            data-tooltip="Limpiar búsqueda"
            aria-label="Limpiar búsqueda"
          >
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
