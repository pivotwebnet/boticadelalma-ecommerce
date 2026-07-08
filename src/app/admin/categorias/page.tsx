'use client'

import { useEffect, useState, useCallback } from 'react'
import { ApiCategory } from '@/lib/api'
import { Reorder } from 'framer-motion'

type FormState = { id: string; name: string; icon: string; isActive: boolean }

const EMPTY_FORM: FormState = { id: '', name: '', icon: 'ring', isActive: true }

function categoryToForm(c: ApiCategory): FormState {
  return { id: c.id, name: c.name, icon: c.icon, isActive: c.isActive }
}

function toSlug(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// El `value` se guarda en la base; el `label` es lo que ve la dueña (en español).
const ICON_OPTIONS = [
  // Joyería
  { value: 'ring',      label: '💍 Anillos'     },
  { value: 'necklace',  label: '📿 Collares'    },
  { value: 'charm',     label: '🔮 Dijes'       },
  { value: 'bracelet',  label: '✨ Pulseras'    },
  { value: 'earring',   label: '💫 Aros'        },
  { value: 'anklet',    label: '🌿 Tobilleras'  },
  // Piedras y complementos
  { value: 'crystal',   label: '💎 Piedras'     },
  { value: 'accessory', label: '🌙 Complementos' },
  // Genéricos
  { value: 'leaf',      label: '🍃 Hoja'        },
  { value: 'moon',      label: '🌙 Luna'        },
  { value: 'star',      label: '⭐ Estrella'    },
  { value: 'gem',       label: '💎 Gema'        },
]

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

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 38, height: 20, borderRadius: 999, position: 'relative', flexShrink: 0,
          background: checked ? 'var(--brand-orange)' : 'var(--line)', transition: 'background .2s',
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

export default function CategoriasPage() {
  const [categories, setCategories] = useState<ApiCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<'create' | 'edit' | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const [error, setError] = useState('')
  const [isReordering, setIsReordering] = useState(false)
  const [reorderedCats, setReorderedCats] = useState<ApiCategory[]>([])

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/categories')
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        setError(d?.error ?? 'Error al cargar las categorías.')
        setCategories([])
      } else {
        const data = await res.json()
        if (Array.isArray(data)) {
          setCategories(data)
        } else {
          setError('El servidor devolvió un formato incorrecto.')
          setCategories([])
        }
      }
    } catch {
      setError('Error de conexión con el servidor backend.')
      setCategories([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  function startReordering() {
    setReorderedCats([...categories])
    setIsReordering(true)
    setError('')
  }

  function cancelReordering() {
    setIsReordering(false)
    setReorderedCats([])
    setError('')
  }

  async function saveReordering() {
    setSaving(true)
    setError('')
    try {
      const ids = reorderedCats.map(c => c.id)
      const res = await fetch('/api/admin/categories/reordenar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ids),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        setError(d?.error ?? 'Error al guardar el nuevo orden.')
        return
      }
      setIsReordering(false)
      await load()
    } catch {
      setError('Error de conexión al guardar el orden.')
    } finally {
      setSaving(false)
    }
  }

  function openCreate() { setForm(EMPTY_FORM); setError(''); setModal('create') }
  function openEdit(c: ApiCategory) { setForm(categoryToForm(c)); setError(''); setModal('edit') }
  function closeModal() { setModal(null); setError('') }

  function setF<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm(f => ({ ...f, [key]: val }))
  }

  async function handleSave() {
    setError('')
    if (!form.id.trim() || !form.name.trim()) { setError('ID y nombre son obligatorios.'); return }
    setSaving(true)
    try {
      if (modal === 'create') {
        const nextOrder = categories.length
          ? Math.max(...categories.map(c => c.sortOrder)) + 1
          : 0
        const res = await fetch('/api/admin/categories', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: form.id.trim(), name: form.name.trim(), icon: form.icon, sortOrder: nextOrder,
          }),
        })
        if (!res.ok) {
          const d = await res.json().catch(() => ({}))
          setError(typeof d === 'string' ? d : (d?.error ?? d?.message ?? d?.title ?? 'Error al crear.'))
          return
        }
      } else {
        const res = await fetch(`/api/admin/categories/${form.id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: form.name.trim(), icon: form.icon, isActive: form.isActive }),
        })
        if (!res.ok) { setError('Error al actualizar categoría.'); return }
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
    setDeleteError('')
    try {
      const res = await fetch(`/api/admin/categories/${deleteId}`, { method: 'DELETE' })
      if (res.ok) {
        setDeleteId(null)
        await load()
      } else {
        const d = await res.json().catch(() => ({}))
        setDeleteError(d?.error ?? 'No se puede eliminar esta categoría.')
      }
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
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 36, fontWeight: 500, margin: 0, color: 'var(--fg)' }}>Categorías</h1>
          <p style={{ margin: '6px 0 0', fontSize: 13, color: 'var(--fg-muted)' }}>
            {isReordering ? 'Modo Reordenador Activo' : `${categories.length} categorías registradas`}
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: 10 }}>
          {isReordering ? (
            <>
              <button onClick={cancelReordering} disabled={saving} style={{
                padding: '10px 22px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                background: 'transparent', border: '1px solid var(--line)', color: 'var(--fg-muted)',
                cursor: saving ? 'wait' : 'pointer',
              }}>
                Cancelar
              </button>
              <button onClick={saveReordering} disabled={saving} style={{
                padding: '10px 22px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                background: 'var(--brand-orange)', color: '#fff', border: 'none',
                cursor: saving ? 'wait' : 'pointer', opacity: saving ? 0.7 : 1,
              }}>
                {saving ? 'Guardando…' : 'Guardar orden'}
              </button>
            </>
          ) : (
            <>
              {categories.length > 1 && (
                <button onClick={startReordering} style={{
                  padding: '10px 22px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                  background: 'transparent', border: '1px solid var(--line)', color: 'var(--fg-muted)', cursor: 'pointer',
                }}>
                  ⇄ Reordenar
                </button>
              )}
              <button onClick={openCreate} style={{
                padding: '10px 22px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                background: 'var(--brand-orange)', color: '#fff', border: 'none', cursor: 'pointer',
              }}>
                + Nueva categoría
              </button>
            </>
          )}
        </div>
        <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, var(--gold), transparent)', opacity: 0.5 }} />
      </div>

      {error && !modal && (
        <div style={{ margin: '24px 40px 0', padding: '12px 18px', background: 'rgba(224,101,87,.12)', border: '1px solid rgba(224,101,87,.3)', borderRadius: 8, fontSize: 13, color: '#e06557' }}>
          ⚠️ {error}
        </div>
      )}

      {isReordering ? (
        <div style={{ padding: '32px 40px 40px', maxWidth: 680, margin: '0 auto' }}>
          <div style={{ padding: '16px 20px', background: 'rgba(230,175,46,.08)', border: '1px solid rgba(230,175,46,.25)', borderRadius: 10, fontSize: 13, color: 'var(--fg-muted)', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <span>💡</span>
            <span>Arrastrá las categorías desde el ícono de agarre <strong>⋮⋮</strong> para reordenarlas. Al terminar, hacé clic en <strong>Guardar orden</strong>.</span>
          </div>
          
          <Reorder.Group axis="y" values={reorderedCats} onReorder={setReorderedCats} style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {reorderedCats.map((c, index) => (
              <Reorder.Item key={c.id} value={c} style={{
                background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12,
                padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                cursor: 'grab', userSelect: 'none',
              }} whileDrag={{ scale: 1.02, boxShadow: '0 8px 25px rgba(0,0,0,0.35)', border: '1px solid var(--brand-orange)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ color: 'var(--fg-soft)', fontSize: 20, cursor: 'grab', paddingRight: 6, userSelect: 'none' }}>
                    ⋮⋮
                  </div>
                  <div style={{ fontSize: 24, lineHeight: 1 }}>
                    {ICON_OPTIONS.find(i => i.value === c.icon)?.label.split(' ')[0] ?? '⬡'}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 500, color: 'var(--fg)' }}>{c.name}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-soft)' }}>{c.id}</div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  <span style={{
                    fontSize: 10, padding: '3px 9px', borderRadius: 999,
                    background: c.isActive ? 'rgba(155,174,136,.12)' : 'rgba(255,255,255,.05)',
                    color: c.isActive ? '#9bae88' : 'var(--fg-soft)',
                  }}>
                    {c.isActive ? 'Activa' : 'Inactiva'}
                  </span>
                  <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--accent)', minWidth: 40, textAlign: 'right', fontFamily: 'var(--font-serif)' }}>
                    {index + 1}º
                  </div>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      ) : (
        /* Cards grid */
        <div style={{ padding: '32px 40px 40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {loading ? (
            <div style={{ gridColumn: '1/-1', padding: 40, textAlign: 'center', color: 'var(--fg-muted)', fontSize: 13 }}>Cargando…</div>
          ) : categories.length === 0 ? (
            <div style={{ gridColumn: '1/-1', padding: 40, textAlign: 'center', color: 'var(--fg-muted)', fontSize: 13 }}>No hay categorías.</div>
          ) : (
            categories.map((c, idx) => (
              <div key={c.id} style={{
                background: 'var(--surface)', border: '1px solid var(--line)',
                borderRadius: 12, padding: 22, position: 'relative', overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                  background: c.isActive
                    ? 'linear-gradient(90deg, transparent, var(--brand-orange), transparent)'
                    : 'linear-gradient(90deg, transparent, var(--line), transparent)',
                  opacity: 0.7,
                }} />
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 22, marginBottom: 6, lineHeight: 1 }}>
                      {ICON_OPTIONS.find(i => i.value === c.icon)?.label.split(' ')[0] ?? '⬡'}
                    </div>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 500, color: 'var(--fg)' }}>{c.name}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-soft)', marginTop: 2 }}>{c.id}</div>
                  </div>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 9px',
                    borderRadius: 999, fontSize: 10,
                    background: c.isActive ? 'rgba(155,174,136,.15)' : 'rgba(255,255,255,.06)',
                    color: c.isActive ? '#9bae88' : 'var(--fg-soft)',
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: c.isActive ? '#9bae88' : 'var(--fg-soft)' }} />
                    {c.isActive ? 'Activa' : 'Inactiva'}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--fg-soft)', marginBottom: 3 }}>Productos</div>
                    <div style={{ fontSize: 22, fontFamily: 'var(--font-serif)', fontWeight: 500, color: 'var(--fg)' }}>{c.productCount}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--fg-soft)', marginBottom: 3 }}>Posición</div>
                    <div style={{ fontSize: 22, fontFamily: 'var(--font-serif)', fontWeight: 500, color: 'var(--fg)' }}>{idx + 1}º</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => openEdit(c)} style={{
                    flex: 1, padding: '7px 0', borderRadius: 7, fontSize: 12, fontWeight: 500,
                    background: 'transparent', border: '1px solid var(--line)', color: 'var(--fg-muted)', cursor: 'pointer',
                  }}>Editar</button>
                  <button
                    onClick={() => { setDeleteId(c.id); setDeleteError('') }}
                    disabled={c.productCount > 0}
                    title={c.productCount > 0 ? 'No se puede eliminar: tiene productos' : ''}
                    style={{
                      flex: 1, padding: '7px 0', borderRadius: 7, fontSize: 12, fontWeight: 500,
                      background: 'transparent',
                      border: `1px solid ${c.productCount > 0 ? 'var(--line)' : 'rgba(224,101,87,.3)'}`,
                      color: c.productCount > 0 ? 'var(--fg-soft)' : '#e06557',
                      cursor: c.productCount > 0 ? 'not-allowed' : 'pointer',
                      opacity: c.productCount > 0 ? 0.5 : 1,
                    }}>Eliminar</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Create / Edit Modal */}
      {modal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 10000,
          background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
        }} onClick={e => { if (e.target === e.currentTarget) closeModal() }}>
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--line)',
            borderRadius: 14, width: '100%', maxWidth: 480, padding: 32,
          }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 500, color: 'var(--fg)', marginBottom: 24 }}>
              {modal === 'create' ? 'Nueva categoría' : 'Editar categoría'}
            </div>

            <div style={{ display: 'grid', gap: 16, marginBottom: 20 }}>
              <Input label="Nombre" value={form.name} onChange={v => {
                setF('name', v);
                if (modal === 'create') setF('id', toSlug(v));
              }} />
              <Input label="ID (slug único generado automáticamente)" value={form.id} onChange={v => setF('id', v)} disabled={true} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <label style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-soft)' }}>Ícono</label>
                <select
                  value={form.icon} onChange={e => setF('icon', e.target.value)}
                  style={{
                    background: 'var(--bg)', border: '1px solid var(--line)',
                    borderRadius: 7, padding: '8px 12px', fontSize: 13, color: 'var(--fg)',
                    outline: 'none', fontFamily: 'inherit', cursor: 'pointer',
                  }}
                >
                  {ICON_OPTIONS.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
                </select>
              </div>

              {modal === 'create' && (
                <p style={{ fontSize: 12, color: 'var(--fg-soft)', margin: 0 }}>
                  El orden de aparición se asigna automáticamente (la nueva categoría va al final).
                </p>
              )}
              <Toggle label="Categoría activa" checked={form.isActive} onChange={v => setF('isActive', v)} />
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
                background: 'var(--brand-orange)', color: '#fff', border: 'none',
                cursor: saving ? 'wait' : 'pointer', opacity: saving ? 0.7 : 1,
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
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12, padding: 32, maxWidth: 420, width: '90%' }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, color: 'var(--fg)', marginBottom: 12 }}>¿Eliminar categoría?</div>
            <p style={{ fontSize: 13, color: 'var(--fg-muted)', margin: '0 0 16px' }}>
              Se eliminará <strong style={{ color: 'var(--fg)', fontFamily: 'var(--font-mono)' }}>{deleteId}</strong>. Esta acción no se puede deshacer.
            </p>
            {deleteError && (
              <div style={{ padding: '10px 14px', background: 'rgba(224,101,87,.12)', border: '1px solid rgba(224,101,87,.3)', borderRadius: 7, fontSize: 13, color: '#e06557', marginBottom: 16 }}>
                {deleteError}
              </div>
            )}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => { setDeleteId(null); setDeleteError('') }} style={{
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
