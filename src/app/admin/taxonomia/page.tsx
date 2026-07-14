'use client'

import { useEffect, useRef, useState } from 'react'
import { slugify } from '@/lib/utils'
import { resolveCard, BUILTIN_ICONS, IntentionArt } from '@/lib/intention-art'

interface Tax {
  materials: string[]
  intentions: string[]
  sizes: string[]
  intentionArt: Record<string, IntentionArt>
}

// ── Editor simple de lista (materiales / tamaños) ──────────────────────────────
function ChipList({ title, help, placeholder, items, onAdd, onRemove }: {
  title: string; help: string; placeholder: string
  items: string[]; onAdd: (v: string) => void; onRemove: (v: string) => void
}) {
  const [draft, setDraft] = useState('')
  const add = () => { const v = draft.trim(); if (v) { onAdd(v); setDraft('') } }
  return (
    <section style={cardStyle}>
      <h2 style={{ margin: 0, fontSize: 17, fontWeight: 600, color: 'var(--fg)' }}>{title}</h2>
      <p style={{ margin: '4px 0 0', fontSize: 12.5, color: 'var(--fg-soft)' }}>{help}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '16px 0' }}>
        {items.map(item => (
          <span key={item} style={chipStyle}>
            {item}
            <button onClick={() => onRemove(item)} aria-label={`Quitar ${item}`} style={chipX}>×</button>
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input value={draft} onChange={e => setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add() } }}
          placeholder={placeholder} style={inputStyle} />
        <button onClick={add} style={btnGhost}>Agregar</button>
      </div>
    </section>
  )
}

