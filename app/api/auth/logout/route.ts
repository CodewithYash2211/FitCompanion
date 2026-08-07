import { NextResponse } from 'next/server'
import { clearRefreshTokenCookie, clearAccessTokenCookie } from '@/lib/auth'
import { apiSuccess } from '@/lib/utils'

export async function POST() {
  await clearRefreshTokenCookie()
  await clearAccessTokenCookie()
  return apiSuccess(null, 'Logged out successfully')
}
