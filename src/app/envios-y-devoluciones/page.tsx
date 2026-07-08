'use client';

import { useEffect, useState } from 'react';
import InfoPageLayout from '@/components/ui/InfoPageLayout';
import Accordion from '@/components/ui/Accordion';
import Icon from '@/components/ui/Icon';

export default function EnviosDevolucionesPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const infoItems = [
    {
      id: "envios",
      title: "Métodos de Envío",
      children: (
        <div className="flex flex-col gap-4">
          <p>Realizamos envíos a todo el país para que nuestras piezas lleguen a tus manos sin importar dónde estés.</p>
          <div className="bg-stone-100 p-6 rounded-2xl border border-stone-200">
            <h4 className="flex items-center gap-2 text-stone-800 mb-2 font-bold uppercase text-[10px] tracking-widest">
              <Icon name="map-pin" size={14} /> Retiro en Persona (Recomendado)
            </h4>
            <p className="text-sm">Podés retirar tu pedido sin cargo en nuestro punto de entrega en <strong>A. Lincoln 85, Rafaela, Santa Fe</strong>. Una vez realizada la compra, te contactaremos por WhatsApp para coordinar el día y horario.</p>
          </div>
          <p>Para el resto del país, trabajamos con Correo Argentino y Andreani. El costo del envío se calcula al finalizar la compra ingresando tu código postal.</p>
        </div>
      )
    },
    {
      id: "tiempos",
      title: "Tiempos de Entrega",
      children: (
        <p>Los pedidos se procesan en un plazo de 24 a 48 horas hábiles. Una vez despachado, el tiempo de entrega estimado es de 3 a 7 días hábiles, dependiendo de la localidad.</p>
      )
    },
    {
      id: "cambios",
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
      id: "danados",
      title: "Productos Dañados",
      children: (
        <p>Si recibiste un producto dañado por el transporte, por favor escribinos por WhatsApp dentro de las 24hs de recibido adjuntando una foto del estado del paquete y el producto para que podamos resolverlo de inmediato.</p>
      )
    },
    {
      id: "terminos",
      title: "Términos y Condiciones",
      children: (
        <div className="flex flex-col gap-3">
          <p>Al navegar en nuestra tienda y realizar una compra, aceptás nuestras condiciones comerciales:</p>
          <ul className="list-disc pl-5 flex flex-col gap-1.5 text-sm">
            <li>Todos los precios publicados están en Pesos Argentinos (ARS) y pueden ser modificados sin previo aviso.</li>
            <li>Las compras se procesan bajo condición de stock real. Si por inconsistencias excepcionales no tuviéramos stock de una pieza, te notificaremos para sustituirla o realizar el reembolso total del dinero.</li>
            <li>Al tratarse de cristales naturales y piezas artesanales hechas a mano, cada pieza es única. Las formas, vetas y tonalidades pueden variar levemente respecto a las imágenes de referencia.</li>
          </ul>
        </div>
      )
    },
    {
      id: "privacidad",
      title: "Política de Privacidad",
      children: (
        <div className="flex flex-col gap-3">
          <p>Resguardamos tu información personal con absoluta confidencialidad:</p>
          <ul className="list-disc pl-5 flex flex-col gap-1.5 text-sm">
            <li>Recopilamos datos como nombre, email, teléfono y dirección con el único fin de procesar tu facturación, coordinar el retiro en Rafaela o despachar tu envío.</li>
            <li>Nunca compartimos, vendemos ni alquilamos tus datos personales con terceros para fines comerciales o de marketing.</li>
            <li>Los cobros digitales se procesan de forma externa y segura mediante Mercado Pago. Nuestro e-commerce no tiene acceso ni almacena tus claves o números de tarjeta de crédito o débito.</li>
          </ul>
        </div>
      )
    }
  ];

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#terminos') {
        setOpenIndex(4);
        setTimeout(() => {
          const el = document.getElementById('terminos');
          el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 150);
      } else if (hash === '#privacidad') {
        setOpenIndex(5);
        setTimeout(() => {
          const el = document.getElementById('privacidad');
          el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 150);
      } else if (hash === '#envios') {
        setOpenIndex(0);
        setTimeout(() => {
          const el = document.getElementById('envios');
          el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 150);
      } else if (hash === '#tiempos') {
        setOpenIndex(1);
        setTimeout(() => {
          const el = document.getElementById('tiempos');
          el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 150);
      } else if (hash === '#cambios') {
        setOpenIndex(2);
        setTimeout(() => {
          const el = document.getElementById('cambios');
          el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 150);
      } else if (hash === '#danados') {
        setOpenIndex(3);
        setTimeout(() => {
          const el = document.getElementById('danados');
          el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 150);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  return (
    <InfoPageLayout 
      eyebrow="Logística & Transparencia"
      title="Envíos y Devoluciones"
      subtitle="Todo lo que necesitás saber sobre cómo recibir tus piezas y nuestras políticas de cambio."
    >
      <div className="mb-8">
        <Accordion 
          items={infoItems} 
          openIndex={openIndex}
          onToggleIndex={setOpenIndex}
        />
      </div>
      
      <div className="bg-accent/5 border border-accent/10 p-8 rounded-[3rem] text-center flex flex-col items-center gap-6">
        <h3 className="font-serif text-3xl italic text-stone-800">¿Tenés una duda específica?</h3>
        <p className="text-stone-600 font-light max-w-md">Nuestro equipo está en línea para ayudarte con cualquier consulta sobre el estado de tu envío o cambios.</p>
        <a 
          href="https://wa.me/5493492274535" 
          target="_blank" 
          rel="noopener noreferrer"
          className="
            group
            btn btn-md btn-whatsapp
            rounded-full
          "
        >
          <Icon name="whatsapp" size={20} className="transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12" />
          <span>Chatear por WhatsApp</span>
        </a>
      </div>
    </InfoPageLayout>
  );
}
