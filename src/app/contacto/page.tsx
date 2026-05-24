import Breadcrumb from '@/components/ui/Breadcrumb';
import Icon from '@/components/ui/Icon';

export default function Contacto() {
  return (
    <main className="info-page">
      <Breadcrumb items={[{ label: 'Inicio', href: '/' }, { label: 'Contacto' }]} />
      
      <article className="section" style={{ maxWidth: '800px', margin: '40px auto' }}>
        <header className="section-head">
          <span className="eyebrow">Hablemos</span>
          <h1>Contacto</h1>
        </header>
        
        <div className="pdp-main" style={{ gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          <div className="tabs-body">
            <p>¿Tenés alguna duda con tu pedido o necesitás asesoramiento personalizado?</p>
            <p>Estamos para ayudarte a encontrar la pieza perfecta para vos o para regalar.</p>
            
            <div className="pdp-perks" style={{ background: 'transparent', padding: '0', marginTop: '32px' }}>
              <div style={{ marginBottom: '16px' }}>
                <Icon name="bag" size={18} />
                <span><strong>WhatsApp:</strong> +54 3492 123456</span>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <Icon name="user" size={18} />
                <span><strong>Email:</strong> hola@laboticadelalma.com</span>
              </div>
              <div>
                <Icon name="truck" size={18} />
                <span><strong>Showroom:</strong> Rafaela, Santa fe.</span>
              </div>
            </div>
          </div>

          <form className="news-field" style={{ flexDirection: 'column', padding: '24px', borderRadius: '12px', background: 'var(--surface-2)', height: 'auto', gap: '16px' }}>
            <div style={{ width: '100%' }}>
              <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Nombre</label>
              <input type="text" placeholder="Tu nombre" style={{ width: '100%', background: 'var(--bg)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--line)' }} />
            </div>
            <div style={{ width: '100%' }}>
              <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Email</label>
              <input type="email" placeholder="tu@email.com" style={{ width: '100%', background: 'var(--bg)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--line)' }} />
            </div>
            <div style={{ width: '100%' }}>
              <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Mensaje</label>
              <textarea placeholder="¿En qué podemos ayudarte?" style={{ width: '100%', background: 'var(--bg)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--line)', minHeight: '100px', fontFamily: 'inherit' }}></textarea>
            </div>
            <button className="btn btn-primary btn-md btn-full" type="button" style={{ width: '100%' }}>Enviar mensaje</button>
          </form>
        </div>
      </article>
    </main>
  );
}
