/**
 * MealLog Mongoose Schema & Model
 */

import mongoose, { Schema, Document, Model } from 'mongoose'

interface MealLogItem {
  foodId?: string
  name: string
  serving: string
  quantity: number
  calories: number
  protein: number
  carbs: number
  fat: number
}

export interface IMealLogDocument extends Document {
  userId: mongoose.Types.ObjectId
  date: string           // YYYY-MM-DD
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks'
  items: MealLogItem[]
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
  createdAt: Date
  updatedAt: Date
}

const MealLogItemSchema = new Schema<MealLogItem>(
  {
    foodId: { type: String },
    name: { type: String, required: true },
    serving: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    calories: { type: Number, required: true },
    protein: { type: Number, required: true, default: 0 },
    carbs: { type: Number, required: true, default: 0 },
    fat: { type: Number, required: true, default: 0 },
  },
  { _id: false }
)

const MealLogSchema = new Schema<IMealLogDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: String, required: true },            // YYYY-MM-DD
    mealType: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snacks'],
      required: true,
    },
    items: [MealLogItemSchema],
    totalCalories: { type: Number, default: 0 },
    totalProtein: { type: Number, default: 0 },
    totalCarbs: { type: Number, default: 0 },
    totalFat: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false }
)

// Compound index for efficient daily queries
MealLogSchema.index({ userId: 1, date: 1 })
MealLogSchema.index({ userId: 1, date: 1, mealType: 1 }, { unique: true })

const MealLog: Model<IMealLogDocument> =
  mongoose.models.MealLog ?? mongoose.model<IMealLogDocument>('MealLog', MealLogSchema)

export default MealLog
