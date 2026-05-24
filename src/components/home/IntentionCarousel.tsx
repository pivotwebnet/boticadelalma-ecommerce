"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS = [
  {
    id: "amor",
    title: "Amor",
    subtitle: "Conectar emocionalmente",
    iconSrc: "/icons/amor.svg",
    bg: "#fdf3f0",
  },
  {
    id: "proteccion",
    title: "Protección",
    subtitle: "Resguardar tu energía",
    iconSrc: "/icons/proteccion.svg",
    bg: "#eff5fa",
  },
  {
    id: "abundancia",
    title: "Abundancia",
    subtitle: "Expandir prosperidad",
    iconSrc: "/icons/abundancia.svg",
    bg: "#fefae8",
  },
  {
    id: "calma",
    title: "Calma",
    subtitle: "Bajar el ruido mental",
    iconSrc: "/icons/calma.svg",
    bg: "#d6ede0",
  },
  {
    id: "limpieza",
    title: "Limpieza",
    subtitle: "Purificar ambientes",
    iconSrc: "/icons/limpieza.svg",
    bg: "#f0f8f3",
  },
  {
    id: "anclaje",
    title: "Anclaje",
    subtitle: "Volver al centro",
    iconSrc: "/icons/anclaje.svg",
    bg: "#fdf5ea",
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
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-10">
          <span className="mb-2 block text-[11px] uppercase tracking-[0.3em] text-stone-400">
            Intenciones
          </span>
          <h2 className="font-serif text-3xl text-stone-800 md:text-4xl">
            Elegí por intención
          </h2>
        </div>

        {/* Row: arrow | viewport | arrow */}
        <div
          className="flex items-center gap-2"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Left arrow */}
          <button
            onClick={prev}
            className="intent-arrow-btn flex-shrink-0"
            aria-label="Anterior"
          >
            <ChevronLeft size={22} strokeWidth={1.5} />
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
              className="flex py-3"
              style={{
                transform: `translateX(-${idx * cardW}%)`,
                transition: animated
                  ? "transform 650ms cubic-bezier(0.22, 1, 0.36, 1)"
                  : "none",
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {CLONED.map((item, i) => (
                <div
                  key={`${item.id}-${i}`}
                  className="flex-shrink-0 px-2"
                  style={{ width: `${cardW}%` }}
                >
                  <Link
                    href={`/catalogo?intencion=${item.id}`}
                    className="group block"
                  >
                    <article
                      className="intent-card"
                      style={{ backgroundColor: item.bg }}
                    >
                      <div className="intent-glow absolute inset-0 bg-gradient-to-b from-white/40 to-transparent" />
                      <div className="relative flex h-full flex-col justify-between p-6">
                        <div>
                          <div className="intent-icon-box">
                            <img
                              src={item.iconSrc}
                              alt={item.title}
                              width={26}
                              height={26}
                              style={{ objectFit: "contain" }}
                            />
                          </div>
                          <h3 className="mt-5 font-serif text-2xl text-stone-800">
                            {item.title}
                          </h3>
                          <p className="mt-3 max-w-[220px] text-sm leading-relaxed text-stone-600">
                            {item.subtitle}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] uppercase tracking-[0.25em] text-stone-500">
                            Explorar
                          </span>
                          <div className="intent-mini-arrow">
                            <ArrowRight size={18} className="text-stone-700" />
                          </div>
                        </div>
                      </div>
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
            <ChevronRight size={22} strokeWidth={1.5} />
          </button>
        </div>

        {/* Dots */}
        <div className="mt-8 flex justify-center gap-2">
          {ITEMS.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(N + i)}
              aria-label={`Ir a ${ITEMS[i].title}`}
              className={`rounded-full transition-all duration-500 ${
                idx % N === i
                  ? "h-1.5 w-8 bg-stone-600"
                  : "h-1.5 w-1.5 bg-stone-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
