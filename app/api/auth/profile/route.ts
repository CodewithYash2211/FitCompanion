import { NextRequest } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import User from '@/models/User'
import { verifyToken } from '@/lib/auth'
import { apiError, apiSuccess } from '@/lib/utils'

export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get('fc_access_token')?.value

    if (!token) {
      return apiError('Unauthorized', 401)
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return apiError('Invalid or expired token', 401)
    }

    const body = await req.json()
    // Body should contain the partial profile updates
    
    await connectToDatabase()
    
    // Use dot notation to update specific fields within profile
    const updateQuery: any = {}
    for (const [key, value] of Object.entries(body)) {
      updateQuery[`profile.${key}`] = value
    }

    const user = await User.findByIdAndUpdate(
      payload.userId,
      { $set: updateQuery },
      { new: true }
    )

    if (!user) {
      return apiError('User not found', 404)
    }

    return apiSuccess({ profile: user.profile }, 'Profile updated successfully')

  } catch (error) {
    console.error('Profile update error:', error)
    return apiError('Internal server error', 500)
  }
}
