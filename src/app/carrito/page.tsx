'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { fmt } from '@/lib/utils';
import Icon from '@/components/ui/Icon';
import ProductPlaceholder from '@/components/ui/ProductPlaceholder';
import Breadcrumb from '@/components/ui/Breadcrumb';

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const items = useStore(s => s.cart);
  const updateQty = useStore(s => s.updateQty);
  const removeFromCart = useStore(s => s.removeFromCart);

  useEffect(() => setMounted(true), []);

  const subtotal = items.reduce((s, it) => s + it.product.price * it.qty, 0);
  const shipping = subtotal > 25000 || subtotal === 0 ? 0 : 2500;
  const total = subtotal + shipping;
  const freeShipGap = Math.max(0, 25000 - subtotal);
  const freeShipPct = Math.min(100, (subtotal / 25000) * 100);

  if (!mounted) return null;

  return (
    <main className="cart-page">
      <Breadcrumb items={[{ label: 'Inicio', href: '/' }, { label: 'Carrito' }]} />

      <header className="cart-page-head">
        <h1>Tu carrito</h1>
        {items.length > 0 && (
          <p>{items.length} {items.length === 1 ? 'pieza' : 'piezas'}</p>
        )}
      </header>

      {items.length === 0 ? (
        <div className="empty-state" style={{ marginTop: 80 }}>
          <Icon name="bag" size={48} stroke={1} />
          <p>Tu carrito está vacío</p>
          <Link href="/catalogo" className="btn btn-primary btn-md">
            Explorar el catálogo
          </Link>
        </div>
      ) : (
        <div className="cart-page-body">
          {/* Columna izquierda — items */}
          <div className="cart-page-items">

            {/* Barra de envío gratis */}
            <div className="freeship" style={{ borderRadius: 8, marginBottom: 24 }}>
              {freeShipGap > 0 ? (
                <p>Te faltan <b>{fmt(freeShipGap)}</b> para envío gratis</p>
              ) : (
                <p><Icon name="check" size={14} /> ¡Tenés envío gratis!</p>
              )}
              <div className="freeship-bar">
                <div style={{ width: `${freeShipPct}%` }} />
              </div>
            </div>

            {items.map(it => (
              <div key={it.product.id} className="cart-page-item">
                <div className="cpi-thumb">
                  <ProductPlaceholder tone={it.product.tone} label="" aspectRatio={1} />
                </div>
                <div className="cpi-body">
                  <p className="cpi-name">{it.product.name}</p>
                  <p className="cpi-meta">{it.product.label}</p>
                  <div className="ci-controls">
                    <div className="qty-stepper">
                      <button
                        onClick={() => updateQty(it.product.id, Math.max(1, it.qty - 1))}
                        aria-label="Restar"
                      >
                        <Icon name="minus" size={13} />
                      </button>
                      <span>{it.qty}</span>
                      <button
                        onClick={() => updateQty(it.product.id, it.qty + 1)}
                        aria-label="Sumar"
                      >
                        <Icon name="plus" size={13} />
                      </button>
                    </div>
                    <button
                      className="ci-remove"
                      onClick={() => removeFromCart(it.product.id)}
                    >
                      Quitar
                    </button>
                  </div>
                </div>
                <div className="cpi-price">{fmt(it.product.price * it.qty)}</div>
              </div>
            ))}

            <div style={{ marginTop: 24 }}>
              <Link href="/catalogo" className="link-arrow">
                <Icon name="chev-l" size={14} /> Seguir comprando
              </Link>
            </div>
          </div>

          {/* Columna derecha — resumen */}
          <div className="cart-summary-box">
            <h3>Resumen de compra</h3>

            <div className="summary-line">
              <span>Subtotal ({items.reduce((s, i) => s + i.qty, 0)} piezas)</span>
              <span>{fmt(subtotal)}</span>
            </div>
            <div className="summary-line">
              <span>Envío</span>
              <span>{shipping === 0 ? 'Gratis' : fmt(shipping)}</span>
            </div>

            <div className="summary-total">
              <span>Total</span>
              <span>{fmt(total)}</span>
            </div>

            <button className="btn btn-primary btn-lg btn-full" disabled style={{ opacity: 0.5 }}>
              Proceder al pago
            </button>
            <p className="summary-cuotas">
              o 3 cuotas sin interés de <b>{fmt(total / 3)}</b>
            </p>

            <div className="summary-perks">
              <div><Icon name="shield" size={14} stroke={1.3} /><span>Compra protegida</span></div>
              <div><Icon name="truck" size={14} stroke={1.3} /><span>Envíos a todo el país</span></div>
              <div><Icon name="leaf" size={14} stroke={1.3} /><span>Empaque de papel reciclado</span></div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
