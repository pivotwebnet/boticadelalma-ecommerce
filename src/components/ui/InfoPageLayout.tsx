'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface InfoPageLayoutProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  children: ReactNode;
}

export default function InfoPageLayout({ title, subtitle, eyebrow, children }: InfoPageLayoutProps) {
  return (
    <main className="min-h-screen pt-32 pb-24">
      {/* Header Section */}
      <header className="max-w-7xl mx-auto px-6 mb-20 text-center">
        {eyebrow && (
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.5, y: 0 }}
            className="block text-[11px] uppercase tracking-[0.4em] text-stone-500 font-bold mb-6"
          >
            {eyebrow}
          </motion.span>
        )}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="font-serif text-5xl md:text-7xl italic tracking-tighter text-stone-800 leading-[0.9] mb-8"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto text-stone-600 leading-relaxed font-light text-lg italic font-serif"
          >
            {subtitle}
          </motion.p>
        )}
      </header>

      {/* Content Section */}
      <section className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
        >
          {children}
        </motion.div>
      </section>
    </main>
  );
}
