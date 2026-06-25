'use client'

import { useEffect, useState } from 'react'
import { ApiComment, ApiProduct } from '@/lib/api'

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
  const [products, setProducts] = useState<Record<string, ApiProduct>>({})
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [confirm, setConfirm] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string | 'all'>('all')
  const [dateFilter, setDateFilter] = useState<string | 'all'>('all')

  useEffect(() => {
    const loadData = async () => {
      try {
        const [commentsRes, productsRes] = await Promise.all([
          fetch('/api/admin/comments'),
          fetch('/api/admin/products')
        ])

        const commentsData = commentsRes.ok ? await commentsRes.json() : []
        const productsData = productsRes.ok ? await productsRes.json() : []

        setComments(commentsData)

        const dict: Record<string, ApiProduct> = {}
        if (Array.isArray(productsData)) {
          productsData.forEach((p: ApiProduct) => {
            dict[p.id] = p
          })
        }
        setProducts(dict)
      } catch (error) {
        console.error('Error al cargar datos en panel de comentarios:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleDelete = async (id: string) => {
    setDeleting(id)
    const res = await fetch(`/api/admin/comments/${id}`, { method: 'DELETE' })
    if (res.ok) setComments(prev => prev.filter(c => c.id !== id))
    setDeleting(null)
    setConfirm(null)
  }

  const uniqueCategories = Object.values(products).reduce((acc: { id: string; name: string }[], p) => {
    if (p.categoryId && !acc.some(cat => cat.id === p.categoryId)) {
      acc.push({ id: p.categoryId, name: p.categoryName || p.categoryId })
    }
    return acc
  }, [])

  const filtered = comments.filter(c => {
    const product = products[c.productId]
    
    // Búsqueda de texto
    const matchesSearch = !search ||
      c.author.toLowerCase().includes(search.toLowerCase()) ||
      c.text.toLowerCase().includes(search.toLowerCase()) ||
      c.productId.toLowerCase().includes(search.toLowerCase()) ||
      (product && product.name.toLowerCase().includes(search.toLowerCase()))
      
    // Calificación
    const matchesRating = ratingFilter === 'all' || c.rating === ratingFilter
    
    // Categoría de producto
    const matchesCategory = categoryFilter === 'all' || (product && product.categoryId === categoryFilter)
    
    // Fecha (últimos 7 o 30 días)
    let matchesDate = true
    if (dateFilter !== 'all') {
      const commentDate = new Date(c.createdAt)
      const now = new Date()
      if (dateFilter === '7d') {
        const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7))
        matchesDate = commentDate >= sevenDaysAgo
      } else if (dateFilter === '30d') {
        const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30))
        matchesDate = commentDate >= thirtyDaysAgo
      }
    }
    
    return matchesSearch && matchesRating && matchesCategory && matchesDate
  })

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
      <div style={{
        padding: '20px 40px',
        borderBottom: '1px solid var(--line-soft)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 16,
        alignItems: 'center',
        background: 'var(--surface)'
      }}>
        {/* Búsqueda */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 11, color: 'var(--fg-soft)', fontWeight: 500 }}>Buscar</label>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Autor, texto o producto…"
            style={{
              padding: '8px 16px', borderRadius: 8,
              border: '1px solid var(--line)', background: 'var(--surface-2)',
              color: 'var(--fg)', fontSize: 13, outline: 'none',
              width: 240, fontFamily: 'var(--font-sans)',
            }}
          />
        </div>

        {/* Filtro Calificación */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 11, color: 'var(--fg-soft)', fontWeight: 500 }}>Calificación</label>
          <select
            value={ratingFilter}
            onChange={e => setRatingFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            style={{
              padding: '8px 12px', borderRadius: 8,
              border: '1px solid var(--line)', background: 'var(--surface-2)',
              color: 'var(--fg)', fontSize: 13, outline: 'none',
              fontFamily: 'var(--font-sans)', cursor: 'pointer',
              minWidth: 120,
            }}
          >
            <option value="all">Todas</option>
            <option value="5">5 ★★★★★</option>
            <option value="4">4 ★★★★</option>
            <option value="3">3 ★★★</option>
            <option value="2">2 ★★</option>
            <option value="1">1 ★</option>
          </select>
        </div>

        {/* Filtro Categoría */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 11, color: 'var(--fg-soft)', fontWeight: 500 }}>Categoría de Producto</label>
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            style={{
              padding: '8px 12px', borderRadius: 8,
              border: '1px solid var(--line)', background: 'var(--surface-2)',
              color: 'var(--fg)', fontSize: 13, outline: 'none',
              fontFamily: 'var(--font-sans)', cursor: 'pointer',
              minWidth: 150,
            }}
          >
            <option value="all">Todas</option>
            {uniqueCategories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Filtro Fecha */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 11, color: 'var(--fg-soft)', fontWeight: 500 }}>Fecha</label>
          <select
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
            style={{
              padding: '8px 12px', borderRadius: 8,
              border: '1px solid var(--line)', background: 'var(--surface-2)',
              color: 'var(--fg)', fontSize: 13, outline: 'none',
              fontFamily: 'var(--font-sans)', cursor: 'pointer',
              minWidth: 130,
            }}
          >
            <option value="all">Cualquier fecha</option>
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
          </select>
        </div>

        {/* Botón de Limpiar */}
        {(search !== '' || ratingFilter !== 'all' || categoryFilter !== 'all' || dateFilter !== 'all') && (
          <button
            onClick={() => {
              setSearch('')
              setRatingFilter('all')
              setCategoryFilter('all')
              setDateFilter('all')
            }}
            style={{
              padding: '8px 16px', borderRadius: 8, fontSize: 12,
              border: '1px solid var(--line)', background: 'transparent',
              color: 'var(--fg-muted)', cursor: 'pointer',
              marginTop: 18,
              fontFamily: 'var(--font-sans)',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--fg)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--fg-muted)' }}
          >
            Limpiar filtros
          </button>
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
              {search || ratingFilter !== 'all' || categoryFilter !== 'all' || dateFilter !== 'all'
                ? 'No hay reseñas que coincidan con los filtros aplicados.'
                : 'No hay reseñas todavía.'}
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
                      <ProductCell productId={c.productId} products={products} />
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
      <style>{`
        @keyframes tooltip-fade-in {
          from {
            opacity: 0;
            transform: translate(-50%, 4px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
      `}</style>
    </div>
  )
}

