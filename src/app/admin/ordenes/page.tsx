'use client'

import { useEffect, useState } from 'react'
import { ApiOrder } from '@/lib/api'

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

  const handleSave = async () => {
    if (status === order.status) return
    setSaving(true)
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
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
              {(['pending', 'paid', 'shipped', 'cancelled'] as const).map(s => (
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
              ).map(([k, v]) => (
                <div key={k} style={{ display: 'flex', gap: 12 }}>
                  <span style={{ fontSize: 11.5, color: 'var(--fg-soft)', width: 72, flexShrink: 0 }}>{k}</span>
                  <span style={{ fontSize: 13, color: 'var(--fg)' }}>{v}</span>
                </div>
              ))}
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
  const [selected, setSelected] = useState<ApiOrder | null>(null)

  useEffect(() => {
    fetch('/api/admin/orders')
      .then(r => r.json())
      .then(setOrders)
      .finally(() => setLoading(false))
  }, [])

  const handleStatusChange = (id: string, status: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null)
  }

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)
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
      }}>
        <div style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 6 }}>
          Gestión
        </div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 36, fontWeight: 500, margin: 0, color: 'var(--fg)' }}>
          Órdenes
        </h1>
        <p style={{ margin: '6px 0 0', fontSize: 13, color: 'var(--fg-muted)' }}>
          {orders.length} órdenes en total
        </p>
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
                      <div style={{ fontSize: 11.5, color: 'var(--fg-soft)' }}>{o.customerEmail}</div>
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
    </div>
  )
}
