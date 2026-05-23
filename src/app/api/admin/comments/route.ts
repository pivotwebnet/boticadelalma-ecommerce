import { NextResponse } from 'next/server'
import { getAllComments } from '@/lib/api'

export async function GET() {
  const comments = await getAllComments()
  return NextResponse.json(comments)
}
