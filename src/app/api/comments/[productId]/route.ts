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

  let payload: unknown
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: 'Petición inválida' }, { status: 400 })
  }
  if (typeof payload !== 'object' || payload === null) {
    return NextResponse.json({ error: 'Se requiere el ID de orden' }, { status: 400 })
  }
  const { text, rating, orderId, author } = payload as Record<string, unknown>

  if (typeof orderId !== 'string' || !orderId.trim()) {
    return NextResponse.json({ error: 'Se requiere el ID de orden' }, { status: 400 })
  }

  const trimmed = typeof text === 'string' ? text.trim() : ''
  if (trimmed.length < 10 || trimmed.length > 300) {
    return NextResponse.json(
      { error: 'El comentario debe tener entre 10 y 300 caracteres' },
      { status: 400 }
    )
  }

  if (!Number.isInteger(rating) || (rating as number) < 1 || (rating as number) > 5) {
    return NextResponse.json({ error: 'La calificación debe ser entre 1 y 5' }, { status: 400 })
  }

  // El nombre lo controla el cliente: lo acotamos a 60 caracteres y, si viene vacío
  // o no es texto, usamos el default. (El backend valida que la orden sea real.)
  const cleanAuthor =
    typeof author === 'string' && author.trim()
      ? author.trim().slice(0, 60)
      : 'Comprador verificado'

  const result = await createComment({
    productId,
    orderId: orderId.trim(),
    author: cleanAuthor,
    text: trimmed,
    rating: rating as number,
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
