/**
 * User Mongoose Schema & Model
 * Includes embedded UserProfile subdocument.
 */

import mongoose, { Schema, Document, Model } from 'mongoose'
import type { UserProfile } from '@/types'

// ─── UserProfile Subdocument ──────────────────────────────────────────────────

const UserProfileSchema = new Schema<UserProfile>(
  {
    age: { type: Number, required: true, min: 10, max: 120 },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    height: { type: Number, required: true, min: 100, max: 250 },  // cm
    weight: { type: Number, required: true, min: 20, max: 400 },   // kg
    targetWeight: { type: Number, min: 20, max: 400 },
    goal: {
      type: String,
      enum: ['lose_weight', 'maintain', 'gain_weight', 'build_muscle'],
      required: true,
    },
    activityLevel: {
      type: String,
      enum: ['sedentary', 'light', 'moderate', 'active', 'very_active'],
      required: true,
    },
    dietaryPref: {
      type: String,
      enum: ['vegetarian', 'non_vegetarian', 'vegan', 'eggetarian'],
      required: true,
    },
    fitnessLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
    },
    equipment: {
      type: String,
      enum: ['gym', 'home', 'none'],
      default: 'none',
    },
    hostelMode: { type: Boolean, default: false },
    examMode: { type: Boolean, default: false },
    dailyCalorieGoal: { type: Number, default: 2000 },
    dailyWaterGoal: { type: Number, default: 2500 }, // ml
    onboardingComplete: { type: Boolean, default: false },
  },
  { _id: false } // Embedded doc — no separate _id needed
)

// ─── User Document Interface ──────────────────────────────────────────────────

export interface IUserDocument extends Document {
  name: string
  email: string
  passwordHash: string
  profile?: UserProfile
  refreshTokens: string[] // hashed refresh tokens
  createdAt: Date
  updatedAt: Date
}

// ─── User Schema ─────────────────────────────────────────────────────────────

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    passwordHash: { type: String, required: true },
    profile: { type: UserProfileSchema, default: null },
    refreshTokens: [{ type: String }], // array of hashed tokens
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

// ─── Indexes ──────────────────────────────────────────────────────────────────

UserSchema.index({ email: 1 }, { unique: true })

// ─── Model ───────────────────────────────────────────────────────────────────

// Prevent model recompilation in hot-reload
const User: Model<IUserDocument> =
  mongoose.models.User ?? mongoose.model<IUserDocument>('User', UserSchema)

export default User
