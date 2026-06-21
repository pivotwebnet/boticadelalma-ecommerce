'use client';

import Link from 'next/link';
import Icon from '@/components/ui/Icon';

const IG_URL = 'https://www.instagram.com/laboticadelalma1/';

function InstagramLink() {
  return (
    <li className="pt-1">
      <a
        href={IG_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-brand-orange font-bold hover:brightness-110 flex items-center gap-2"
      >
        <Icon name="instagram" size={14} /> Seguinos en Instagram
      </a>
    </li>
  );
}

export default function Footer() {
  const whatsappNumber = "3492274535";
  const whatsappMessage = encodeURIComponent("¡Hola! Tengo una consulta sobre...");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <footer className="mt-24 pt-12 pb-8 bg-[#2A5E36] text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:justify-between gap-x-12 gap-y-10 mb-6">

          {/* Col 1: Experiencia del Cliente */}
          <div className="flex flex-col items-start">
            <h4 className="text-[12px] uppercase tracking-[0.4em] font-bold text-stone-300/40 mb-6">Experiencia del Cliente</h4>
            <ul className="flex flex-col gap-3 text-[13px] font-medium text-stone-100/90">
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
            <h4 className="text-[12px] uppercase tracking-[0.4em] font-bold text-stone-300/40 mb-6">Ayuda</h4>
            <ul className="flex flex-col gap-3 text-[13px] font-medium text-stone-100/90">
              <li><Link href="/como-comprar" className="hover:text-brand-orange transition-colors">Cómo comprar</Link></li>
              <li><Link href="/envios-y-devoluciones" className="hover:text-brand-orange transition-colors">Envíos y devoluciones</Link></li>
              <li><Link href="/preguntas-frecuentes" className="hover:text-brand-orange transition-colors">Dudas Frecuentes</Link></li>
              <li><Link href="/cuidados" className="hover:text-brand-orange transition-colors">Guía de cuidados</Link></li>
            </ul>
          </div>

          {/* Col 3: La Botica */}
          <div className="flex flex-col items-start">
            <h4 className="text-[12px] uppercase tracking-[0.4em] font-bold text-stone-300/40 mb-6">La Botica</h4>
            <ul className="flex flex-col gap-3 text-[13px] font-medium text-stone-100/90">
              <li><Link href="/catalogo" className="hover:text-brand-orange transition-colors">Tienda online</Link></li>
              <li><Link href="/nuestra-historia" className="hover:text-brand-orange transition-colors">Sobre la Botica</Link></li>
            </ul>
          </div>

          {/* Col 4: Información */}
          <div className="flex flex-col items-start">
            <h4 className="text-[12px] uppercase tracking-[0.4em] font-bold text-stone-300/40 mb-6">Información</h4>
            <ul className="flex flex-col gap-3 text-[13px] font-medium text-stone-100/90">
              <li><Link href="/envios-y-devoluciones" className="hover:text-brand-orange transition-colors">Términos y condiciones</Link></li>
              <li><Link href="/envios-y-devoluciones" className="hover:text-brand-orange transition-colors">Política de privacidad</Link></li>
              <li className="pt-4 flex items-center gap-2 text-stone-300 text-[11px] font-bold uppercase tracking-widest">
                <Icon name="shield" size={14} /> Compra 100% Segura
              </li>
            </ul>
          </div>

        </div>


        {/* Footer Base */}
        <div className="pt-4 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-5 text-[11px]">
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
          
          <div className="flex items-center gap-1.5">
            <span className="uppercase tracking-widest text-stone-300/60">Creado por</span>
            <a
              href="https://www.pivotweb.com.ar/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-serif italic text-base text-white transition-all duration-500 hover:text-brand-orange hover:[text-shadow:0_0_8px_rgba(232,99,21,0.9),0_0_18px_rgba(232,99,21,0.55)]"
            >
              PIVOT
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
