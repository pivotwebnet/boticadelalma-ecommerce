'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '@/components/ui/Icon';

const DEFAULT_QUOTE = 'Lo que eliges, también te elige.';

export default function EditorialQuote() {
  // La frase es editable desde el panel (Apariencia → Textos de la home).
  const [quote, setQuote] = useState(DEFAULT_QUOTE);
  useEffect(() => {
    fetch('/api/site-settings')
      .then(r => r.json())
      .then((s: { editorialQuote?: string | null }) => {
        if (s?.editorialQuote) setQuote(s.editorialQuote);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="section py-12 px-4">
      <div className="max-w-4xl mx-auto relative group">
        
        {/* Soft Note Background */}
        <div className="absolute inset-0 bg-stone-200/40 rounded-[3rem] -rotate-1 scale-[1.02] transition-transform duration-700 group-hover:rotate-0" />
        <div className="absolute inset-0 bg-[#f4f1e0]/60 backdrop-blur-sm rounded-[3rem] shadow-sm border border-stone-200/50" />

        {/* Animated Leaf Watermark */}
        <div className="absolute inset-0 overflow-hidden rounded-[3rem] pointer-events-none">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1/4 -right-1/4 text-accent/5 opacity-40"
          >
            <Icon name="leaf" size={500} stroke={0.2} />
          </motion.div>
        </div>

        <div className="relative z-10 py-10 px-6 md:py-12 md:px-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <blockquote className="font-serif text-2xl md:text-4xl italic text-stone-800 leading-[1.5] tracking-tight mb-10 max-w-2xl mx-auto">
              &ldquo;{quote}&rdquo;
            </blockquote>

            <div className="flex flex-col items-center gap-6">
              {/* Minimalist divider with leaf */}
              <div className="flex items-center gap-4 text-accent/30">
                <div className="w-12 h-px bg-current" />
                <motion.div
                  animate={{ rotate: [0, 15, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Icon name="leaf" size={24} stroke={1.5} />
                </motion.div>
                <div className="w-12 h-px bg-current" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
