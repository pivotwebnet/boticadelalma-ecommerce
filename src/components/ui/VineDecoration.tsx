'use client';

import { motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;

// Forma de una hoja, dibujada desde su base (0,0) apuntando hacia arriba.
const LEAF_D = 'M0 0 C 5 -2 9 -7 7 -14 C 4 -8 -3 -5 0 0 Z';

// Hojas repartidas a lo largo del tallo (viewBox 0 0 480 30).
// Tamaños bien variados y ángulos propios — distinta personalidad que la del buscador.
const LEAVES: { x: number; y: number; rot: number; s: number; delay: number }[] = [
  { x: 40,  y: 22, rot: 150, s: 1.2,  delay: 0.30 },
  { x: 70,  y: 25, rot: 166, s: 0.7,  delay: 0.42 },
  { x: 132, y: 9,  rot: -20, s: 1.35, delay: 0.55 },
  { x: 160, y: 6,  rot: -4,  s: 0.8,  delay: 0.68 },
  { x: 230, y: 20, rot: 140, s: 1.1,  delay: 0.82 },
  { x: 260, y: 26, rot: 158, s: 0.85, delay: 0.95 },
  { x: 332, y: 13, rot: -16, s: 1.25, delay: 1.08 },
  { x: 400, y: 13, rot: 12,  s: 0.75, delay: 1.20 },
  { x: 454, y: 21, rot: 146, s: 1.15, delay: 1.30 },
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
      {/* El tallo queda quieto; las hojas respiran individualmente (ver abajo) */}
      <g>
        {/* Tallo — más fino y ondulando en sentido opuesto al del buscador */}
        <motion.path
          d="M4 16 C 36 24 70 26 102 18 C 132 11 160 5 196 12 C 232 19 260 27 298 20 C 332 14 366 7 400 13 C 430 18 454 22 476 17"
          stroke="#7C8A54"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: EASE }}
        />

        {/* Zarcillo en espiral al comienzo, mirando hacia el otro lado */}
        <motion.path
          d="M4 16 c -9 -1 -13 6 -8 11 c 3 3 9 1 8 -4"
          stroke="#7C8A54"
          strokeWidth="1.2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
        />

        {/* Hojas: brotan al entrar y luego "respiran" cada una a su ritmo */}
        {LEAVES.map((l, i) => (
          <motion.g
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: l.s, opacity: 1 }}
            viewport={{ once: true }}
            style={{ x: l.x, y: l.y, originX: 0.5, originY: 1 }}
            transition={{
              scale: { type: 'spring', stiffness: 320, damping: 13, delay: l.delay },
              opacity: { duration: 0.25, delay: l.delay },
            }}
          >
            <motion.path
              d={LEAF_D}
              fill={i % 2 === 0 ? '#8A9A5B' : '#6F7D45'}
              style={{ rotate: l.rot, originX: 0.5, originY: 1 }}
              animate={{ scale: [1, 1.09, 1] }}
              transition={{
                duration: 3.6 + (i % 3) * 0.6,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: l.delay + 1.4 + i * 0.2,
              }}
            />
          </motion.g>
        ))}
      </g>
    </svg>
  );
}
