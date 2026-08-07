/**
 * WaterLog Mongoose Schema & Model
 */

import mongoose, { Schema, Document, Model } from 'mongoose'

interface WaterEntry {
  amount: number     // ml
  loggedAt: Date
}

export interface IWaterLogDocument extends Document {
  userId: mongoose.Types.ObjectId
  date: string       // YYYY-MM-DD
  entries: WaterEntry[]
  totalMl: number
  createdAt: Date
  updatedAt: Date
}

const WaterEntrySchema = new Schema<WaterEntry>(
  {
    amount: { type: Number, required: true, min: 1 },
    loggedAt: { type: Date, default: Date.now },
  },
  { _id: true }
)

const WaterLogSchema = new Schema<IWaterLogDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: String, required: true },
    entries: [WaterEntrySchema],
    totalMl: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false }
)

WaterLogSchema.index({ userId: 1, date: 1 }, { unique: true })

const WaterLog: Model<IWaterLogDocument> =
  mongoose.models.WaterLog ?? mongoose.model<IWaterLogDocument>('WaterLog', WaterLogSchema)

export default WaterLog
