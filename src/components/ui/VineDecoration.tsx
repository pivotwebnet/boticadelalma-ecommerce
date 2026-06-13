'use client';

import { motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;

// Forma de una hoja, dibujada desde su base (0,0) apuntando hacia arriba.
const LEAF_D = 'M0 0 C 5 -2 9 -7 7 -14 C 4 -8 -3 -5 0 0 Z';

// Hojas repartidas a lo largo del tallo (viewBox 0 0 480 30).
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

/**
 * Enredadera decorativa que se "dibuja" sola al entrar en pantalla (whileInView).
 * El tallo recorre el ancho del contenedor, brotan las hojas a su paso y queda
 * meciéndose suave como con el viento. Pensada para acompañar títulos.
 */
export default function VineDecoration({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`vine-decor ${className}`}
      viewBox="0 0 480 30"
      fill="none"
      aria-hidden="true"
    >
      {/* Balanceo suave de toda la rama */}
      <motion.g
        style={{ originX: 0, originY: 1 }}
        initial={{ rotate: 0 }}
        whileInView={{ rotate: [0, 0.8, 0, -0.8, 0] }}
        viewport={{ once: true }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1.7 }}
      >
        {/* Tallo */}
        <motion.path
          d="M6 18 C 46 6 86 6 126 18 C 166 30 206 30 246 18 C 286 6 326 6 366 18 C 406 30 446 30 474 18"
          stroke="#7C8A54"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: EASE }}
        />

        {/* Zarcillo en espiral al final */}
        <motion.path
          d="M474 18 c 9 -1 13 6 8 11 c -3 3 -9 1 -8 -4"
          stroke="#7C8A54"
          strokeWidth="1.6"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 1.35, ease: EASE }}
        />

        {/* Hojas */}
        {LEAVES.map((l, i) => (
          <motion.path
            key={i}
            d={LEAF_D}
            fill={i % 2 === 0 ? '#8A9A5B' : '#6F7D45'}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: l.s, opacity: 1 }}
            viewport={{ once: true }}
            style={{ x: l.x, y: l.y, rotate: l.rot, originX: 0.5, originY: 1 }}
            transition={{
              scale: { type: 'spring', stiffness: 320, damping: 13, delay: l.delay },
              opacity: { duration: 0.25, delay: l.delay },
            }}
          />
        ))}
      </motion.g>
    </svg>
  );
}
