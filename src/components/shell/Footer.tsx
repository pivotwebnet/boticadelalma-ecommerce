'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@/components/ui/Icon';

const IG_URL = 'https://www.instagram.com/laboticadelalma1/';

// Mock post colors that match the brand palette
const IG_POSTS = [
  'from-stone-300 to-stone-400',
  'from-emerald-200 to-emerald-400',
  'from-amber-200 to-amber-400',
  'from-rose-200 to-rose-300',
  'from-stone-200 to-stone-300',
  'from-emerald-300 to-teal-400',
  'from-amber-100 to-amber-300',
  'from-rose-100 to-rose-200',
  'from-stone-300 to-stone-500',
];

function InstagramPreviewCard({
  pos, onClose, onMouseEnter, onMouseLeave,
}: {
  pos: { top: number; left: number };
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const cardW = 256;
  const margin = 12;
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1024;
  const left = Math.min(pos.left, vw - cardW - margin);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.97 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="fixed rounded-2xl overflow-hidden shadow-2xl bg-white z-[200]"
      style={{ top: pos.top, left, width: cardW }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      data-ig-card="true"
    >
      {/* IG gradient header */}
      <div className="h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 relative">
        <button
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/20 flex items-center justify-center text-white text-xs leading-none"
          onClick={onClose}
          aria-label="Cerrar"
        >✕</button>
        <div className="absolute -bottom-5 left-4 w-12 h-12 rounded-full border-2 border-white bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg">
          <Icon name="instagram" size={22} className="text-white" />
        </div>
      </div>

      {/* Profile info */}
      <div className="pt-8 px-4 pb-3">
        <p className="font-bold text-[13px] text-stone-900 leading-tight">La Botica del Alma</p>
        <p className="text-[11px] text-stone-500">@laboticadelalma1</p>
        <p className="text-[11px] text-stone-600 mt-1.5 leading-snug">
          Joyería artesanal · Piedras naturales · Rafaela, Santa Fe ✨
        </p>
      </div>

      {/* Mock posts grid */}
      <div className="grid grid-cols-3 gap-0.5 px-0.5">
        {IG_POSTS.map((grad, i) => (
          <div key={i} className={`aspect-square bg-gradient-to-br ${grad}`} />
        ))}
      </div>

      {/* CTA */}
      <a
        href={IG_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-center text-[11px] font-bold uppercase tracking-widest py-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 hover:opacity-80 transition-opacity"
      >
        Ver perfil completo →
      </a>
    </motion.div>
  );
}

function InstagramLink() {
  const [open, setOpen] = useState(false);
  const [cardPos, setCardPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLLIElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const calcPos = () => {
    if (!triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    const cardH = 340;
    const top = r.top - cardH - 8 > 0 ? r.top - cardH - 8 : r.bottom + 8;
    setCardPos({ top, left: r.left });
  };

  // Close on outside tap (mobile)
  useEffect(() => {
    if (!open) return;
    const onTap = (e: TouchEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        // Check if tap is on the fixed card by class
        const el = e.target as HTMLElement;
        if (!el.closest('[data-ig-card]')) setOpen(false);
      }
    };
    document.addEventListener('touchstart', onTap);
    return () => document.removeEventListener('touchstart', onTap);
  }, [open]);

  return (
    <li ref={triggerRef} className="pt-1">
      <a
        href={IG_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-brand-orange font-bold hover:brightness-110 flex items-center gap-2"
        onPointerEnter={(e) => {
          if (e.pointerType !== 'mouse') return;
          cancelClose();
          calcPos();
          setOpen(true);
        }}
        onPointerLeave={(e) => {
          if (e.pointerType !== 'mouse') return;
          scheduleClose();
        }}
        onClick={(e) => {
          const native = e.nativeEvent as PointerEvent;
          if (native.pointerType === 'mouse') return;
          e.preventDefault();
          calcPos();
          setOpen(prev => !prev);
        }}
      >
        <Icon name="instagram" size={14} /> Seguinos en Instagram
      </a>
      <AnimatePresence>
        {open && (
          <InstagramPreviewCard
            pos={cardPos}
            onClose={() => setOpen(false)}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          />
        )}
      </AnimatePresence>
    </li>
  );
}

export default function Footer() {
  const pivotLetters = "PIVOT".split("");
  const whatsappNumber = "3492274535";
  const whatsappMessage = encodeURIComponent("¡Hola! Tengo una consulta sobre...");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <footer className="mt-32 pt-16 pb-8 bg-[#2A5E36] text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16 mb-12">

          {/* Col 1: Experiencia del Cliente */}
          <div className="flex flex-col items-start">
            <h4 className="text-[12px] uppercase tracking-[0.4em] font-bold text-stone-300/40 mb-8">Experiencia del Cliente</h4>
            <ul className="flex flex-col gap-4 text-[13px] font-medium text-stone-100/90">
              <li><Link href="/contacto" className="hover:text-brand-orange transition-colors">Hacenos tu consulta</Link></li>
              <li className="pt-1">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-orange font-bold hover:brightness-110 flex items-center gap-2"
                >
                  <Icon name="whatsapp" size={14} /> Comprá por WhatsApp
                </a>
              </li>
              <InstagramLink />
            </ul>
          </div>

          {/* Col 2: Ayuda */}
          <div className="flex flex-col items-start">
            <h4 className="text-[12px] uppercase tracking-[0.4em] font-bold text-stone-300/40 mb-8">Ayuda</h4>
            <ul className="flex flex-col gap-4 text-[13px] font-medium text-stone-100/90">
              <li><Link href="/como-comprar" className="hover:text-brand-orange transition-colors">Cómo comprar</Link></li>
              <li><Link href="/envios-y-devoluciones" className="hover:text-brand-orange transition-colors">Envíos y devoluciones</Link></li>
              <li><Link href="/preguntas-frecuentes" className="hover:text-brand-orange transition-colors">Dudas Frecuentes</Link></li>
              <li><Link href="/cuidados" className="hover:text-brand-orange transition-colors">Guía de cuidados</Link></li>
            </ul>
          </div>

          {/* Col 3: La Botica */}
          <div className="flex flex-col items-start">
            <h4 className="text-[12px] uppercase tracking-[0.4em] font-bold text-stone-300/40 mb-8">La Botica</h4>
            <ul className="flex flex-col gap-4 text-[13px] font-medium text-stone-100/90">
              <li><Link href="/catalogo" className="hover:text-brand-orange transition-colors">Tienda online</Link></li>
              <li><Link href="/nuestra-historia" className="hover:text-brand-orange transition-colors">Sobre la Botica</Link></li>
            </ul>
          </div>

          {/* Col 4: Información */}
          <div className="flex flex-col items-start">
            <h4 className="text-[12px] uppercase tracking-[0.4em] font-bold text-stone-300/40 mb-8">Información</h4>
            <ul className="flex flex-col gap-4 text-[13px] font-medium text-stone-100/90">
              <li><Link href="/envios-y-devoluciones" className="hover:text-brand-orange transition-colors">Términos y condiciones</Link></li>
              <li><Link href="/envios-y-devoluciones" className="hover:text-brand-orange transition-colors">Política de privacidad</Link></li>
              <li className="pt-4 flex items-center gap-2 text-stone-300 text-[11px] font-bold uppercase tracking-widest">
                <Icon name="shield" size={14} /> Compra 100% Segura
              </li>
            </ul>
          </div>

        </div>


        {/* Footer Base */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 text-[11px]">
          <div className="uppercase tracking-[0.2em] text-stone-400 font-medium flex items-center gap-4">
            <span>© 2026 · La Botica del Alma</span>
            <span className="hidden md:inline text-stone-600/40">|</span>
            <a 
              href="https://www.google.com/maps/search/Rafaela,+Santa+Fe,+Argentina" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition-all group"
            >
              <Icon name="map-pin" size={10} /> 
              Rafaela, Santa Fe
            </a>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="uppercase tracking-widest text-stone-300/60">Diseño y Desarrollo por</span>
            <motion.a 
              href="https://www.pivotweb.com.ar/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group relative flex items-center ml-1"
              initial="rest"
              whileHover="hover"
            >
              <span className="font-serif italic text-2xl text-white group-hover:text-brand-orange transition-colors duration-300 flex items-center">
                {pivotLetters.map((letter, i) => (
                  <motion.span
                    key={i}
                    variants={{
                      rest: { 
                        opacity: 1, 
                        y: 0,
                        filter: "drop-shadow(0 0 0px rgba(232, 99, 21, 0))"
                      },
                      hover: { 
                        opacity: [0, 1],
                        y: -2,
                        filter: [
                          "drop-shadow(0 0 0px rgba(232, 99, 21, 0))",
                          "drop-shadow(0 4px 12px rgba(232, 99, 21, 0.4))"
                        ],
                        transition: { delay: i * 0.08, duration: 0.2 }
                      }
                    }}
                    className="inline-block"
                  >
                    {letter}
                  </motion.span>
                ))}
                
                {/* Blinking Code Cursor with Glow */}
                <motion.span
                  variants={{
                    rest: { opacity: 0 },
                    hover: { 
                      opacity: [1, 0, 1],
                      filter: "drop-shadow(0 0 8px rgba(232, 99, 21, 0.8))",
                      transition: { repeat: Infinity, duration: 0.8 }
                    }
                  }}
                  className="inline-block w-[10px] h-[3px] bg-brand-orange ml-1 mb-0.5"
                />
              </span>
            </motion.a>
          </div>
        </div>
      </div>
    </footer>
  );
}
