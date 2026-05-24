'use client';

import { useState } from 'react';
import Breadcrumb from '@/components/ui/Breadcrumb';

const faqs = [
  {
    q: '¿Tienen local físico?',
    a: 'Contamos con un showroom en Rafaela, Santa Fe, donde podés ver todas las piezas y retirar tus compras online. Atendemos de lunes a viernes de 11 a 19hs.'
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
  },
  {
    q: '¿Hacen envíos a todo el país?',
    a: 'Sí, enviamos a todo el territorio argentino. El envío es gratis a partir de $120.000.'
  },
  {
    q: '¿Cuánto tarda en llegar mi pedido?',
    a: 'Los pedidos se preparan en 1 a 2 días hábiles. La entrega tarda entre 3 y 7 días hábiles según tu ubicación.'
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <main className="info-page">
      <Breadcrumb items={[{ label: 'Inicio', href: '/' }, { label: 'Preguntas frecuentes' }]} />

      <article className="section" style={{ maxWidth: '800px', margin: '40px auto' }}>
        <header className="section-head">
          <span className="eyebrow">Ayuda</span>
          <h1>Preguntas frecuentes</h1>
        </header>

        <div className="faq-list">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className={`faq-row${isOpen ? ' faq-row--open' : ''}`}>
                <button
                  className="faq-btn"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span>{f.q}</span>
                  <svg
                    className="faq-arrow"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div className="faq-panel" style={{ maxHeight: isOpen ? '400px' : '0' }}>
                  <p className="faq-answer">{f.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </article>
    </main>
  );
}
