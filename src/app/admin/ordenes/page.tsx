'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { ApiOrder, ApiProduct } from '@/lib/api'

function fmt(n: number) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n)
}
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
}
function fmtDateTime(d: string) {
  return new Date(d).toLocaleString('es-AR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

const STATUSES = ['all', 'pending', 'paid', 'shipped', 'cancelled'] as const
const STATUS_LABEL: Record<string, string> = {
  all: 'Todas', pending: 'Pendiente', paid: 'Pagado', shipped: 'Enviado', cancelled: 'Cancelado',
}
const STATUS_COLOR: Record<string, { bg: string; color: string }> = {
  pending:   { bg: 'rgba(201,161,122,.15)', color: '#c9a17a' },
  paid:      { bg: 'rgba(155,174,136,.15)', color: '#9bae88' },
  shipped:   { bg: 'rgba(102,134,231,.15)', color: '#6686e7' },
  cancelled: { bg: 'rgba(169,74,60,.15)',   color: '#e06557' },
}

// Máquina de estados (igual que el backend): a qué estados se puede pasar.
const NEXT_STATUS: Record<string, string[]> = {
  pending:   ['paid', 'cancelled'],
  paid:      ['shipped', 'cancelled'],
  shipped:   [],
  cancelled: [],
}

function fmtMoney(n: number) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n)
}

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_COLOR[status] ?? { bg: 'rgba(255,255,255,.08)', color: '#aaa' }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 999,
      fontSize: 11, fontWeight: 500, background: s.bg, color: s.color,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
      {STATUS_LABEL[status] ?? status}
    </span>
  )
}

