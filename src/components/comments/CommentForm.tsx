'use client'

import { useState } from 'react'

interface Props {
  productId: string
  orderId: string
  author: string
  onSuccess: () => void
}

function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="star-input" role="group" aria-label="Calificación">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          className={`star-btn${n <= (hovered || value) ? ' on' : ''}`}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(n)}
          aria-label={`${n} estrella${n > 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  )
}

const MAX = 300

export default function CommentForm({ productId, orderId, author, onSuccess }: Props) {
  const [text, setText] = useState('')
  const [rating, setRating] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) { setError('Seleccioná una calificación'); return }
    if (text.trim().length < 10) { setError('Escribí al menos 10 caracteres'); return }

    setLoading(true)
    setError('')

    const res = await fetch(`/api/comments/${productId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, rating, orderId, author }),
    })

    setLoading(false)

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Error al publicar')
      return
    }

    onSuccess()
  }

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <p className="comment-form-title">Tu opinión</p>
      <div className="form-field">
        <label>Calificación</label>
        <StarInput value={rating} onChange={setRating} />
      </div>
      <div className="form-field">
        <label htmlFor="comment-text">Comentario</label>
        <div className="textarea-wrap">
          <textarea
            id="comment-text"
            value={text}
            onChange={e => setText(e.target.value.slice(0, MAX))}
            placeholder="Contanos tu experiencia con este producto…"
            rows={3}
          />
          <span className={`char-counter${text.length >= MAX - 30 ? ' near-limit' : ''}`}>
            {text.length}/{MAX}
          </span>
        </div>
      </div>
      {error && <p className="auth-error">{error}</p>}
      <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
        {loading ? 'Publicando…' : 'Publicar opinión'}
      </button>
    </form>
  )
}
