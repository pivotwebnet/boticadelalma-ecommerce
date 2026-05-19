"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import {
  Heart,
  Shield,
  Sparkles,
  Flower2,
  Moon,
  Leaf,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const ITEMS = [
  {
    id: "amor",
    title: "Amor",
    subtitle: "Conectar emocionalmente",
    icon: Heart,
    tone: "bg-[#efe4df]",
  },
  {
    id: "proteccion",
    title: "Protección",
    subtitle: "Resguardar tu energía",
    icon: Shield,
    tone: "bg-[#e7ebf3]",
  },
  {
    id: "abundancia",
    title: "Abundancia",
    subtitle: "Expandir prosperidad",
    icon: Sparkles,
    tone: "bg-[#f3e8dc]",
  },
  {
    id: "calma",
    title: "Calma",
    subtitle: "Bajar el ruido mental",
    icon: Moon,
    tone: "bg-[#e7ede6]",
  },
  {
    id: "limpieza",
    title: "Limpieza",
    subtitle: "Purificar ambientes",
    icon: Flower2,
    tone: "bg-[#f3efe4]",
  },
  {
    id: "anclaje",
    title: "Anclaje",
    subtitle: "Volver al centro",
    icon: Leaf,
    tone: "bg-[#e5e8dc]",
  },
];

export default function IntentionCarousel() {
  const [visibleCards, setVisibleCards] = useState(4);

  const [currentIndex, setCurrentIndex] = useState(ITEMS.length);

  const [isHovered, setIsHovered] = useState(false);
const [isTransitionEnabled, setIsTransitionEnabled] =
  useState(true);


  const startX = useRef(0);

  // =========================
  // LOOP INFINITO
  // =========================

  const carouselItems = [...ITEMS, ...ITEMS, ...ITEMS];
  // =========================
  // RESPONSIVE
  // =========================

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCards(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2);
      } else {
        setVisibleCards(4);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // =========================
  // AUTOPLAY
  // =========================

  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 4000);

    return () => clearInterval(interval);
  }, [isHovered]);

  // =========================
  // RESET INVISIBLE
  // =========================

  useEffect(() => {
  if (currentIndex === ITEMS.length * 2) {

    const timeout = setTimeout(() => {

      setIsTransitionEnabled(false);

      setCurrentIndex(ITEMS.length);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitionEnabled(true);
        });
      });

    }, 900);

    return () => clearTimeout(timeout);
  }

  if (currentIndex === 0) {

    const timeout = setTimeout(() => {

      setIsTransitionEnabled(false);

      setCurrentIndex(ITEMS.length);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitionEnabled(true);
        });
      });

    }, 900);

    return () => clearTimeout(timeout);
  }

}, [currentIndex]);



  // =========================
  // NAVEGACIÓN
  // =========================

  const nextSlide = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? ITEMS.length - 1 : prev - 1));
  };

  // =========================
  // DRAG / SWIPE
  // =========================

  const handleStart = (clientX: number) => {
    startX.current = clientX;
  };

  const handleEnd = (clientX: number) => {
    const distance = startX.current - clientX;

    if (distance > 50) {
      nextSlide();
    }

    if (distance < -50) {
      prevSlide();
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#faf9f6] py-20">
      {/* Fade izquierdo */}

      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-[#faf9f6] to-transparent" />

      {/* Fade derecho */}

      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-[#faf9f6] to-transparent" />

      <div className="mx-auto max-w-7xl px-4">
        {/* HEADER */}

        <div className="mb-10 flex items-end justify-between">
          <div>
            <span className="mb-2 block text-[11px] uppercase tracking-[0.3em] text-stone-400">
              Intenciones
            </span>

            <h2 className="text-3xl font-serif text-stone-800 md:text-4xl">
              Elegí por intención
            </h2>
          </div>
        </div>

        {/* CONTENEDOR */}

        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* BOTÓN IZQUIERDO */}

          <button
            onClick={prevSlide}
            className="intent-arrow-btn absolute -left-5 md:-left-3 top-1/2 z-30 -translate-y-1/2"
          >
            <ChevronLeft size={20} strokeWidth={2} />
          </button>

          {/* BOTÓN DERECHO */}

          <button
            onClick={nextSlide}
            className="intent-arrow-btn absolute -right-5 md:-right-3 top-1/2 z-30 -translate-y-1/2"
          >
            <ChevronRight size={20} strokeWidth={2} />
          </button>

          {/* VIEWPORT */}

          <div
            className="
              overflow-hidden
              cursor-grab
              active:cursor-grabbing
              select-none
            "
            onMouseDown={(e) => handleStart(e.clientX)}
            onMouseUp={(e) => handleEnd(e.clientX)}
            onTouchStart={(e) => handleStart(e.touches[0].clientX)}
            onTouchEnd={(e) => handleEnd(e.changedTouches[0].clientX)}
          >
            {/* TRACK */}

            <div
              className="flex"
              style={{
  transform: `translateX(-${
    currentIndex *
    (100 / visibleCards)
  }%)`,

  transition: isTransitionEnabled
  ? 'transform 900ms cubic-bezier(0.22, 1, 0.36, 1)'
  : 'none',
}}
            >
              {carouselItems.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={`${item.id}-${index}`}
                    className="flex-shrink-0 px-2"
                    style={{
                      width: `${100 / visibleCards}%`,
                    }}
                  >
                    <Link
                      href={`/catalogo?intencion=${item.id}`}
                      className="group block"
                    >
                      <article
                        className={`
                            intent-card
                            relative
                            overflow-hidden
                            ${item.tone}
                          `}
                      >
                        {/* Glow */}

                        <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent opacity-70" />

                        {/* CONTENT */}

                        <div className="relative flex h-full flex-col justify-between p-6">
                          {/* TOP */}

                          <div>
                            <div className="intent-icon-box">
                              <Icon
                                size={22}
                                strokeWidth={1.7}
                                className="text-stone-700"
                              />
                            </div>

                            <h3 className="mt-5 text-2xl font-serif text-stone-800">
                              {item.title}
                            </h3>

                            <p className="mt-3 max-w-[220px] text-sm leading-relaxed text-stone-600">
                              {item.subtitle}
                            </p>
                          </div>

                          {/* BOTTOM */}

                          <div className="flex items-center justify-between">
                            <span className="text-[11px] uppercase tracking-[0.25em] text-stone-500">
                              Explorar
                            </span>

                            <div className="intent-mini-arrow group-hover:translate-x-1">
                              <ArrowRight
                                size={18}
                                className="text-stone-700"
                              />
                            </div>
                          </div>
                        </div>
                      </article>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* INDICADORES */}

        <div className="mt-8 flex justify-center gap-2">
          {ITEMS.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`rounded-full transition-all duration-500 ${
                currentIndex % ITEMS.length === index
                  ? "h-1.5 w-8 bg-stone-700"
                  : "h-1.5 w-1.5 bg-stone-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
