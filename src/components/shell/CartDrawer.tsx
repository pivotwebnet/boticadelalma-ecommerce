'use client';

import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { fmt } from '@/lib/utils';
import Icon from '@/components/ui/Icon';
import Button from '@/components/ui/Button';
import ProductPlaceholder from '@/components/ui/ProductPlaceholder';

export default function CartDrawer() {
  const router = useRouter();
  const cartOpen = useStore(s => s.cartOpen);
  const setCartOpen = useStore(s => s.setCartOpen);
  const items = useStore(s => s.cart);
  const updateQty = useStore(s => s.updateQty);
  const removeFromCart = useStore(s => s.removeFromCart);

  const subtotal = items.reduce((s, it) => s + it.product.price * it.qty, 0);
  const shipping = subtotal > 25000 || subtotal === 0 ? 0 : 2500;
  const total = subtotal + shipping;
  const freeShipGap = Math.max(0, 25000 - subtotal);
  const freeShipPct = Math.min(100, (subtotal / 25000) * 100);

  return (
    <>
      <div
        className={`drawer-scrim${cartOpen ? ' open' : ''}`}
        onClick={() => setCartOpen(false)}
      />
      <aside
        className={`drawer drawer-right${cartOpen ? ' open' : ''}`}
        aria-hidden={!cartOpen}
      >
        <header className="drawer-head">
          <div>
            <span className="drawer-eyebrow">Tu carrito</span>
            <h3>{items.length} {items.length === 1 ? 'pieza' : 'piezas'}</h3>
          </div>
          <button className="icon-btn" onClick={() => setCartOpen(false)} aria-label="Cerrar">
            <Icon name="close" size={18} />
          </button>
        </header>

        {items.length > 0 && (
          <div className="freeship">
            {freeShipGap > 0 ? (
              <p>Te faltan <b>{fmt(freeShipGap)}</b> para envío gratis</p>
            ) : (
              <p><Icon name="check" size={14} /> ¡Tenés envío gratis!</p>
            )}
            <div className="freeship-bar">
              <div style={{ width: `${freeShipPct}%` }} />
            </div>
          </div>
        )}

        <div className="cart-items">
          {items.length === 0 ? (
            <div className="empty-state cart-empty">
              <Icon name="bag" size={32} stroke={1} />
              <p>Tu carrito está vacío</p>
              <button className="btn btn-ghost btn-sm" onClick={() => setCartOpen(false)}>
                Seguir explorando
              </button>
            </div>
          ) : (
            items.map(it => (
              <div key={it.product.id} className="cart-item">
                <div className="ci-thumb">
                  <ProductPlaceholder tone={it.product.tone} label="" aspectRatio={1} />
                </div>
                <div className="ci-body">
                  <span className="ci-name">{it.product.name}</span>
                  <span className="ci-meta">{it.product.label}</span>
                  <div className="ci-controls">
                    <div className="qty-stepper qty-sm">
                      <button onClick={() => updateQty(it.product.id, Math.max(1, it.qty - 1))}>
                        <Icon name="minus" size={12} />
                      </button>
                      <span>{it.qty}</span>
                      <button onClick={() => updateQty(it.product.id, it.qty + 1)}>
                        <Icon name="plus" size={12} />
                      </button>
                    </div>
                    <button className="ci-remove" onClick={() => removeFromCart(it.product.id)}>
                      Quitar
                    </button>
                  </div>
                </div>
                <div className="ci-price">{fmt(it.product.price * it.qty)}</div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <footer className="cart-foot">
            <div className="cart-line"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
            <div className="cart-line"><span>Envío</span><span>{shipping === 0 ? 'Gratis' : fmt(shipping)}</span></div>
            <div className="cart-line cart-total"><span>Total</span><span>{fmt(total)}</span></div>
            <Button
              variant="primary"
              size="lg"
              full
              iconRight="arrow-r"
              onClick={() => {
                setCartOpen(false);
                router.push('/carrito');
              }}
            >
              Finalizar compra
            </Button>
            <p className="cart-fine">
              o 3 cuotas sin interés de <b>{fmt(total / 3)}</b>
            </p>
          </footer>
        )}
      </aside>
    </>
  );
}
