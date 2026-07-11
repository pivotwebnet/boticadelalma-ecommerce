'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { ApiProduct, ApiCategory } from '@/lib/api'

const MAX_IMAGES = 6

function fmt(n: number) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n)
}

const TONES = [
  { value: 'stone',  label: 'Piedra  — plata / neutro'   },
  { value: 'ember',  label: 'Ámbar   — dorado / cálido'  },
  { value: 'rose',   label: 'Rosado  — amor / cuarzo'    },
  { value: 'indigo', label: 'Índigo  — protección'       },
  { value: 'sage',   label: 'Salvia  — calma / verde'    },
  { value: 'moss',   label: 'Musgo   — natural / tierra' },
  { value: 'cream',  label: 'Crema   — neutro suave'     },
  { value: 'clay',   label: 'Arcilla — gamuza / tierra'  },
]

type FormState = {
  id: string; name: string; categoryId: string; price: string; originalPrice: string
  stock: string
  tone: string; label: string; tags: string; images: string[]; isNew: boolean; isActive: boolean
}

const EMPTY_FORM: FormState = {
  id: '', name: '', categoryId: '', price: '', originalPrice: '', stock: '0',
  tone: 'stone', label: '', tags: '', images: [], isNew: false, isActive: true,
}

function productToForm(p: ApiProduct): FormState {
  return {
    id: p.id, name: p.name, categoryId: p.categoryId,
    price: String(p.price), originalPrice: p.originalPrice ? String(p.originalPrice) : '',
    stock: String(p.stock ?? 0),
    tone: p.tone, label: p.label, tags: Array.isArray(p.tags) ? p.tags.join(', ') : '',
    images: Array.isArray(p.images) && p.images.length > 0 ? p.images : (p.imageUrl ? [p.imageUrl] : []),
    isNew: p.isNew, isActive: p.isActive,
  }
}

