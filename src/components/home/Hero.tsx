'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import Icon from '@/components/ui/Icon';
import { useProducts } from '@/hooks/useApiData';

const MARQUEE = [
  'Joyería artesanal',
  'Piedras naturales',
  'Hecho con amor',
  'Envíos a todo el país',
  'Complementos energéticos',
  'Piezas únicas',
  'Plata de ley',
  'Cuarzo · Amatista · Labradorita',
];

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

function up(delay: number) {
  return {
    hidden: { opacity: 0, y: 36 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, delay, ease: EASE },
    },
  };
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const products = useProducts();
  const totalPiezas = products.length;

  const STATS = [
    { value: `+${totalPiezas}`, label: 'piezas' },
    { value: '100%', label: 'artesanal' },
    { value: '48h', label: 'envío' },
  ];

  const imgY        = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const contentOp   = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const contentY    = useTransform(scrollYProgress, [0, 0.55], ['0%', '-6%']);

  return (
    <>
      <section
        ref={ref}
        className="hero-v2"
      >
        {/* ── Background with parallax ── */}
        <motion.div className="absolute inset-0" style={{ y: imgY }}>
          <Image
            src="/banner.png"
            alt="La Botica del Alma"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center scale-110"
          />
        </motion.div>

        {/* ── Gradient layers ── */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/45 to-stone-950/5" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/65 via-stone-950/20 to-transparent" />

        {/* ── Glow orb ── */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            top: '20%', right: '15%',
            width: 480, height: 480,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(42,94,54,0.18) 0%, transparent 68%)',
          }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.85, 0.5] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* ── Main content ── */}
        <motion.div
          className="hero-v2-body"
          style={{ opacity: contentOp, y: contentY }}
        >
          {/* Eyebrow pill */}
          <motion.div variants={up(0.1)} initial="hidden" animate="show">
            <span className="hero-pill">
              <span className="hero-pill-dot" />
              Colección de otoño
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={up(0.28)}
            initial="hidden"
            animate="show"
            className="hero-v2-title"
          >
            Joyas con<br />
            <em className="text-[#E86315]">alma.</em>
          </motion.h1>

          {/* Subtitle + CTAs */}
          <motion.div
            variants={up(0.46)}
            initial="hidden"
            animate="show"
            className="hero-v2-bottom"
          >
            <p className="hero-v2-sub">
              Joyería artesanal, piedras naturales y complementos energéticos.
              Seleccionados uno por uno. Envíos a todo el país.
            </p>

            <div className="hero-v2-ctas">
              <Link href="/catalogo" className="hero-btn-primary">
                Explorar tienda
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ display: 'inline-flex' }}
                >
                  <Icon name="arrow-r" size={14} />
                </motion.span>
              </Link>
              <Link href="/categoria/collares" className="hero-btn-ghost">
                Ver collares
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={up(0.62)}
            initial="hidden"
            animate="show"
            className="hero-v2-stats"
          >
            {STATS.map((s, i) => (
              <div key={s.label} className="hero-stat">
                {i > 0 && <div className="hero-stat-divider" />}
                <span className="hero-stat-value">{s.value}</span>
                <span className="hero-stat-label">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Scroll indicator ── */}
        <motion.div
          className="hero-scroll-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <motion.div
            animate={{ y: [0, 9, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="hero-scroll-ring"
          >
            <Icon name="chev-d" size={14} className="text-white/40" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Marquee strip ── */}
      <div className="hero-marquee-wrap">
        <div className="hero-marquee-track">
          {[...MARQUEE, ...MARQUEE].map((item, i) => (
            <span key={i} className="hero-marquee-item">
              {item}
              <span className="hero-marquee-dot" />
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
