'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ApiOrder } from '@/lib/api'

function fmt(n: number) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n)
}
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
}

const STATUS_LABEL: Record<string, string> = {
  pending: 'Pendiente', paid: 'Pagado', shipped: 'Enviado', cancelled: 'Cancelado',
}
const STATUS_COLOR: Record<string, { bg: string; color: string }> = {
  pending:   { bg: 'rgba(201,161,122,.15)', color: '#c9a17a' },
  paid:      { bg: 'rgba(155,174,136,.15)', color: '#9bae88' },
  shipped:   { bg: 'rgba(102,134,231,.15)', color: '#6686e7' },
  cancelled: { bg: 'rgba(169,74,60,.15)',   color: '#e06557' },
}

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_COLOR[status] ?? { bg: 'rgba(255,255,255,.08)', color: '#fff' }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 999,
      fontSize: 11, fontWeight: 500, letterSpacing: '0.04em',
      background: s.bg, color: s.color,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
      {STATUS_LABEL[status] ?? status}
    </span>
  )
}

type Period = '7d' | '30d' | '90d' | '1y' | 'all'

const PERIOD_LABELS: Record<Period, string> = {
  '7d': 'Últimos 7 días',
  '30d': 'Últimos 30 días',
  '90d': 'Últimos 3 meses',
  '1y': 'Último año',
  'all': 'Todo el tiempo',
}

// Una orden cuenta como ingreso real solo si fue cobrada (pagada o enviada).
function isRevenue(o: ApiOrder): boolean {
  return o.status === 'paid' || o.status === 'shipped'
}

function filterByPeriod(orders: ApiOrder[], period: Period): ApiOrder[] {
  if (period === 'all') return orders
  const now = new Date()
  const cutoff = new Date()
  if (period === '7d') cutoff.setDate(now.getDate() - 7)
  else if (period === '30d') cutoff.setDate(now.getDate() - 30)
  else if (period === '90d') cutoff.setDate(now.getDate() - 90)
  else if (period === '1y') cutoff.setFullYear(now.getFullYear() - 1)
  return orders.filter(o => new Date(o.createdAt) >= cutoff)
}

function deltaLabel(current: number, prev: number) {
  if (prev === 0) return current > 0 ? '+100%' : '0%'
  const pct = Math.round(((current - prev) / prev) * 100)
  return (pct >= 0 ? '+' : '') + pct + '%'
}
function deltaColor(current: number, prev: number) {
  if (current >= prev) return '#9bae88'
  return '#e06557'
}

