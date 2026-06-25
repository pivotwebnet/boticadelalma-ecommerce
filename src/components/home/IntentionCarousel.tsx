"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import VineDecoration from "@/components/ui/VineDecoration";

const ITEMS = [
  {
    id: "crecimiento-personal",
    title: "Crecimiento personal",
    subtitle: "Evolucionar y florecer",
    iconSrc: "/icons/crecimiento-personal.svg",
    bg: "#F6FAF2",
    hoverBg: "#C2E0AC",
    hoverText: "#2D5A2D",
  },
  {
    id: "amor",
    title: "Amor",
    subtitle: "Conectar emocionalmente",
    iconSrc: "/icons/amor.svg",
    bg: "#FCF8F8",
    hoverBg: "#F6C9CF",
    hoverText: "#8A5A55",
  },
  {
    id: "abundancia",
    title: "Abundancia",
    subtitle: "Expandir lo que tenés",
    iconSrc: "/icons/abundancia.svg",
    bg: "#F8FBF3",
    hoverBg: "#DCEBA8",
    hoverText: "#5A6A35",
  },
  {
    id: "prosperidad",
    title: "Prosperidad",
    subtitle: "Atraer riqueza y fortuna",
    iconSrc: "/icons/prosperidad.svg",
    bg: "#FCFAF3",
    hoverBg: "#F2E2A8",
    hoverText: "#7A6335",
  },
  {
    id: "escudos-y-proteccion",
    title: "Escudos y protección",
    subtitle: "Resguardar tu energía",
    iconSrc: "/icons/escudos-y-proteccion.svg",
    bg: "#F4F8FC",
    hoverBg: "#BFDCF0",
    hoverText: "#3A4D5C",
  },
  {
    id: "calma-y-paz-interior",
    title: "Calma y paz interior",
    subtitle: "Bajar el ruido mental",
    iconSrc: "/icons/calma-y-paz-interior.svg",
    bg: "#F4FBF8",
    hoverBg: "#B6E2D2",
    hoverText: "#3E5C52",
  },
  {
    id: "concrecion",
    title: "Concreción",
    subtitle: "Materializar tus metas",
    iconSrc: "/icons/concrecion.svg",
    bg: "#FCF9F3",
    hoverBg: "#F2CFA6",
    hoverText: "#5C4D3A",
  },
  {
    id: "comunicacion",
    title: "Comunicación",
    subtitle: "Expresar con claridad",
    iconSrc: "/icons/comunicacion.svg",
    bg: "#F4F9FC",
    hoverBg: "#B5DDE7",
    hoverText: "#3A4D5A",
  },
  {
    id: "sanacion-y-procesos",
    title: "Sanación y procesos",
    subtitle: "Restaurar el equilibrio",
    iconSrc: "/icons/sanacion-y-procesos.svg",
    bg: "#FBF7FB",
    hoverBg: "#E2BFDC",
    hoverText: "#5A3A55",
  },
];

const N = ITEMS.length;
// Three copies: [copy0][copy1][copy2]
// Start at copy1 (index N) so we can go left/right freely
const CLONED = [...ITEMS, ...ITEMS, ...ITEMS];

