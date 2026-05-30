'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { fmt } from '@/lib/utils';
import Icon from '@/components/ui/Icon';
import ProductPlaceholder from '@/components/ui/ProductPlaceholder';
import Breadcrumb from '@/components/ui/Breadcrumb';

interface CheckoutFields {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  notes: string;
}

type Step = 'cart' | 'checkout' | 'submitting' | 'success';

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<Step>('cart');
  const [formError, setFormError] = useState('');
  const [fields, setFields] = useState<CheckoutFields>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    address: '',
    city: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFields, string>>>({});

  const items = useStore(s => s.cart);
  const updateQty = useStore(s => s.updateQty);
  const removeFromCart = useStore(s => s.removeFromCart);
  const setPurchase = useStore(s => s.setPurchase);
  const clearCart = useStore(s => s.clearPurchase);

  useEffect(() => setMounted(true), []);

  const subtotal = items.reduce((s, it) => s + it.product.price * it.qty, 0);
  const isRafaela = fields.city.toLowerCase().trim() === 'rafaela';
  
  // Si es Rafaela es gratis (0). Si no, es a coordinar (no sumamos nada al total aquí).
  const shippingCost = isRafaela ? 0 : 0; 
  const total = subtotal + shippingCost;
  
  const freeShipGap = isRafaela ? 0 : 0;
  const freeShipPct = isRafaela ? 100 : 0;

  const validateField = (key: keyof CheckoutFields, val: string) => {
    let err = '';
    if (key !== 'notes' && !val.trim()) {
      err = 'Este campo es obligatorio';
    } else if (key === 'customerName') {
      if (val.trim().split(/\s+/).length < 2) err = 'Ingresá nombre y apellido';
    } else if (key === 'customerEmail') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) err = 'Email no válido';
    } else if (key === 'customerPhone') {
      if (val.replace(/\D/g, '').length < 10) err = 'Mínimo 10 números';
    }
    setErrors(prev => ({ ...prev, [key]: err }));
    return !err;
  };

  const setField = (key: keyof CheckoutFields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let val = e.target.value;
    
    // Filtros en tiempo real
    if (key === 'customerName') {
      val = val.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '').slice(0, 35);
    }
    if (key === 'customerPhone') {
      val = val.replace(/[^0-9+]/g, '').slice(0, 15);
    }
    if (key === 'address') val = val.slice(0, 30);
    if (key === 'notes') val = val.slice(0, 200);

    setFields(f => ({ ...f, [key]: val }));
    
    // Validación al toque
    validateField(key, val);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Validar todo antes de mandar
    const keys = Object.keys(fields) as (keyof CheckoutFields)[];
    const isAllValid = keys.every(k => validateField(k, fields[k]));

    if (!isAllValid) {
      setFormError('Revisá los campos marcados en rojo.');
      return;
    }

    setStep('submitting');
    
    const { customerName, customerEmail, customerPhone, address, city, notes } = fields;

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        address: address.trim(),
        city: city.trim(),
        notes: notes.trim() || undefined,
        items: items.map(it => ({
          productId: it.product.id,
          productName: it.product.name,
          pricePaid: it.product.price,
          quantity: it.qty,
        })),
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setFormError(data.error || 'Error al procesar la orden. Intentá de nuevo.');
      setStep('checkout');
      return;
    }

    const order = await res.json();

    setPurchase({
      orderId: order.id,
      buyerName: fields.customerName.trim(),
      products: items.map(it => it.product.id),
      confirmedAt: new Date().toISOString(),
    });

    setStep('success');
  };

  if (!mounted) return null;

  if (step === 'success') {
    return (
      <main className="cart-page">
        <Breadcrumb items={[{ label: 'Inicio', href: '/' }, { label: 'Carrito' }]} />
        <div className="empty-state" style={{ marginTop: 80 }}>
          <Icon name="check" size={48} stroke={1.5} />
          <h2 style={{ marginTop: 16 }}>¡Orden recibida!</h2>
          <p style={{ maxWidth: 360, textAlign: 'center', lineHeight: 1.6 }}>
            Tu orden fue registrada correctamente. Pronto te contactaremos a <b>{fields.customerEmail}</b> para coordinar el pago y el envío.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <Link href="/catalogo" className="btn btn-primary btn-md">
              Seguir comprando
            </Link>
            <Link href="/" className="btn btn-ghost btn-md">
              Ir al inicio
            </Link>
          </div>
        </div>
      </main>
    );
  }

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
            <div className="freeship" style={{ borderRadius: 8, marginBottom: 24 }}>
              {isRafaela ? (
                <p><Icon name="truck" size={14} /> ¡Envío gratis por ser de Rafaela!</p>
              ) : (
                <p><Icon name="info" size={14} /> Envío a coordinar por WhatsApp (Gratis en Rafaela)</p>
              )}
              {isRafaela && (
                <div className="freeship-bar">
                  <div style={{ width: `100%` }} />
                </div>
              )}
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
                        disabled={step === 'checkout' || step === 'submitting'}
                      >
                        <Icon name="minus" size={13} />
                      </button>
                      <span>{it.qty}</span>
                      <button
                        onClick={() => updateQty(it.product.id, it.qty + 1)}
                        aria-label="Sumar"
                        disabled={step === 'checkout' || step === 'submitting'}
                      >
                        <Icon name="plus" size={13} />
                      </button>
                    </div>
                    <button
                      className="ci-remove"
                      onClick={() => removeFromCart(it.product.id)}
                      disabled={step === 'checkout' || step === 'submitting'}
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

          {/* Columna derecha — resumen + formulario */}
            <div className="cart-summary-box">
            <h3>Resumen de compra</h3>

            <div className="summary-line">
              <span>Subtotal ({items.reduce((s, i) => s + i.qty, 0)} piezas)</span>
              <span>{fmt(subtotal)}</span>
            </div>
            <div className="summary-line">
              <span>Envío</span>
              <span style={{ color: isRafaela ? 'var(--success)' : 'var(--brand-orange)', fontWeight: 600 }}>
                {isRafaela ? 'Gratis' : 'A coordinar'}
              </span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>{fmt(total)}</span>
            </div>

            {!isRafaela && (
              <p style={{ fontSize: 12, color: 'var(--fg-muted)', marginBottom: 20, lineHeight: 1.4, fontStyle: 'italic' }}>
                * Al no ser de Rafaela, el costo de envío se coordinará por WhatsApp luego de realizar la orden.
              </p>
            )}

            {step === 'cart' && (
              <>
                <button
                  className="btn btn-primary btn-lg btn-full"
                  onClick={() => setStep('checkout')}
                >
                  Completar datos
                </button>
                <p className="summary-cuotas">
                  o 3 cuotas sin interés de <b>{fmt(total / 3)}</b>
                </p>
              </>
            )}

            {(step === 'checkout' || step === 'submitting') && (
              <form onSubmit={handleCheckout} style={{ marginTop: 20 }} noValidate>
                <p style={{ fontWeight: 600, marginBottom: 16 }}>Tus datos</p>

                <div className="form-field" style={{ marginBottom: 12 }}>
                  <label htmlFor="co-name">Nombre completo *</label>
                  <input
                    id="co-name"
                    type="text"
                    value={fields.customerName}
                    onChange={setField('customerName')}
                    placeholder="María García"
                    required
                    disabled={step === 'submitting'}
                    style={errors.customerName ? { borderColor: 'var(--danger)', backgroundColor: 'rgba(169, 74, 60, 0.02)' } : {}}
                  />
                  {errors.customerName && <span style={{ fontSize: 11, color: 'var(--danger)', marginTop: 4 }}>{errors.customerName}</span>}
                </div>

                <div className="form-field" style={{ marginBottom: 12 }}>
                  <label htmlFor="co-email">Email *</label>
                  <input
                    id="co-email"
                    type="email"
                    value={fields.customerEmail}
                    onChange={setField('customerEmail')}
                    placeholder="maria@ejemplo.com"
                    required
                    disabled={step === 'submitting'}
                    style={errors.customerEmail ? { borderColor: 'var(--danger)', backgroundColor: 'rgba(169, 74, 60, 0.02)' } : {}}
                  />
                  {errors.customerEmail && <span style={{ fontSize: 11, color: 'var(--danger)', marginTop: 4 }}>{errors.customerEmail}</span>}
                </div>

                <div className="form-field" style={{ marginBottom: 12 }}>
                  <label htmlFor="co-phone">Teléfono *</label>
                  <input
                    id="co-phone"
                    type="tel"
                    value={fields.customerPhone}
                    onChange={setField('customerPhone')}
                    placeholder="11 1234-5678"
                    required
                    disabled={step === 'submitting'}
                    style={errors.customerPhone ? { borderColor: 'var(--danger)', backgroundColor: 'rgba(169, 74, 60, 0.02)' } : {}}
                  />
                  {errors.customerPhone && <span style={{ fontSize: 11, color: 'var(--danger)', marginTop: 4 }}>{errors.customerPhone}</span>}
                </div>

                <div className="form-field" style={{ marginBottom: 12 }}>
                  <label htmlFor="co-address">Dirección *</label>
                  <input
                    id="co-address"
                    type="text"
                    value={fields.address}
                    onChange={setField('address')}
                    placeholder="Av. Corrientes 1234"
                    required
                    disabled={step === 'submitting'}
                    style={errors.address ? { borderColor: 'var(--danger)', backgroundColor: 'rgba(169, 74, 60, 0.02)' } : {}}
                  />
                  {errors.address && <span style={{ fontSize: 11, color: 'var(--danger)', marginTop: 4 }}>{errors.address}</span>}
                </div>

                <div className="form-field" style={{ marginBottom: 12 }}>
                  <label htmlFor="co-city">Ciudad *</label>
                  <input
                    id="co-city"
                    type="text"
                    value={fields.city}
                    onChange={setField('city')}
                    placeholder="Buenos Aires"
                    required
                    disabled={step === 'submitting'}
                    style={errors.city ? { borderColor: 'var(--danger)', backgroundColor: 'rgba(169, 74, 60, 0.02)' } : {}}
                  />
                  {errors.city && <span style={{ fontSize: 11, color: 'var(--danger)', marginTop: 4 }}>{errors.city}</span>}
                </div>

                <div className="form-field" style={{ marginBottom: 16 }}>
                  <label htmlFor="co-notes">Notas (opcional)</label>
                  <textarea
                    id="co-notes"
                    value={fields.notes}
                    onChange={setField('notes')}
                    placeholder="Instrucciones de entrega, aclaraciones…"
                    rows={2}
                    disabled={step === 'submitting'}
                    style={errors.notes ? { borderColor: 'var(--danger)', backgroundColor: 'rgba(169, 74, 60, 0.02)' } : {}}
                  />
                  {errors.notes && <span style={{ fontSize: 11, color: 'var(--danger)', marginTop: 4 }}>{errors.notes}</span>}
                </div>

                <p style={{ fontSize: 11, color: 'var(--fg-soft)', marginBottom: 16, fontStyle: 'italic' }}>
                  (*) Los campos marcados son obligatorios.
                </p>

                {formError && (
                  <p className="auth-error" style={{ marginBottom: 12 }}>{formError}</p>
                )}

                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    className="btn btn-ghost btn-md"
                    onClick={() => { setStep('cart'); setFormError(''); }}
                    disabled={step === 'submitting'}
                    style={{ flex: 1 }}
                  >
                    Volver
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-md"
                    disabled={step === 'submitting'}
                    style={{ flex: 2 }}
                  >
                    {step === 'submitting' ? 'Procesando…' : 'Confirmar orden'}
                  </button>
                </div>
              </form>
            )}

            <div className="summary-perks" style={{ marginTop: 20 }}>
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
