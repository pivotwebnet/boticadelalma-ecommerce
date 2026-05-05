import Breadcrumb from '@/components/ui/Breadcrumb';

export default function NuestraHistoria() {
  return (
    <main className="info-page">
      <Breadcrumb items={[{ label: 'Inicio', href: '/' }, { label: 'Nuestra historia' }]} />
      
      <article className="section" style={{ maxWidth: '800px', margin: '40px auto' }}>
        <header className="section-head" style={{ textAlign: 'center' }}>
          <span className="eyebrow">Sobre nosotras</span>
          <h1>Nuestra historia</h1>
        </header>
        
        <div className="tabs-body" style={{ fontSize: '16px', lineHeight: '1.8' }}>
          <p>
            La Botica del Alma nació en 2018 como un pequeño proyecto de curaduría de objetos
            con alma. Nuestra fundadora, buscaba piezas que no solo fueran bellas, sino que
            tuvieran un propósito y una historia que contar.
          </p>
          <p>
            Creemos en la belleza de lo imperfecto, en la huella de lo artesanal y en el
            valor de lo que perdura en el tiempo. Cada cristal, cada vela y cada amuleto
            que encontrás en nuestra tienda ha sido seleccionado personalmente por su energía
            y su calidad.
          </p>
          <p>
            Hoy, somos una comunidad de personas que buscan rodearse de objetos que eleven
            la vibración de sus espacios y acompañen sus rituales cotidianos.
          </p>
        </div>
      </article>
    </main>
  );
}
