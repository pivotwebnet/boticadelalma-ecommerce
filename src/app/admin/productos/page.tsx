'use client'

import { useEffect, useState, useCallback } from 'react'
import { ApiProduct, ApiCategory } from '@/lib/api'

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
  tone: string; label: string; tags: string; imageUrl: string; isNew: boolean; isActive: boolean
}

const EMPTY_FORM: FormState = {
  id: '', name: '', categoryId: '', price: '', originalPrice: '',
  tone: 'stone', label: '', tags: '', imageUrl: '', isNew: false, isActive: true,
}

function productToForm(p: ApiProduct): FormState {
  return {
    id: p.id, name: p.name, categoryId: p.categoryId,
    price: String(p.price), originalPrice: p.originalPrice ? String(p.originalPrice) : '',
    tone: p.tone, label: p.label, tags: Array.isArray(p.tags) ? p.tags.join(', ') : '',
    imageUrl: p.imageUrl ?? '',
    isNew: p.isNew, isActive: p.isActive,
  }
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

  const filtered = products.filter(p => {
    const q = search.toLowerCase()
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)
    const matchCat = !catFilter || p.categoryId === catFilter
    return matchSearch && matchCat
  })

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
    if (!form.id.trim() || !form.name.trim() || !form.categoryId || !form.price) {
      setError('ID, nombre, categoría y precio son obligatorios.')
      return
    }
    setSaving(true)
    const body = {
      id: form.id.trim(),
      name: form.name.trim(),
      categoryId: form.categoryId,
      price: parseInt(form.price) || 0,
      originalPrice: form.originalPrice ? parseInt(form.originalPrice) : null,
      tone: form.tone,
      label: form.label.trim(),
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      imageUrl: form.imageUrl.trim() || null,
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
        if (!res.ok) { setError('Error al actualizar producto.'); return }
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
    try {
      await fetch(`/api/admin/products/${deleteId}`, { method: 'DELETE' })
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

      {/* Table */}
      <div style={{ padding: '0 40px 40px' }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--fg-muted)', fontSize: 13 }}>Cargando productos…</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--fg-muted)', fontSize: 13 }}>No hay productos.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['ID', 'Nombre', 'Categoría', 'Precio', 'Etiqueta', 'Estado', 'Acciones'].map(h => (
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
                  <tr key={p.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--line-soft)' : 'none' }}>
                    <td style={{ padding: '13px 16px', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-soft)' }}>{p.id}</td>
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
                    <td style={{ padding: '13px 16px' }}>
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
              <Input label="ID (slug único)" value={form.id} onChange={v => setF('id', v)} disabled={modal === 'edit'} />
              <Input label="Nombre" value={form.name} onChange={v => setF('name', v)} />
              <Select label="Categoría" value={form.categoryId} onChange={v => setF('categoryId', v)}
                options={categories.map(c => ({ value: c.id, label: c.name }))} />
              <Select label="Tono de color" value={form.tone} onChange={v => setF('tone', v)}
                options={TONES.map(t => ({ value: t.value, label: t.label }))} />
              <Input label="Precio (ARS)" value={form.price} onChange={v => setF('price', v)} type="number" />
              <Input label="Precio original (opcional)" value={form.originalPrice} onChange={v => setF('originalPrice', v)} type="number" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16, marginBottom: 20 }}>
              <Input label="Etiqueta (ej: collar · plata)" value={form.label} onChange={v => setF('label', v)} />
              <Input label="Tags (separados por coma — materiales e intenciones)" value={form.tags} onChange={v => setF('tags', v)} />
              <Input label="URL de imagen (Unsplash u otra)" value={form.imageUrl} onChange={v => setF('imageUrl', v)} />
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
    </div>
  )
}
