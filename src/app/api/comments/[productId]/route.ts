import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { prisma } from '@/lib/prisma'

type Params = { params: Promise<{ productId: string }> }

function formatName(name: string | null, email: string): string {
  if (name) {
    const parts = name.trim().split(' ')
    return parts.length > 1 ? `${parts[0]} ${parts[1][0]}.` : parts[0]
  }
  return email.split('@')[0]
}

export async function GET(_req: NextRequest, { params }: Params) {
  const { productId } = await params
  const session = await getServerSession(authOptions)

  const comments = await prisma.comment.findMany({
    where: { productId },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: 'desc' },
  })

  let hasPurchased = false
  let hasCommented = false

  if (session?.user?.id) {
    const [order, comment] = await Promise.all([
      prisma.order.findFirst({ where: { userId: session.user.id, productId } }),
      prisma.comment.findUnique({
        where: { userId_productId: { userId: session.user.id, productId } },
      }),
    ])
    hasPurchased = !!order
    hasCommented = !!comment
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
      userName: formatName(c.user.name, c.user.email),
    })),
    avgRating,
    total: comments.length,
    hasPurchased,
    hasCommented,
  })
}

export async function POST(req: NextRequest, { params }: Params) {
  const { productId } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const { text, rating } = await req.json()

  const trimmed = typeof text === 'string' ? text.trim() : ''
  if (trimmed.length < 10 || trimmed.length > 300) {
    return NextResponse.json(
      { error: 'El comentario debe tener entre 10 y 300 caracteres' },
      { status: 400 }
    )
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json(
      { error: 'La calificación debe ser entre 1 y 5' },
      { status: 400 }
    )
  }

  const order = await prisma.order.findFirst({
    where: { userId: session.user.id, productId },
  })

  if (!order) {
    return NextResponse.json(
      { error: 'Solo compradores verificados pueden comentar' },
      { status: 403 }
    )
  }

  try {
    const comment = await prisma.comment.create({
      data: { text: trimmed, rating, userId: session.user.id, productId },
      include: { user: { select: { name: true, email: true } } },
    })

    return NextResponse.json({
      id: comment.id,
      text: comment.text,
      rating: comment.rating,
      createdAt: comment.createdAt.toISOString(),
      userName: formatName(comment.user.name, comment.user.email),
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
