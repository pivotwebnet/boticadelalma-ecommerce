import InfoPageLayout from '@/components/ui/InfoPageLayout';
import Accordion from '@/components/ui/Accordion';

export default function FAQPage() {
  const faqItems = [
    {
      title: "¿Cómo elijo el cristal adecuado para mí?",
      children: (
        <p>Creemos que el cristal te elige a vos. Te recomendamos navegar por nuestra colección y prestar atención a cuál capta tu mirada o resuena con tu energía en este momento. También podés leer las propiedades de cada uno en la descripción o escribirnos por WhatsApp para que te asesoremos personalmente.</p>
      )
    },
    {
      title: "¿Cómo debo limpiar mis cristales al recibirlos?",
      children: (
        <p>Al recibir un cristal, es ideal limpiarlo energéticamente. Podés pasarlo por el humo de un sahumerio (como sándalo o palo santo), dejarlo bajo la luz de la luna llena o colocarlo sobre una selenite. Evitá el agua con sal en cristales porosos como la malaquita o la turquesa.</p>
      )
    },
    {
      title: "¿Tienen showroom o tienda física?",
      children: (
        <p>Actualmente operamos como tienda online con base en Rafaela, Santa Fe. Contamos con un punto de retiro para pedidos locales, pero no tenemos atención al público general de forma presencial por el momento.</p>
      )
    },
    {
      title: "¿Qué medios de pago aceptan?",
      children: (
        <p>Aceptamos todas las tarjetas de crédito y débito a través de MercadoPago. También podés abonar mediante transferencia bancaria (con un descuento especial) o en efectivo al momento del retiro en Rafaela.</p>
      )
    },
    {
      title: "¿Cómo cuido mis velas de intención?",
      children: (
        <p>Para una quemado parejo, dejá la vela encendida hasta que la capa superior se derrita por completo. Cortá el pabilo a 0.5cm antes de cada uso. Nunca dejes una vela encendida sin supervisión y mantenela lejos de corrientes de aire.</p>
      )
    }
  ];

  return (
    <InfoPageLayout 
      eyebrow="Resolvé tus dudas"
      title="Preguntas Frecuentes"
      subtitle="Aquí encontrarás las respuestas a las consultas más comunes sobre nuestros productos, envíos y rituales."
    >
      <div className="mb-12">
        <Accordion items={faqItems} />
      </div>

      <div className="text-center py-12 border-t border-stone-200">
        <p className="text-stone-500 font-light italic mb-8">¿No encontraste lo que buscabas?</p>
        <div className="flex flex-col md:flex-row justify-center gap-6">
          <a href="/contacto" className="btn btn-ghost">Ir a Contacto</a>
          <a href="https://wa.me/3492274535" target="_blank" rel="noopener noreferrer" className="btn btn-primary">Chatear por WhatsApp</a>
        </div>
      </div>
    </InfoPageLayout>
  );
}
