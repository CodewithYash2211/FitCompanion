/**
 * WeightLog Mongoose Schema & Model
 */

import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IWeightLogDocument extends Document {
  userId: mongoose.Types.ObjectId
  weight: number     // kg
  date: string       // YYYY-MM-DD
  loggedAt: Date
}

const WeightLogSchema = new Schema<IWeightLogDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    weight: { type: Number, required: true, min: 20, max: 400 },
    date: { type: String, required: true },
    loggedAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
)

WeightLogSchema.index({ userId: 1, date: -1 }) // Most recent first

const WeightLog: Model<IWeightLogDocument> =
  mongoose.models.WeightLog ?? mongoose.model<IWeightLogDocument>('WeightLog', WeightLogSchema)

export default WeightLog
