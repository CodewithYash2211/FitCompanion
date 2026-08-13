import { NextRequest } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import WaterLog from '@/models/WaterLog'
import { verifyToken } from '@/lib/auth'
import { apiError, apiSuccess } from '@/lib/utils'
import { z } from 'zod'

const waterSchema = z.object({
  amount: z.number().min(-5000).max(5000), // ml
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)').optional(),
})

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('fc_access_token')?.value
    if (!token) return apiError('Unauthorized', 401)
    
    const payload = await verifyToken(token)
    if (!payload) return apiError('Invalid or expired token', 401)

    // Optional date query, default to today
    const { searchParams } = new URL(req.url)
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0]

    await connectToDatabase()

    const waterLog = await WaterLog.findOne({ 
      userId: payload.userId,
      date 
    }).lean()

    // Return empty state safely if not found
    if (!waterLog) {
      return apiSuccess({ log: { entries: [], totalMl: 0, date } })
    }

    return apiSuccess({ log: waterLog })
  } catch (error) {
    console.error('Error fetching water log:', error)
    return apiError('Failed to fetch water log', 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('fc_access_token')?.value
    if (!token) return apiError('Unauthorized', 401)

    const payload = await verifyToken(token)
    if (!payload) return apiError('Invalid or expired token', 401)

    const body = await req.json()
    const result = waterSchema.safeParse(body)
    
    if (!result.success) {
      return apiError('Invalid input', 400, result.error.flatten().fieldErrors)
    }

    await connectToDatabase()

    const date = result.data.date || new Date().toISOString().split('T')[0]
    const amount = result.data.amount

    let waterLog = await WaterLog.findOne({ userId: payload.userId, date })
    
    if (!waterLog) {
      // If we're trying to remove water but no log exists, just create one with 0
      const newTotal = Math.max(0, amount)
      waterLog = await WaterLog.create({
        userId: payload.userId,
        date,
        entries: [{ amount, loggedAt: new Date() }],
        totalMl: newTotal
      })
    } else {
      const newTotal = Math.max(0, waterLog.totalMl + amount)
      waterLog.entries.push({ amount, loggedAt: new Date() } as any)
      waterLog.totalMl = newTotal
      await waterLog.save()
    }

    return apiSuccess({ log: waterLog }, 'Water logged successfully')
  } catch (error) {
    console.error('Error logging water:', error)
    return apiError('Failed to log water', 500)
  }
}
