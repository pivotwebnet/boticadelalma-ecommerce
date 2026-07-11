'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ApiOrder, ApiProduct, ApiComment } from '@/lib/api'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: '◈' },
  { href: '/admin/ordenes', label: 'Órdenes', icon: '◇' },
  { href: '/admin/mensajes', label: 'Mensajes', icon: '✉' },
  { href: '/admin/comentarios', label: 'Reseñas', icon: '◎' },
  { href: '/admin/productos', label: 'Productos', icon: '⬡' },
  { href: '/admin/importar', label: 'Importar Excel', icon: '⇪' },
  { href: '/admin/categorias', label: 'Categorías', icon: '⊛' },
  { href: '/admin/apariencia', label: 'Apariencia', icon: '✦' },
  { href: '/admin/configuracion', label: 'Configuración', icon: '⚙' },
]

interface AlertItem {
  id: string;
  type: 'arrepentimiento' | 'new_order' | 'stock' | 'transfer' | 'review';
  title: string;
  message: string;
  actionText: string;
  actionHref: string;
  color: string;
  icon: string;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname()
  const router = useRouter()

  const [alerts, setAlerts] = useState<AlertItem[]>([])
  
  // Guardamos el ID de la última orden conocida para detectar nuevos pedidos
  const lastOrderIdRef = useRef<string | null>(null)
  const isInitialLoadRef = useRef<boolean>(true)

