'use client';

import InfoPageLayout from '@/components/ui/InfoPageLayout';
import Icon from '@/components/ui/Icon';
import { motion } from 'framer-motion';

export default function ComoComprarPage() {
  const steps = [
    {
      icon: "search",
      title: "Explorá la Colección",
      desc: "Navegá por nuestro catálogo curado. Cada pieza tiene una energía única; tomate tu tiempo para sentir cuál resuena con vos."
    },
    {
      icon: "bag",
      title: "Tu Selección",
      desc: "Añadí tus elegidos al carrito. Podés revisar tu pedido en cualquier momento antes de finalizar la compra."
    },
    {
      icon: "whatsapp",
      title: "Coordiná tu Pedido",
      desc: "Si preferís atención personalizada o querés retirar en Rafaela, escribinos. Te ayudamos a cerrar el pedido por WhatsApp."
    },
    {
      icon: "check",
      title: "El Arribo",
      desc: "Preparamos tu paquete como un regalo sagrado. Te notificaremos apenas esté listo para ser retirado o en camino a tu hogar."
    }
  ];

  return (
    <InfoPageLayout 
      eyebrow="Experiencia de Compra"
      title="Cómo Comprar"
      subtitle="Comprar en La Botica es un proceso simple y cercano. Podés hacerlo 100% online o coordinar todo por chat."
    >
      {/* Restored Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 py-6">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
              <Icon name={step.icon} size={20} stroke={2} />
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="font-serif text-2xl italic text-stone-800">{i + 1}. {step.title}</h3>
              <p className="text-stone-600 font-light leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Kept the new Asesoramiento Section */}
      <div className="mt-12 border-t border-stone-200 pt-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-6"
        >
          <div className="text-accent/30 mb-2">
            <Icon name="whatsapp" size={36} stroke={1.5} />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl italic text-stone-800 max-w-xl leading-tight">
            ¿Buscás asesoramiento personalizado?
          </h2>
          <p className="text-stone-500 font-light text-lg max-w-md mx-auto leading-relaxed">
            Estamos en línea para ayudarte a elegir el cristal ideal o coordinar tu retiro sin cargo en Rafaela.
          </p>
          <a 
            href="https://wa.me/5493492274535" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group btn btn-md btn-whatsapp rounded-full mt-4"
          >
            <Icon name="whatsapp" size={18} className="transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12" />
            <span>Hablar por WhatsApp</span>
          </a>
        </motion.div>
      </div>
    </InfoPageLayout>
  );
}
