'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Icon from '@/components/ui/Icon';

// Textos e imagen por defecto (se usan si no se configuró nada en el panel).
const DEFAULTS = {
  overline: 'Edición Limitada',
  title: 'Luna Nueva',
  text: 'Una curaduría de joyas y piedras para acompañar los ciclos: collares de cuarzo lunar, amuletos de protección y complementos energéticos para los nuevos comienzos.',
  ctaText: 'Ver Colección Completa',
  imageUrl: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=1200&q=85',
};

export default function CollectionBanner() {
  // Contenido editable desde el panel (Apariencia → Textos de la home).
  const [content, setContent] = useState(DEFAULTS);
  useEffect(() => {
    fetch('/api/site-settings')
      .then(r => r.json())
      .then((s: {
        limitedOverline?: string | null; limitedTitle?: string | null;
        limitedText?: string | null; limitedCtaText?: string | null; limitedImageUrl?: string | null;
      }) => {
        setContent({
          overline: s?.limitedOverline || DEFAULTS.overline,
          title: s?.limitedTitle || DEFAULTS.title,
          text: s?.limitedText || DEFAULTS.text,
          ctaText: s?.limitedCtaText || DEFAULTS.ctaText,
          imageUrl: s?.limitedImageUrl || DEFAULTS.imageUrl,
        });
      })
      .catch(() => {});
  }, []);

  return (
    <section className="relative py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-16 lg:gap-24">
          
          {/* Media Side - Overlapping Images Effect */}
          <div className="lg:col-span-7 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 rounded-[2rem] overflow-hidden shadow-2xl aspect-[16/10]"
            >
              <Image
                key={content.imageUrl}
                src={content.imageUrl}
                alt={`${content.title} — colección editorial`}
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                unoptimized={content.imageUrl.startsWith('/api/media/')}
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-stone-900/20" />
            </motion.div>
            
            {/* Decorative Floating Element */}
            <motion.div
              initial={{ opacity: 0, x: 40, y: 40 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -bottom-8 -right-8 w-32 h-32 bg-white rounded-full p-3 shadow-xl z-20 flex items-center justify-center hidden md:flex"
            >
              <div className="w-full h-full rounded-full overflow-hidden border border-stone-100 flex items-center justify-center bg-stone-50">
                <Icon name="moon" size={32} className="text-brand-orange/40" />
              </div>
            </motion.div>
          </div>

          {/* Text Side */}
          <div className="lg:col-span-5 relative z-30">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <span className="text-[11px] uppercase tracking-[0.4em] text-stone-400 font-bold mb-6 block">
                {content.overline}
              </span>
              <h2 className="font-serif text-5xl md:text-6xl italic text-stone-800 tracking-tight mb-8">
                {content.title}
              </h2>
              <div className="h-px w-20 bg-brand-orange mb-8" />
              <p className="text-lg text-stone-600 leading-relaxed font-light mb-12">
                {content.text}
              </p>
              <Link href="/catalogo" className="group inline-flex items-center gap-6">
                <div className="w-16 h-16 rounded-full border border-stone-200 flex items-center justify-center group-hover:bg-brand-orange group-hover:border-brand-orange transition-all duration-500">
                  <Icon name="arrow-r" size={20} className="group-hover:text-white transition-colors duration-500" />
                </div>
                <span className="text-xs uppercase tracking-[0.3em] font-bold text-stone-800">
                  {content.ctaText}
                </span>
              </Link>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Background Decorative Text */}
      <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 select-none pointer-events-none opacity-[0.04] whitespace-nowrap z-0">
        <span className="font-serif text-[14vw] italic text-stone-900">{content.title}</span>
      </div>
    </section>
  );
}
