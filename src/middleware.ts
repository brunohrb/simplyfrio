import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from './lib/auth'

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('sf_token')?.value
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/dashboard')) {
    if (!token) return NextResponse.redirect(new URL('/', req.url))
    const user = await verifyToken(token)
    if (!user) return NextResponse.redirect(new URL('/', req.url))

    if (pathname.startsWith('/dashboard/financeiro') && user.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  if (pathname === '/' && token) {
    const user = await verifyToken(token)
    if (user) return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/dashboard/:path*'],
}
