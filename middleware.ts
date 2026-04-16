import { NextRequest, NextResponse } from 'next/server'

// Routes that require authentication
const protectedRoutes = ['/dashboard']

// Routes that should redirect to dashboard if already logged in
const authRoutes = ['/auth/login', '/auth/register']

export function middleware(req: NextRequest) {
  const token = req.cookies.get('auth-token')?.value ||
    req.headers.get('authorization')?.replace('Bearer ', '')

  const { pathname } = req.nextUrl

  // Check if route is protected
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route))

  // For protected routes, we rely on client-side auth context to redirect
  // since JWT is stored in localStorage (not accessible in middleware)
  // The middleware here handles cookie-based tokens if present

  // For auth routes, redirect to dashboard if already authenticated via cookie
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
}
