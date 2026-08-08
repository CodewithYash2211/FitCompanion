import { NextRequest } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import User from '@/models/User'
import { verifyToken } from '@/lib/auth'
import { apiError, apiSuccess } from '@/lib/utils'

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('fc_access_token')?.value

    if (!token) {
      return apiError('Unauthorized', 401)
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return apiError('Invalid or expired token', 401)
    }

    await connectToDatabase()
    
    // Fetch user data
    const user = await User.findById(payload.userId)
    
    if (!user) {
      return apiError('User not found', 404)
    }

    // Return safe user data
    const userData = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      profile: user.profile || null,
    }

    return apiSuccess({ user: userData }, 'User retrieved successfully')

  } catch (error) {
    console.error('Auth/Me error:', error)
    return apiError('Internal server error', 500)
  }
}
