'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: '◈' },
  { href: '/admin/ordenes', label: 'Órdenes', icon: '◇' },
  { href: '/admin/comentarios', label: 'Reseñas', icon: '◎' },
  { href: '/admin/productos', label: 'Productos', icon: '⬡' },
  { href: '/admin/categorias', label: 'Categorías', icon: '⊛' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname()
  const router = useRouter()

  if (path === '/admin/login' || path === '/admin/setup') {
    return <>{children}</>
  }

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin/login')
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
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  )
}
