'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './Icon';

export default function FloatingActions() {
  const [showTop, setShowTop] = useState(false);
  
  const whatsappNumber = "5493492274535";
  const whatsappMessage = encodeURIComponent("¡Hola! Tengo una consulta sobre...");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-center gap-4">
      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={scrollToTop}
            className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md text-stone-800 shadow-lg border border-white/20 flex items-center justify-center hover:bg-white transition-all active:scale-90"
            aria-label="Volver arriba"
            data-tooltip="Volver arriba"
            data-tooltip-dir="left"
          >
            <Icon name="chev-u" size={20} stroke={2.5} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* WhatsApp Button */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-14 h-14 rounded-full bg-[#25D366] text-white shadow-[0_10px_40px_rgba(37,211,102,0.4)] flex items-center justify-center relative group"
        aria-label="Chatear por WhatsApp"
        data-tooltip="Chatear por WhatsApp"
        data-tooltip-dir="left"
      >
        <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 group-hover:hidden" />
        <Icon name="whatsapp" size={32} stroke={0} />
      </motion.a>
    </div>
  );
}
