'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SetupPage() {
  const router = useRouter()
  const [password, setPassword]     = useState('')
  const [confirm, setConfirm]       = useState('')
  const [error, setError]           = useState('')
  const [loading, setLoading]       = useState(false)
  const [checking, setChecking]     = useState(true)

  useEffect(() => {
    fetch('/api/admin/setup')
      .then(r => r.json())
      .then(({ setupRequired }) => {
        if (!setupRequired) router.replace('/admin/login')
        else setChecking(false)
      })
      .catch(() => setChecking(false))
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden')
      return
    }

    setLoading(true)
    const res = await fetch('/api/admin/setup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, confirm }),
    })

    if (res.ok) {
      router.replace('/admin/login')
    } else {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? 'Error al guardar la contraseña')
      setLoading(false)
    }
  }

  const strength = password.length === 0 ? null
    : password.length < 8  ? 'débil'
    : password.length < 12 ? 'aceptable'
    : 'fuerte'

  const strengthColor = strength === 'débil' ? '#e06557'
    : strength === 'aceptable' ? '#c9a17a'
    : '#9bae88'

  if (checking) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg)',
      }} data-theme="dark" />
    )
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', fontFamily: 'var(--font-sans)',
    }} data-theme="dark">
      <div style={{
        width: '100%', maxWidth: 400,
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: 16, padding: '40px 36px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 1,
          background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
        }} />

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-soft)', marginBottom: 8 }}>
            Configuración inicial
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontStyle: 'italic', color: 'var(--fg)', marginBottom: 12 }}>
            La Botica del Alma
          </div>
          <p style={{ fontSize: 13, color: 'var(--fg-muted)', margin: 0, lineHeight: 1.6 }}>
            Elegí tu contraseña de acceso al panel.<br />
            Esta acción solo puede realizarse una vez.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-soft)', marginBottom: 8 }}>
              Nueva contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
              required
              placeholder="Mínimo 8 caracteres"
              style={{
                width: '100%', padding: '10px 14px',
                background: 'var(--bg)', border: '1px solid var(--line)',
                borderRadius: 8, color: 'var(--fg)', fontSize: 14,
                outline: 'none', boxSizing: 'border-box',
              }}
            />
            {strength && (
              <div style={{ marginTop: 6, fontSize: 11, color: strengthColor, display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ display: 'flex', gap: 3 }}>
                  {[1, 2, 3].map(i => (
                    <div key={i} style={{
                      width: 24, height: 3, borderRadius: 2,
                      background: (strength === 'débil' && i === 1) || (strength === 'aceptable' && i <= 2) || strength === 'fuerte'
                        ? strengthColor : 'var(--line)',
                      transition: 'background .2s',
                    }} />
                  ))}
                </div>
                {strength}
              </div>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-soft)', marginBottom: 8 }}>
              Confirmar contraseña
            </label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              style={{
                width: '100%', padding: '10px 14px',
                background: 'var(--bg)', border: '1px solid var(--line)',
                borderRadius: 8, color: 'var(--fg)', fontSize: 14,
                outline: 'none', boxSizing: 'border-box',
                borderColor: confirm && confirm !== password ? '#e06557' : 'var(--line)',
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
            disabled={loading || !password || !confirm}
            style={{
              marginTop: 4, padding: '11px 0', borderRadius: 8,
              background: loading || !password || !confirm ? 'var(--line)' : 'var(--brand-orange)',
              color: loading || !password || !confirm ? 'var(--fg-muted)' : '#fff',
              border: 'none', fontSize: 14, fontWeight: 500,
              cursor: loading || !password || !confirm ? 'not-allowed' : 'pointer',
              transition: 'all .15s',
            }}
          >
            {loading ? 'Guardando…' : 'Establecer contraseña'}
          </button>
        </form>

        <p style={{ marginTop: 20, fontSize: 11, color: 'var(--fg-soft)', textAlign: 'center', lineHeight: 1.5 }}>
          Guardá tu contraseña en un lugar seguro.<br />
          No podrás cambiarla desde el panel.
        </p>
      </div>
    </div>
  )
}
