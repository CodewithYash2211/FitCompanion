import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import connectToDatabase from '@/lib/mongodb'
import User from '@/models/User'
import { loginSchema } from '@/lib/validations/auth'
import {
  signAccessToken,
  signRefreshToken,
  setRefreshTokenCookie,
  setAccessTokenCookie,
} from '@/lib/auth'
import { apiError, apiSuccess } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const result = loginSchema.safeParse(body)

    if (!result.success) {
      return apiError('Invalid input', 400, result.error.flatten().fieldErrors)
    }

    const { email, password } = result.data

    await connectToDatabase()

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return apiError('Invalid credentials', 401)
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
    if (!isPasswordValid) {
      return apiError('Invalid credentials', 401)
    }

    // Generate tokens
    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
    }

    const accessToken = await signAccessToken(tokenPayload)
    const refreshToken = await signRefreshToken(tokenPayload)

    // Save refresh token to db
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10)
    // Keep max 5 active sessions
    if (user.refreshTokens.length >= 5) {
      user.refreshTokens.shift()
    }
    user.refreshTokens.push(hashedRefreshToken)
    await user.save()

    // Set cookies
    await setRefreshTokenCookie(refreshToken)
    await setAccessTokenCookie(accessToken)

    // Return success response
    const userData = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      profile: user.profile,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    }

    return apiSuccess(
      { user: userData, accessToken },
      'Login successful'
    )
  } catch (error) {
    console.error('Login error:', error)
    return apiError('Internal server error', 500)
  }
}
