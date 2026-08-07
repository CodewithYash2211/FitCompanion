/**
 * Streak Mongoose Schema & Model
 * Tracks user consistency across 4 streak types.
 */

import mongoose, { Schema, Document, Model } from 'mongoose'
import type { StreakType } from '@/types'

export interface IStreakDocument extends Document {
  userId: mongoose.Types.ObjectId
  type: StreakType
  current: number
  longest: number
  lastLoggedAt?: Date
  updatedAt: Date
}

const StreakSchema = new Schema<IStreakDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
      type: String,
      enum: ['daily_login', 'meal_log', 'workout', 'water'],
      required: true,
    },
    current: { type: Number, default: 0, min: 0 },
    longest: { type: Number, default: 0, min: 0 },
    lastLoggedAt: { type: Date },
  },
  { timestamps: true, versionKey: false }
)

// One streak record per user per type
StreakSchema.index({ userId: 1, type: 1 }, { unique: true })

const Streak: Model<IStreakDocument> =
  mongoose.models.Streak ?? mongoose.model<IStreakDocument>('Streak', StreakSchema)

export default Streak
