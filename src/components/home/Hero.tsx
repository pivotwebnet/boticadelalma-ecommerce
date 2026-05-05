import Link from 'next/link';
import Icon from '@/components/ui/Icon';
import ProductPlaceholder from '@/components/ui/ProductPlaceholder';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-media">
        <img 
          src="/banner.png" 
          alt="La Botica del Alma Banner" 
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
        />
      </div>
      <div className="hero-overlay">
        <span className="hero-eyebrow">— Colección de otoño —</span>
        <h1>Joyas con alma.</h1>
        <p>Cristales, velas y amuletos seleccionados uno por uno. Envíos a todo el país.</p>
        <div className="hero-ctas">
          <Link href="/catalogo" className="btn btn-primary btn-lg">
            Explorar la tienda <Icon name="arrow-r" size={16} />
          </Link>
          <Link href="/categoria/cristales" className="btn btn-ghost btn-lg">
            Ver cristales
          </Link>
        </div>
      </div>
    </section>
  );
}
