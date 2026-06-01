'use client';

import InfoPageLayout from '@/components/ui/InfoPageLayout';
import Icon from '@/components/ui/Icon';

export default function ContactoPage() {
  return (
    <InfoPageLayout 
      eyebrow="Hablemos"
      title="Contacto"
      subtitle="¿Tenés alguna duda con tu pedido o necesitás asesoramiento personalizado? Estamos para ayudarte."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 py-12">
        <div className="flex flex-col gap-8">
          <p className="text-stone-600 font-light leading-relaxed text-lg">
            Creemos en la atención cercana. Si preferís no usar el formulario, podés escribirnos directamente por WhatsApp.
          </p>
          
          <div className="flex flex-col gap-6">
            <a 
              href="https://wa.me/3492274535" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-4 text-accent hover:text-brand-orange transition-colors group"
            >
              <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-brand-orange/10 transition-colors">
                <Icon name="whatsapp" size={28} stroke={2} />
              </div>
              <span className="font-bold text-xl">+54 349 227-4535</span>
            </a>

            <div className="flex items-center gap-4 text-stone-500">
              <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center">
                <Icon name="map-pin" size={28} stroke={1.5} />
              </div>
              <span className="text-lg">Rafaela, Santa Fe, AR</span>
            </div>
          </div>
        </div>

        <form className="p-10 rounded-[3rem] bg-accent/5 border border-accent/10 flex flex-col gap-6 h-fit shadow-sm">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Nombre Completo</label>
            <input type="text" placeholder="Tu nombre" className="w-full bg-white border border-stone-200 rounded-xl px-4 py-4 outline-none focus:border-accent transition-colors" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Mensaje</label>
            <textarea placeholder="¿En qué podemos ayudarte?" className="w-full bg-white border border-stone-200 rounded-xl px-4 py-4 outline-none focus:border-accent transition-colors min-h-[150px] font-inherit" />
          </div>
          <button className="btn btn-primary btn-lg w-full mt-4" type="button">Enviar mensaje</button>
        </form>
      </div>
    </InfoPageLayout>
  );
}
