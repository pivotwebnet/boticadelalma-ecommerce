'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  useEffect(() => {
    fetch('/api/admin/setup')
      .then(r => r.json())
      .then(({ setupRequired }) => {
        if (setupRequired) { router.replace('/admin/setup'); return }
        fetch('/api/admin/orders').then(r => { if (r.ok) router.replace('/admin') }).catch(() => {})
      })
      .catch(() => {})
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      // Anti open-redirect: solo se permite volver a una ruta interna del panel.
      const fromParam = searchParams.get('from') ?? '/admin'
      const from = fromParam.startsWith('/admin') ? fromParam : '/admin'
      router.replace(from)
    } else {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? 'Error al iniciar sesión')
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', fontFamily: 'var(--font-sans)',
    }} data-theme="dark">
      <div style={{
        width: '100%', maxWidth: 360,
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: 16, padding: '40px 36px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Gold top line */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 1,
          background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
        }} />

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-soft)', marginBottom: 8 }}>
            Panel Admin
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 26, fontStyle: 'italic', color: 'var(--fg)' }}>
            La Botica del Alma
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-soft)', marginBottom: 8 }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
              required
              style={{
                width: '100%', padding: '10px 14px',
                background: 'var(--bg)', border: '1px solid var(--line)',
                borderRadius: 8, color: 'var(--fg)', fontSize: 14,
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          {error && (
            <div style={{
              padding: '10px 14px', borderRadius: 8,
              background: 'rgba(224,101,87,0.12)', border: '1px solid rgba(224,101,87,0.3)',
              color: '#e06557', fontSize: 13,
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            style={{
              padding: '11px 0', borderRadius: 8,
              background: loading || !password ? 'var(--line)' : 'var(--brand-orange)',
              color: loading || !password ? 'var(--fg-muted)' : '#fff',
              border: 'none', fontSize: 14, fontWeight: 500,
              cursor: loading || !password ? 'not-allowed' : 'pointer',
              transition: 'all .15s',
            }}
          >
            {loading ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