function OrderDrawer({ order, onClose, onStatusChange }: {
  order: ApiOrder
  onClose: () => void
  onStatusChange: (id: string, status: string) => void
}) {
  const [status, setStatus] = useState(order.status)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [err, setErr] = useState('')

  const allowedNext = NEXT_STATUS[order.status] ?? []
  const isFinal = allowedNext.length === 0

  const handleSave = async () => {
    if (status === order.status) return
    setSaving(true)
    setErr('')
    const res = await fetch(`/api/admin/orders/${order.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setSaving(false)
    if (res.ok) {
      setSaved(true)
      onStatusChange(order.id, status)
      setTimeout(() => setSaved(false), 2000)
    } else {
      const d = await res.json().catch(() => ({}))
      setErr(d?.error ?? 'No se pudo actualizar el estado.')
    }
  }

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)',
        backdropFilter: 'blur(4px)', zIndex: 100,
      }} />
      <aside style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 440,
        background: 'var(--surface)', borderLeft: '1px solid var(--line)',
        zIndex: 101, overflowY: 'auto', display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 28px 20px',
          borderBottom: '1px solid var(--line)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-soft)', marginBottom: 4 }}>
              Detalle de orden
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-muted)' }}>
              {order.id.slice(0, 16)}…
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 999,
            border: '1px solid var(--line)', background: 'transparent',
            color: 'var(--fg-muted)', cursor: 'pointer', fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>×</button>
        </div>

        <div style={{ flex: 1, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Estado */}
          <section>
            <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-soft)', marginBottom: 12 }}>
              Estado
            </div>
            <div style={{ marginBottom: 12, fontSize: 12, color: 'var(--fg-muted)' }}>
              Actual: <StatusBadge status={order.status} />
            </div>
            {isFinal ? (
              <div style={{ fontSize: 12.5, color: 'var(--fg-soft)', padding: '10px 14px', background: 'var(--surface-2)', borderRadius: 8 }}>
                {order.status === 'shipped'
                  ? 'La orden fue enviada. Es un estado final.'
                  : 'La orden está cancelada. Es un estado final.'}
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
                  {allowedNext.map(s => (
                    <button key={s} onClick={() => setStatus(s)} style={{
                      padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 500,
                      border: status === s ? 'none' : '1px solid var(--line)',
                      background: status === s ? (STATUS_COLOR[s]?.bg ?? 'var(--surface-2)') : 'transparent',
                      color: status === s ? (STATUS_COLOR[s]?.color ?? 'var(--fg)') : 'var(--fg-muted)',
                      cursor: 'pointer', transition: 'all .15s',
                    }}>
                      {STATUS_LABEL[s]}
                    </button>
                  ))}
                </div>
                <button onClick={handleSave} disabled={saving || status === order.status} style={{
                  padding: '8px 20px', borderRadius: 999, fontSize: 13, fontWeight: 500,
                  background: saved ? 'rgba(155,174,136,.2)' : 'var(--brand-orange)',
                  color: saved ? '#9bae88' : '#fff',
                  border: 'none', cursor: saving || status === order.status ? 'not-allowed' : 'pointer',
                  opacity: status === order.status ? 0.4 : 1, transition: 'all .2s',
                }}>
                  {saving ? 'Guardando…' : saved ? '✓ Guardado' : 'Guardar cambio'}
                </button>
              </>
            )}
            {err && (
              <div style={{ marginTop: 12, padding: '8px 12px', background: 'rgba(224,101,87,.12)', border: '1px solid rgba(224,101,87,.3)', borderRadius: 7, fontSize: 12.5, color: '#e06557' }}>
                {err}
              </div>
            )}
          </section>

          {/* Cliente */}
          <section>
            <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-soft)', marginBottom: 12 }}>
              Cliente
            </div>
            <div style={{ background: 'var(--surface-2)', borderRadius: 8, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(
                [
                  ['Nombre', order.customerName],
                  ['Email', order.customerEmail],
                  ...(order.customerPhone ? [['Teléfono', order.customerPhone]] : []),
                  ...(order.address ? [['Dirección', order.address]] : []),
                  ...(order.city ? [['Ciudad', order.city]] : []),
                  ...(order.notes ? [['Notas', order.notes]] : []),
                ] as [string, string][]
              ).map(([k, v]) => {
                let content: React.ReactNode = v;
                if (k === 'Email') {
                  const emailBody = encodeURIComponent(
                    `Hola ${order.customerName}!\n\nTe escribimos desde La Botica del Alma en relación a tu pedido #${order.id.slice(0, 8)}. Queríamos coordinar los detalles para realizar el pago y acordar el método de envío.\n\nLos datos para realizar la transferencia bancaria son:\n- Banco: [COMPLETAR BANCO]\n- CBU: [COMPLETAR CBU]\n- Alias: [COMPLETAR ALIAS]\n- Titular: [COMPLETAR TITULAR]\n\nUna vez realizada la transferencia, por favor envianos el comprobante respondiendo a este correo o por WhatsApp al +54 3492274535.\n\nMuchas gracias,\nLa Botica del Alma`
                  );
                  content = (
                    <a
                      href={`mailto:${v}?subject=Orden %23${order.id.slice(0, 8)} - La Botica del Alma&body=${emailBody}`}
                      className="hover:opacity-85 transition-opacity"
                      style={{ color: 'var(--brand-orange)', textDecoration: 'underline', fontWeight: 500 }}
                    >
                      {v}
                    </a>
                  );
                } else if (k === 'Teléfono') {
                  const cleanPhone = v.replace(/[^0-9]/g, '');
                  const wppMsg = encodeURIComponent(
                    `¡Hola ${order.customerName}! ✨ Te escribo de La Botica del Alma por tu pedido #${order.id.slice(0, 8)}. 🌸 Los datos para transferir son:\n- Banco: [COMPLETAR BANCO]\n- CBU: [COMPLETAR CBU]\n- Alias: [COMPLETAR ALIAS]\n- Titular: [COMPLETAR TITULAR]\n\nPor favor, una vez realizada la transferencia, envianos el comprobante por acá. ¡Muchas gracias! 🙏💜`
                  );
                  const wppUrl = `https://wa.me/${cleanPhone.startsWith('54') ? cleanPhone : '54' + cleanPhone}?text=${wppMsg}`;
                  content = (
                    <a
                      href={wppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-85 transition-opacity"
                      style={{ color: 'var(--brand-orange)', textDecoration: 'underline', fontWeight: 500 }}
                    >
                      {v} (WhatsApp)
                    </a>
                  );
                }
                return (
                  <div key={k} style={{ display: 'flex', gap: 12 }}>
                    <span style={{ fontSize: 11.5, color: 'var(--fg-soft)', width: 72, flexShrink: 0 }}>{k}</span>
                    <span style={{ fontSize: 13, color: 'var(--fg)' }}>{content}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Productos */}
          <section>
            <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-soft)', marginBottom: 12 }}>
              Productos ({order.items.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {order.items.map(item => (
                <div key={item.id} style={{
                  background: 'var(--surface-2)', borderRadius: 8, padding: '12px 16px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--fg)' }}>{item.productName}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--fg-soft)', marginTop: 2 }}>
                      {fmt(item.pricePaid)} × {item.quantity}
                    </div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg)', fontVariantNumeric: 'tabular-nums' }}>
                    {fmt(item.pricePaid * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Total */}
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            padding: '16px 18px',
            background: 'rgba(232,99,21,.06)',
            border: '1px solid rgba(232,99,21,.15)',
            borderRadius: 8,
          }}>
            <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--fg)' }}>Total</span>
            <span style={{ fontSize: 18, fontWeight: 600, color: 'var(--brand-orange)', fontVariantNumeric: 'tabular-nums', fontFamily: 'var(--font-serif)' }}>
              {fmt(order.total)}
            </span>
          </div>

          {/* Fechas */}
          <div style={{ display: 'flex', gap: 16, fontSize: 11, color: 'var(--fg-soft)' }}>
            <span>Creada: {fmtDateTime(order.createdAt)}</span>
            <span>·</span>
            <span>Actualizada: {fmtDateTime(order.updatedAt)}</span>
          </div>
        </div>
      </aside>
    </>
  )
}

