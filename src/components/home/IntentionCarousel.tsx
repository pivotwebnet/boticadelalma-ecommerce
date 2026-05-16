'use client';

import { useRef, useState, useEffect, useLayoutEffect, useCallback } from 'react';

const VISIBLE = 4;
const GAP = 20;

const AmorSvg = () => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M24 32 C 16 26 12 18 16 11 C 18 7 22 8 24 14 C 26 8 30 7 32 11 C 36 18 32 26 24 32Z" />
    <path d="M24 32 C 14 30 8 22 10 14 C 12 9 18 12 18 18 Q 16 24 24 32Z" />
    <path d="M24 32 C 34 30 40 22 38 14 C 36 9 30 12 30 18 Q 32 24 24 32Z" />
    <path d="M24 32 L 24 44" />
    <path d="M24 40 Q 19 38 17 42" />
  </svg>
);
const ProteccionSvg = () => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M24 4 L 5 10 L 5 24 C 5 35 14 43 24 47 C 34 43 43 35 43 24 L 43 10 Z" />
    <path d="M15 24 L 21 30 L 33 18" />
  </svg>
);
const AbundanciaSvg = () => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M24 7 L 20 22 L 24 26 L 28 22 Z" />
    <path d="M14 15 L 11 29 L 17 33 L 22 29 L 22 15" />
    <path d="M34 15 L 37 29 L 31 33 L 26 29 L 26 15" />
    <path d="M11 33 L 37 33" />
    <path d="M7 9 L 8 11 L 10 9 L 8 7 Z" />
    <path d="M39 7 L 40 9 L 42 7 L 40 5 Z" />
  </svg>
);
const LimpiezaSvg = () => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 48 L 19 32 M 22 48 L 22 30 M 26 48 L 26 30 M 30 48 L 29 32" />
    <path d="M16 42 Q 24 40 32 42" />
    <path d="M20 28 Q 16 21 20 14 Q 24 7 20 2" />
    <path d="M26 26 Q 30 19 26 13" />
    <path d="M23 27 Q 19 20 23 13" />
  </svg>
);
const IntuicionSvg = () => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M30 5 Q 14 9 12 23 Q 10 37 24 44 Q 11 40 7 29 Q 3 17 15 7 Z" />
    <path d="M35 13 L 36 15 L 38 13 L 36 11 Z" />
    <path d="M39 25 L 40 27 L 42 25 L 40 23 Z" />
    <path d="M34 35 L 35 37 L 37 35 L 35 33 Z" />
  </svg>
);
const AnclajeSvg = () => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="24" cy="17" rx="12" ry="9" />
    <path d="M24 26 L 24 44" />
    <path d="M24 34 L 15 44" />
    <path d="M24 34 L 33 44" />
    <path d="M24 38 L 19 46" />
    <path d="M24 38 L 29 46" />
  </svg>
);

const INTENTIONS = [
  { id: 'Amor',       sub: 'Conexión y vínculo',      color: '#b07878', bg: 'rgba(176,120,120,0.09)', symbol: <AmorSvg /> },
  { id: 'Protección', sub: 'Escudo energético',        color: '#2A5E36', bg: 'rgba(42,94,54,0.08)',    symbol: <ProteccionSvg /> },
  { id: 'Abundancia', sub: 'Prosperidad y flujo',      color: '#9a7040', bg: 'rgba(154,112,64,0.09)',  symbol: <AbundanciaSvg /> },
  { id: 'Limpieza',   sub: 'Purificación del espacio', color: '#5a8a6a', bg: 'rgba(90,138,106,0.09)',  symbol: <LimpiezaSvg /> },
  { id: 'Intuición',  sub: 'Claridad interior',        color: '#5566c8', bg: 'rgba(85,102,200,0.08)',  symbol: <IntuicionSvg /> },
  { id: 'Anclaje',    sub: 'Conexión con la tierra',   color: '#7a5e38', bg: 'rgba(122,94,56,0.09)',   symbol: <AnclajeSvg /> },
];

