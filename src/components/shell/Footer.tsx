'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import Icon from '@/components/ui/Icon';

export default function Footer() {
  const [email, setEmail] = useState('');
  const showToast = useStore(s => s.showToast);

  const handleSubscribe = () => {
    if (!email || !email.includes('@')) {
      showToast('Por favor ingresá un email válido');
      return;
    }
    showToast('¡Gracias por suscribirte!');
    setEmail('');
  };

  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="foot-brand">
          <Link href="/" className="brand small">
            <span className="brand-mark">
              <svg width="24" height="24" viewBox="0 0 30 30" fill="none">
                <circle cx="15" cy="15" r="13" stroke="currentColor" strokeWidth="0.8" />
                <circle cx="15" cy="15" r="2" fill="currentColor" />
              </svg>
            </span>
            <span className="brand-name">
              <span className="brand-line1">La Botica</span>
              <span className="brand-line2">del Alma</span>
            </span>
          </Link>
          <p>Objetos con historia. Piezas curadas una por una, con foco en artesanía latinoamericana.</p>
        </div>

        <div>
          <h4>Ayuda</h4>
          <ul>
            <li><Link href="/envios-y-devoluciones">Envíos y devoluciones</Link></li>
            <li><Link href="/como-comprar">Cómo comprar</Link></li>
            <li><Link href="/preguntas-frecuentes">Preguntas frecuentes</Link></li>
            <li><Link href="/contacto">Contacto</Link></li>
          </ul>
        </div>

        <div>
          <h4>Nosotras</h4>
          <ul>
            <li><Link href="/nuestra-historia">Nuestra historia</Link></li>
          </ul>
        </div>

        <div className="foot-news">
          <h4>Newsletter</h4>
          <p>Lunas nuevas, nuevos ingresos y ofertas.</p>
          <div className="news-field">
            <input 
              type="email" 
              placeholder="tu@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
            />
            <button aria-label="Suscribirse" onClick={handleSubscribe}>
              <Icon name="arrow-r" size={14} />
            </button>
          </div>
        </div>
      </div>
      <div className="foot-base">
        <div className="foot-base-left">
          <span>© 2026 La Botica del Alma · Rafaela, Argentina</span>
        </div>
        <div className="foot-attribution">
          <span>Creado por</span>
          <a href="https://pivotweb.com.ar/" target="_blank" rel="noopener noreferrer" className="pivot-link">
            <span className="pivot-text">PIVOT</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
