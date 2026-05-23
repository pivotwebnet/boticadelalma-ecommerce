'use client'

import Stars from '@/components/ui/Stars'
import { Comment } from '@/lib/types'

function relativeDate(dateStr: string): string {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000)
  if (days === 0) return 'hoy'
  if (days === 1) return 'hace 1 día'
  if (days < 7) return `hace ${days} días`
  if (days < 30) return `hace ${Math.floor(days / 7)} semanas`
  if (days < 365) return `hace ${Math.floor(days / 30)} meses`
  return `hace ${Math.floor(days / 365)} años`
}

export default function CommentCard({ comment }: { comment: Comment }) {
  const initial = comment.author[0]?.toUpperCase() ?? '?'
  return (
    <article className="comment-card">
      <div className="comment-meta">
        <div className="comment-author">
          <span className="comment-avatar">{initial}</span>
          <span className="comment-name">{comment.author}</span>
          <span className="comment-verified">Compra verificada</span>
        </div>
        <div className="comment-right">
          <Stars value={comment.rating} size={12} />
          <span className="comment-date">{relativeDate(comment.createdAt)}</span>
        </div>
      </div>
      <p className="comment-text">{comment.text}</p>
    </article>
  )
}