export default function OrdenesPage() {
  const [orders, setOrders] = useState<ApiOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<ApiOrder | null>(null)
  const [showNew, setShowNew] = useState(false)
  const openedRef = useRef(false)

  const load = useCallback(async () => {
    setLoading(true)
    const data = await fetch('/api/admin/orders').then(r => r.json()).catch(() => [])
    setOrders(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  // Lee filtros desde la URL (al venir enlazado desde el dashboard).
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search)
    const st = sp.get('status')
    if (st && (STATUSES as readonly string[]).includes(st)) setFilter(st)
    const q = sp.get('q')
    if (q) setSearch(q)
  }, [])

  // Abre el detalle de una orden puntual (?order=<id>) una vez cargadas.
  useEffect(() => {
    if (loading || openedRef.current) return
    const oid = new URLSearchParams(window.location.search).get('order')
    if (oid) {
      const o = orders.find(x => x.id === oid)
      if (o) { setSelected(o); openedRef.current = true }
    }
  }, [loading, orders])

  const handleStatusChange = (id: string, status: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null)
  }

  const q = search.trim().toLowerCase()
  const filtered = orders.filter(o => {
    const matchStatus = filter === 'all' || o.status === filter
    const matchSearch = !q || o.customerName.toLowerCase().includes(q) || o.customerEmail.toLowerCase().includes(q)
    return matchStatus && matchSearch
  })
  const counts = STATUSES.reduce((acc, s) => ({
    ...acc,
    [s]: s === 'all' ? orders.length : orders.filter(o => o.status === s).length,
  }), {} as Record<string, number>)

  return (
    <div>
      {/* Header */}
      <div style={{
        padding: '32px 40px 24px',
        borderBottom: '1px solid var(--line)',
        position: 'relative',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
      }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 6 }}>
            Gestión
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 36, fontWeight: 500, margin: 0, color: 'var(--fg)' }}>
            Órdenes
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: 13, color: 'var(--fg-muted)' }}>
            {orders.length} órdenes en total
          </p>
        </div>
        <button onClick={() => setShowNew(true)} style={{
          padding: '10px 22px', borderRadius: 8, fontSize: 13, fontWeight: 600,
          background: 'var(--brand-orange)', color: '#fff', border: 'none', cursor: 'pointer',
        }}>
          + Nueva venta manual
        </button>
        <div style={{
          position: 'absolute', bottom: -1, left: 0, right: 0, height: 1,
          background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
          opacity: 0.5,
        }} />
      </div>

      {/* Filtros */}
      <div style={{ padding: '20px 40px', borderBottom: '1px solid var(--line-soft)', display: 'flex', gap: 8 }}>
        {STATUSES.map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: '6px 14px', borderRadius: 999, fontSize: 12.5, fontWeight: 500,
            border: filter === s ? 'none' : '1px solid var(--line)',
            background: filter === s
              ? (s === 'all' ? 'var(--brand-orange)' : (STATUS_COLOR[s]?.bg ?? 'var(--surface-2)'))
              : 'transparent',
            color: filter === s
              ? (s === 'all' ? '#fff' : (STATUS_COLOR[s]?.color ?? 'var(--fg)'))
              : 'var(--fg-muted)',
            cursor: 'pointer', transition: 'all .15s',
          }}>
            {STATUS_LABEL[s]} <span style={{ opacity: 0.7 }}>({counts[s] ?? 0})</span>
          </button>
        ))}
        <input
          placeholder="Buscar cliente o email…"
          value={search} onChange={e => setSearch(e.target.value)}
          style={{
            marginLeft: 'auto', background: 'var(--surface)', border: '1px solid var(--line)',
            borderRadius: 999, padding: '6px 14px', fontSize: 12.5, color: 'var(--fg)', outline: 'none', width: 220,
          }}
        />
      </div>

      {/* Tabla */}
      <div style={{ padding: '0 40px 40px' }}>
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--line)',
          borderRadius: 12, overflow: 'hidden', marginTop: 24,
        }}>
          {loading ? (
            <div style={{ padding: 60, textAlign: 'center', color: 'var(--fg-muted)', fontSize: 13 }}>
              Cargando órdenes…
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center', color: 'var(--fg-muted)', fontSize: 13 }}>
              No hay órdenes {filter !== 'all' ? `con estado "${STATUS_LABEL[filter]}"` : ''}.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['', 'Cliente', 'Productos', 'Total', 'Fecha', 'Estado'].map(h => (
                    <th key={h} style={{
                      textAlign: 'left', padding: '12px 16px',
                      fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase',
                      color: 'var(--fg-soft)', borderBottom: '1px solid var(--line)',
                      fontWeight: 500, fontFamily: 'var(--font-sans)',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((o, i) => (
                  <tr
                    key={o.id}
                    onClick={() => setSelected(o)}
                    style={{
                      borderBottom: i < filtered.length - 1 ? '1px solid var(--line-soft)' : 'none',
                      cursor: 'pointer', transition: 'background .12s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--fg-soft)', width: 90 }}>
                      {o.id.slice(0, 8)}…
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--fg)' }}>{o.customerName}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--fg-soft)' }}>
                        <a
                          href={`mailto:${o.customerEmail}?subject=Orden %23${o.id.slice(0, 8)} - La Botica del Alma&body=${encodeURIComponent(`Hola ${o.customerName}!\n\nTe escribimos desde La Botica del Alma en relación a tu pedido #${o.id.slice(0, 8)}. Queríamos coordinar los detalles para realizar el pago y acordar el método de envío.\n\nLos datos para realizar la transferencia bancaria son:\n- Banco: [COMPLETAR BANCO]\n- CBU: [COMPLETAR CBU]\n- Alias: [COMPLETAR ALIAS]\n- Titular: [COMPLETAR TITULAR]\n\nUna vez realizada la transferencia, por favor envianos el comprobante respondiendo a este correo o por WhatsApp al +54 3492274535.\n\nMuchas gracias,\nLa Botica del Alma`)}`}
                          onClick={e => e.stopPropagation()}
                          className="hover:opacity-80 transition-opacity"
                          style={{ color: 'var(--fg-soft)', textDecoration: 'underline' }}
                        >
                          {o.customerEmail}
                        </a>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 12.5, color: 'var(--fg-muted)' }}>
                      {o.items.length} {o.items.length === 1 ? 'item' : 'items'}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 600, color: 'var(--fg)', fontVariantNumeric: 'tabular-nums' }}>
                      {fmt(o.total)}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 12, color: 'var(--fg-muted)' }}>
                      {fmtDate(o.createdAt)}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <StatusBadge status={o.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {selected && (
        <OrderDrawer
          order={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
        />
      )}

      {showNew && (
        <NewOrderModal
          onClose={() => setShowNew(false)}
          onCreated={() => { setShowNew(false); load() }}
        />
      )}
    </div>
  )
}

