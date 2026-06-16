'use client'

import { useEffect, useState, useRef, useCallback } from 'react'

const DEFAULT_BANNER = '/banner3.jpg'

export default function AparienciaPage() {
  const [current, setCurrent] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [ok, setOk] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const s = await fetch('/api/admin/banner').then(r => r.json()).catch(() => ({}))
    setCurrent(s?.heroImageUrl ?? null)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  function pick(f: File | null) {
    setError(''); setOk('')
    if (!f) { setFile(null); setPreview(null); return }
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(f.type)) {
      setError('Formato no permitido. Usá JPG, PNG, WebP o AVIF.'); return
    }
    if (f.size > 6 * 1024 * 1024) { setError('La imagen supera el máximo de 6 MB.'); return }
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  async function upload() {
    if (!file) return
    setBusy(true); setError(''); setOk('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/banner', { method: 'POST', body: fd })
      const d = await res.json().catch(() => ({}))
      if (res.ok) {
        setOk('Banner actualizado. Ya se ve en la página de inicio.')
        setFile(null); setPreview(null)
        if (inputRef.current) inputRef.current.value = ''
        setCurrent(d?.heroImageUrl ?? null)
      } else {
        setError(d?.error ?? 'No se pudo subir la imagen.')
      }
    } finally { setBusy(false) }
  }

  async function resetDefault() {
    setBusy(true); setError(''); setOk('')
    try {
      const res = await fetch('/api/admin/banner', { method: 'DELETE' })
      if (res.ok) { setOk('Se volvió al banner por defecto.'); setCurrent(null) }
      else setError('No se pudo restablecer.')
    } finally { setBusy(false) }
  }

  const shown = preview ?? current ?? DEFAULT_BANNER

  return (
    <div>
      <div style={{ padding: '32px 40px 24px', borderBottom: '1px solid var(--line)', position: 'relative' }}>
        <div style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 6 }}>Tienda</div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 36, fontWeight: 500, margin: 0, color: 'var(--fg)' }}>Apariencia</h1>
        <p style={{ margin: '6px 0 0', fontSize: 13, color: 'var(--fg-muted)' }}>Cambiá la imagen de fondo del banner principal de la página de inicio</p>
        <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, var(--gold), transparent)', opacity: 0.5 }} />
      </div>

      <div style={{ padding: '32px 40px', maxWidth: 720 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-soft)', marginBottom: 12 }}>
          Banner actual {preview && '· vista previa'}
        </div>

        {/* Preview del banner con los botones encima (los textos/CTA no cambian) */}
        <div style={{
          position: 'relative', width: '100%', aspectRatio: '16 / 7', borderRadius: 14, overflow: 'hidden',
          border: '1px solid var(--line)', background: 'var(--surface-2)',
        }}>
          {!loading && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={shown} alt="Banner" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.35), transparent 60%)' }} />
          <div style={{ position: 'absolute', left: 24, bottom: 22, display: 'flex', gap: 10 }}>
            <span style={{ padding: '8px 16px', borderRadius: 999, background: 'var(--brand-orange)', color: '#fff', fontSize: 12, fontWeight: 600 }}>Explorar tienda</span>
            <span style={{ padding: '8px 16px', borderRadius: 999, background: 'rgba(255,255,255,.18)', color: '#fff', fontSize: 12, fontWeight: 500, backdropFilter: 'blur(4px)' }}>Ver collares</span>
          </div>
          <span style={{ position: 'absolute', top: 12, right: 14, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.7)' }}>
            Los botones no cambian
          </span>
        </div>

        <input
          ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif"
          onChange={e => pick(e.target.files?.[0] ?? null)} style={{ display: 'none' }}
        />

        <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <button onClick={() => inputRef.current?.click()} disabled={busy} style={{
            padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 500,
            background: 'transparent', border: '1px solid var(--line)', color: 'var(--fg)', cursor: busy ? 'wait' : 'pointer',
          }}>Elegir imagen…</button>

          {file && (
            <button onClick={upload} disabled={busy} style={{
              padding: '10px 22px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: 'var(--brand-orange)', color: '#fff', border: 'none', cursor: busy ? 'wait' : 'pointer', opacity: busy ? 0.7 : 1,
            }}>{busy ? 'Subiendo…' : 'Guardar banner'}</button>
          )}

          {file && (
            <span style={{ fontSize: 12.5, color: 'var(--fg-soft)' }}>{file.name}</span>
          )}

          {!file && current && (
            <button onClick={resetDefault} disabled={busy} style={{
              padding: '10px 18px', borderRadius: 8, fontSize: 12.5, fontWeight: 500,
              background: 'transparent', border: '1px solid var(--line)', color: 'var(--fg-muted)', cursor: busy ? 'wait' : 'pointer', marginLeft: 'auto',
            }}>Volver al banner por defecto</button>
          )}
        </div>

        <p style={{ fontSize: 12, color: 'var(--fg-soft)', marginTop: 14, lineHeight: 1.5 }}>
          Recomendado: imagen apaisada (horizontal), mínimo 1600px de ancho, en JPG o WebP. Máximo 6 MB.
        </p>

        {error && (
          <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(224,101,87,.12)', border: '1px solid rgba(224,101,87,.3)', borderRadius: 8, fontSize: 13, color: '#e06557' }}>
            {error}
          </div>
        )}
        {ok && (
          <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(155,174,136,.15)', border: '1px solid rgba(155,174,136,.3)', borderRadius: 8, fontSize: 13, color: '#9bae88' }}>
            ✓ {ok}
          </div>
        )}
      </div>
    </div>
  )
}
