import { NextRequest } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import User from '@/models/User'
import { apiError, apiSuccess } from '@/lib/utils'

export async function POST(req: NextRequest) {
  if (process.env.ALLOW_PRODUCTION_TEST_DATA_CLEANUP !== 'true') {
    return apiError('Forbidden', 403)
  }

  try {
    await connectToDatabase()
    
    // We only have the User model currently defined for this demo, 
    // but in a full app we'd delete from WorkoutLog, MealLog, etc as well.
    // For now, we will delete all users.
    const result = await User.deleteMany({})

    return apiSuccess({ deletedCount: result.deletedCount }, 'Successfully cleaned up all test users')
  } catch (error) {
    console.error('Cleanup error:', error)
    return apiError('Internal server error', 500)
  }
}
