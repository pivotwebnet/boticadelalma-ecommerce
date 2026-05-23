'use client'

import { useEffect, useState } from 'react'
import { ApiComment } from '@/lib/api'

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function Stars({ value }: { value: number }) {
  return (
    <span style={{ letterSpacing: 1, fontSize: 13 }}>
      {[1,2,3,4,5].map(n => (
        <span key={n} style={{ color: n <= value ? '#c9a17a' : 'var(--line)' }}>★</span>
      ))}
    </span>
  )
}

export default function ComentariosPage() {
  const [comments, setComments] = useState<ApiComment[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [confirm, setConfirm] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/admin/comments')
      .then(r => r.json())
      .then(setComments)
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id: string) => {
    setDeleting(id)
    const res = await fetch(`/api/admin/comments/${id}`, { method: 'DELETE' })
    if (res.ok) setComments(prev => prev.filter(c => c.id !== id))
    setDeleting(null)
    setConfirm(null)
  }

  const filtered = comments.filter(c =>
    !search ||
    c.author.toLowerCase().includes(search.toLowerCase()) ||
    c.text.toLowerCase().includes(search.toLowerCase()) ||
    c.productId.toLowerCase().includes(search.toLowerCase())
  )

  const avgRating = comments.length
    ? (comments.reduce((s, c) => s + c.rating, 0) / comments.length).toFixed(1)
    : '—'

  return (
    <div>
      {/* Header */}
      <div style={{
        padding: '32px 40px 24px',
        borderBottom: '1px solid var(--line)',
        position: 'relative',
      }}>
        <div style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 6 }}>
          Gestión
        </div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 36, fontWeight: 500, margin: 0, color: 'var(--fg)' }}>
          Reseñas
        </h1>
        <p style={{ margin: '6px 0 0', fontSize: 13, color: 'var(--fg-muted)' }}>
          {comments.length} reseñas · Promedio {avgRating} ★
        </p>
        <div style={{
          position: 'absolute', bottom: -1, left: 0, right: 0, height: 1,
          background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
          opacity: 0.5,
        }} />
      </div>

      {/* Toolbar */}
      <div style={{ padding: '20px 40px', borderBottom: '1px solid var(--line-soft)', display: 'flex', gap: 12 }}>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por autor, texto o producto…"
          style={{
            padding: '8px 16px', borderRadius: 999,
            border: '1px solid var(--line)', background: 'var(--surface-2)',
            color: 'var(--fg)', fontSize: 13, outline: 'none',
            width: 320, fontFamily: 'var(--font-sans)',
          }}
        />
        {search && (
          <button onClick={() => setSearch('')} style={{
            padding: '8px 14px', borderRadius: 999, fontSize: 12,
            border: '1px solid var(--line)', background: 'transparent',
            color: 'var(--fg-muted)', cursor: 'pointer',
          }}>Limpiar</button>
        )}
      </div>

      {/* Tabla */}
      <div style={{ padding: '24px 40px 40px' }}>
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--line)',
          borderRadius: 12, overflow: 'hidden',
        }}>
          {loading ? (
            <div style={{ padding: 60, textAlign: 'center', color: 'var(--fg-muted)', fontSize: 13 }}>
              Cargando reseñas…
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center', color: 'var(--fg-muted)', fontSize: 13 }}>
              {search ? 'No hay reseñas que coincidan.' : 'No hay reseñas todavía.'}
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Autor', 'Producto', 'Calificación', 'Reseña', 'Fecha', ''].map(h => (
                    <th key={h} style={{
                      textAlign: 'left', padding: '12px 16px',
                      fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase',
                      color: 'var(--fg-soft)', borderBottom: '1px solid var(--line)',
                      fontWeight: 500, fontFamily: 'var(--font-sans)',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => (
                  <tr
                    key={c.id}
                    style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--line-soft)' : 'none' }}
                  >
                    {/* Autor */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 30, height: 30, borderRadius: '50%',
                          background: 'var(--surface-2)', border: '1px solid var(--line)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 12, fontWeight: 600, color: 'var(--fg)', flexShrink: 0,
                        }}>
                          {c.author[0]?.toUpperCase() ?? '?'}
                        </div>
                        <span style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--fg)' }}>{c.author}</span>
                      </div>
                    </td>
                    {/* Producto */}
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: 11,
                        background: 'var(--surface-2)', padding: '3px 8px',
                        borderRadius: 4, color: 'var(--fg-muted)',
                      }}>{c.productId.slice(0, 12)}…</span>
                    </td>
                    {/* Rating */}
                    <td style={{ padding: '14px 16px' }}>
                      <Stars value={c.rating} />
                    </td>
                    {/* Texto */}
                    <td style={{ padding: '14px 16px', maxWidth: 280 }}>
                      <p style={{
                        margin: 0, fontSize: 13, color: 'var(--fg-muted)',
                        overflow: 'hidden', display: '-webkit-box',
                        WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                        lineHeight: 1.5,
                      }}>
                        {c.text}
                      </p>
                    </td>
                    {/* Fecha */}
                    <td style={{ padding: '14px 16px', fontSize: 12, color: 'var(--fg-soft)', whiteSpace: 'nowrap' }}>
                      {fmtDate(c.createdAt)}
                    </td>
                    {/* Acciones */}
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      {confirm === c.id ? (
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => handleDelete(c.id)}
                            disabled={deleting === c.id}
                            style={{
                              padding: '5px 12px', borderRadius: 999, fontSize: 11.5, fontWeight: 500,
                              border: 'none', background: 'rgba(169,74,60,.2)', color: '#e06557',
                              cursor: 'pointer',
                            }}
                          >
                            {deleting === c.id ? '…' : 'Confirmar'}
                          </button>
                          <button
                            onClick={() => setConfirm(null)}
                            style={{
                              padding: '5px 12px', borderRadius: 999, fontSize: 11.5,
                              border: '1px solid var(--line)', background: 'transparent',
                              color: 'var(--fg-muted)', cursor: 'pointer',
                            }}
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirm(c.id)}
                          style={{
                            padding: '5px 12px', borderRadius: 999, fontSize: 11.5,
                            border: '1px solid var(--line)', background: 'transparent',
                            color: 'var(--fg-soft)', cursor: 'pointer', transition: 'all .15s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.color = '#e06557'; e.currentTarget.style.borderColor = 'rgba(169,74,60,.4)' }}
                          onMouseLeave={e => { e.currentTarget.style.color = 'var(--fg-soft)'; e.currentTarget.style.borderColor = 'var(--line)' }}
                        >
                          Eliminar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
