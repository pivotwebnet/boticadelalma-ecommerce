import { NextRequest, NextResponse } from 'next/server'
import { getComments, createComment } from '@/lib/api'
import { rateLimit, clientIp } from '@/lib/rate-limit'

type Params = { params: Promise<{ productId: string }> }

export async function GET(req: NextRequest, { params }: Params) {
  const { productId } = await params
  const orderId = req.nextUrl.searchParams.get('orderId')

  const comments = await getComments(productId)

  let canComment = false
  let hasCommented = false

  if (orderId) {
    canComment = true
    hasCommented = comments.some(c => c.orderId === orderId)
  }

  const avgRating = comments.length
    ? Math.round((comments.reduce((s, c) => s + c.rating, 0) / comments.length) * 10) / 10
    : 0

  return NextResponse.json({
    comments: comments.map(c => ({
      id: c.id,
      text: c.text,
      rating: c.rating,
      createdAt: c.createdAt,
      author: c.author,
    })),
    avgRating,
    total: comments.length,
    canComment,
    hasCommented,
  })
}

export async function POST(req: NextRequest, { params }: Params) {
  // Anti-spam de reseñas: máx 5 por minuto por IP.
  if (!rateLimit(`comments:${clientIp(req)}`, 5, 60_000)) {
    return NextResponse.json(
      { error: 'Demasiados intentos. Esperá un momento e intentá de nuevo.' },
      { status: 429 },
    )
  }

  const { productId } = await params
  const { text, rating, orderId, author } = await req.json()

  if (!orderId) {
    return NextResponse.json({ error: 'Se requiere el ID de orden' }, { status: 400 })
  }

  const trimmed = typeof text === 'string' ? text.trim() : ''
  if (trimmed.length < 10 || trimmed.length > 300) {
    return NextResponse.json(
      { error: 'El comentario debe tener entre 10 y 300 caracteres' },
      { status: 400 }
    )
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'La calificación debe ser entre 1 y 5' }, { status: 400 })
  }

  const result = await createComment({
    productId,
    orderId,
    author: author || 'Comprador verificado',
    text: trimmed,
    rating,
  })

  if (!result.ok) {
    if (result.status === 409) {
      return NextResponse.json(
        { error: 'Ya dejaste una opinión sobre este producto' },
        { status: 409 }
      )
    }
    return NextResponse.json({ error: 'Error al publicar la opinión' }, { status: 500 })
  }

  return NextResponse.json(result.data)
}
