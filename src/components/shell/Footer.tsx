'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Icon from '@/components/ui/Icon';

export default function Footer() {
  const pivotLetters = "PIVOT".split("");
  const whatsappNumber = "3492274535";
  const whatsappMessage = encodeURIComponent("¡Hola! Tengo una consulta sobre...");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <footer className="mt-32 pt-16 pb-8 bg-[#2A5E36] text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Col 1: Experiencia del Cliente */}
          <div>
            <h4 className="text-[14px] uppercase tracking-[0.4em] font-bold text-stone-300/40 mb-10">Experiencia del Cliente</h4>
            <ul className="flex flex-col gap-4 text-[15px] font-medium text-stone-100">
              <li><Link href="/contacto" className="hover:text-brand-orange transition-colors">Hacenos tu consulta</Link></li>
              <li className="pt-2">
                <a 
                  href={whatsappUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-brand-orange font-bold hover:brightness-110 flex items-center gap-2"
                >
                  <Icon name="whatsapp" size={16} /> Comprá por WhatsApp
                </a>
              </li>
            </ul>
          </div>

          {/* Col 2: Ayuda */}
          <div>
            <h4 className="text-[14px] uppercase tracking-[0.4em] font-bold text-stone-300/40 mb-10">Ayuda</h4>
            <ul className="flex flex-col gap-4 text-[15px] font-medium text-stone-100">
              <li><Link href="/como-comprar" className="hover:text-brand-orange transition-colors">Cómo comprar</Link></li>
              <li><Link href="/envios-y-devoluciones" className="hover:text-brand-orange transition-colors">Envíos y devoluciones</Link></li>
              <li><Link href="/preguntas-frecuentes" className="hover:text-brand-orange transition-colors">Preguntas frecuentes</Link></li>
              <li><Link href="/cuidados" className="hover:text-brand-orange transition-colors">Guía de cuidados</Link></li>
            </ul>
          </div>

          {/* Col 3: La Botica */}
          <div>
            <h4 className="text-[14px] uppercase tracking-[0.4em] font-bold text-stone-300/40 mb-10">La Botica</h4>
            <ul className="flex flex-col gap-4 text-[15px] font-medium text-stone-100">
              <li><Link href="/catalogo" className="hover:text-brand-orange transition-colors">Tienda online</Link></li>
              <li><Link href="/nuestra-historia" className="hover:text-brand-orange transition-colors">Sobre la Botica</Link></li>
            </ul>
          </div>

          {/* Col 4: Información */}
          <div>
            <h4 className="text-[14px] uppercase tracking-[0.4em] font-bold text-stone-300/40 mb-10">Información</h4>
            <ul className="flex flex-col gap-4 text-[15px] font-medium text-stone-100">
              <li><Link href="/envios-y-devoluciones" className="hover:text-brand-orange transition-colors">Términos y condiciones</Link></li>
              <li><Link href="/envios-y-devoluciones" className="hover:text-brand-orange transition-colors">Política de privacidad</Link></li>
              <li className="pt-4 flex items-center gap-2 text-stone-300 text-[12px] font-bold uppercase tracking-widest">
                <Icon name="shield" size={14} /> Compra 100% Segura
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Base */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-[11px] uppercase tracking-[0.2em] text-stone-400 flex items-center gap-4">
            <span>© 2026 · La Botica del Alma</span>
            <span className="hidden md:inline text-stone-600">|</span>
            <a 
              href="https://www.google.com/maps/search/Rafaela,+Santa+Fe,+Argentina" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-brand-orange transition-all group border-b border-transparent hover:border-brand-orange/40 pb-0.5"
              title="Ver en Google Maps"
            >
              <Icon name="map-pin" size={12} className="group-hover:scale-110 transition-transform" /> 
              <span className="flex items-center gap-2">
                Rafaela, Santa Fe
                <span className="text-[9px] opacity-0 group-hover:opacity-100 transition-opacity uppercase font-bold tracking-tighter bg-white/10 px-1.5 py-0.5 rounded ml-1">Ver mapa</span>
              </span>
            </a>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-[11px] uppercase tracking-widest text-stone-300/60">Diseño y Desarrollo por</span>
            <motion.a 
              href="https://www.pivotweb.com.ar/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group relative flex items-center ml-2"
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
                  className="inline-block w-[12px] h-[4px] bg-brand-orange ml-1 mb-1"
                />
              </span>
            </motion.a>
          </div>
        </div>
      </div>
    </footer>
  );
}