export default function IntentionCarousel() {
  const [visibleCards, setVisibleCards] = useState(4);
  const [idx, setIdx] = useState(N);
  const [animated, setAnimated] = useState(true);
  const [hovered, setHovered] = useState(false);
  const startX = useRef(0);

  // Responsive visible count
  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setVisibleCards(1);
      else if (window.innerWidth < 1024) setVisibleCards(2);
      else setVisibleCards(4);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Autoplay
  useEffect(() => {
    if (hovered) return;
    const id = setInterval(() => setIdx((p) => p + 1), 4000);
    return () => clearInterval(id);
  }, [hovered]);

  // After instant jump (animated=false), re-enable animation on the next paint
  useEffect(() => {
    if (!animated) {
      const raf = requestAnimationFrame(() =>
        requestAnimationFrame(() => setAnimated(true))
      );
      return () => cancelAnimationFrame(raf);
    }
  }, [animated]);

  // When the CSS transition finishes, snap to copy1 if we overshot
  const handleTransitionEnd = () => {
    if (idx >= N * 2) {
      setAnimated(false);
      setIdx(idx - N);
    } else if (idx < N) {
      setAnimated(false);
      setIdx(idx + N);
    }
  };

  const next = () => setIdx((p) => p + 1);
  const prev = () => setIdx((p) => p - 1);

  const swipeStart = (x: number) => { startX.current = x; };
  const swipeEnd = (x: number) => {
    const d = startX.current - x;
    if (d > 50) next();
    else if (d < -50) prev();
  };

  const cardW = 100 / visibleCards;

  return (
    <section className="py-8 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mb-6 text-center">
          <span className="mb-2 block text-[11px] uppercase tracking-[0.4em] text-stone-400 font-medium">
            Propósito & Intención
          </span>
          <VineDecoration />
          <h2 className="font-serif text-4xl text-stone-800 md:text-5xl italic tracking-tight">
            Elegí tu camino
          </h2>
        </div>

        {/* Row: arrow | viewport | arrow */}
        <div
          className="flex items-center gap-4"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Left arrow */}
          <button
            onClick={prev}
            className="intent-arrow-btn flex-shrink-0"
            aria-label="Anterior"
          >
            <ChevronLeft size={26} strokeWidth={1.5} />
          </button>

          {/* Viewport — overflow hidden + edge fade via mask */}
          <div
            className="flex-1 overflow-hidden cursor-grab active:cursor-grabbing select-none"
            style={{
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
              maskImage:
                "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            }}
            onMouseDown={(e) => swipeStart(e.clientX)}
            onMouseUp={(e) => swipeEnd(e.clientX)}
            onTouchStart={(e) => swipeStart(e.touches[0].clientX)}
            onTouchEnd={(e) => swipeEnd(e.changedTouches[0].clientX)}
          >
            {/* Track */}
            <div
              className="flex py-6"
              style={{
                transform: `translateX(-${idx * cardW}%)`,
                transition: animated
                  ? "transform 800ms cubic-bezier(0.2, 1, 0.2, 1)"
                  : "none",
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {CLONED.map((item, i) => (
                <div
                  key={`${item.id}-${i}`}
                  className="flex-shrink-0 px-3"
                  style={{
                    width: `${cardW}%`,
                    // Injecting variables for CSS base + hover colors
                    '--card-bg': item.bg,
                    '--hover-bg': item.hoverBg,
                    '--hover-text': item.hoverText,
                  } as React.CSSProperties}
                >
                  <Link
                    href={`/catalogo?intencion=${item.id}`}
                    className="group block"
                  >
                    <article
                      className={`intent-card-elite ${item.id}`}
                    >
                      <div className="relative flex h-full flex-col justify-between p-7 text-center items-center z-10">
                        <div>
                          <div className="intent-icon-box mb-6">
                            <Image
                              src={item.iconSrc}
                              alt={item.title}
                              width={36}
                              height={34}
                              style={{ objectFit: "contain" }}
                              className="intent-icon"
                            />
                          </div>
                          <h3 className="intent-title font-serif text-2xl italic tracking-tight">
                            {item.title}
                          </h3>
                          <p className="intent-subtitle mt-3 max-w-[190px] text-[10px] leading-relaxed font-light tracking-[0.1em] uppercase opacity-40">
                            {item.subtitle}
                          </p>
                        </div>
                        <div className="mt-7 flex flex-col items-center gap-3">
                          <div className="intent-divider h-px w-8 bg-stone-300" />
                          <span className="intent-discover text-[9px] uppercase tracking-[0.35em] font-medium">
                            Descubrir
                          </span>
                        </div>
                      </div>
                      
                      {/* Interactive Layers */}
                      <div className="intent-bg-overlay absolute inset-0 bg-[var(--hover-bg)] opacity-0 transition-opacity duration-700" />
                      <div className="intent-gold-border absolute inset-0 border border-[#D4AF37]/0 transition-all duration-700 pointer-events-none" />
                    </article>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Right arrow */}
          <button
            onClick={next}
            className="intent-arrow-btn flex-shrink-0"
            aria-label="Siguiente"
          >
            <ChevronRight size={26} strokeWidth={1.5} />
          </button>
        </div>

        {/* Dots */}
        <div className="mt-4 flex justify-center gap-3">
          {ITEMS.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(N + i)}
              aria-label={`Ir a ${ITEMS[i].title}`}
              className={`h-px transition-all duration-700 ${
                idx % N === i
                  ? "w-12 bg-stone-800"
                  : "w-4 bg-stone-200 hover:bg-stone-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
