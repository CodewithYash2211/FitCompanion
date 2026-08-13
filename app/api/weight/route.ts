import { NextRequest } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import WeightLog from '@/models/WeightLog'
import { verifyToken } from '@/lib/auth'
import { apiError, apiSuccess } from '@/lib/utils'
import { z } from 'zod'

const weightSchema = z.object({
  weight: z.number().positive().min(20).max(400),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)').optional(),
})

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('fc_access_token')?.value
    if (!token) return apiError('Unauthorized', 401)
    
    const payload = await verifyToken(token)
    if (!payload) return apiError('Invalid or expired token', 401)

    await connectToDatabase()

    const history = await WeightLog.find({ userId: payload.userId })
      .sort({ date: -1 }) // Newest first
      .lean()

    return apiSuccess({ history })
  } catch (error) {
    console.error('Error fetching weight history:', error)
    return apiError('Failed to fetch weight history', 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('fc_access_token')?.value
    if (!token) return apiError('Unauthorized', 401)

    const payload = await verifyToken(token)
    if (!payload) return apiError('Invalid or expired token', 401)

    const body = await req.json()
    const result = weightSchema.safeParse(body)
    
    if (!result.success) {
      return apiError('Invalid input', 400, result.error.flatten().fieldErrors)
    }

    await connectToDatabase()

    // Normalize date to today's local string if not provided
    const date = result.data.date || new Date().toISOString().split('T')[0]

    const newWeight = await WeightLog.create({
      userId: payload.userId,
      weight: result.data.weight,
      date,
      loggedAt: new Date()
    })

    return apiSuccess({ record: newWeight }, 'Weight logged successfully')
  } catch (error) {
    console.error('Error saving weight:', error)
    return apiError('Failed to save weight', 500)
  }
}
