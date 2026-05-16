'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Icon from '@/components/ui/Icon'

interface Props {
  onClose: () => void
  defaultTab?: 'login' | 'register'
}

export default function AuthModal({ onClose, defaultTab = 'login' }: Props) {
  const [tab, setTab] = useState<'login' | 'register'>(defaultTab)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPass, setLoginPass] = useState('')

  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPass, setRegPass] = useState('')

  const switchTab = (t: 'login' | 'register') => {
    setTab(t)
    setError('')
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email: loginEmail,
      password: loginPass,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError('Email o contraseña incorrectos')
    } else {
      onClose()
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: regName, email: regEmail, password: regPass }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Error al crear la cuenta')
      setLoading(false)
      return
    }

    const result = await signIn('credentials', {
      email: regEmail,
      password: regPass,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError('Cuenta creada. Iniciá sesión.')
      switchTab('login')
    } else {
      onClose()
    }
  }

  return (
    <div className="auth-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="auth-box" role="dialog" aria-modal="true">
        <button className="auth-close" onClick={onClose} aria-label="Cerrar">
          <Icon name="close" size={16} />
        </button>

        <div className="auth-head">
          <span className="eyebrow">La Botica del Alma</span>
          <h3>{tab === 'login' ? 'Iniciá sesión' : 'Creá tu cuenta'}</h3>
        </div>

        <div className="auth-tabs">
          <button className={tab === 'login' ? 'on' : ''} onClick={() => switchTab('login')}>
            Entrar
          </button>
          <button className={tab === 'register' ? 'on' : ''} onClick={() => switchTab('register')}>
            Crear cuenta
          </button>
        </div>

        {tab === 'login' ? (
          <form className="auth-form" onSubmit={handleLogin}>
            <div className="form-field">
              <label htmlFor="login-email">Email</label>
              <input
                id="login-email"
                type="email"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                autoComplete="email"
                autoFocus
              />
            </div>
            <div className="form-field">
              <label htmlFor="login-pass">Contraseña</label>
              <input
                id="login-pass"
                type="password"
                value={loginPass}
                onChange={e => setLoginPass(e.target.value)}
                placeholder="••••••"
                required
                autoComplete="current-password"
              />
            </div>
            {error && <p className="auth-error">{error}</p>}
            <button type="submit" className="btn btn-primary btn-md btn-full" disabled={loading}>
              {loading ? 'Ingresando…' : 'Ingresar'}
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleRegister}>
            <div className="form-field">
              <label htmlFor="reg-name">Nombre</label>
              <input
                id="reg-name"
                type="text"
                value={regName}
                onChange={e => setRegName(e.target.value)}
                placeholder="Tu nombre"
                autoComplete="name"
                autoFocus
              />
            </div>
            <div className="form-field">
              <label htmlFor="reg-email">Email</label>
              <input
                id="reg-email"
                type="email"
                value={regEmail}
                onChange={e => setRegEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                autoComplete="email"
              />
            </div>
            <div className="form-field">
              <label htmlFor="reg-pass">Contraseña</label>
              <input
                id="reg-pass"
                type="password"
                value={regPass}
                onChange={e => setRegPass(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>
            {error && <p className="auth-error">{error}</p>}
            <button type="submit" className="btn btn-primary btn-md btn-full" disabled={loading}>
              {loading ? 'Creando cuenta…' : 'Crear cuenta'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