  // Sincronizar alertas locales e iniciar polling
  useEffect(() => {
    const checkStatusAndSystemData = async () => {
      try {
        // Ejecutar peticiones en paralelo de manera eficiente
        const [ordersRes, productsRes, commentsRes]: [ApiOrder[], ApiProduct[], ApiComment[]] = await Promise.all([
          fetch('/api/admin/orders').then(r => r.ok ? r.json() : []),
          fetch('/api/admin/products').then(r => r.ok ? r.json() : []),
          fetch('/api/admin/comments').then(r => r.ok ? r.json() : []),
        ])

        const systemAlerts: AlertItem[] = []

        // 1. CHEQUEAR ALERTA DE ARREPENTIMIENTO (MANUAL)
        const pendingCancelId = localStorage.getItem('pending_cancel_id')
        const pendingCancelName = localStorage.getItem('pending_cancel_name')
        
        if (pendingCancelId && pendingCancelName) {
          const target = ordersRes.find((o: ApiOrder) => o.id === pendingCancelId)
          if (target && target.status === 'cancelled') {
            // Se canceló con éxito en el sistema: limpiar storage
            localStorage.removeItem('pending_cancel_id')
            localStorage.removeItem('pending_cancel_name')
            
            // Sonido o alerta de éxito
            alert(`✓ ¡Éxito! La orden de ${pendingCancelName} (#${pendingCancelId.slice(0, 8)}) ya figura como 'Cancelada' en el sistema y se ha repuesto el stock correspondiente.`)
          } else {
            systemAlerts.push({
              id: `arrepentimiento-${pendingCancelId}`,
              type: 'arrepentimiento',
              title: '⚠️ Arrepentimiento Pendiente',
              message: `Respondiste a ${pendingCancelName}. Debés cambiar la orden a 'Cancelada' en el sistema para reponer el stock.`,
              actionText: `Ver Orden #${pendingCancelId.slice(0, 8)}`,
              actionHref: `/admin/ordenes?order=${pendingCancelId}`,
              color: '#c9a17a',
              icon: '↩️',
            })
          }
        }

        // 2. CHEQUEAR ALERTA DE NUEVO PEDIDO EN SEGUNDO PLANO
        if (Array.isArray(ordersRes) && ordersRes.length > 0) {
          const latestOrder = ordersRes[0] // Al estar ordenados por fecha desc, el primero es el más nuevo
          
          if (isInitialLoadRef.current) {
            // Guardar el id inicial y desactivar bandera
            lastOrderIdRef.current = latestOrder.id
            isInitialLoadRef.current = false
          } else if (lastOrderIdRef.current && latestOrder.id !== lastOrderIdRef.current) {
            // Hay una orden nueva que no existía antes
            lastOrderIdRef.current = latestOrder.id
            
            // Creamos una alerta temporal de nuevo pedido
            const newAlertId = `neworder-${latestOrder.id}`
            const newAlert: AlertItem = {
              id: newAlertId,
              type: 'new_order',
              title: '✨ ¡Nuevo Pedido Recibido!',
              message: `${latestOrder.customerName} acaba de realizar una compra por un total de $${latestOrder.total}.`,
              actionText: 'Ver Pedido',
              actionHref: `/admin/ordenes?order=${latestOrder.id}`,
              color: '#9bae88',
              icon: '🛍️',
            }

            // Añadir al stack de alertas y reproducir sonido visual
            setAlerts(prev => [newAlert, ...prev.filter(a => a.type !== 'new_order')])
          }
        }

        // 3. CHEQUEAR ALERTA DE STOCK CRÍTICO (STOCK === 0)
        if (Array.isArray(productsRes)) {
          const outOfStockActive = productsRes.filter((p: ApiProduct) => p.isActive && p.stock === 0)
          if (outOfStockActive.length > 0) {
            systemAlerts.push({
              id: 'stock-out',
              type: 'stock',
              title: '⚠️ Alerta de Inventario',
              message: `Tenés ${outOfStockActive.length} ${outOfStockActive.length === 1 ? 'producto activo' : 'productos activos'} sin stock en la tienda.`,
              actionText: 'Ver Productos',
              actionHref: '/admin/productos',
              color: '#e06557',
              icon: '📦',
            })
          }
        }

        // 4. CHEQUEAR ALERTA DE TRANSFERENCIAS PENDIENTES (+24 HORAS EN PENDING)
        if (Array.isArray(ordersRes)) {
          const now = new Date()
          const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
          
          const pendingOldOrders = ordersRes.filter((o: ApiOrder) => 
            o.status === 'pending' && new Date(o.createdAt) < oneDayAgo
          )

          if (pendingOldOrders.length > 0) {
            systemAlerts.push({
              id: 'transfer-pending',
              type: 'transfer',
              title: '📱 Transferencias por Cobrar',
              message: `Tenés ${pendingOldOrders.length} ${pendingOldOrders.length === 1 ? 'pedido' : 'pedidos'} pendientes de pago hace más de 24 horas.`,
              actionText: 'Revisar Pendientes',
              actionHref: '/admin/ordenes?status=pending',
              color: '#6686e7',
              icon: '💵',
            })
          }
        }

        // 5. CHEQUEAR ALERTA DE RESEÑAS NEGATIVAS RECIENTES (MENORES A 2 ESTRELLAS EN LOS ÚLTIMOS 3 DÍAS)
        if (Array.isArray(commentsRes)) {
          const threeDaysAgo = new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000)
          const recentNegative = commentsRes.filter((c: ApiComment) => 
            c.rating <= 2 && new Date(c.createdAt) >= threeDaysAgo
          )

          if (recentNegative.length > 0) {
            // Tomamos la más reciente
            const newestNegative = recentNegative[0]
            systemAlerts.push({
              id: `review-${newestNegative.id}`,
              type: 'review',
              title: '💬 Reseña Negativa Reciente',
              message: `${newestNegative.author} calificó con ${newestNegative.rating}★. Revisá la opinión.`,
              actionText: 'Ver Reseñas',
              actionHref: '/admin/comentarios',
              color: '#e06557',
              icon: '⭐',
            })
          }
        }

        // Actualizamos las alertas del sistema (conservando alertas temporales de nuevo pedido)
        setAlerts(prev => {
          const temporalAlerts = prev.filter(a => a.type === 'new_order')
          // Evitar duplicados
          const filteredSystemAlerts = systemAlerts.filter(sa => !temporalAlerts.some(ta => ta.id === sa.id))
          return [...temporalAlerts, ...filteredSystemAlerts]
        })

      } catch (err) {
        console.error('Error en polling de datos de layout:', err)
      }
    }

    checkStatusAndSystemData()

    // Polling cada 8 segundos para evitar sobrecarga del servidor en desarrollo
    const interval = setInterval(checkStatusAndSystemData, 8000)

    // Escuchar el evento manual de cancelación
    const handleManualUpdate = () => checkStatusAndSystemData()
    window.addEventListener('pending-cancel-updated', handleManualUpdate)

    return () => {
      clearInterval(interval)
      window.removeEventListener('pending-cancel-updated', handleManualUpdate)
    }
  }, [])

  if (path === '/admin/login' || path === '/admin/setup') {
    return <>{children}</>
  }

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin/login')
  }

  const dismissAlert = (id: string) => {
    // Si es un arrepentimiento, limpiamos también del localStorage
    if (id.startsWith('arrepentimiento-')) {
      localStorage.removeItem('pending_cancel_id')
      localStorage.removeItem('pending_cancel_name')
    }
    setAlerts(prev => prev.filter(a => a.id !== id))
  }

  return (
    <div data-theme="dark" style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', fontFamily: 'var(--font-sans)',
      background: 'var(--bg)', color: 'var(--fg)',
    }}>
      {/* Sidebar */}
      <aside style={{
        width: 220, flexShrink: 0,
        background: 'var(--surface)',
        borderRight: '1px solid var(--line)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Brand */}
        <div style={{
          padding: '28px 20px 20px',
          borderBottom: '1px solid var(--line)',
          position: 'relative',
        }}>
          <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-soft)', marginBottom: 6 }}>
            Panel Admin
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontStyle: 'italic', color: 'var(--fg)', lineHeight: 1.1 }}>
            La Botica
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, color: 'var(--fg-muted)', lineHeight: 1.1 }}>
            del Alma
          </div>
          <div style={{
            position: 'absolute', bottom: 0, left: 20, right: 20, height: 1,
            background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
            opacity: 0.6,
          }} />
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 0' }}>
          <div style={{ padding: '16px 20px 8px', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-soft)' }}>
            Menú
          </div>
          {NAV.map(item => {
            const active = item.href === '/admin'
              ? path === '/admin'
              : path.startsWith(item.href)
            return (
              <Link key={item.href} href={item.href} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 20px',
                fontSize: 13.5, fontWeight: active ? 500 : 400,
                color: active ? 'var(--brand-orange)' : 'var(--fg-muted)',
                background: active ? 'rgba(232,99,21,0.08)' : 'transparent',
                textDecoration: 'none',
                position: 'relative',
                borderLeft: active ? '2px solid var(--brand-orange)' : '2px solid transparent',
                transition: 'all .15s',
              }}>
                <span style={{ fontSize: 16, opacity: active ? 1 : 0.5, lineHeight: 1 }}>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer del sidebar */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid var(--line)',
          fontSize: 11, color: 'var(--fg-soft)',
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          <Link href="/" style={{ color: 'var(--fg-soft)', fontSize: 11, textDecoration: 'none' }}>
            ← Volver a la tienda
          </Link>
          <button
            onClick={handleLogout}
            style={{
              background: 'none', border: '1px solid var(--line)',
              borderRadius: 6, padding: '5px 10px',
              fontSize: 11, color: 'var(--fg-soft)',
              cursor: 'pointer', textAlign: 'left',
              transition: 'all .15s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#e06557'
              ;(e.currentTarget as HTMLButtonElement).style.color = '#e06557'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--line)'
              ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--fg-soft)'
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {children}
        
        {/* Pila de Notificaciones Críticas (Bottom Right Alert Stack) */}
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '380px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          zIndex: 99999,
          maxHeight: '80vh',
          overflowY: 'auto',
          padding: '4px',
          pointerEvents: 'none', // Permite clics a través del contenedor
        }}>
          {alerts.map((alert) => (
            <div
              key={alert.id}
              style={{
                background: 'var(--surface)',
                border: `1.5px solid ${alert.color}`,
                borderRadius: '16px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                padding: '16px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                pointerEvents: 'auto', // Reactiva los clics en la tarjeta
                animation: 'slideUpAlert 0.25s ease-out',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '13px', color: alert.color }}>
                  <span>{alert.icon}</span> {alert.title}
                </span>
                <button
                  onClick={() => dismissAlert(alert.id)}
                  style={{
                    background: 'none', border: 'none', color: 'var(--fg-soft)',
                    cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', padding: '0 4px',
                  }}
                  title="Descartar aviso"
                >
                  ×
                </button>
              </div>
              <p style={{ margin: 0, fontSize: '11.5px', lineHeight: 1.45, color: 'var(--fg-muted)' }}>
                {alert.message}
              </p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
                <button
                  onClick={() => {
                    dismissAlert(alert.id)
                    router.push(alert.actionHref)
                  }}
                  style={{
                    flex: 1, padding: '7px 10px', borderRadius: '8px', fontSize: '11.5px', fontWeight: 600,
                    background: alert.color, color: '#fff', border: 'none', cursor: 'pointer',
                    textAlign: 'center', transition: 'opacity 0.15s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  {alert.actionText}
                </button>
                <button
                  onClick={() => dismissAlert(alert.id)}
                  style={{
                    padding: '7px 10px', borderRadius: '8px', fontSize: '11.5px', fontWeight: 500,
                    background: 'transparent', color: 'var(--fg-muted)', border: '1px solid var(--line)',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--fg-muted)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--line)'}
                >
                  Descartar
                </button>
              </div>
            </div>
          ))}
        </div>
        <style jsx global>{`
          @keyframes slideUpAlert {
            from { transform: translateY(15px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  )
}
