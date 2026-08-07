import { NextRequest } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import User from '@/models/User'
import { onboardingSchema } from '@/lib/validations/auth'
import { verifyToken, extractBearerToken } from '@/lib/auth'
import { apiError, apiSuccess } from '@/lib/utils'
import { calculateTDEE, calculateMacroTargets } from '@/lib/calculations'

export async function POST(req: NextRequest) {
  try {
    // 1. Verify Authentication
    const tokenFromHeader = extractBearerToken(req.headers.get('authorization'))
    const tokenFromCookie = req.cookies.get('fc_access_token')?.value
    const token = tokenFromHeader || tokenFromCookie

    if (!token) {
      return apiError('Unauthorized', 401)
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return apiError('Invalid or expired token', 401)
    }

    // 2. Parse and Validate Input
    const body = await req.json()
    const result = onboardingSchema.safeParse(body)

    if (!result.success) {
      return apiError('Invalid input', 400, result.error.flatten().fieldErrors)
    }

    const profileData = result.data

    // 3. Calculate Macros & Goals
    const tdeeResult = calculateTDEE(
      profileData.weight,
      profileData.height,
      profileData.age,
      profileData.gender,
      profileData.activityLevel
    )

    let dailyCalorieGoal = tdeeResult.maintenance
    if (profileData.goal === 'lose_weight') {
      dailyCalorieGoal = tdeeResult.deficit
    } else if (profileData.goal === 'build_muscle' || profileData.goal === 'gain_weight') {
      dailyCalorieGoal = tdeeResult.surplus
    }

    // Basic hydration goal (in ml): 35ml per kg of body weight, capped at 4000ml
    const dailyWaterGoal = Math.min(Math.round(profileData.weight * 35), 4000)

    // Construct the complete profile
    const profile = {
      ...profileData,
      dailyCalorieGoal,
      dailyWaterGoal,
      onboardingComplete: true,
    }

    // 4. Update User in DB
    await connectToDatabase()
    
    const user = await User.findByIdAndUpdate(
      payload.userId,
      { $set: { profile } },
      { new: true }
    )

    if (!user) {
      return apiError('User not found', 404)
    }

    // Return success response
    const userData = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      profile: user.profile,
    }

    return apiSuccess({ user: userData }, 'Profile updated successfully')

  } catch (error) {
    console.error('Onboarding error:', error)
    return apiError('Internal server error', 500)
  }
}
