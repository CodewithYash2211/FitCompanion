import { NextRequest } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import User from '@/models/User'
import { verifyToken } from '@/lib/auth'
import { apiError, apiSuccess } from '@/lib/utils'
import { profileUpdateSchema } from '@/lib/validations/auth'

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
    const result = profileUpdateSchema.safeParse(body)
    
    if (!result.success) {
      return apiError('Invalid input', 400, result.error.flatten().fieldErrors)
    }
    
    await connectToDatabase()
    
    const updateQuery: any = {}
    
    // Extract name (on root user document) vs profile fields
    const { name, ...profileFields } = result.data
    
    if (name) {
      updateQuery['name'] = name
    }
    
    // Use dot notation to update specific fields within profile
    for (const [key, value] of Object.entries(profileFields)) {
      if (value !== undefined) {
        updateQuery[`profile.${key}`] = value
      }
    }

    if (Object.keys(updateQuery).length === 0) {
      return apiError('No valid fields to update', 400)
    }

    const user = await User.findByIdAndUpdate(
      payload.userId,
      { $set: updateQuery },
      { new: true }
    )

    if (!user) {
      return apiError('User not found', 404)
    }

    // Don't return sensitive data
    return apiSuccess({ profile: user.profile, name: user.name }, 'Profile updated successfully')

  } catch (error) {
    console.error('Profile update error:', error)
    return apiError('Internal server error', 500)
  }
}