function MonthlyChart({ orders }: { orders: ApiOrder[] }) {
  const months = useMemo(() => {
    const map: Record<string, number> = {}
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      map[key] = 0
    }
    orders.filter(isRevenue).forEach(o => {
      const d = new Date(o.createdAt)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      if (key in map) map[key] += o.total
    })
    return Object.entries(map).map(([key, total]) => {
      const [y, m] = key.split('-')
      const label = new Date(parseInt(y), parseInt(m) - 1, 1)
        .toLocaleDateString('es-AR', { month: 'short' })
      return { key, label, total }
    })
  }, [orders])

  const max = Math.max(...months.map(m => m.total), 1)
  const chartH = 120

  return (
    <div style={{ padding: '24px 28px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12 }}>
      <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-soft)', marginBottom: 20 }}>
        Ingresos últimos 6 meses
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: chartH }}>
        {months.map((m, i) => {
          const h = max === 0 ? 4 : Math.max(4, Math.round((m.total / max) * chartH))
          const isLast = i === months.length - 1
          return (
            <div key={m.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
              <div style={{ fontSize: 9, color: 'var(--fg-soft)', letterSpacing: '0.04em', fontVariantNumeric: 'tabular-nums', display: m.total > 0 ? 'block' : 'none' }}>
                {m.total > 0 ? fmt(m.total).replace('$', '').replace('.000', 'k') : ''}
              </div>
              <div
                title={fmt(m.total)}
                style={{
                  width: '100%', height: h,
                  background: isLast
                    ? 'linear-gradient(180deg, var(--brand-orange), rgba(232,99,21,0.5))'
                    : 'linear-gradient(180deg, rgba(102,134,231,0.7), rgba(102,134,231,0.25))',
                  borderRadius: '4px 4px 2px 2px',
                  transition: 'height .3s ease',
                }}
              />
              <div style={{ fontSize: 10, color: 'var(--fg-muted)', textTransform: 'capitalize', letterSpacing: '0.04em' }}>
                {m.label}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function RankingTable({
  title, rows, valueLabel, colorAccent, href,
}: {
  title: string
  rows: { label: string; sub?: string; value: string | number; href?: string }[]
  valueLabel: string
  colorAccent: string
  href?: string
}) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {href ? (
          <Link href={href} style={{ fontFamily: 'var(--font-serif)', fontSize: 16, fontWeight: 500, color: 'var(--fg)', textDecoration: 'none' }}>{title} →</Link>
        ) : (
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: 16, fontWeight: 500, color: 'var(--fg)' }}>{title}</span>
        )}
        <span style={{ fontSize: 10, color: 'var(--fg-soft)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{valueLabel}</span>
      </div>
      {rows.length === 0 ? (
        <div style={{ padding: '24px 20px', color: 'var(--fg-soft)', fontSize: 12, textAlign: 'center' }}>Sin datos</div>
      ) : (
        rows.map((r, i) => {
          const inner = (
            <>
              <span style={{
                width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 600,
                background: i === 0 ? colorAccent : 'var(--bg)',
                color: i === 0 ? '#fff' : 'var(--fg-soft)',
                border: i === 0 ? 'none' : '1px solid var(--line)',
              }}>{i + 1}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: 'var(--fg)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {r.label}
                </div>
                {r.sub && <div style={{ fontSize: 11, color: 'var(--fg-soft)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.sub}</div>}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: colorAccent, fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>
                {r.value}
              </span>
            </>
          )
          const rowStyle: React.CSSProperties = {
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 20px',
            borderBottom: i < rows.length - 1 ? '1px solid var(--line-soft)' : 'none',
            textDecoration: 'none', color: 'inherit',
            cursor: r.href ? 'pointer' : 'default', transition: 'background .12s',
          }
          const hover = (e: React.MouseEvent<HTMLElement>, on: boolean) => {
            if (r.href) e.currentTarget.style.background = on ? 'var(--surface-2)' : 'transparent'
          }
          return r.href ? (
            <Link key={i} href={r.href} style={rowStyle} onMouseEnter={e => hover(e, true)} onMouseLeave={e => hover(e, false)}>{inner}</Link>
          ) : (
            <div key={i} style={rowStyle}>{inner}</div>
          )
        })
      )}
    </div>
  )
}

// Umbral de "poco stock": a partir de acá conviene reponer.
const LOW_STOCK_THRESHOLD = 3

function InventoryPanel({ products }: { products: { id: string; name: string; stock: number; isActive: boolean }[] }) {
  const active = products.filter(p => p.isActive)
  const inactiveCount = products.filter(p => !p.isActive).length
  const outOfStock = active.filter(p => p.stock === 0)
  const lowStock = active.filter(p => p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD)
  const alerts = [...outOfStock, ...lowStock].sort((a, b) => a.stock - b.stock).slice(0, 8)
  const healthy = alerts.length === 0

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/admin/productos" style={{ fontFamily: 'var(--font-serif)', fontSize: 16, fontWeight: 500, color: 'var(--fg)', textDecoration: 'none' }}>Reposición de stock →</Link>
        <span style={{ fontSize: 10, color: 'var(--fg-soft)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {outOfStock.length} agotados · {lowStock.length} por agotarse
        </span>
      </div>
      {/* Mini zona: inactivos (sin foto) — clic lleva al listado ya filtrado */}
      <Link href="/admin/productos?estado=inactive" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 20px', borderBottom: '1px solid var(--line)', textDecoration: 'none',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'var(--fg-muted)' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--fg-soft)' }} />
          Inactivos
        </span>
        <span style={{
          fontSize: 12, fontWeight: 700, color: inactiveCount > 0 ? '#c9a17a' : 'var(--fg-soft)',
          fontVariantNumeric: 'tabular-nums',
        }}>{inactiveCount}</span>
      </Link>
      {healthy ? (
        <div style={{ padding: '24px 20px', color: '#9bae88', fontSize: 12.5, textAlign: 'center' }}>
          ✓ Todos los productos activos tienen stock saludable.
        </div>
      ) : (
        alerts.map((p, i) => (
          <Link key={p.id} href={`/admin/productos?search=${encodeURIComponent(p.id)}`} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '11px 20px',
            borderBottom: i < alerts.length - 1 ? '1px solid var(--line-soft)' : 'none',
            textDecoration: 'none', color: 'inherit', cursor: 'pointer', transition: 'background .12s',
          }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0, background: p.stock === 0 ? '#e06557' : '#c9a17a' }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, color: 'var(--fg)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
              <div style={{ fontSize: 11, color: 'var(--fg-soft)', fontFamily: 'var(--font-mono)' }}>{p.id}</div>
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, flexShrink: 0, color: p.stock === 0 ? '#e06557' : '#c9a17a' }}>
              {p.stock === 0 ? 'Agotado' : `Quedan ${p.stock}`}
            </span>
          </Link>
        ))
      )}
    </div>
  )
}

export default function AdminDashboard() {
  const [orders,     setOrders]     = useState<ApiOrder[]>([])
  const [products,   setProducts]   = useState<{ id: string; categoryId: string; name: string; stock: number; isActive: boolean }[]>([])
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<Period>('30d')
  const [newOrdersPopup, setNewOrdersPopup] = useState<ApiOrder[] | null>(null)
  const router = useRouter()

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/orders').then(r => r.json()).catch(() => []),
      fetch('/api/admin/products').then(r => r.json()).catch(() => []),
      fetch('/api/admin/categories').then(r => r.json()).catch(() => []),
    ]).then(([o, p, c]) => {
      const fetchedOrders: ApiOrder[] = Array.isArray(o) ? o : []
      setOrders(fetchedOrders)
      setProducts(Array.isArray(p) ? p : [])
      setCategories(Array.isArray(c) ? c : [])

      try {
        const lastVisit = localStorage.getItem('last_admin_visit')
        if (lastVisit) {
          const lastVisitDate = new Date(lastVisit)
          const newOrders = fetchedOrders.filter(ord => new Date(ord.createdAt) > lastVisitDate)
          if (newOrders.length > 0) {
            setNewOrdersPopup(newOrders)
          }
        }
      } catch (err) {
        console.error('Error leyendo last_admin_visit:', err)
      }

      try {
        localStorage.setItem('last_admin_visit', new Date().toISOString())
      } catch (err) {
        console.error('Error guardando last_admin_visit:', err)
      }
    }).finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => filterByPeriod(orders, period), [orders, period])
  const prevPeriodOrders = useMemo(() => {
    if (period === 'all') return orders
    const now = new Date()
    const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365
    const start = new Date(); start.setDate(now.getDate() - days * 2)
    const end = new Date(); end.setDate(now.getDate() - days)
    return orders.filter(o => {
      const d = new Date(o.createdAt)
      return d >= start && d < end
    })
  }, [orders, period])

  // Solo las órdenes cobradas (pagadas/enviadas) cuentan como facturación.
  const revenueOrders = useMemo(() => filtered.filter(isRevenue), [filtered])
  const prevRevenueOrders = useMemo(() => prevPeriodOrders.filter(isRevenue), [prevPeriodOrders])

  const totalRevenue = revenueOrders.reduce((s, o) => s + o.total, 0)
  const prevRevenue = prevRevenueOrders.reduce((s, o) => s + o.total, 0)
  const pending = filtered.filter(o => o.status === 'pending').length
  const prevPending = prevPeriodOrders.filter(o => o.status === 'pending').length
  const paidCount = revenueOrders.length
  const prevPaid = prevRevenueOrders.length
  const avgOrder = revenueOrders.length > 0 ? totalRevenue / revenueOrders.length : 0

  // Rankings — sobre órdenes con ingreso real.
  const productRanking = useMemo(() => {
    const map: Record<string, { id: string; name: string; revenue: number; qty: number }> = {}
    revenueOrders.forEach(o => o.items.forEach(it => {
      if (!map[it.productId]) map[it.productId] = { id: it.productId, name: it.productName, revenue: 0, qty: 0 }
      map[it.productId].revenue += it.pricePaid * it.quantity
      map[it.productId].qty += it.quantity
    }))
    return Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, 5)
      .map(p => ({ label: p.name, sub: `${p.qty} vendidos`, value: fmt(p.revenue), href: `/admin/productos?search=${encodeURIComponent(p.id)}` }))
  }, [revenueOrders])

  const customerRanking = useMemo(() => {
    const map: Record<string, { name: string; email: string; revenue: number; count: number }> = {}
    revenueOrders.forEach(o => {
      const k = o.customerEmail
      if (!map[k]) map[k] = { name: o.customerName, email: k, revenue: 0, count: 0 }
      map[k].revenue += o.total
      map[k].count++
    })
    return Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, 5)
      .map(c => ({ label: c.name, sub: `${c.count} órdenes`, value: fmt(c.revenue), href: `/admin/ordenes?q=${encodeURIComponent(c.email)}` }))
  }, [revenueOrders])

  const categoryRanking = useMemo(() => {
    const prodCatMap: Record<string, string> = {}
    products.forEach(p => { prodCatMap[p.id] = p.categoryId })

    const map: Record<string, { catId: string; catName: string; revenue: number; qty: number }> = {}
    revenueOrders.forEach(o => o.items.forEach(it => {
      const catId   = prodCatMap[it.productId] ?? 'otros'
      const catName = categories.find(c => c.id === catId)?.name ?? catId
      if (!map[catId]) map[catId] = { catId, catName, revenue: 0, qty: 0 }
      map[catId].revenue += it.pricePaid * it.quantity
      map[catId].qty     += it.quantity
    }))
    return Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, 5)
      .map(v => ({ label: v.catName, sub: `${v.qty} unidades`, value: fmt(v.revenue), href: v.catId !== 'otros' ? `/admin/productos?cat=${encodeURIComponent(v.catId)}` : undefined }))
  }, [revenueOrders, products, categories])

  const recent = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8)
  const dateStr = new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  const stats = [
    {
      label: 'Ingresos',
      value: fmt(totalRevenue),
      delta: deltaLabel(totalRevenue, prevRevenue),
      deltaC: deltaColor(totalRevenue, prevRevenue),
      sub: `Ticket promedio: ${fmt(avgOrder)}`,
      color: '#9bae88',
      href: '/admin/ordenes?status=paid',
    },
    {
      label: 'Órdenes',
      value: filtered.length,
      delta: deltaLabel(filtered.length, prevPeriodOrders.length),
      deltaC: deltaColor(filtered.length, prevPeriodOrders.length),
      sub: `${pending} pendientes de pago`,
      color: '#6686e7',
      href: '/admin/ordenes',
    },
    {
      label: 'Pagadas / Enviadas',
      value: paidCount,
      delta: deltaLabel(paidCount, prevPaid),
      deltaC: deltaColor(paidCount, prevPaid),
      sub: `${pending} sin confirmar`,
      color: '#c9a17a',
      href: '/admin/ordenes?status=paid',
    },
    {
      label: 'Pendientes',
      value: pending,
      delta: deltaLabel(pending, prevPending),
      deltaC: deltaColor(prevPending, pending), // inverted: fewer pending = better
      sub: 'requieren acción',
      color: '#e06557',
      href: '/admin/ordenes?status=pending',
    },
  ]

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
            Panel de Control
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 36, fontWeight: 500, margin: 0, color: 'var(--fg)' }}>
            Dashboard
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: 13, color: 'var(--fg-muted)', textTransform: 'capitalize' }}>{dateStr}</p>
        </div>
        {/* Period selector */}
        <div style={{ display: 'flex', gap: 6, paddingBottom: 4 }}>
          {(Object.keys(PERIOD_LABELS) as Period[]).map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{
              padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 500,
              border: '1px solid',
              borderColor: period === p ? 'var(--brand-orange)' : 'var(--line)',
              background: period === p ? 'rgba(232,99,21,0.12)' : 'transparent',
              color: period === p ? 'var(--brand-orange)' : 'var(--fg-muted)',
              cursor: 'pointer', transition: 'all .15s',
            }}>{PERIOD_LABELS[p]}</button>
          ))}
        </div>
        <div style={{
          position: 'absolute', bottom: -1, left: 0, right: 0, height: 1,
          background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
          opacity: 0.5,
        }} />
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, padding: '28px 40px 0' }}>
        {stats.map(s => (
          <Link key={s.label} href={s.href} style={{
            background: 'var(--surface)', border: '1px solid var(--line)',
            borderRadius: 12, padding: '20px 22px',
            position: 'relative', overflow: 'hidden',
            textDecoration: 'none', cursor: 'pointer', transition: 'border-color .15s, transform .15s',
            display: 'block',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = s.color; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.transform = 'none' }}
          >
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 2,
              background: `linear-gradient(90deg, transparent, ${s.color}, transparent)`,
              opacity: 0.6,
            }} />
            <div style={{ fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-soft)', marginBottom: 12 }}>
              {s.label}
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 32, fontWeight: 500, color: 'var(--fg)', lineHeight: 1 }}>
              {loading ? '—' : s.value}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
              {period !== 'all' && !loading && (
                <span style={{ fontSize: 11, fontWeight: 600, color: s.deltaC }}>
                  {s.delta}
                </span>
              )}
              <span style={{ fontSize: 11, color: 'var(--fg-soft)' }}>{s.sub}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Monthly chart + inventario */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16, padding: '24px 40px 0' }}>
        <MonthlyChart orders={orders} />
        <InventoryPanel products={products} />
      </div>

      {/* Rankings */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, padding: '24px 40px 0' }}>
        <RankingTable
          title="Top Productos"
          rows={productRanking}
          valueLabel="Ingresos"
          colorAccent="#9bae88"
          href="/admin/productos"
        />
        <RankingTable
          title="Top Clientes"
          rows={customerRanking}
          valueLabel="Total compras"
          colorAccent="#6686e7"
          href="/admin/ordenes"
        />
        <RankingTable
          title="Top Categorías"
          rows={categoryRanking}
          valueLabel="Ingresos"
          colorAccent="#c9a17a"
          href="/admin/categorias"
        />
      </div>

      {/* Recent orders */}
      <div style={{ padding: '24px 40px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 500, color: 'var(--fg)', margin: 0 }}>
            Últimas órdenes
          </h3>
          <Link href="/admin/ordenes" style={{
            fontSize: 12, color: 'var(--accent-ink)', textDecoration: 'none',
            borderBottom: '1px solid var(--line)', paddingBottom: 1,
          }}>
            Ver todas →
          </Link>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--fg-muted)', fontSize: 13 }}>Cargando…</div>
          ) : recent.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--fg-muted)', fontSize: 13 }}>No hay órdenes en este período.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['ID', 'Cliente', 'Total', 'Fecha', 'Estado'].map(h => (
                    <th key={h} style={{
                      textAlign: 'left', padding: '12px 20px',
                      fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase',
                      color: 'var(--fg-soft)', borderBottom: '1px solid var(--line)',
                      fontWeight: 500, fontFamily: 'var(--font-sans)',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map((o, i) => (
                  <tr key={o.id}
                    onClick={() => router.push(`/admin/ordenes?order=${o.id}`)}
                    style={{ borderBottom: i < recent.length - 1 ? '1px solid var(--line-soft)' : 'none', cursor: 'pointer', transition: 'background .12s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '14px 20px', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-soft)' }}>
                      {o.id.slice(0, 8)}…
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--fg)' }}>{o.customerName}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--fg-soft)' }}>{o.customerEmail}</div>
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 500, color: 'var(--fg)', fontVariantNumeric: 'tabular-nums' }}>
                      {fmt(o.total)}
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: 12, color: 'var(--fg-muted)' }}>
                      {fmtDate(o.createdAt)}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <StatusBadge status={o.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {newOrdersPopup && newOrdersPopup.length > 0 && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, padding: 20
        }}>
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--line)',
            borderRadius: 16, maxWidth: 440, width: '100%',
            padding: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            display: 'flex', flexDirection: 'column', gap: 16
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--brand-orange)' }}>
              <span style={{ fontSize: 24 }}>✨</span>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: 18, color: 'var(--fg)', border: 0, padding: 0 }}>
                ¡Nuevos pedidos!
              </h3>
            </div>
            <p style={{ fontSize: 13, color: 'var(--fg-muted)', margin: 0, lineHeight: 1.5 }}>
              Se registraron <b>{newOrdersPopup.length} {newOrdersPopup.length === 1 ? 'pedido nuevo' : 'pedidos nuevos'}</b> desde tu última visita al panel.
            </p>
            <div style={{
              maxHeight: 200, overflowY: 'auto', display: 'flex', flexDirection: 'column',
              gap: 8, padding: '4px 0'
            }}>
              {newOrdersPopup.map(ord => (
                <div key={ord.id} style={{
                  background: 'var(--surface-2)', border: '1px solid var(--line-soft)',
                  borderRadius: 8, padding: '10px 12px', fontSize: 12,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--fg)' }}>{ord.customerName}</div>
                    <div style={{ fontSize: 10, color: 'var(--fg-soft)' }}>
                      {new Date(ord.createdAt).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} · {ord.city}
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--brand-orange)', fontVariantNumeric: 'tabular-nums' }}>
                    {fmt(ord.total)}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button
                className="btn btn-primary btn-md btn-full"
                style={{ background: 'var(--brand-orange)', border: 'none', color: '#fff', cursor: 'pointer' }}
                onClick={() => {
                  setNewOrdersPopup(null);
                  router.push('/admin/ordenes');
                }}
              >
                Ver en detalle
              </button>
              <button
                className="btn btn-ghost btn-md"
                style={{ border: '1px solid var(--line)', cursor: 'pointer' }}
                onClick={() => setNewOrdersPopup(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
