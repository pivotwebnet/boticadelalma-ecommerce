'use client'

import { useState, useEffect, useCallback } from 'react'
import { useStore } from '@/store/useStore'
import Stars from '@/components/ui/Stars'
import Icon from '@/components/ui/Icon'
import CommentCard from './CommentCard'
import CommentForm from './CommentForm'
import { Comment } from '@/lib/types'

interface CommentsData {
  comments: Comment[]
  avgRating: number
  total: number
  canComment: boolean
  hasCommented: boolean
}

export default function CommentSection({ productId }: { productId: string }) {
  const purchase = useStore(s => s.purchase)
  const [data, setData] = useState<CommentsData | null>(null)
  const [loading, setLoading] = useState(true)

  const hasPurchasedThis = purchase?.products.includes(productId) ?? false

  const fetchComments = useCallback(async () => {
    setLoading(true)
    try {
      const url = hasPurchasedThis
        ? `/api/comments/${productId}?orderId=${purchase!.orderId}`
        : `/api/comments/${productId}`
      const res = await fetch(url)
      if (res.ok) setData(await res.json())
    } finally {
      setLoading(false)
    }
  }, [productId, purchase?.orderId, hasPurchasedThis]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchComments() }, [fetchComments])

  return (
    <section className="comments-section">
      <header className="comments-hd">
        <div>
          <span className="eyebrow">Compradores verificados</span>
          <h2>Reseñas</h2>
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
          <div className="comments-loading">Cargando reseñas…</div>
        )}
        {!loading && data?.comments.length === 0 && (
          <div className="comments-empty">
            <div className="comments-empty-badge">
              <Icon name="star" size={30} stroke={1.3} />
            </div>
            <h3>Todavía no hay reseñas</h3>
            <p>
              Esta pieza está esperando su primera historia. Si ya la tenés, tu
              reseña ayuda a otras personas a elegir con el corazón.
            </p>
          </div>
        )}
        {!loading && data?.comments.map(c => (
          <CommentCard key={c.id} comment={c} />
        ))}
      </div>

      <div className="comments-action">
        {hasPurchasedThis && data?.canComment && !data.hasCommented && (
          <CommentForm productId={productId} orderId={purchase!.orderId} author={purchase!.buyerName} onSuccess={fetchComments} />
        )}

        {hasPurchasedThis && data?.hasCommented && (
          <div className="comment-gate comment-gate--done">
            <Icon name="check" size={16} stroke={2} />
            <p>Ya dejaste tu reseña sobre este producto. ¡Gracias!</p>
          </div>
        )}

        {!hasPurchasedThis && (
          <div className="comment-gate">
            <Icon name="shield" size={16} stroke={1.3} />
            <p>Las reseñas son de compradores verificados. Completá tu compra para dejar la tuya.</p>
          </div>
        )}
      </div>
    </section>
  )
}