// ── Editor de arte de una intención ────────────────────────────────────────────
function IntentionRow({ name, index, art, onArt, onRemove, onUpload }: {
  name: string; index: number; art: IntentionArt
  onArt: (patch: Partial<IntentionArt>) => void
  onRemove: () => void
  onUpload: (file: File) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const card = resolveCard(name, index, art)   // valores efectivos actuales

  return (
    <div style={{ border: '1px solid var(--line)', borderRadius: 12, padding: 16, display: 'grid', gridTemplateColumns: '150px 1fr', gap: 18 }}>
      {/* Preview */}
      <div>
        <div style={{
          borderRadius: 16, background: card.bg, padding: '20px 12px', textAlign: 'center',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, minHeight: 150, justifyContent: 'center',
        }}>
          {card.iconSrc
            ? <img src={card.iconSrc} alt="" width={34} height={32} style={{ objectFit: 'contain' }} />
            : <span style={{ fontSize: 26 }}>✦</span>}
          <strong style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 18, color: '#3a3a3a' }}>{card.title}</strong>
          {card.subtitle && <span style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#3a3a3a', opacity: 0.5 }}>{card.subtitle}</span>}
        </div>
        <button onClick={onRemove} style={{ ...btnGhost, width: '100%', marginTop: 8, color: '#e06557', borderColor: 'rgba(224,101,87,0.4)' }}>
          Quitar intención
        </button>
      </div>

      {/* Controles */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <strong style={{ fontSize: 15, color: 'var(--fg)', textTransform: 'capitalize' }}>{name}</strong>
          {(art.subtitle || art.iconUrl || art.bg || art.hoverBg || art.hoverText) && (
            <button onClick={() => onArt({ subtitle: undefined, iconUrl: undefined, bg: undefined, hoverBg: undefined, hoverText: undefined })}
              style={{ background: 'none', border: 'none', color: 'var(--fg-soft)', fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}>
              Volver al arte por defecto
            </button>
          )}
        </div>

        {/* Subtítulo */}
        <label style={fieldLabel}>Subtítulo
          <input value={art.subtitle ?? ''} onChange={e => onArt({ subtitle: e.target.value })}
            placeholder={resolveCard(name, index, {}).subtitle || 'Ej: Atraer y sostener'} style={inputStyle} />
        </label>

        {/* Colores */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <ColorField label="Fondo"        value={card.bg}        onChange={v => onArt({ bg: v })} />
          <ColorField label="Fondo hover"  value={card.hoverBg}   onChange={v => onArt({ hoverBg: v })} />
          <ColorField label="Texto hover"  value={card.hoverText} onChange={v => onArt({ hoverText: v })} />
        </div>

        {/* Ícono */}
        <div>
          <span style={fieldLabel}>Ícono</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6, alignItems: 'center' }}>
            <button onClick={() => onArt({ iconUrl: undefined })} title="Ícono por defecto (según el nombre)"
              style={{ ...iconBtn, borderColor: !art.iconUrl ? 'var(--brand-orange)' : 'var(--line)', fontSize: 11 }}>
              Auto
            </button>
            {BUILTIN_ICONS.map(slug => {
              const url = `/icons/${slug}.svg`
              const on = art.iconUrl === url
              return (
                <button key={slug} onClick={() => onArt({ iconUrl: url })} title={slug}
                  style={{ ...iconBtn, borderColor: on ? 'var(--brand-orange)' : 'var(--line)' }}>
                  <img src={url} alt={slug} width={20} height={20} style={{ objectFit: 'contain' }} />
                </button>
              )
            })}
            <button onClick={() => fileRef.current?.click()} style={{ ...iconBtn, fontSize: 11 }}>Subir…</button>
            <input ref={fileRef} type="file" accept="image/png,image/webp" hidden
              onChange={e => { const f = e.target.files?.[0]; if (f) onUpload(f); e.target.value = '' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 11, color: 'var(--fg-soft)' }}>
      {label}
      <input type="color" value={value} onChange={e => onChange(e.target.value)}
        style={{ width: 52, height: 32, padding: 0, border: '1px solid var(--line)', borderRadius: 6, background: 'none', cursor: 'pointer' }} />
    </label>
  )
}

export default function TaxonomiaPage() {
  const [tax, setTax] = useState<Tax | null>(null)
  const [draftInt, setDraftInt] = useState('')
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/taxonomia').then(r => r.json())
      .then((t: Tax) => setTax(t))
      .catch(() => setError('No se pudo cargar la configuración.'))
  }, [])

  const addTo = (key: 'materials' | 'sizes' | 'intentions', v: string) => {
    setTax(t => {
      if (!t || t[key].some(x => x.toLowerCase() === v.toLowerCase())) return t
      return { ...t, [key]: [...t[key], v] }
    })
    setNotice('')
  }
  const removeFrom = (key: 'materials' | 'sizes', v: string) => {
    setTax(t => t ? { ...t, [key]: t[key].filter(x => x !== v) } : t); setNotice('')
  }
  const removeIntention = (name: string) => {
    setTax(t => {
      if (!t) return t
      const art = { ...t.intentionArt }; delete art[slugify(name)]
      return { ...t, intentions: t.intentions.filter(x => x !== name), intentionArt: art }
    }); setNotice('')
  }
  const setArt = (slug: string, patch: Partial<IntentionArt>) => {
    setTax(t => {
      if (!t) return t
      const cur: IntentionArt = { ...(t.intentionArt[slug] || {}) }
      for (const [k, v] of Object.entries(patch)) {
        if (v === undefined || v === '') delete (cur as Record<string, unknown>)[k]
        else (cur as Record<string, unknown>)[k] = v
      }
      const art = { ...t.intentionArt }
      if (Object.keys(cur).length) art[slug] = cur; else delete art[slug]
      return { ...t, intentionArt: art }
    }); setNotice('')
  }
  const uploadIcon = async (slug: string, file: File) => {
    setError(''); setNotice('')
    const fd = new FormData(); fd.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    const data = await res.json().catch(() => ({}))
    if (res.ok && data.url) setArt(slug, { iconUrl: data.url })
    else setError(data?.error ?? 'No se pudo subir el ícono.')
  }

  const save = async () => {
    if (!tax) return
    setSaving(true); setError(''); setNotice('')
    try {
      const res = await fetch('/api/admin/taxonomia', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tax),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) { setTax(data); setNotice('Cambios guardados. Se ven en la tienda al recargar.') }
      else setError(data?.error ?? 'No se pudo guardar.')
    } catch { setError('Error de conexión al guardar.') } finally { setSaving(false) }
  }

  return (
    <div>
      <div style={{ padding: '32px 40px 24px', borderBottom: '1px solid var(--line)' }}>
        <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-soft)', marginBottom: 6 }}>Catálogo</div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 30, fontWeight: 500, margin: 0, color: 'var(--fg)' }}>Filtros del catálogo</h1>
        <p style={{ margin: '8px 0 0', color: 'var(--fg-muted)', fontSize: 14, maxWidth: 660 }}>
          Gestioná <strong>Materiales</strong>, <strong>Tamaños</strong> e <strong>Intenciones</strong>. Cada intención
          tiene además su <strong>tarjeta en el inicio</strong>: podés cambiarle el subtítulo, los colores y el ícono.
          Para que un producto aparezca bajo una opción, tiene que tener ese tag (se cargan en Productos).
        </p>
      </div>

      <div style={{ padding: '28px 40px', display: 'flex', flexDirection: 'column', gap: 22, maxWidth: 900 }}>
        {!tax ? <p style={{ color: 'var(--fg-muted)' }}>Cargando…</p> : (
          <>
            <ChipList title="Materiales" help='Casillas del filtro "Material".' placeholder="Ej: Plata, Alpaca…"
              items={tax.materials} onAdd={v => addTo('materials', v)} onRemove={v => removeFrom('materials', v)} />

            <ChipList title="Tamaños" help='Opciones del filtro "Tamaño".' placeholder="Ej: Pequeña, Mediana…"
              items={tax.sizes} onAdd={v => addTo('sizes', v)} onRemove={v => removeFrom('sizes', v)} />

            <section style={cardStyle}>
              <h2 style={{ margin: 0, fontSize: 17, fontWeight: 600, color: 'var(--fg)' }}>Intenciones y sus tarjetas</h2>
              <p style={{ margin: '4px 0 0', fontSize: 12.5, color: 'var(--fg-soft)' }}>
                Cada una es un filtro y también una tarjeta del carrusel del inicio.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, margin: '16px 0' }}>
                {tax.intentions.map((name, i) => (
                  <IntentionRow key={name} name={name} index={i} art={tax.intentionArt[slugify(name)] ?? {}}
                    onArt={patch => setArt(slugify(name), patch)}
                    onRemove={() => removeIntention(name)}
                    onUpload={file => uploadIcon(slugify(name), file)} />
                ))}
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <input value={draftInt} onChange={e => setDraftInt(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); const v = draftInt.trim(); if (v) { addTo('intentions', v); setDraftInt('') } } }}
                  placeholder="Nueva intención (ej: buena suerte)" style={inputStyle} />
                <button onClick={() => { const v = draftInt.trim(); if (v) { addTo('intentions', v); setDraftInt('') } }} style={btnGhost}>Agregar</button>
              </div>
            </section>
          </>
        )}

        {(notice || error) && <p style={{ margin: 0, fontSize: 13.5, color: error ? '#e06557' : 'var(--brand-orange)' }}>{error || notice}</p>}

        <div>
          <button onClick={save} disabled={saving || !tax} style={{
            background: 'var(--brand-orange)', color: '#fff', border: 'none', borderRadius: 8,
            padding: '11px 26px', fontSize: 14, fontWeight: 600, cursor: saving ? 'default' : 'pointer', opacity: saving ? 0.7 : 1,
          }}>{saving ? 'Guardando…' : 'Guardar cambios'}</button>
        </div>
      </div>
    </div>
  )
}

// ── Estilos compartidos ────────────────────────────────────────────────────────
const cardStyle: React.CSSProperties = { background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 14, padding: '20px 22px' }
const chipStyle: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(232,99,21,0.10)', border: '1px solid rgba(232,99,21,0.35)', color: 'var(--brand-orange)', borderRadius: 999, padding: '6px 8px 6px 14px', fontSize: 13 }
const chipX: React.CSSProperties = { background: 'var(--brand-orange)', color: '#fff', border: 'none', borderRadius: '50%', width: 18, height: 18, lineHeight: '16px', fontSize: 13, cursor: 'pointer', padding: 0 }
const inputStyle: React.CSSProperties = { flex: 1, background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: 8, padding: '9px 12px', color: 'var(--fg)', fontSize: 14, fontFamily: 'var(--font-sans)' }
const btnGhost: React.CSSProperties = { background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--fg)', borderRadius: 8, padding: '9px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }
const fieldLabel: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 5, fontSize: 12, color: 'var(--fg-soft)' }
const iconBtn: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: 8, border: '1px solid var(--line)', background: 'var(--bg)', cursor: 'pointer', color: 'var(--fg-muted)', padding: 0 }
