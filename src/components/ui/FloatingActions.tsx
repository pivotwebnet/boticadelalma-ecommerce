'use client';

import { useEffect, useState } from 'react';
import Icon from './Icon';

// Cambiá este número por el de WhatsApp real del negocio
const WA_NUMBER = '5493492000000';
const WA_MSG    = 'Hola! Quisiera hacer una consulta sobre un producto 🌿';

export default function FloatingActions() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 320);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MSG)}`;

  return (
    <div className="floating-actions">
      {/* Volver arriba */}
      <button
        className={`fab fab-top${showTop ? ' visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Volver al inicio"
        title="Volver al inicio"
      >
        <Icon name="chev-u" size={20} stroke={2} />
      </button>

      {/* WhatsApp */}
      <a
        className="fab fab-wa"
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Consultar por WhatsApp"
        title="Consultar por WhatsApp"
      >
        {/* WhatsApp icon */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l4.93-1.37C8.42 21.5 10.15 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.72 0-3.32-.5-4.67-1.35l-.33-.2-3.43.9.92-3.37-.22-.35C3.5 15.32 3 13.72 3 12c0-4.97 4.03-9 9-9s9 4.03 9 9-4.03 9-9 9zm4.97-6.74c-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.61.14-.18.27-.7.88-.86 1.06-.16.18-.31.2-.58.07-.27-.14-1.14-.42-2.17-1.34-.8-.71-1.35-1.6-1.5-1.87-.16-.26-.02-.41.12-.55.12-.12.27-.31.41-.47.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.48-.84-2.02-.22-.54-.45-.47-.61-.48h-.52c-.16 0-.43.06-.66.32-.23.27-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.57.12.16 1.74 2.66 4.22 3.73.59.25 1.05.4 1.41.52.59.19 1.13.16 1.55.1.47-.07 1.46-.6 1.67-1.17.2-.58.2-1.07.14-1.17-.06-.11-.23-.17-.5-.31z"/>
        </svg>
      </a>
    </div>
  );
}
