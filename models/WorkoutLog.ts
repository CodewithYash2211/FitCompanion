/**
 * WorkoutLog Mongoose Schema & Model
 */

import mongoose, { Schema, Document, Model } from 'mongoose'

interface WorkoutSet {
  weight?: number    // kg, optional (bodyweight exercises)
  reps: number
  completed: boolean
}

interface WorkoutExercise {
  exerciseId: string
  name: string
  sets: WorkoutSet[]
  notes?: string
}

export interface IWorkoutLogDocument extends Document {
  userId: mongoose.Types.ObjectId
  date: string       // YYYY-MM-DD
  name: string
  exercises: WorkoutExercise[]
  durationMin: number
  caloriesBurned?: number
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const WorkoutSetSchema = new Schema<WorkoutSet>(
  {
    weight: { type: Number, min: 0 },
    reps: { type: Number, required: true, min: 0 },
    completed: { type: Boolean, default: false },
  },
  { _id: false }
)

const WorkoutExerciseSchema = new Schema<WorkoutExercise>(
  {
    exerciseId: { type: String, required: true },
    name: { type: String, required: true },
    sets: [WorkoutSetSchema],
    notes: { type: String },
  },
  { _id: false }
)

const WorkoutLogSchema = new Schema<IWorkoutLogDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: String, required: true },
    name: { type: String, required: true },
    exercises: [WorkoutExerciseSchema],
    durationMin: { type: Number, required: true, min: 1 },
    caloriesBurned: { type: Number, min: 0 },
    notes: { type: String },
  },
  { timestamps: true, versionKey: false }
)

WorkoutLogSchema.index({ userId: 1, date: 1 })

const WorkoutLog: Model<IWorkoutLogDocument> =
  mongoose.models.WorkoutLog ?? mongoose.model<IWorkoutLogDocument>('WorkoutLog', WorkoutLogSchema)

export default WorkoutLog
