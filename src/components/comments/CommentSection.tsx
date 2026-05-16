'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import Stars from '@/components/ui/Stars'
import Icon from '@/components/ui/Icon'
import CommentCard from './CommentCard'
import CommentForm from './CommentForm'
import AuthModal from '@/components/auth/AuthModal'
import { Comment } from '@/lib/types'

interface CommentsData {
  comments: Comment[]
  avgRating: number
  total: number
  hasPurchased: boolean
  hasCommented: boolean
}

export default function CommentSection({ productId }: { productId: string }) {
  const { data: session, status } = useSession()
  const [data, setData] = useState<CommentsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAuth, setShowAuth] = useState(false)

  const fetchComments = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/comments/${productId}`)
      if (res.ok) setData(await res.json())
    } finally {
      setLoading(false)
    }
  }, [productId, session?.user?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchComments() }, [fetchComments])

  return (
    <section className="comments-section">
      <header className="comments-hd">
        <div>
          <span className="eyebrow">Compradores verificados</span>
          <h2>Opiniones</h2>
        </div>
        {data && data.total > 0 && (
          <div className="comments-summary">
            <span className="comments-avg">{data.avgRating.toFixed(1)}</span>
            <Stars value={data.avgRating} size={16} />
            <span className="comments-total">
              {data.total} {data.total === 1 ? 'reseña' : 'reseñas'}
            </span>
          </div>
        )}
      </header>

      <div className="comments-list">
        {loading && (
          <div className="comments-loading">Cargando opiniones…</div>
        )}
        {!loading && data?.comments.length === 0 && (
          <div className="comments-empty">
            <Icon name="star" size={28} />
            <p>Todavía no hay opiniones.</p>
            <span>Sé el primero en compartir tu experiencia.</span>
          </div>
        )}
        {!loading && data?.comments.map(c => (
          <CommentCard key={c.id} comment={c} />
        ))}
      </div>

      <div className="comments-action">
        {status === 'unauthenticated' && (
          <div className="comment-gate">
            <Icon name="user" size={16} stroke={1.3} />
            <p>
              ¿Compraste este producto?{' '}
              <button className="gate-link" onClick={() => setShowAuth(true)}>
                Iniciá sesión
              </button>{' '}
              para dejar tu opinión.
            </p>
          </div>
        )}

        {status === 'authenticated' && data && !data.hasPurchased && (
          <div className="comment-gate">
            <Icon name="shield" size={16} stroke={1.3} />
            <p>Solo quienes compraron este producto pueden dejar una opinión.</p>
          </div>
        )}

        {status === 'authenticated' && data?.hasPurchased && !data.hasCommented && (
          <CommentForm productId={productId} onSuccess={fetchComments} />
        )}

        {status === 'authenticated' && data?.hasCommented && (
          <div className="comment-gate comment-gate--done">
            <Icon name="check" size={16} stroke={2} />
            <p>Ya dejaste tu opinión sobre este producto. ¡Gracias!</p>
          </div>
        )}
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </section>
  )
}
