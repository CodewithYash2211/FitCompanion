/**
 * JWT Authentication utilities.
 * Handles token signing, verification, and cookie management.
 * Uses the `jose` library for Edge-compatible JWT operations.
 */

import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import type { AuthTokenPayload } from '@/types'

// Token expiry constants
const ACCESS_TOKEN_EXPIRY = '15m'
const REFRESH_TOKEN_EXPIRY = '7d'
const REFRESH_COOKIE_NAME = 'fc_refresh_token'
const ACCESS_COOKIE_NAME = 'fc_access_token'

/** Get the JWT secret as a Uint8Array for jose */
function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not defined')
  }
  return new TextEncoder().encode(secret)
}

/**
 * Sign a new JWT access token (short-lived: 15 minutes)
 */
export async function signAccessToken(payload: Omit<AuthTokenPayload, 'iat' | 'exp'>): Promise<string> {
  const secret = getJwtSecret()

  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .sign(secret)
}

/**
 * Sign a new JWT refresh token (long-lived: 7 days)
 */
export async function signRefreshToken(payload: Omit<AuthTokenPayload, 'iat' | 'exp'>): Promise<string> {
  const secret = getJwtSecret()

  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXPIRY)
    .sign(secret)
}

/**
 * Verify and decode a JWT token.
 * Returns null if the token is invalid or expired.
 */
export async function verifyToken(token: string): Promise<AuthTokenPayload | null> {
  try {
    const secret = getJwtSecret()
    const { payload } = await jwtVerify(token, secret)

    return {
      userId: payload.userId as string,
      email: payload.email as string,
      iat: payload.iat,
      exp: payload.exp,
    }
  } catch {
    return null
  }
}

/**
 * Set the refresh token as an HttpOnly cookie.
 * This prevents client-side JavaScript from accessing it.
 */
export async function setRefreshTokenCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    path: '/',
  })
}

/**
 * Get the refresh token from cookies.
 */
export async function getRefreshTokenCookie(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(REFRESH_COOKIE_NAME)?.value
}

/**
 * Clear the refresh token cookie (logout).
 */
export async function clearRefreshTokenCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(REFRESH_COOKIE_NAME)
}

/**
 * Set the access token as a cookie (not HttpOnly so client JS can use it if needed,
 * but primarily for middleware routing support).
 */
export async function setAccessTokenCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(ACCESS_COOKIE_NAME, token, {
    httpOnly: false, // Middleware can read it, and client can read it
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60, // 15 minutes
    path: '/',
  })
}

/**
 * Clear the access token cookie.
 */
export async function clearAccessTokenCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(ACCESS_COOKIE_NAME)
}

/**
 * Extract the access token from the Authorization header.
 * Expected format: "Bearer <token>"
 */
export function extractBearerToken(authHeader: string | null): string | null {
  if (!authHeader?.startsWith('Bearer ')) return null
  return authHeader.slice(7)
}
