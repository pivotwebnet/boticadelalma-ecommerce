import Breadcrumb from '@/components/ui/Breadcrumb';

export default function ComoComprar() {
  return (
    <main className="info-page">
      <Breadcrumb items={[{ label: 'Inicio', href: '/' }, { label: 'Cómo comprar' }]} />
      
      <article className="section" style={{ maxWidth: '800px', margin: '40px auto' }}>
        <header className="section-head">
          <span className="eyebrow">Guía</span>
          <h1>Cómo comprar</h1>
        </header>
        
        <div className="tabs-body" style={{ fontSize: '15px' }}>
          <ol className="steps" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <li>
              <b>1. Navegá el catálogo</b>
              <p>Explorá nuestras categorías y seleccioná los objetos que más te gusten. Hacé clic en "Agregar al carrito" para sumarlos a tu orden.</p>
            </li>
            <li>
              <b>2. Revisá tu carrito</b>
              <p>Cuando hayas terminado, hacé clic en el icono de la bolsa (esquina superior derecha) para ver el resumen de tu compra. Podés modificar cantidades o eliminar productos.</p>
            </li>
            <li>
              <b>3. Iniciá el pago</b>
              <p>Hacé clic en "Finalizar compra". Completá tus datos de contacto, elegí el método de envío y la forma de pago (Mercado Pago, transferencia o efectivo al retirar).</p>
            </li>
            <li>
              <b>4. Confirmación</b>
              <p>Una vez acreditado el pago, recibirás un mail de confirmación. Te mantendremos al tanto del estado de tu envío por mail o WhatsApp.</p>
            </li>
          </ol>
        </div>
      </article>
    </main>
  );
}
