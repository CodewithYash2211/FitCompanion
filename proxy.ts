/**
 * Next.js Proxy — JWT Route Protection (Next.js 16+)
 * Formerly middleware.ts — renamed to proxy.ts in Next.js 16.
 * Runs on the Edge Runtime before every matched request.
 */

import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

// ─── Route Definitions ───────────────────────────────────────────────────────

/** All routes that require a valid JWT */
const PROTECTED_PREFIXES = [
  '/dashboard',
  '/ai-coach',
  '/nutrition',
  '/fitness',
  '/calculators',
  '/analytics',
  '/history',
  '/settings',
]

/** Routes that should redirect to /dashboard if already authenticated */
const AUTH_ROUTES = ['/auth/login', '/auth/register']

// ─── JWT Verification ────────────────────────────────────────────────────────

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET ?? ''
  return new TextEncoder().encode(secret)
}

async function getAuthenticatedUserId(request: NextRequest): Promise<string | null> {
  // Check Authorization header first (API clients)
  const authHeader = request.headers.get('authorization')
  const tokenFromHeader = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null

  // Fall back to non-HttpOnly access token cookie (set on login for client-side nav)
  const tokenFromCookie = request.cookies.get('fc_access_token')?.value

  const token = tokenFromHeader ?? tokenFromCookie
  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, getJwtSecret())
    return payload.userId as string
  } catch {
    return null
  }
}

// ─── Proxy Handler ────────────────────────────────────────────────────────────

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl

  const userId = await getAuthenticatedUserId(request)
  const isAuthenticated = !!userId

  // ── Redirect authenticated users away from auth pages ──────────────────────
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // ── Protect app routes ─────────────────────────────────────────────────────
  if (PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  // ── Onboarding — authenticated only ────────────────────────────────────────
  if (pathname.startsWith('/auth/onboarding')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

// ─── Route Matcher ────────────────────────────────────────────────────────────

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static assets)
     * - _next/image (image optimization)
     * - favicon.ico
     * - Public files (icons, manifest, sw.js)
     * - API routes (handle their own auth)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|icons|manifest\\.json|sw\\.js|api).*)',
  ],
}