// ─── Modal de carga de venta manual ──────────────────────────────────────────
type NewItem = { productId: string; quantity: number }

function NewOrderModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [products, setProducts] = useState<ApiProduct[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState('paid')
  const [items, setItems] = useState<NewItem[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const loadProducts = useCallback(async () => {
    const data = await fetch('/api/admin/products').then(r => r.json()).catch(() => [])
    setProducts(Array.isArray(data) ? data : [])
  }, [])
  useEffect(() => { loadProducts() }, [loadProducts])

  const addItem = () => setItems(prev => [...prev, { productId: '', quantity: 1 }])
  const updItem = (i: number, patch: Partial<NewItem>) =>
    setItems(prev => prev.map((it, idx) => idx === i ? { ...it, ...patch } : it))
  const delItem = (i: number) => setItems(prev => prev.filter((_, idx) => idx !== i))

  const total = items.reduce((s, it) => {
    const p = products.find(pr => pr.id === it.productId)
    return s + (p ? p.price * it.quantity : 0)
  }, 0)

  async function handleSubmit() {
    setError('')
    if (!name.trim() || !email.trim()) { setError('Nombre y email del cliente son obligatorios.'); return }
    const valid = items.filter(it => it.productId && it.quantity > 0)
    if (valid.length === 0) { setError('Agregá al menos un producto.'); return }

    setSaving(true)
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name.trim(), customerEmail: email.trim(),
          customerPhone: phone.trim() || undefined, city: city.trim() || undefined,
          notes: notes.trim() || undefined, status,
          items: valid.map(it => ({ productId: it.productId, quantity: it.quantity })),
        }),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        setError(d?.error ?? 'No se pudo crear la orden.')
        return
      }
      onCreated()
    } finally {
      setSaving(false)
    }
  }

  const fieldStyle: React.CSSProperties = {
    background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: 7,
    padding: '8px 12px', fontSize: 13, color: 'var(--fg)', outline: 'none', width: '100%', boxSizing: 'border-box',
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--line)',
        borderRadius: 14, width: '100%', maxWidth: 620, maxHeight: '90vh', overflow: 'auto', padding: 32,
      }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 500, color: 'var(--fg)', marginBottom: 6 }}>
          Nueva venta manual
        </div>
        <p style={{ fontSize: 12.5, color: 'var(--fg-muted)', margin: '0 0 22px' }}>
          Para ventas por WhatsApp o presenciales. Los precios se toman del catálogo y se descuenta stock.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
          <input placeholder="Nombre del cliente *" value={name} onChange={e => setName(e.target.value)} style={fieldStyle} />
          <input placeholder="Email *" value={email} onChange={e => setEmail(e.target.value)} style={fieldStyle} />
          <input placeholder="Teléfono" value={phone} onChange={e => setPhone(e.target.value)} style={fieldStyle} />
          <input placeholder="Ciudad" value={city} onChange={e => setCity(e.target.value)} style={fieldStyle} />
        </div>

        <textarea placeholder="Notas (opcional)" value={notes} onChange={e => setNotes(e.target.value)} rows={2}
          style={{ ...fieldStyle, marginBottom: 18, resize: 'vertical', fontFamily: 'inherit' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-soft)' }}>Productos</span>
          <button onClick={addItem} style={{
            padding: '5px 12px', borderRadius: 6, fontSize: 12, fontWeight: 500,
            background: 'transparent', border: '1px solid var(--line)', color: 'var(--fg-muted)', cursor: 'pointer',
          }}>+ Agregar</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
          {items.length === 0 && (
            <div style={{ fontSize: 12.5, color: 'var(--fg-soft)', padding: '10px 0' }}>Todavía no agregaste productos.</div>
          )}
          {items.map((it, i) => {
            const p = products.find(pr => pr.id === it.productId)
            return (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <select value={it.productId} onChange={e => updItem(i, { productId: e.target.value })}
                  style={{ ...fieldStyle, flex: 1, cursor: 'pointer' }}>
                  <option value="">— Producto —</option>
                  {products.filter(pr => pr.isActive).map(pr => (
                    <option key={pr.id} value={pr.id} disabled={pr.stock === 0}>
                      {pr.name} · {fmtMoney(pr.price)} {pr.stock === 0 ? '(agotado)' : `(stock ${pr.stock})`}
                    </option>
                  ))}
                </select>
                <input type="number" min={1} max={p?.stock ?? 99} value={it.quantity}
                  onChange={e => updItem(i, { quantity: Math.max(1, parseInt(e.target.value) || 1) })}
                  style={{ ...fieldStyle, width: 70 }} />
                <button onClick={() => delItem(i)} style={{
                  width: 32, height: 32, borderRadius: 6, flexShrink: 0,
                  border: '1px solid rgba(224,101,87,.3)', background: 'transparent', color: '#e06557', cursor: 'pointer',
                }}>×</button>
              </div>
            )
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <span style={{ fontSize: 12, color: 'var(--fg-soft)' }}>Estado inicial:</span>
          {(['pending', 'paid'] as const).map(s => (
            <button key={s} onClick={() => setStatus(s)} style={{
              padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 500,
              border: status === s ? 'none' : '1px solid var(--line)',
              background: status === s ? (STATUS_COLOR[s]?.bg ?? 'var(--surface-2)') : 'transparent',
              color: status === s ? (STATUS_COLOR[s]?.color ?? 'var(--fg)') : 'var(--fg-muted)',
              cursor: 'pointer',
            }}>{STATUS_LABEL[s]}</button>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: 15, fontWeight: 600, color: 'var(--brand-orange)', fontFamily: 'var(--font-serif)' }}>
            Total: {fmtMoney(total)}
          </span>
        </div>

        {error && (
          <div style={{ padding: '10px 14px', background: 'rgba(224,101,87,.12)', border: '1px solid rgba(224,101,87,.3)', borderRadius: 7, fontSize: 13, color: '#e06557', marginBottom: 16 }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{
            padding: '9px 20px', borderRadius: 7, fontSize: 13, fontWeight: 500,
            background: 'transparent', border: '1px solid var(--line)', color: 'var(--fg-muted)', cursor: 'pointer',
          }}>Cancelar</button>
          <button onClick={handleSubmit} disabled={saving} style={{
            padding: '9px 24px', borderRadius: 7, fontSize: 13, fontWeight: 600,
            background: 'var(--brand-orange)', color: '#fff', border: 'none', cursor: saving ? 'wait' : 'pointer', opacity: saving ? 0.7 : 1,
          }}>{saving ? 'Creando…' : 'Crear venta'}</button>
        </div>
      </div>
    </div>
  )
}