function ProductCell({ productId, products }: { productId: string; products: Record<string, ApiProduct> }) {
  const [hovered, setHovered] = useState(false)
  const product = products[productId]

  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={{
        fontFamily: product ? 'var(--font-sans)' : 'var(--font-mono)',
        fontSize: product ? 12.5 : 11,
        background: 'var(--surface-2)',
        padding: '4px 10px',
        borderRadius: 6,
        color: product ? 'var(--fg)' : 'var(--fg-muted)',
        border: '1px solid var(--line-soft)',
        cursor: 'default',
        fontWeight: product ? 500 : 400,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        transition: 'all 0.2s ease',
      }}>
        {product ? product.name : `${productId.slice(0, 12)}…`}
      </span>

      {hovered && product && (
        <div style={{
          position: 'absolute',
          bottom: 'calc(100% + 8px)',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          width: 240,
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: 12,
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
          padding: 12,
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          animation: 'tooltip-fade-in 0.15s ease-out forwards',
        }}>
          {/* Triángulo del tooltip */}
          <div style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: '6px solid var(--line)',
          }} />
          <div style={{
            position: 'absolute',
            top: 'calc(100% - 1px)',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderTop: '5px solid var(--surface)',
          }} />

          {/* Imagen si existe */}
          {product.imageUrl && (
            <div style={{
              width: '100%',
              height: 120,
              borderRadius: 6,
              overflow: 'hidden',
              background: 'var(--surface-2)',
              position: 'relative',
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.imageUrl}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
          )}

          {/* Información */}
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent)', fontWeight: 600 }}>
              {product.categoryName || 'Producto'}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg)', marginTop: 2, lineHeight: 1.2 }}>
              {product.name}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--fg)' }}>
                ${product.price.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              </span>
              <span style={{
                fontSize: 10,
                padding: '2px 6px',
                borderRadius: 4,
                background: product.stock > 0 ? 'rgba(74, 169, 108, 0.15)' : 'rgba(169, 74, 60, 0.15)',
                color: product.stock > 0 ? '#4aa96c' : '#e06557',
                fontWeight: 600,
              }}>
                {product.stock > 0 ? `${product.stock} disp.` : 'Sin stock'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
