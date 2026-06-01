'use client';

import { motion } from 'framer-motion';
import Icon from '@/components/ui/Icon';

export default function EditorialQuote() {
  return (
    <section className="section py-24 px-4">
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

        <div className="relative z-10 py-16 px-8 md:py-20 md:px-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <blockquote className="font-serif text-2xl md:text-4xl italic text-stone-800 leading-[1.5] tracking-tight mb-12 max-w-2xl mx-auto">
              &ldquo;Cada objeto que llega a tus manos fue elegido con cuidado. Son piezas pequeñas, con alma e historia.&rdquo;
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

              <cite className="not-italic flex flex-col items-center">
                <span className="text-[10px] uppercase tracking-[0.5em] text-stone-400 font-bold mb-2">Curaduría</span>
                <span className="font-serif text-2xl text-stone-600 italic">Valentina G.</span>
              </cite>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
