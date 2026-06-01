import InfoPageLayout from '@/components/ui/InfoPageLayout';
import Icon from '@/components/ui/Icon';

export default function ComoComprarPage() {
  const steps = [
    {
      icon: "search",
      title: "Explorá la colección",
      desc: "Navegá por nuestro catálogo y elegí las piezas que más resuenen con vos. Podés filtrar por intención si buscás algo específico."
    },
    {
      icon: "bag",
      title: "Armá tu carrito",
      desc: "Añadí los productos que desees. Cuando termines, podés iniciar el checkout para pagar online o simplemente ver el resumen."
    },
    {
      icon: "whatsapp",
      title: "Coordiná por WhatsApp",
      desc: "Si preferís atención personalizada o querés coordinar el retiro en Rafaela, escribinos. Te asesoramos y cerramos el pedido por ahí."
    },
    {
      icon: "check",
      title: "Recibí tu magia",
      desc: "Una vez confirmado el pago, preparamos tu paquete con todo el cuidado del mundo. Te avisamos cuando esté listo para retirar o en camino."
    }
  ];

  return (
    <InfoPageLayout 
      eyebrow="Guía Paso a Paso"
      title="Cómo Comprar"
      subtitle="Comprar en La Botica es un proceso simple y cercano. Podés hacerlo 100% online o coordinar todo por chat."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 py-12">
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

      <div className="mt-24 p-12 rounded-[3rem] bg-accent/5 border border-accent/10 text-center flex flex-col items-center gap-8 relative overflow-hidden">
        {/* Decorative Watermark */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
          <Icon name="sparkle" size={400} className="text-accent" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-6 max-w-xl">
          <span className="text-[10px] uppercase tracking-[0.4em] text-accent font-bold">Atención Personalizada</span>
          <h2 className="font-serif text-3xl md:text-5xl italic leading-tight text-stone-800">¿Preferís que te ayudemos nosotras?</h2>
          <p className="text-stone-600 font-light">Escribinos directamente y realizá tu pedido de forma manual. Estamos para asesorarte en la elección de tus cristales.</p>
          <a 
            href="https://wa.me/3492274535" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            <Icon name="whatsapp" size={20} stroke={2} />
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </InfoPageLayout>
  );
}