// Duplicar los primeros VISIBLE para loop infinito sin salto visible
const ITEMS = [...INTENTIONS, ...INTENTIONS.slice(0, VISIBLE)];

interface Props {
  selected: string | null;
  onSelect: (id: string | null) => void;
}

export default function IntentionCarousel({ selected, onSelect }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepRef = useRef(0);

  const [step, setStep] = useState(0);
  const [animated, setAnimated] = useState(true);
  const [cardW, setCardW] = useState(0);

  // Medir ancho de cada card según el contenedor
  const measure = useCallback(() => {
    if (wrapRef.current) {
      const w = wrapRef.current.clientWidth;
      setCardW((w - GAP * (VISIBLE - 1)) / VISIBLE);
    }
  }, []);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, [measure]);

  const stepPx = cardW + GAP;

  // Avanzar al siguiente card
  const advance = useCallback(() => {
    setAnimated(true);
    setStep(s => {
      stepRef.current = s + 1;
      return s + 1;
    });
  }, []);

  // Reiniciar timer de auto-scroll
  const resetTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(advance, 4000);
  }, [advance]);

  useEffect(() => {
    resetTimer();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [resetTimer]);

  // Cuando la transición termina: si llegamos al clon, saltar sin animación al original
  const handleTransitionEnd = useCallback(() => {
    if (stepRef.current >= INTENTIONS.length) {
      setAnimated(false);
      const newStep = stepRef.current - INTENTIONS.length;
      stepRef.current = newStep;
      setStep(newStep);
    }
  }, []);

  // Re-habilitar animación tras el salto instantáneo
  useEffect(() => {
    if (!animated) {
      const id = requestAnimationFrame(() => requestAnimationFrame(() => setAnimated(true)));
      return () => cancelAnimationFrame(id);
    }
  }, [animated]);

  const goNext = () => {
    advance();
    resetTimer();
  };

  const goPrev = () => {
    resetTimer();
    if (stepRef.current === 0) {
      // Saltar al clon del final sin animación, luego retroceder con animación
      const jumpTo = INTENTIONS.length;
      setAnimated(false);
      stepRef.current = jumpTo;
      setStep(jumpTo);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        setAnimated(true);
        stepRef.current = jumpTo - 1;
        setStep(jumpTo - 1);
      }));
    } else {
      setAnimated(true);
      setStep(s => {
        stepRef.current = s - 1;
        return s - 1;
      });
    }
  };

  return (
    <section className="intention-section">
      <div className="intention-head">
        <span className="eyebrow">Explorá por intención</span>
      </div>

      <div className="intention-outer">
        <button className="int-arrow" onClick={goPrev} aria-label="Anterior">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width={16} height={16}>
            <path d="m15 6-6 6 6 6" />
          </svg>
        </button>

        <div className="intention-track-wrap" ref={wrapRef}>
          <div
            ref={trackRef}
            className="intention-track"
            style={{
              transform: cardW ? `translateX(-${step * stepPx}px)` : undefined,
              transition: animated ? 'transform 0.55s cubic-bezier(.3,.7,.3,1)' : 'none',
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {ITEMS.map((int, i) => {
              const isSelected = selected === int.id;
              return (
                <button
                  key={`${int.id}-${i}`}
                  className={`int-card${isSelected ? ' int-card--on' : ''}`}
                  style={{
                    width: cardW || undefined,
                    '--ic': int.color,
                    '--ib': int.bg,
                  } as React.CSSProperties}
                  onClick={() => onSelect(isSelected ? null : int.id)}
                  aria-pressed={isSelected}
                >
                  <div className="int-symbol">{int.symbol}</div>
                  <div className="int-info">
                    <strong>{int.id}</strong>
                    <span>{int.sub}</span>
                  </div>
                  {isSelected && <span className="int-check">✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        <button className="int-arrow" onClick={goNext} aria-label="Siguiente">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width={16} height={16}>
            <path d="m9 6 6 6-6 6" />
          </svg>
        </button>
      </div>
    </section>
  );
}
