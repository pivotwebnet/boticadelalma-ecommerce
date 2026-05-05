import Breadcrumb from '@/components/ui/Breadcrumb';

export default function EnviosDevoluciones() {
  return (
    <main className="info-page">
      <Breadcrumb items={[{ label: 'Inicio', href: '/' }, { label: 'Envíos y devoluciones' }]} />
      
      <article className="section" style={{ maxWidth: '800px', margin: '40px auto' }}>
        <header className="section-head">
          <span className="eyebrow">Logística</span>
          <h1>Envíos y devoluciones</h1>
        </header>
        
        <div className="tabs-body" style={{ fontSize: '15px' }}>
          <section style={{ marginBottom: '40px' }}>
            <h3>Envíos</h3>
            <p>Realizamos envíos a todo el país a través de Andreani y mensajería privada en CABA y GBA.</p>
            <ul>
              <li><strong>CABA:</strong> Entrega en 24-48 horas hábiles.</li>
              <li><strong>Resto del país:</strong> Entrega en 3 a 7 días hábiles según la localidad.</li>
              <li><strong>Retiro gratuito:</strong> Podés retirar tu compra por nuestro showroom en Palermo, CABA, de lunes a viernes de 11 a 19hs.</li>
            </ul>
            <p><em>Envío gratuito en compras superiores a $25.000.</em></p>
          </section>

          <section>
            <h3>Devoluciones y Cambios</h3>
            <p>Si no estás conforme con tu producto, aceptamos cambios dentro de los 30 días de realizada la compra.</p>
            <p>Los productos deben estar en las mismas condiciones en que fueron recibidos, con su packaging original y sin uso.</p>
            <p>Para gestionar un cambio o devolución, por favor contactanos vía WhatsApp o mail con tu número de orden.</p>
          </section>
        </div>
      </article>
    </main>
  );
}
