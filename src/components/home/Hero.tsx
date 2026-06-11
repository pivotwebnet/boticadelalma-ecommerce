'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import Icon from '@/components/ui/Icon';
import { useProducts } from '@/hooks/useApiData';

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

function AnimatedTitle() {
  const lines = ['Joyas con', 'alma.'];
  let idx = 0;
  return (
    <h1 className="hero-v2-title">
      {lines.map((line, li) => (
        <span key={li} className={`block${li === 0 ? ' text-[#E86315]' : ''}`}>
          {Array.from(line).map((ch) => {
            const i = idx++;
            return (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ y: -55, opacity: 0, filter: 'blur(6px)' }}
                animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.04, ease: EASE }}
              >
                {ch === ' ' ? ' ' : ch}
              </motion.span>
            );
          })}
        </span>
      ))}
    </h1>
  );
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
            src="/banner2.jpeg"
            alt="La Botica del Alma"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center scale-110"
          />
        </motion.div>

        {/* ── Degradé crema abajo (legibilidad del texto oscuro) ── */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#F5F2D9]/38 via-[#F5F2D9]/10 to-transparent" />

        {/* ── Difuminado crema (color del navbar) cayendo sobre la foto ── */}
        <div
          className="absolute inset-x-0 top-0 h-36 pointer-events-none z-[5]"
          style={{
            background:
              'linear-gradient(to bottom, rgba(245,242,217,0.5) 0%, rgba(245,242,217,0.45) 35%, rgba(245,242,217,0.28) 65%, transparent 100%)',
          }}
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

          {/* Headline — revelado letra por letra cayendo desde arriba */}
          <AnimatedTitle />

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
    </>
  );
}
