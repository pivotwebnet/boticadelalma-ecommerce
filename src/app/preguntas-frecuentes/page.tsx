import Breadcrumb from '@/components/ui/Breadcrumb';

export default function FAQ() {
  const faqs = [
    {
      q: '¿Tienen local físico?',
      a: 'Contamos con un showroom en Palermo, CABA, donde podés ver todas las piezas y retirar tus compras online. Atendemos de lunes a viernes de 11 a 19hs.'
    },
    {
      q: '¿Qué medios de pago aceptan?',
      a: 'Aceptamos todas las tarjetas de crédito y débito a través de Mercado Pago, transferencia bancaria (con 10% de descuento) y efectivo al retirar.'
    },
    {
      q: '¿Hacen ventas por mayor?',
      a: 'Sí, realizamos ventas mayoristas para locales de decoración y curaduría. Escribinos a nuestro mail o WhatsApp para solicitar el catálogo mayorista.'
    },
    {
      q: '¿Cómo cuido mis cristales?',
      a: 'Recomendamos limpiarlos energéticamente con sahumerios de salvia o palo santo. Físicamente, podés usar un paño suave apenas húmedo. Evitá el contacto directo con químicos.'
    }
  ];

  return (
    <main className="info-page">
      <Breadcrumb items={[{ label: 'Inicio', href: '/' }, { label: 'Preguntas frecuentes' }]} />
      
      <article className="section" style={{ maxWidth: '800px', margin: '40px auto' }}>
        <header className="section-head">
          <span className="eyebrow">Ayuda</span>
          <h1>Preguntas frecuentes</h1>
        </header>
        
        <div className="tabs-body" style={{ fontSize: '15px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {faqs.map((f, i) => (
            <div key={i}>
              <h3 style={{ marginBottom: '8px' }}>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}
        </div>
      </article>
    </main>
  );
}
