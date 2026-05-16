import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Params = { params: Promise<{ productId: string }> }

export async function GET(req: NextRequest, { params }: Params) {
  const { productId } = await params
  const paymentId = req.nextUrl.searchParams.get('paymentId')

  const comments = await prisma.comment.findMany({
    where: { productId },
    orderBy: { createdAt: 'desc' },
  })

  let canComment = false
  let hasCommented = false

  if (paymentId) {
    const order = await prisma.order.findUnique({
      where: { mpPaymentId: paymentId },
      include: { items: true },
    })

    if (order?.status === 'approved') {
      const hasBought = order.items.some(i => i.productId === productId)
      if (hasBought) {
        canComment = true
        hasCommented = comments.some(c => c.orderId === order.id)
      }
    }
  }

  const avgRating = comments.length
    ? Math.round((comments.reduce((s, c) => s + c.rating, 0) / comments.length) * 10) / 10
    : 0

  return NextResponse.json({
    comments: comments.map(c => ({
      id: c.id,
      text: c.text,
      rating: c.rating,
      createdAt: c.createdAt.toISOString(),
      buyerName: c.buyerName,
    })),
    avgRating,
    total: comments.length,
    canComment,
    hasCommented,
  })
}

export async function POST(req: NextRequest, { params }: Params) {
  const { productId } = await params
  const { text, rating, paymentId } = await req.json()

  if (!paymentId) {
    return NextResponse.json({ error: 'Se requiere el ID de pago' }, { status: 400 })
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

  const order = await prisma.order.findUnique({
    where: { mpPaymentId: paymentId },
    include: { items: true },
  })

  if (!order || order.status !== 'approved') {
    return NextResponse.json(
      { error: 'No se encontró un pago aprobado con ese ID' },
      { status: 403 }
    )
  }

  const hasBought = order.items.some(i => i.productId === productId)
  if (!hasBought) {
    return NextResponse.json(
      { error: 'Este producto no está en tu compra' },
      { status: 403 }
    )
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        text: trimmed,
        rating,
        orderId: order.id,
        productId,
        buyerName: order.buyerName,
      },
    })

    return NextResponse.json({
      id: comment.id,
      text: comment.text,
      rating: comment.rating,
      createdAt: comment.createdAt.toISOString(),
      buyerName: comment.buyerName,
    })
  } catch (err: unknown) {
    if (
      err &&
      typeof err === 'object' &&
      'code' in err &&
      (err as { code: string }).code === 'P2002'
    ) {
      return NextResponse.json(
        { error: 'Ya dejaste una opinión sobre este producto' },
        { status: 409 }
      )
    }
    throw err
  }
}
