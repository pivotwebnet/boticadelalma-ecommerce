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

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  pricePaid: number;
  quantity: number;
}

interface OrderData {
  id: string;
  status: string;
  total: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  address?: string;
  city?: string;
  notes?: string;
  createdAt: string;
  items: OrderItem[];
}

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
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(false);

  const [mpStatus, setMpStatus] = useState<string | null>(null);
  const [mpOrderId, setMpOrderId] = useState<string | null>(null);

  const items = useStore(s => s.cart);
  const updateQty = useStore(s => s.updateQty);
  const removeFromCart = useStore(s => s.removeFromCart);
  const setPurchase = useStore(s => s.setPurchase);
  const clearCart = useStore(s => s.clearCart);
  const purchase = useStore(s => s.purchase);

  const targetOrderId = mpOrderId || purchase?.orderId;

  useEffect(() => {
    if (step === 'success' && targetOrderId) {
      setLoadingOrder(true);
      fetch(`/api/orders/public/${targetOrderId}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          setOrderData(data);
          setLoadingOrder(false);
        })
        .catch(err => {
          console.error('Error fetching order details:', err);
          setLoadingOrder(false);
        });
    }
  }, [step, targetOrderId]);

  useEffect(() => {
    setMounted(true);
    
    // 1. Leer parámetros de Mercado Pago de la URL
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    const orderId = params.get('orderId');
    if (status && orderId) {
      setMpStatus(status);
      setMpOrderId(orderId);
      setStep('success');
      return;
    }

    // 2. Si el carrito está vacío pero hay una compra reciente (<20 minutos), mostrar pantalla de éxito
    if (items.length === 0 && purchase && purchase.confirmedAt) {
      const diff = new Date().getTime() - new Date(purchase.confirmedAt).getTime();
      const twentyMinutes = 20 * 60 * 1000;
      if (diff < twentyMinutes) {
        setStep('success');
        return;
      }
    }

    // 3. Sincronizar stock y precios en tiempo real con la base de datos
    if (items.length > 0) {
      fetch('/api/products')
        .then(res => res.ok ? res.json() : [])
        .then(freshProducts => {
          if (!Array.isArray(freshProducts) || freshProducts.length === 0) return;
          
          let changed = false;
          
          items.forEach(it => {
            const fresh = freshProducts.find((p: { id: string; price: number; isActive: boolean; stock: number }) => p.id === it.product.id);
            if (!fresh) {
              // El producto ya no existe en base de datos: remover
              removeFromCart(it.product.id);
              changed = true;
            } else if (!fresh.isActive) {
              // El producto está inactivo: remover
              removeFromCart(it.product.id);
              changed = true;
            } else if (fresh.stock === 0) {
              // Sin stock: remover
              removeFromCart(it.product.id);
              changed = true;
            } else if (fresh.stock < it.qty) {
              // Stock insuficiente: ajustar a la cantidad máxima disponible
              updateQty(it.product.id, fresh.stock);
              changed = true;
            }
            
            // Si el precio cambió en base de datos, lo ideal es alertar y actualizar en Zustand
            if (fresh && fresh.price !== it.product.price) {
              // Actualizamos la cantidad para forzar refresco del precio fresco en local
              updateQty(it.product.id, Math.min(it.qty, fresh.stock));
              changed = true;
            }
          });

          if (changed) {
            setFormError('Hemos actualizado tu carrito según los precios y el stock actual de la tienda.');
          }
        })
        .catch(err => console.error('Error sincronizando stock del carrito:', err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [purchase, items.length]);

  const subtotal = items.reduce((s, it) => s + it.product.price * it.qty, 0);
  const isRafaela = fields.city.toLowerCase().trim() === 'rafaela';
  
  // Si es Rafaela es gratis (0). Si no, es a coordinar (no sumamos nada al total aquí).
  const shippingCost = isRafaela ? 0 : 0; 
  const total = subtotal + shippingCost;
  


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

    clearCart();

    if (order.initPoint) {
      window.location.href = order.initPoint;
    } else {
      setStep('success');
    }
  };

  if (!mounted) return null;

  if (step === 'success') {
    if (loadingOrder && !orderData) {
      return (
        <main className="cart-page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16 }}>
          <div className="spinner" style={{ width: 40, height: 40, border: '3px solid #eae6e1', borderTop: '3px solid #8fa27b', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--fg-soft)' }}>Cargando comprobante de compra...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </main>
      );
    }

    const data = orderData || {
      id: targetOrderId || 'Cargando...',
      status: mpStatus === 'success' ? 'paid' : 'pending',
      total: items.reduce((acc, it) => acc + it.product.price * it.qty, 0),
      customerName: purchase?.buyerName || 'Cliente',
      customerEmail: fields.customerEmail || 'correo@ejemplo.com',
      customerPhone: fields.customerPhone || '',
      address: fields.address || '',
      city: fields.city || '',
      notes: fields.notes || '',
      createdAt: new Date().toISOString(),
      items: items.map(it => ({
        id: it.product.id,
        productId: it.product.id,
        productName: it.product.name,
        pricePaid: it.product.price,
        quantity: it.qty
      }))
    };

    const isPaid = data.status === 'paid';
    const isRetiro = !data.address || data.address.trim() === '' || data.address.toLowerCase().includes('retiro') || data.address.toLowerCase().includes('local');
    const orderItemsCount = data.items?.reduce((acc: number, it: OrderItem) => acc + it.quantity, 0) || 0;

    const fechaPedido = new Date(data.createdAt).toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const isShippingFree = data.total >= 120000 || isRetiro;
    const shippingText = isShippingFree ? 'Gratis' : 'A coordinar por WhatsApp';

    return (
      <main className="cart-page" style={{ paddingBottom: 100 }}>
        <Breadcrumb items={[{ label: 'Inicio', href: '/' }, { label: 'Carrito' }, { label: 'Comprobante' }]} />
        
        <div style={{ maxWidth: 640, margin: '40px auto 0', padding: '0 16px' }}>
          {/* Tarjeta de Éxito Principal */}
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '24px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.03)',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: 28
          }}>
            
            {/* Header del Ticket */}
            <div style={{ textAlign: 'center', borderBottom: '1px dashed var(--border)', paddingBottom: 24 }}>
              <div style={{ 
                fontFamily: 'var(--font-mono)', 
                fontSize: 12, 
                color: 'var(--fg-muted)', 
                letterSpacing: '0.05em',
                marginBottom: 8
              }}>
                ORDEN: #{data.id.slice(0, 8).toUpperCase()}
              </div>
              <h2 style={{ 
                fontFamily: 'var(--font-serif)', 
                fontSize: 22, 
                fontWeight: 600,
                color: 'var(--fg)',
                margin: '0 0 12px 0'
              }}>
                {isPaid ? '¡Pago aprobado con éxito!' : '¡Orden registrada con éxito!'}
              </h2>
              <div style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 14px',
                borderRadius: '50px',
                fontSize: 13,
                fontWeight: 500,
                background: isPaid ? '#eaf5eb' : '#fff4eb',
                color: isPaid ? '#2d6a3f' : '#b25e00'
              }}>
                <Icon name={isPaid ? 'check' : 'info'} size={14} />
                {isPaid ? 'Pago confirmado. ¡Vamos a preparar tu pedido!' : 'Pago pendiente de acreditación'}
              </div>
            </div>

            {/* Punto de Entrega Destacado */}
            <div style={{ 
              background: 'var(--surface-2)', 
              borderRadius: '16px', 
              padding: '20px',
              border: '1px solid var(--border)',
              display: 'flex',
              gap: 14
            }}>
              <div style={{ color: 'var(--brand-orange)', marginTop: 2 }}>
                <Icon name="map-pin" size={20} />
              </div>
              <div>
                <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--fg-muted)', fontWeight: 600, marginBottom: 4 }}>
                  {isRetiro ? 'Retirás en punto de entrega' : 'Envío a domicilio'}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--fg)', lineHeight: 1.4 }}>
                  {isRetiro ? 'A. LINCOLN 85 (RAFAELA)' : `${(data.address || '').toUpperCase()}`}
                </div>
                <div style={{ fontSize: 13, color: 'var(--fg-soft)', marginTop: 2 }}>
                  {isRetiro ? 'Lincoln 85, Rafaela, Santa Fe, CP 2300' : `${data.city || ''}, Santa Fe, Argentina`}
                </div>
              </div>
            </div>

            {/* Listado de Productos */}
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg)', marginBottom: 16 }}>
                Tu pedido · {orderItemsCount} {orderItemsCount === 1 ? 'producto' : 'productos'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {data.items?.map((item: OrderItem) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, fontSize: 13.5 }}>
                    <div style={{ color: 'var(--fg)', flex: 1, lineHeight: 1.4 }}>
                      <span style={{ textTransform: 'uppercase', fontSize: 12.5, fontWeight: 500 }}>{item.productName}</span>
                      <span style={{ color: 'var(--fg-soft)', marginLeft: 8 }}>× {item.quantity}</span>
                    </div>
                    <div style={{ fontWeight: 600, color: 'var(--fg)', fontVariantNumeric: 'tabular-nums' }}>
                      {fmt(item.pricePaid * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bloque Financiero Totales */}
              <div style={{ borderTop: '1px solid var(--border)', marginTop: 20, paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13.5 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--fg-soft)' }}>
                  <span>Subtotal</span>
                  <span style={{ fontVariantNumeric: 'tabular-nums' }}>{fmt(data.total)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--fg-soft)' }}>
                  <span>Costo de envío</span>
                  <span style={{ color: isShippingFree ? '#2d6a3f' : 'inherit', fontWeight: isShippingFree ? 500 : 'normal' }}>
                    {shippingText}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--border)', marginTop: 6, paddingTop: 14, fontSize: 17, fontWeight: 700, color: 'var(--fg)' }}>
                  <span>Total</span>
                  <span style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--accent)' }}>{fmt(data.total)}</span>
                </div>
              </div>
            </div>

            {/* Pago por Transferencia si aplica */}
            {!isPaid && (
              <div style={{
                background: '#fdfcf7',
                border: '1.5px solid #c9a17a',
                borderRadius: '16px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: 12
              }}>
                <h4 style={{ margin: 0, color: '#c9a17a', fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                  Instrucciones de Pago
                </h4>
                <p style={{ fontSize: 13.5, color: 'var(--fg-soft)', margin: 0, lineHeight: 1.5 }}>
                  Para concretar tu compra, realizá la transferencia bancaria por el total a nuestra cuenta oficial:
                </p>
                <div style={{ 
                  background: 'var(--surface-2)', 
                  padding: '14px', 
                  borderRadius: '10px', 
                  fontFamily: 'var(--font-mono)', 
                  fontSize: 12.5, 
                  color: 'var(--fg)', 
                  lineHeight: 1.8,
                  border: '1px solid var(--border)'
                }}>
                  <strong>Banco:</strong> Banco Credicoop<br />
                  <strong>Titular:</strong> Botica del Alma S.H.<br />
                  <strong>CBU:</strong> 1910274855027402770274<br />
                  <strong>Alias:</strong> botica.del.alma
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText('botica.del.alma');
                    alert('¡Alias de cuenta copiado!');
                  }}
                  className="btn btn-ghost btn-sm"
                  style={{ alignSelf: 'flex-start', color: '#c9a17a', gap: 6 }}
                >
                  <Icon name="copy" size={13} /> Copiar Alias
                </button>
                <p style={{ fontSize: 12, color: 'var(--fg-muted)', fontStyle: 'italic', margin: 0 }}>
                  * Una vez transferido, envianos el comprobante por WhatsApp o respondiendo al email.
                </p>
              </div>
            )}

            {/* Como seguir el pedido */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--fg)', marginBottom: 6 }}>
                Cómo seguir el pedido
              </div>
              <p style={{ fontSize: 13, color: 'var(--fg-soft)', margin: 0, lineHeight: 1.5 }}>
                Te enviamos un correo electrónico a <strong>{data.customerEmail}</strong> con los detalles y el comprobante de esta orden, para que puedas llevar el seguimiento de tu compra en cualquier momento.
              </p>
            </div>

            {/* Información Detallada del Pedido */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg)', marginBottom: 16 }}>
                Información del pedido
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 32px', fontSize: 13, color: 'var(--fg-soft)' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--fg-muted)', marginBottom: 4 }}>E-mail</div>
                  <div style={{ wordBreak: 'break-all' }}>{data.customerEmail}</div>
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--fg-muted)', marginBottom: 4 }}>Forma de entrega</div>
                  <div>{isRetiro ? 'Retiro en Lincoln 85' : 'Envío a domicilio'}</div>
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--fg-muted)', marginBottom: 4 }}>Datos de facturación</div>
                  <div>
                    {data.customerName}<br />
                    {data.customerPhone && <>{data.customerPhone}<br /></>}
                    {!isRetiro && <>{data.address}, {data.city}</>}
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--fg-muted)', marginBottom: 4 }}>Pedido realizado</div>
                  <div>{fechaPedido}</div>
                </div>
                {data.notes && (
                  <div style={{ gridColumn: 'span 2' }}>
                    <div style={{ fontWeight: 600, color: 'var(--fg-muted)', marginBottom: 4 }}>Notas del cliente</div>
                    <div style={{ fontStyle: 'italic', background: 'var(--surface-2)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                      &quot;{data.notes}&quot;
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* CTA Soporte WhatsApp */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, textAlign: 'center' }}>
              <a
                href={`https://wa.me/5493492274535?text=${encodeURIComponent('¡Hola! Realicé una orden en la web y necesito ayuda. Mi orden es la #' + data.id.slice(0, 8).toUpperCase())}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group btn btn-md btn-whatsapp rounded-full"
              >
                <Icon name="whatsapp" size={18} className="transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12" />
                <span>¿Necesitás ayuda? Comunicate con nosotros</span>
              </a>
            </div>

          </div>

          {/* Botones de navegación inferiores */}
          <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'center' }}>
            <Link href="/catalogo" className="btn btn-ghost btn-md">
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
