import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import connectToDatabase from '@/lib/mongodb'
import User from '@/models/User'
import { registerSchema } from '@/lib/validations/auth'
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
    const result = registerSchema.safeParse(body)

    if (!result.success) {
      return apiError('Invalid input', 400, result.error.flatten().fieldErrors)
    }

    const { name, email, password } = result.data

    await connectToDatabase()

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return apiError('User with this email already exists', 409)
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    // Create user
    const newUser = await User.create({
      name,
      email,
      passwordHash,
      refreshTokens: [],
    })

    // Generate tokens
    const tokenPayload = {
      userId: newUser._id.toString(),
      email: newUser.email,
    }

    const accessToken = await signAccessToken(tokenPayload)
    const refreshToken = await signRefreshToken(tokenPayload)

    // Save refresh token to db
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10)
    newUser.refreshTokens.push(hashedRefreshToken)
    await newUser.save()

    // Set cookies
    await setRefreshTokenCookie(refreshToken)
    await setAccessTokenCookie(accessToken)

    // Return success response (excluding sensitive data)
    const userData = {
      _id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt.toISOString(),
      updatedAt: newUser.updatedAt.toISOString(),
    }

    return apiSuccess(
      { user: userData, accessToken },
      'Registration successful'
    )
  } catch (error) {
    console.error('Registration error:', error)
    return apiError('Internal server error', 500)
  }
}
