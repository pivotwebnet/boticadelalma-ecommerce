import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { reordenarCategorias } from '@/lib/api'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    if (!Array.isArray(body)) {
      return NextResponse.json({ error: 'Se esperaba un array de IDs' }, { status: 400 })
    }

    const ok = await reordenarCategorias(body)
    if (ok) {
      revalidateTag('categories')
      revalidateTag('products')
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: 'Error al reordenar las categorías en el backend' }, { status: 500 })
  } catch {
    return NextResponse.json({ error: 'Error en la solicitud' }, { status: 500 })
  }
}