// Subida de fotos del producto: hasta MAX_IMAGES, solo las cargadas se guardan.
// La primera es la portada.
function ImageUploader({ images, onChange }: { images: string[]; onChange: (imgs: string[]) => void }) {
  const [uploading, setUploading] = useState(false)
  const [err, setErr] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  async function onFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setErr('')
    const room = MAX_IMAGES - images.length
    if (room <= 0) { setErr(`Máximo ${MAX_IMAGES} fotos.`); return }
    const list = Array.from(files).slice(0, room)
    setUploading(true)
    try {
      const uploaded: string[] = []
      for (const f of list) {
        if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(f.type)) {
          setErr('Formato no permitido. Usá JPG, PNG, WebP o AVIF.'); continue
        }
        if (f.size > 6 * 1024 * 1024) { setErr('Cada imagen debe pesar máximo 6 MB.'); continue }
        const fd = new FormData(); fd.append('file', f)
        const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
        const d = await res.json().catch(() => ({}))
        if (res.ok && d?.url) uploaded.push(d.url)
        else setErr(d?.error ?? 'No se pudo subir una imagen.')
      }
      if (uploaded.length) onChange([...images, ...uploaded])
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const remove = (i: number) => onChange(images.filter((_, idx) => idx !== i))
  const makeCover = (i: number) => {
    if (i === 0) return
    const next = [...images]
    const [x] = next.splice(i, 1)
    next.unshift(x)
    onChange(next)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <label style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-soft)' }}>
        Fotos del producto ({images.length}/{MAX_IMAGES}) · la primera es la portada
      </label>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {images.map((src, i) => (
          <div key={src + i} style={{
            position: 'relative', width: 84, height: 84, borderRadius: 8, overflow: 'hidden',
            border: i === 0 ? '2px solid var(--brand-orange)' : '1px solid var(--line)',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={`Foto ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            {i === 0 && (
              <span style={{ position: 'absolute', top: 0, left: 0, right: 0, fontSize: 9, textAlign: 'center', background: 'var(--brand-orange)', color: '#fff', padding: '1px 0', letterSpacing: '0.05em' }}>PORTADA</span>
            )}
            <button type="button" onClick={() => remove(i)} title="Quitar" style={{
              position: 'absolute', top: 3, right: 3, width: 18, height: 18, borderRadius: '50%',
              border: 'none', background: 'rgba(0,0,0,.65)', color: '#fff', cursor: 'pointer', fontSize: 12, lineHeight: 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>×</button>
            {i !== 0 && (
              <button type="button" onClick={() => makeCover(i)} title="Hacer portada" style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, fontSize: 9, border: 'none',
                background: 'rgba(0,0,0,.6)', color: '#fff', cursor: 'pointer', padding: '2px 0',
              }}>Hacer portada</button>
            )}
          </div>
        ))}
        {images.length < MAX_IMAGES && (
          <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} style={{
            width: 84, height: 84, borderRadius: 8, border: '1px dashed var(--line)',
            background: 'transparent', color: 'var(--fg-soft)', cursor: uploading ? 'wait' : 'pointer',
            fontSize: 11, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
          }}>
            <span style={{ fontSize: 20, lineHeight: 1 }}>＋</span>
            {uploading ? 'Subiendo…' : 'Agregar'}
          </button>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple
        onChange={e => onFiles(e.target.files)} style={{ display: 'none' }} />
      {err && <span style={{ fontSize: 12, color: '#e06557' }}>{err}</span>}
    </div>
  )
}

// Devuelve un entero >= 0 o null si el texto no es un entero válido.
function parsePositiveInt(s: string): number | null {
  const n = Number(s)
  if (!Number.isInteger(n) || n < 0) return null
  return n
}

// Convierte un nombre en un slug: minúsculas, sin acentos, con guiones.
// "Anillo de Luna ✦" → "anillo-de-luna"
function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')  // saca acentos
    .replace(/[^a-z0-9]+/g, '-')                       // todo lo demás → guión
    .replace(/^-+|-+$/g, '')                            // sin guiones al borde
}

// Garantiza que el slug no choque con uno existente: si "anillo-luna" ya está,
// devuelve "anillo-luna-2", "anillo-luna-3", etc. Así nunca se repiten IDs.
function uniqueSlug(base: string, taken: Set<string>): string {
  const root = base || 'producto'
  if (!taken.has(root)) return root
  let n = 2
  while (taken.has(`${root}-${n}`)) n++
  return `${root}-${n}`
}

function Input({ label, value, onChange, type = 'text', disabled = false }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; disabled?: boolean
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-soft)' }}>{label}</label>
      <input
        type={type} value={value} disabled={disabled}
        onChange={e => onChange(e.target.value)}
        style={{
          background: 'var(--bg)', border: '1px solid var(--line)',
          borderRadius: 7, padding: '8px 12px', fontSize: 13, color: 'var(--fg)',
          outline: 'none', fontFamily: 'inherit',
          opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'text',
        }}
      />
    </div>
  )
}

function Select({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-soft)' }}>{label}</label>
      <select
        value={value} onChange={e => onChange(e.target.value)}
        style={{
          background: 'var(--bg)', border: '1px solid var(--line)',
          borderRadius: 7, padding: '8px 12px', fontSize: 13, color: 'var(--fg)',
          outline: 'none', fontFamily: 'inherit', cursor: 'pointer',
        }}
      >
        <option value="">— Seleccionar —</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 38, height: 20, borderRadius: 999, position: 'relative', flexShrink: 0,
          background: checked ? 'var(--brand-orange)' : 'var(--line)',
          transition: 'background .2s',
        }}
      >
        <div style={{
          position: 'absolute', top: 2, left: checked ? 18 : 2,
          width: 16, height: 16, borderRadius: '50%', background: '#fff',
          transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,.3)',
        }} />
      </div>
      <span style={{ fontSize: 13, color: 'var(--fg-muted)' }}>{label}</span>
    </label>
  )
}

export default function ProductosPage() {
  const [products, setProducts] = useState<ApiProduct[]>([])
  const [categories, setCategories] = useState<ApiCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('')
  const [modal, setModal] = useState<'create' | 'edit' | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  // Ajuste masivo de precios
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [bulkMode, setBulkMode] = useState<'discount' | 'increase'>('discount')
  const [bulkPct, setBulkPct] = useState('')
  const [bulkConfirm, setBulkConfirm] = useState(false)
  const [bulkBusy, setBulkBusy] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const [p, c] = await Promise.all([
      fetch('/api/admin/products').then(r => r.json()).catch(() => []),
      fetch('/api/admin/categories').then(r => r.json()).catch(() => []),
    ])
    setProducts(Array.isArray(p) ? p : [])
    setCategories(Array.isArray(c) ? c : [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  // Lee filtros desde la URL (al venir enlazado desde el dashboard).
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search)
    const s = sp.get('search'); if (s) setSearch(s)
    const c = sp.get('cat'); if (c) setCatFilter(c)
  }, [])

  const filtered = products.filter(p => {
    const q = search.toLowerCase()
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)
    const matchCat = !catFilter || p.categoryId === catFilter
    return matchSearch && matchCat
  })

  // Productos a los que se aplica el ajuste: los tildados, o —si no hay ninguno
  // tildado— todos los que están filtrados a la vista.
  const targetIds = selected.size > 0
    ? products.filter(p => selected.has(p.id)).map(p => p.id)
    : filtered.map(p => p.id)

  const toggleOne = (id: string) => setSelected(s => {
    const n = new Set(s)
    if (n.has(id)) n.delete(id); else n.add(id)
    return n
  })
  const allFilteredSelected = filtered.length > 0 && filtered.every(p => selected.has(p.id))
  const toggleAllFiltered = () => setSelected(s => {
    const n = new Set(s)
    if (allFilteredSelected) filtered.forEach(p => n.delete(p.id))
    else filtered.forEach(p => n.add(p.id))
    return n
  })

  async function applyBulk() {
    const pct = parseInt(bulkPct)
    if (!Number.isInteger(pct) || pct < 1) return
    setBulkBusy(true)
    setError('')
    try {
      const res = await fetch('/api/admin/products/bulk-price', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds: targetIds, percent: pct, mode: bulkMode }),
      })
      const d = await res.json().catch(() => ({}))
      if (res.ok) {
        setNotice(`Se aplicó un ${bulkMode === 'discount' ? 'descuento' : 'aumento'} del ${pct}% a ${d?.updated ?? targetIds.length} producto(s).`)
        setBulkConfirm(false); setBulkPct(''); setSelected(new Set())
        await load()
      } else {
        setError(d?.error ?? 'No se pudo aplicar el ajuste.')
        setBulkConfirm(false)
      }
    } finally {
      setBulkBusy(false)
    }
  }

  function openCreate() {
    setForm(EMPTY_FORM)
    setError('')
    setModal('create')
  }
  function openEdit(p: ApiProduct) {
    setForm(productToForm(p))
    setError('')
    setModal('edit')
  }
  function closeModal() { setModal(null); setError('') }

  function setF<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm(f => ({ ...f, [key]: val }))
  }

  async function handleSave() {
    setError('')
    if (!form.name.trim() || !form.categoryId || !form.price) {
      setError('Nombre, categoría y precio son obligatorios.')
      return
    }
    // El ID/slug se genera solo a partir del nombre (y se evita repetir uno existente).
    // En edición el ID no cambia nunca.
    const id = modal === 'create'
      ? uniqueSlug(slugify(form.name), new Set(products.map(p => p.id)))
      : form.id
    const price = parsePositiveInt(form.price.trim())
    if (price === null) {
      setError('El precio debe ser un número entero (sin decimales).')
      return
    }
    let originalPrice: number | null = null
    if (form.originalPrice.trim()) {
      originalPrice = parsePositiveInt(form.originalPrice.trim())
      if (originalPrice === null) {
        setError('El precio original debe ser un número entero.')
        return
      }
      if (originalPrice <= price) {
        setError('El precio original (tachado) debe ser mayor que el precio actual.')
        return
      }
    }
    const stock = parsePositiveInt(form.stock.trim() || '0')
    if (stock === null) {
      setError('El stock debe ser un número entero igual o mayor a 0.')
      return
    }
    setSaving(true)
    const body = {
      id,
      name: form.name.trim(),
      categoryId: form.categoryId,
      price,
      originalPrice,
      stock,
      tone: form.tone,
      label: form.label.trim(),
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      images: form.images,
      isNew: form.isNew,
      isActive: form.isActive,
    }
    try {
      if (modal === 'create') {
        const res = await fetch('/api/admin/products', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (!res.ok) {
          const d = await res.json().catch(() => ({}))
          setError(d?.message ?? d?.title ?? 'Error al crear producto.')
          return
        }
      } else {
        const res = await fetch(`/api/admin/products/${form.id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (!res.ok) {
          const d = await res.json().catch(() => ({}))
          setError(d?.error ?? 'Error al actualizar producto.')
          return
        }
      }
      closeModal()
      await load()
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    setNotice('')
    try {
      const res = await fetch(`/api/admin/products/${deleteId}`, { method: 'DELETE' })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data?.softDeleted) {
        setNotice(data.message ?? 'El producto tiene ventas registradas: se desactivó en lugar de eliminarse.')
      }
      setDeleteId(null)
      await load()
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      {/* Header */}
      <div style={{ padding: '32px 40px 24px', borderBottom: '1px solid var(--line)', position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 6 }}>Gestión</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 36, fontWeight: 500, margin: 0, color: 'var(--fg)' }}>Productos</h1>
          <p style={{ margin: '6px 0 0', fontSize: 13, color: 'var(--fg-muted)' }}>{products.length} productos en la base de datos</p>
        </div>
        <button onClick={openCreate} style={{
          padding: '10px 22px', borderRadius: 8, fontSize: 13, fontWeight: 600,
          background: 'var(--brand-orange)', color: '#fff', border: 'none', cursor: 'pointer',
        }}>
          + Nuevo producto
        </button>
        <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, var(--gold), transparent)', opacity: 0.5 }} />
      </div>

      {/* Filters */}
      <div style={{ padding: '20px 40px', display: 'flex', gap: 12, alignItems: 'center' }}>
        <input
          placeholder="Buscar por nombre o ID…"
          value={search} onChange={e => setSearch(e.target.value)}
          style={{
            background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 8,
            padding: '9px 14px', fontSize: 13, color: 'var(--fg)', outline: 'none', width: 280,
          }}
        />
        <select
          value={catFilter} onChange={e => setCatFilter(e.target.value)}
          style={{
            background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 8,
            padding: '9px 14px', fontSize: 13, color: 'var(--fg)', outline: 'none', cursor: 'pointer',
          }}
        >
          <option value="">Todas las categorías</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <span style={{ fontSize: 12, color: 'var(--fg-soft)', marginLeft: 'auto' }}>{filtered.length} resultados</span>
      </div>

      {/* Ajuste masivo de precios */}
      <div style={{ padding: '0 40px 16px', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 10, padding: '8px 12px' }}>
          <span style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--fg-soft)' }}>Ajuste de precios</span>
          <div style={{ display: 'flex', gap: 4 }}>
            {(['discount', 'increase'] as const).map(m => (
              <button key={m} onClick={() => setBulkMode(m)} style={{
                padding: '5px 12px', borderRadius: 999, fontSize: 12, fontWeight: 500, cursor: 'pointer',
                border: bulkMode === m ? 'none' : '1px solid var(--line)',
                background: bulkMode === m ? (m === 'discount' ? 'rgba(155,174,136,.18)' : 'rgba(201,161,122,.18)') : 'transparent',
                color: bulkMode === m ? (m === 'discount' ? '#9bae88' : '#c9a17a') : 'var(--fg-muted)',
              }}>{m === 'discount' ? 'Descuento' : 'Aumento'}</button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <input
              type="number" min={1} max={bulkMode === 'discount' ? 99 : 1000} value={bulkPct}
              onChange={e => setBulkPct(e.target.value)} placeholder="0"
              style={{ width: 58, background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: 7, padding: '7px 10px', fontSize: 13, color: 'var(--fg)', outline: 'none', textAlign: 'right' }}
            />
            <span style={{ fontSize: 14, color: 'var(--fg-muted)', fontWeight: 600 }}>%</span>
          </div>
          <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>
            a {selected.size > 0 ? <strong style={{ color: 'var(--fg)' }}>{selected.size} seleccionado{selected.size === 1 ? '' : 's'}</strong> : <>todos los filtrados ({filtered.length})</>}
          </span>
          <button
            disabled={!bulkPct || parseInt(bulkPct) < 1 || targetIds.length === 0}
            onClick={() => setBulkConfirm(true)}
            style={{
              padding: '7px 16px', borderRadius: 7, fontSize: 12.5, fontWeight: 600, border: 'none',
              background: (!bulkPct || parseInt(bulkPct) < 1 || targetIds.length === 0) ? 'var(--line)' : 'var(--brand-orange)',
              color: (!bulkPct || parseInt(bulkPct) < 1 || targetIds.length === 0) ? 'var(--fg-soft)' : '#fff',
              cursor: (!bulkPct || parseInt(bulkPct) < 1 || targetIds.length === 0) ? 'not-allowed' : 'pointer',
            }}>Aplicar</button>
        </div>
        {selected.size > 0 && (
          <button onClick={() => setSelected(new Set())} style={{
            padding: '7px 14px', borderRadius: 7, fontSize: 12, fontWeight: 500,
            background: 'transparent', border: '1px solid var(--line)', color: 'var(--fg-muted)', cursor: 'pointer',
          }}>Limpiar selección</button>
        )}
      </div>

      {error && !modal && (
        <div style={{ margin: '0 40px 8px', padding: '10px 14px', background: 'rgba(224,101,87,.12)', border: '1px solid rgba(224,101,87,.3)', borderRadius: 8, fontSize: 13, color: '#e06557', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{error}</span>
          <button onClick={() => setError('')} style={{ background: 'none', border: 'none', color: 'var(--fg-soft)', cursor: 'pointer', fontSize: 16 }}>×</button>
        </div>
      )}

      {notice && (
        <div style={{ margin: '0 40px 8px', padding: '10px 14px', background: 'rgba(201,161,122,.12)', border: '1px solid rgba(201,161,122,.3)', borderRadius: 8, fontSize: 13, color: '#c9a17a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{notice}</span>
          <button onClick={() => setNotice('')} style={{ background: 'none', border: 'none', color: 'var(--fg-soft)', cursor: 'pointer', fontSize: 16 }}>×</button>
        </div>
      )}

      {/* Table */}
      <div style={{ padding: '0 40px 40px' }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12, overflowX: 'auto' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--fg-muted)', fontSize: 13 }}>Cargando productos…</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--fg-muted)', fontSize: 13 }}>No hay productos.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--line)', width: 36 }}>
                    <input type="checkbox" checked={allFilteredSelected} onChange={toggleAllFiltered}
                      title="Seleccionar todos los filtrados" style={{ cursor: 'pointer', accentColor: 'var(--brand-orange)' }} />
                  </th>
                  {['ID', 'Nombre', 'Categoría', 'Precio', 'Stock', 'Etiqueta', 'Estado', 'Acciones'].map(h => (
                    <th key={h} style={{
                      textAlign: 'left', padding: '12px 16px',
                      fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase',
                      color: 'var(--fg-soft)', borderBottom: '1px solid var(--line)', fontWeight: 500,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={p.id} style={{
                    borderBottom: i < filtered.length - 1 ? '1px solid var(--line-soft)' : 'none',
                    background: selected.has(p.id) ? 'rgba(232,99,21,0.05)' : 'transparent',
                  }}>
                    <td style={{ padding: '13px 16px', width: 36 }}>
                      <input type="checkbox" checked={selected.has(p.id)} onChange={() => toggleOne(p.id)}
                        style={{ cursor: 'pointer', accentColor: 'var(--brand-orange)' }} />
                    </td>
                    <td style={{ padding: '13px 16px', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-soft)' }}>
                      <div title={p.id} style={{ maxWidth: 160, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.id}</div>
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--fg)' }}>{p.name}</div>
                      {p.isNew && <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 4, background: 'rgba(102,134,231,.15)', color: '#6686e7' }}>NUEVO</span>}
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: 12.5, color: 'var(--fg-muted)' }}>
                      {categories.find(c => c.id === p.categoryId)?.name ?? p.categoryId}
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 600, color: 'var(--fg)', fontVariantNumeric: 'tabular-nums' }}>
                      {fmt(p.price)}
                      {p.originalPrice && (
                        <div style={{ fontSize: 11, color: 'var(--fg-soft)', textDecoration: 'line-through' }}>{fmt(p.originalPrice)}</div>
                      )}
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: p.stock === 0 ? '#e06557' : p.stock <= 3 ? '#c9a17a' : 'var(--fg)' }}>
                      {p.stock === 0 ? 'Agotado' : p.stock}
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: 12, color: 'var(--fg-muted)' }}>{p.label}</td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        padding: '3px 9px', borderRadius: 999, fontSize: 11,
                        background: p.isActive ? 'rgba(155,174,136,.15)' : 'rgba(255,255,255,.06)',
                        color: p.isActive ? '#9bae88' : 'var(--fg-soft)',
                      }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: p.isActive ? '#9bae88' : 'var(--fg-soft)' }} />
                        {p.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td style={{ padding: '13px 16px', width: 1, whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => openEdit(p)} style={{
                          padding: '5px 14px', borderRadius: 6, fontSize: 12, fontWeight: 500,
                          background: 'transparent', border: '1px solid var(--line)',
                          color: 'var(--fg-muted)', cursor: 'pointer',
                        }}>Editar</button>
                        <button onClick={() => setDeleteId(p.id)} style={{
                          padding: '5px 14px', borderRadius: 6, fontSize: 12, fontWeight: 500,
                          background: 'transparent', border: '1px solid rgba(224,101,87,.3)',
                          color: '#e06557', cursor: 'pointer',
                        }}>Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Create / Edit Modal */}
      {modal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 10000,
          background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 24,
        }} onClick={e => { if (e.target === e.currentTarget) closeModal() }}>
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--line)',
            borderRadius: 14, width: '100%', maxWidth: 600, maxHeight: '90vh',
            overflow: 'auto', padding: 32,
          }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 500, color: 'var(--fg)', marginBottom: 24 }}>
              {modal === 'create' ? 'Nuevo producto' : 'Editar producto'}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <Input label="Nombre" value={form.name} onChange={v => setF('name', v)} />
              {modal === 'edit'
                ? <Input label="ID (no se puede cambiar)" value={form.id} onChange={() => {}} disabled />
                : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <label style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-soft)' }}>ID (se genera solo)</label>
                    <div style={{
                      background: 'var(--bg)', border: '1px dashed var(--line)', borderRadius: 7,
                      padding: '8px 12px', fontSize: 13, color: 'var(--fg-soft)', fontFamily: 'var(--font-mono)',
                      minHeight: 19, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {form.name.trim()
                        ? uniqueSlug(slugify(form.name), new Set(products.map(p => p.id)))
                        : '—'}
                    </div>
                  </div>
                )}
              <Select label="Categoría" value={form.categoryId} onChange={v => setF('categoryId', v)}
                options={categories.map(c => ({ value: c.id, label: c.name }))} />
              <Select label="Tono de color" value={form.tone} onChange={v => setF('tone', v)}
                options={TONES.map(t => ({ value: t.value, label: t.label }))} />
              <Input label="Precio (ARS)" value={form.price} onChange={v => setF('price', v)} type="number" />
              <Input label="Precio original (opcional, debe ser mayor)" value={form.originalPrice} onChange={v => setF('originalPrice', v)} type="number" />
              <Input label="Stock disponible" value={form.stock} onChange={v => setF('stock', v)} type="number" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16, marginBottom: 20 }}>
              <Input label="Etiqueta (ej: collar · plata)" value={form.label} onChange={v => setF('label', v)} />
              <Input label="Tags (separados por coma — materiales e intenciones)" value={form.tags} onChange={v => setF('tags', v)} />
              <ImageUploader images={form.images} onChange={imgs => setF('images', imgs)} />
            </div>

            <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
              <Toggle label="Producto nuevo" checked={form.isNew} onChange={v => setF('isNew', v)} />
              <Toggle label="Activo" checked={form.isActive} onChange={v => setF('isActive', v)} />
            </div>

            {error && (
              <div style={{ padding: '10px 14px', background: 'rgba(224,101,87,.12)', border: '1px solid rgba(224,101,87,.3)', borderRadius: 7, fontSize: 13, color: '#e06557', marginBottom: 16 }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={closeModal} style={{
                padding: '9px 20px', borderRadius: 7, fontSize: 13, fontWeight: 500,
                background: 'transparent', border: '1px solid var(--line)', color: 'var(--fg-muted)', cursor: 'pointer',
              }}>Cancelar</button>
              <button onClick={handleSave} disabled={saving} style={{
                padding: '9px 24px', borderRadius: 7, fontSize: 13, fontWeight: 600,
                background: 'var(--brand-orange)', color: '#fff', border: 'none', cursor: saving ? 'wait' : 'pointer',
                opacity: saving ? 0.7 : 1,
              }}>{saving ? 'Guardando…' : 'Guardar'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 10000,
          background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--line)',
            borderRadius: 12, padding: 32, maxWidth: 400, width: '90%',
          }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, color: 'var(--fg)', marginBottom: 12 }}>¿Eliminar producto?</div>
            <p style={{ fontSize: 13, color: 'var(--fg-muted)', margin: '0 0 24px' }}>
              Se eliminará el producto <strong style={{ color: 'var(--fg)', fontFamily: 'var(--font-mono)' }}>{deleteId}</strong>. Esta acción no se puede deshacer.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setDeleteId(null)} style={{
                padding: '9px 20px', borderRadius: 7, fontSize: 13, fontWeight: 500,
                background: 'transparent', border: '1px solid var(--line)', color: 'var(--fg-muted)', cursor: 'pointer',
              }}>Cancelar</button>
              <button onClick={handleDelete} disabled={deleting} style={{
                padding: '9px 20px', borderRadius: 7, fontSize: 13, fontWeight: 600,
                background: '#c0392b', color: '#fff', border: 'none', cursor: deleting ? 'wait' : 'pointer',
              }}>{deleting ? 'Eliminando…' : 'Sí, eliminar'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmación de ajuste masivo de precios */}
      {bulkConfirm && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 10000,
          background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
        }} onClick={e => { if (e.target === e.currentTarget && !bulkBusy) setBulkConfirm(false) }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12, padding: 32, maxWidth: 440, width: '90%' }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, color: 'var(--fg)', marginBottom: 12 }}>
              {bulkMode === 'discount' ? 'Aplicar descuento' : 'Aplicar aumento'}
            </div>
            <p style={{ fontSize: 13.5, color: 'var(--fg-muted)', margin: '0 0 8px', lineHeight: 1.5 }}>
              Se va a aplicar un <strong style={{ color: 'var(--fg)' }}>{bulkMode === 'discount' ? 'descuento' : 'aumento'} del {parseInt(bulkPct) || 0}%</strong> sobre{' '}
              <strong style={{ color: 'var(--fg)' }}>{targetIds.length} producto{targetIds.length === 1 ? '' : 's'}</strong>{' '}
              ({selected.size > 0 ? 'los seleccionados' : 'todos los filtrados'}).
            </p>
            <p style={{ fontSize: 12.5, color: 'var(--fg-soft)', margin: '0 0 24px', lineHeight: 1.5 }}>
              {bulkMode === 'discount'
                ? 'El precio anterior queda tachado como precio de lista y se muestra como oferta en la tienda.'
                : 'Sube el precio de venta. Si algún producto estaba en oferta y el aumento alcanza el precio de lista, deja de mostrarse como oferta.'}
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setBulkConfirm(false)} disabled={bulkBusy} style={{
                padding: '9px 20px', borderRadius: 7, fontSize: 13, fontWeight: 500,
                background: 'transparent', border: '1px solid var(--line)', color: 'var(--fg-muted)', cursor: bulkBusy ? 'wait' : 'pointer',
              }}>Cancelar</button>
              <button onClick={applyBulk} disabled={bulkBusy} style={{
                padding: '9px 22px', borderRadius: 7, fontSize: 13, fontWeight: 600,
                background: 'var(--brand-orange)', color: '#fff', border: 'none', cursor: bulkBusy ? 'wait' : 'pointer', opacity: bulkBusy ? 0.7 : 1,
              }}>{bulkBusy ? 'Aplicando…' : 'Confirmar'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
