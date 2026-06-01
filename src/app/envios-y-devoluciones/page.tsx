import InfoPageLayout from '@/components/ui/InfoPageLayout';
import Accordion from '@/components/ui/Accordion';
import Icon from '@/components/ui/Icon';

export default function EnviosDevolucionesPage() {
  const infoItems = [
    {
      title: "Métodos de Envío",
      children: (
        <div className="flex flex-col gap-4">
          <p>Realizamos envíos a todo el país para que nuestras piezas lleguen a tus manos sin importar dónde estés.</p>
          <div className="bg-stone-100 p-6 rounded-2xl border border-stone-200">
            <h4 className="flex items-center gap-2 text-stone-800 mb-2 font-bold uppercase text-[10px] tracking-widest">
              <Icon name="map-pin" size={14} /> Retiro en Persona (Recomendado)
            </h4>
            <p className="text-sm">Podés retirar tu pedido sin cargo en nuestro punto de entrega en <strong>Rafaela, Santa Fe</strong>. Una vez realizada la compra, te contactaremos por WhatsApp para coordinar el día y horario.</p>
          </div>
          <p>Para el resto del país, trabajamos con Correo Argentino y Andreani. El costo del envío se calcula al finalizar la compra ingresando tu código postal.</p>
        </div>
      )
    },
    {
      title: "Tiempos de Entrega",
      children: (
        <p>Los pedidos se procesan en un plazo de 24 a 48 horas hábiles. Una vez despachado, el tiempo de entrega estimado es de 3 a 7 días hábiles, dependiendo de la localidad.</p>
      )
    },
    {
      title: "Cambios y Devoluciones",
      children: (
        <div className="flex flex-col gap-4">
          <p>Queremos que ames cada pieza tanto como nosotros. Si por alguna razón no estás conforme, podés solicitar un cambio o devolución dentro de los <strong>10 días corridos</strong> de recibida la compra.</p>
          <div className="flex flex-col gap-2">
            <h4 className="text-stone-800 font-bold uppercase text-[10px] tracking-widest">Condiciones:</h4>
            <ul className="list-disc pl-5 flex flex-col gap-1 text-sm">
              <li>El producto debe estar intacto, en su empaque original y sin signos de uso.</li>
              <li>Debe presentarse el comprobante de compra.</li>
              <li className="text-brand-orange font-medium">Importante: Por razones de seguridad y naturaleza del producto, no se aceptan devoluciones de velas que hayan sido encendidas.</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Productos Dañados",
      children: (
        <p>Si recibiste un producto dañado por el transporte, por favor escribinos por WhatsApp dentro de las 24hs de recibido adjuntando una foto del estado del paquete y el producto para que podamos resolverlo de inmediato.</p>
      )
    }
  ];

  return (
    <InfoPageLayout 
      eyebrow="Logística & Transparencia"
      title="Envíos y Devoluciones"
      subtitle="Todo lo que necesitás saber sobre cómo recibir tus piezas y nuestras políticas de cambio."
    >
      <div className="mb-12">
        <Accordion items={infoItems} />
      </div>
      
      <div className="bg-accent/5 border border-accent/20 p-8 rounded-[2rem] text-center">
        <h3 className="font-serif text-2xl italic text-stone-800 mb-4">¿Tenés una duda específica?</h3>
        <p className="text-stone-600 font-light mb-6">Estamos en línea para ayudarte con cualquier consulta sobre tu envío.</p>
        <a 
          href="https://wa.me/3492274535" 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          Consultar por WhatsApp
        </a>
      </div>
    </InfoPageLayout>
  );
}
