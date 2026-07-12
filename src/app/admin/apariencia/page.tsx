'use client'

import { useEffect, useState, useRef, useCallback } from 'react'

const DEFAULT_BANNER = '/banner3.jpg'
const DEFAULT_LIMITED_IMG = 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=1200&q=85'

// Textos por defecto de la home (placeholder y valor si el campo queda vacío).
const TEXT_DEFAULTS = {
  editorialQuote: 'Lo que eliges, también te elige.',
  editorialQuoteAuthor: '',
  limitedOverline: 'Edición Limitada',
  limitedTitle: 'Luna Nueva',
  limitedText: 'Una curaduría de joyas y piedras para acompañar los ciclos: collares de cuarzo lunar, amuletos de protección y complementos energéticos para los nuevos comienzos.',
  limitedCtaText: 'Ver Colección Completa',
}

const labelStyle = { display: 'block', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: 'var(--fg-soft)', marginBottom: 6 }
const fieldStyle = { width: '100%', background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: 7, padding: '9px 12px', fontSize: 13, color: 'var(--fg)', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' as const, resize: 'vertical' as const }

// Máximo de caracteres por campo de texto de la home. Debe coincidir con el
// tope del servidor en src/app/api/admin/content/route.ts.
const MAX_LEN = 600

// Contador de caracteres bajo cada campo. Se pone naranja al acercarse al tope.
function CharCount({ value, style }: { value: string; style?: React.CSSProperties }) {
  const len = value.length
  const near = len >= MAX_LEN * 0.9
  return (
    <div style={{ fontSize: 11, textAlign: 'right', marginTop: 4, color: near ? 'var(--brand-orange)' : 'var(--fg-soft)', ...style }}>
      {len}/{MAX_LEN}
    </div>
  )
}

export default function AparienciaPage() {
  const [currentBanner, setCurrentBanner] = useState<string | null>(null)
  const [fileBanner, setFileBanner] = useState<File | null>(null)
  const [previewBanner, setPreviewBanner] = useState<string | null>(null)
  const [busyBanner, setBusyBanner] = useState(false)

  const [currentLogo, setCurrentLogo] = useState<string | null>(null)
  const [fileLogo, setFileLogo] = useState<File | null>(null)
  const [previewLogo, setPreviewLogo] = useState<string | null>(null)
  const [busyLogo, setBusyLogo] = useState(false)

  // Textos editables de la home
  const [texts, setTexts] = useState({
    editorialQuote: '', editorialQuoteAuthor: '', limitedOverline: '', limitedTitle: '', limitedText: '', limitedCtaText: '',
  })
  const [savingTexts, setSavingTexts] = useState(false)

  // Imagen de la sección "Edición Limitada"
  const [currentLimitedImg, setCurrentLimitedImg] = useState<string | null>(null)
  const [fileLimitedImg, setFileLimitedImg] = useState<File | null>(null)
  const [previewLimitedImg, setPreviewLimitedImg] = useState<string | null>(null)
  const [busyLimitedImg, setBusyLimitedImg] = useState(false)
  const limitedImgInputRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [ok, setOk] = useState('')
  
  const bannerInputRef = useRef<HTMLInputElement>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const s = await fetch('/api/admin/banner').then(r => r.json()).catch(() => ({}))
    setCurrentBanner(s?.heroImageUrl ?? null)
    setCurrentLogo(s?.logoUrl ?? null)
    setTexts({
      editorialQuote: s?.editorialQuote ?? '',
      editorialQuoteAuthor: s?.editorialQuoteAuthor ?? '',
      limitedOverline: s?.limitedOverline ?? '',
      limitedTitle: s?.limitedTitle ?? '',
      limitedText: s?.limitedText ?? '',
      limitedCtaText: s?.limitedCtaText ?? '',
    })
    setCurrentLimitedImg(s?.limitedImageUrl ?? null)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  function pickBanner(f: File | null) {
    setError(''); setOk('')
    if (!f) { setFileBanner(null); setPreviewBanner(null); return }
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(f.type)) {
      setError('Formato no permitido para banner. Usá JPG, PNG, WebP o AVIF.'); return
    }
    if (f.size > 6 * 1024 * 1024) { setError('El banner supera el máximo de 6 MB.'); return }
    setFileBanner(f)
    setPreviewBanner(URL.createObjectURL(f))
  }

  function pickLogo(f: File | null) {
    setError(''); setOk('')
    if (!f) { setFileLogo(null); setPreviewLogo(null); return }
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml'].includes(f.type)) {
      setError('Formato no permitido para logo. Usá JPG, PNG, WebP, AVIF o SVG.'); return
    }
    if (f.size > 2 * 1024 * 1024) { setError('El logo supera el máximo de 2 MB.'); return }
    setFileLogo(f)
    setPreviewLogo(URL.createObjectURL(f))
  }

  async function uploadBanner() {
    if (!fileBanner) return
    setBusyBanner(true); setError(''); setOk('')
    try {
      const fd = new FormData()
      fd.append('file', fileBanner)
      const res = await fetch('/api/admin/banner', { method: 'POST', body: fd })
      const d = await res.json().catch(() => ({}))
      if (res.ok) {
        setOk('Banner actualizado. Ya se ve en la página de inicio.')
        setFileBanner(null); setPreviewBanner(null)
        if (bannerInputRef.current) bannerInputRef.current.value = ''
        setCurrentBanner(d?.heroImageUrl ?? null)
      } else {
        setError(d?.error ?? 'No se pudo subir el banner.')
      }
    } finally { setBusyBanner(false) }
  }

  async function uploadLogo() {
    if (!fileLogo) return
    setBusyLogo(true); setError(''); setOk('')
    try {
      const fd = new FormData()
      fd.append('file', fileLogo)
      const res = await fetch('/api/admin/logo', { method: 'POST', body: fd })
      const d = await res.json().catch(() => ({}))
      if (res.ok) {
        setOk('Logo actualizado. Ya se ve en la barra de navegación y en el footer.')
        setFileLogo(null); setPreviewLogo(null)
        if (logoInputRef.current) logoInputRef.current.value = ''
        setCurrentLogo(d?.logoUrl ?? null)
      } else {
        setError(d?.error ?? 'No se pudo subir el logo.')
      }
    } finally { setBusyLogo(false) }
  }

  async function resetDefaultBanner() {
    setBusyBanner(true); setError(''); setOk('')
    try {
      const res = await fetch('/api/admin/banner', { method: 'DELETE' })
      if (res.ok) { setOk('Se volvió al banner por defecto.'); setCurrentBanner(null) }
      else setError('No se pudo restablecer el banner.')
    } finally { setBusyBanner(false) }
  }

  async function resetDefaultLogo() {
    setBusyLogo(true); setError(''); setOk('')
    try {
      const res = await fetch('/api/admin/logo', { method: 'DELETE' })
      if (res.ok) { setOk('Se volvió al logo de texto por defecto.'); setCurrentLogo(null) }
      else setError('No se pudo restablecer el logo.')
    } finally { setBusyLogo(false) }
  }

  async function saveTexts() {
    setSavingTexts(true); setError(''); setOk('')
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(texts),
      })
      const d = await res.json().catch(() => ({}))
      if (res.ok) setOk('Textos guardados. Ya se ven en la página de inicio.')
      else setError(d?.error ?? 'No se pudieron guardar los textos.')
    } finally { setSavingTexts(false) }
  }

  function pickLimitedImg(f: File | null) {
    setError(''); setOk('')
    if (!f) { setFileLimitedImg(null); setPreviewLimitedImg(null); return }
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(f.type)) {
      setError('Formato no permitido. Usá JPG, PNG, WebP o AVIF.'); return
    }
    if (f.size > 6 * 1024 * 1024) { setError('La imagen supera el máximo de 6 MB.'); return }
    setFileLimitedImg(f)
    setPreviewLimitedImg(URL.createObjectURL(f))
  }

  async function uploadLimitedImg() {
    if (!fileLimitedImg) return
    setBusyLimitedImg(true); setError(''); setOk('')
    try {
      const fd = new FormData(); fd.append('file', fileLimitedImg)
      const res = await fetch('/api/admin/limited-image', { method: 'POST', body: fd })
      const d = await res.json().catch(() => ({}))
      if (res.ok) {
        setOk('Imagen de la sección actualizada. Ya se ve en la página de inicio.')
        setFileLimitedImg(null); setPreviewLimitedImg(null)
        if (limitedImgInputRef.current) limitedImgInputRef.current.value = ''
        setCurrentLimitedImg(d?.limitedImageUrl ?? null)
      } else setError(d?.error ?? 'No se pudo subir la imagen.')
    } finally { setBusyLimitedImg(false) }
  }

  async function resetLimitedImg() {
    setBusyLimitedImg(true); setError(''); setOk('')
    try {
      const res = await fetch('/api/admin/limited-image', { method: 'DELETE' })
      if (res.ok) { setOk('Se volvió a la imagen por defecto de la sección.'); setCurrentLimitedImg(null) }
      else setError('No se pudo restablecer la imagen.')
    } finally { setBusyLimitedImg(false) }
  }

  const shownBanner = previewBanner ?? currentBanner ?? DEFAULT_BANNER
  const shownLogo = previewLogo ?? currentLogo
  const shownLimitedImg = previewLimitedImg ?? currentLimitedImg ?? DEFAULT_LIMITED_IMG

  return (
    <div>
      <div style={{ padding: '32px 40px 24px', borderBottom: '1px solid var(--line)', position: 'relative' }}>
        <div style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 6 }}>Tienda</div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 36, fontWeight: 500, margin: 0, color: 'var(--fg)' }}>Apariencia</h1>
        <p style={{ margin: '6px 0 0', fontSize: 13, color: 'var(--fg-muted)' }}>Configurá el banner, el logo y los textos e imágenes de la página de inicio.</p>
        <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, var(--gold), transparent)', opacity: 0.5 }} />
      </div>

      <div style={{ padding: '32px 40px', maxWidth: 720 }}>
        
        {/* ================= LOGO ================= */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-soft)', marginBottom: 12 }}>
            Logo actual {previewLogo && '· vista previa'}
          </div>

          <div style={{
            position: 'relative', width: '100%', height: 120, borderRadius: 14, overflow: 'hidden',
            border: '1px solid var(--line)', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {!loading && (
              shownLogo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={shownLogo} alt="Logo" style={{ maxHeight: 80, maxWidth: '80%', objectFit: 'contain' }} />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--fg)' }}>
                  <span style={{ fontSize: 20, fontFamily: 'var(--font-serif)' }}>La Botica</span>
                  <span style={{ fontSize: 14, fontFamily: 'var(--font-serif)', color: 'var(--brand-orange)' }}>del Alma</span>
                  <span style={{ fontSize: 10, marginTop: 8, color: 'var(--fg-soft)' }}>(Logo de texto por defecto)</span>
                </div>
              )
            )}
          </div>

          <input
            ref={logoInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
            onChange={e => pickLogo(e.target.files?.[0] ?? null)} style={{ display: 'none' }}
          />

          <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap', alignItems: 'center' }}>
            <button onClick={() => logoInputRef.current?.click()} disabled={busyLogo} style={{
              padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 500,
              background: 'transparent', border: '1px solid var(--line)', color: 'var(--fg)', cursor: busyLogo ? 'wait' : 'pointer',
            }}>Elegir imagen de logo…</button>

            {fileLogo && (
              <button onClick={uploadLogo} disabled={busyLogo} style={{
                padding: '10px 22px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                background: 'var(--brand-orange)', color: '#fff', border: 'none', cursor: busyLogo ? 'wait' : 'pointer', opacity: busyLogo ? 0.7 : 1,
              }}>{busyLogo ? 'Subiendo…' : 'Guardar logo'}</button>
            )}

            {fileLogo && (
              <span style={{ fontSize: 12.5, color: 'var(--fg-soft)' }}>{fileLogo.name}</span>
            )}

            {!fileLogo && currentLogo && (
              <button onClick={resetDefaultLogo} disabled={busyLogo} style={{
                padding: '10px 18px', borderRadius: 8, fontSize: 12.5, fontWeight: 500,
                background: 'transparent', border: '1px solid var(--line)', color: 'var(--fg-muted)', cursor: busyLogo ? 'wait' : 'pointer', marginLeft: 'auto',
              }}>Volver al logo por defecto</button>
            )}
          </div>

          <p style={{ fontSize: 12, color: 'var(--fg-soft)', marginTop: 14, lineHeight: 1.5 }}>
            Recomendado: logo con fondo transparente en formato PNG o SVG.
          </p>
        </div>

        <div style={{ height: 1, background: 'var(--line)', marginBottom: 48 }} />

        {/* ================= BANNER ================= */}
        <div>
          <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-soft)', marginBottom: 12 }}>
            Banner actual {previewBanner && '· vista previa'}
          </div>

          {/* Preview del banner con los botones encima (los textos/CTA no cambian) */}
          <div style={{
            position: 'relative', width: '100%', aspectRatio: '16 / 7', borderRadius: 14, overflow: 'hidden',
            border: '1px solid var(--line)', background: 'var(--surface-2)',
          }}>
            {!loading && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={shownBanner} alt="Banner" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
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
            ref={bannerInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={e => pickBanner(e.target.files?.[0] ?? null)} style={{ display: 'none' }}
          />

          <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap', alignItems: 'center' }}>
            <button onClick={() => bannerInputRef.current?.click()} disabled={busyBanner} style={{
              padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 500,
              background: 'transparent', border: '1px solid var(--line)', color: 'var(--fg)', cursor: busyBanner ? 'wait' : 'pointer',
            }}>Elegir imagen de banner…</button>

            {fileBanner && (
              <button onClick={uploadBanner} disabled={busyBanner} style={{
                padding: '10px 22px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                background: 'var(--brand-orange)', color: '#fff', border: 'none', cursor: busyBanner ? 'wait' : 'pointer', opacity: busyBanner ? 0.7 : 1,
              }}>{busyBanner ? 'Subiendo…' : 'Guardar banner'}</button>
            )}

            {fileBanner && (
              <span style={{ fontSize: 12.5, color: 'var(--fg-soft)' }}>{fileBanner.name}</span>
            )}

            {!fileBanner && currentBanner && (
              <button onClick={resetDefaultBanner} disabled={busyBanner} style={{
                padding: '10px 18px', borderRadius: 8, fontSize: 12.5, fontWeight: 500,
                background: 'transparent', border: '1px solid var(--line)', color: 'var(--fg-muted)', cursor: busyBanner ? 'wait' : 'pointer', marginLeft: 'auto',
              }}>Volver al banner por defecto</button>
            )}
          </div>

          <p style={{ fontSize: 12, color: 'var(--fg-soft)', marginTop: 14, lineHeight: 1.5 }}>
            Recomendado: imagen apaisada (horizontal), mínimo 1600px de ancho, en JPG o WebP. Máximo 6 MB.
          </p>
        </div>

        <div style={{ height: 1, background: 'var(--line)', margin: '48px 0' }} />

        {/* ================= TEXTOS DE LA HOME ================= */}
        <div>
          <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-soft)', marginBottom: 4 }}>
            Textos de la home
          </div>
          <p style={{ fontSize: 12.5, color: 'var(--fg-soft)', marginBottom: 24, lineHeight: 1.5 }}>
            Si dejás un campo vacío, la tienda usa el texto por defecto (nunca queda en blanco).
          </p>

          {/* Frase del final */}
          <label style={labelStyle}>Frase del final <span style={{ textTransform: 'none', letterSpacing: 0, color: 'var(--fg-muted)' }}>· la cita al pie de la página de inicio</span></label>
          <textarea
            value={texts.editorialQuote}
            onChange={e => setTexts(t => ({ ...t, editorialQuote: e.target.value }))}
            placeholder={TEXT_DEFAULTS.editorialQuote} rows={2} maxLength={MAX_LEN}
            style={fieldStyle}
          />
          <CharCount value={texts.editorialQuote} style={{ marginBottom: 16 }} />

          {/* Autor / subtítulo de la frase (opcional) */}
          <label style={labelStyle}>Autor / subtítulo <span style={{ textTransform: 'none', letterSpacing: 0, color: 'var(--fg-muted)' }}>· opcional — el autor de la cita u otra línea debajo</span></label>
          <input
            value={texts.editorialQuoteAuthor}
            onChange={e => setTexts(t => ({ ...t, editorialQuoteAuthor: e.target.value }))}
            placeholder="Ej: — Rumi   ·   dejalo vacío para no mostrar nada" maxLength={MAX_LEN}
            style={fieldStyle}
          />
          <CharCount value={texts.editorialQuoteAuthor} style={{ marginBottom: 28 }} />

          {/* Sección Edición Limitada */}
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg)', marginBottom: 4 }}>Sección “Edición Limitada”</div>
          <p style={{ fontSize: 12, color: 'var(--fg-soft)', marginBottom: 16 }}>El bloque grande con imagen y texto de la home.</p>

          <label style={labelStyle}>Sobretítulo</label>
          <input value={texts.limitedOverline} onChange={e => setTexts(t => ({ ...t, limitedOverline: e.target.value }))}
            placeholder={TEXT_DEFAULTS.limitedOverline} maxLength={MAX_LEN} style={fieldStyle} />
          <CharCount value={texts.limitedOverline} style={{ marginBottom: 16 }} />

          <label style={labelStyle}>Título</label>
          <input value={texts.limitedTitle} onChange={e => setTexts(t => ({ ...t, limitedTitle: e.target.value }))}
            placeholder={TEXT_DEFAULTS.limitedTitle} maxLength={MAX_LEN} style={fieldStyle} />
          <CharCount value={texts.limitedTitle} style={{ marginBottom: 16 }} />

          <label style={labelStyle}>Párrafo</label>
          <textarea value={texts.limitedText} onChange={e => setTexts(t => ({ ...t, limitedText: e.target.value }))}
            placeholder={TEXT_DEFAULTS.limitedText} rows={3} maxLength={MAX_LEN} style={fieldStyle} />
          <CharCount value={texts.limitedText} style={{ marginBottom: 16 }} />

          <label style={labelStyle}>Texto del botón</label>
          <input value={texts.limitedCtaText} onChange={e => setTexts(t => ({ ...t, limitedCtaText: e.target.value }))}
            placeholder={TEXT_DEFAULTS.limitedCtaText} maxLength={MAX_LEN} style={fieldStyle} />
          <CharCount value={texts.limitedCtaText} style={{ marginBottom: 20 }} />

          <button onClick={saveTexts} disabled={savingTexts} style={{
            padding: '10px 24px', borderRadius: 8, fontSize: 13, fontWeight: 600,
            background: 'var(--brand-orange)', color: '#fff', border: 'none',
            cursor: savingTexts ? 'wait' : 'pointer', opacity: savingTexts ? 0.7 : 1,
          }}>{savingTexts ? 'Guardando…' : 'Guardar textos'}</button>
        </div>

        {/* Imagen de la sección Edición Limitada */}
        <div style={{ marginTop: 40 }}>
          <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-soft)', marginBottom: 12 }}>
            Imagen de la sección “Edición Limitada” {previewLimitedImg && '· vista previa'}
          </div>

          <div style={{
            position: 'relative', width: '100%', aspectRatio: '16 / 10', borderRadius: 14, overflow: 'hidden',
            border: '1px solid var(--line)', background: 'var(--surface-2)', maxWidth: 460,
          }}>
            {!loading && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={shownLimitedImg} alt="Imagen de la sección" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            )}
          </div>

          <input
            ref={limitedImgInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={e => pickLimitedImg(e.target.files?.[0] ?? null)} style={{ display: 'none' }}
          />

          <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap', alignItems: 'center' }}>
            <button onClick={() => limitedImgInputRef.current?.click()} disabled={busyLimitedImg} style={{
              padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 500,
              background: 'transparent', border: '1px solid var(--line)', color: 'var(--fg)', cursor: busyLimitedImg ? 'wait' : 'pointer',
            }}>Elegir imagen…</button>

            {fileLimitedImg && (
              <button onClick={uploadLimitedImg} disabled={busyLimitedImg} style={{
                padding: '10px 22px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                background: 'var(--brand-orange)', color: '#fff', border: 'none', cursor: busyLimitedImg ? 'wait' : 'pointer', opacity: busyLimitedImg ? 0.7 : 1,
              }}>{busyLimitedImg ? 'Subiendo…' : 'Guardar imagen'}</button>
            )}

            {fileLimitedImg && <span style={{ fontSize: 12.5, color: 'var(--fg-soft)' }}>{fileLimitedImg.name}</span>}

            {!fileLimitedImg && currentLimitedImg && (
              <button onClick={resetLimitedImg} disabled={busyLimitedImg} style={{
                padding: '10px 18px', borderRadius: 8, fontSize: 12.5, fontWeight: 500,
                background: 'transparent', border: '1px solid var(--line)', color: 'var(--fg-muted)', cursor: busyLimitedImg ? 'wait' : 'pointer', marginLeft: 'auto',
              }}>Volver a la imagen por defecto</button>
            )}
          </div>
          <p style={{ fontSize: 12, color: 'var(--fg-soft)', marginTop: 14, lineHeight: 1.5 }}>
            Recomendado: imagen apaisada, en JPG o WebP. Máximo 6 MB.
          </p>
        </div>

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
