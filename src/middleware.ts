import { NextRequest, NextResponse } from 'next/server'
import { verifySessionToken, SESSION_COOKIE } from '@/lib/admin-auth'

const PUBLIC_ADMIN_PATHS = ['/admin/login', '/admin/setup']
const PUBLIC_API_PREFIXES = ['/api/admin/auth', '/api/admin/setup']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (
    PUBLIC_ADMIN_PATHS.includes(pathname) ||
    PUBLIC_API_PREFIXES.some(p => pathname.startsWith(p))
  ) {
    return NextResponse.next()
  }

  const valid = await verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value)

  if (!valid) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    const url = new URL('/admin/login', req.url)
    url.searchParams.set('from', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
