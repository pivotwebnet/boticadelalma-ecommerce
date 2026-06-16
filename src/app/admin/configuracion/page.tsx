'use client'

import { useState } from 'react'

export default function ConfiguracionPage() {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [saving, setSaving] = useState(false)
  const [ok, setOk] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setOk(false)
    if (next.length < 8) { setError('La nueva contraseña debe tener al menos 8 caracteres.'); return }
    if (next !== confirm) { setError('Las contraseñas no coinciden.'); return }

    setSaving(true)
    try {
      const res = await fetch('/api/admin/password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: current, newPassword: next, confirm }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setOk(true); setCurrent(''); setNext(''); setConfirm('')
      } else {
        setError(data?.error ?? 'No se pudo cambiar la contraseña.')
      }
    } finally {
      setSaving(false)
    }
  }

  const field: React.CSSProperties = {
    background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: 8,
    padding: '10px 14px', fontSize: 14, color: 'var(--fg)', outline: 'none',
    width: '100%', boxSizing: 'border-box',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
    color: 'var(--fg-soft)', marginBottom: 8,
  }

  return (
    <div>
      <div style={{ padding: '32px 40px 24px', borderBottom: '1px solid var(--line)', position: 'relative' }}>
        <div style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 6 }}>
          Cuenta
        </div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 36, fontWeight: 500, margin: 0, color: 'var(--fg)' }}>
          Configuración
        </h1>
        <p style={{ margin: '6px 0 0', fontSize: 13, color: 'var(--fg-muted)' }}>Cambiá tu contraseña de acceso al panel</p>
        <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, var(--gold), transparent)', opacity: 0.5 }} />
      </div>

      <div style={{ padding: '32px 40px' }}>
        <form onSubmit={handleSubmit} style={{
          maxWidth: 420, background: 'var(--surface)', border: '1px solid var(--line)',
          borderRadius: 14, padding: 28, display: 'flex', flexDirection: 'column', gap: 18,
        }}>
          <div>
            <label style={labelStyle}>Contraseña actual</label>
            <input type="password" value={current} onChange={e => setCurrent(e.target.value)} style={field} autoComplete="current-password" />
          </div>
          <div>
            <label style={labelStyle}>Nueva contraseña</label>
            <input type="password" value={next} onChange={e => setNext(e.target.value)} style={field} placeholder="Mínimo 8 caracteres" autoComplete="new-password" />
          </div>
          <div>
            <label style={labelStyle}>Confirmar nueva contraseña</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} style={{
              ...field, borderColor: confirm && confirm !== next ? '#e06557' : 'var(--line)',
            }} autoComplete="new-password" />
          </div>

          {error && (
            <div style={{ padding: '10px 14px', background: 'rgba(224,101,87,.12)', border: '1px solid rgba(224,101,87,.3)', borderRadius: 8, fontSize: 13, color: '#e06557' }}>
              {error}
            </div>
          )}
          {ok && (
            <div style={{ padding: '10px 14px', background: 'rgba(155,174,136,.15)', border: '1px solid rgba(155,174,136,.3)', borderRadius: 8, fontSize: 13, color: '#9bae88' }}>
              ✓ Contraseña actualizada. Usala la próxima vez que inicies sesión.
            </div>
          )}

          <button type="submit" disabled={saving || !current || !next || !confirm} style={{
            padding: '11px 0', borderRadius: 8, fontSize: 14, fontWeight: 600,
            background: saving || !current || !next || !confirm ? 'var(--line)' : 'var(--brand-orange)',
            color: saving || !current || !next || !confirm ? 'var(--fg-muted)' : '#fff',
            border: 'none', cursor: saving || !current || !next || !confirm ? 'not-allowed' : 'pointer',
          }}>
            {saving ? 'Guardando…' : 'Cambiar contraseña'}
          </button>
        </form>
      </div>
    </div>
  )
}
