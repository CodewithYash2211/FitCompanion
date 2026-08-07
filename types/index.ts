/**
 * FitCompanion — Global TypeScript Type Definitions
 * These interfaces mirror the Mongoose schemas and are used
 * across the entire application for type safety.
 */

// ─── User & Profile ──────────────────────────────────────────────────────────

export type Goal = 'lose_weight' | 'maintain' | 'gain_weight' | 'build_muscle'
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
export type DietaryPref = 'vegetarian' | 'non_vegetarian' | 'vegan' | 'eggetarian'
export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced'
export type Gender = 'male' | 'female' | 'other'
export type Equipment = 'gym' | 'home' | 'none'
export type StreakType = 'daily_login' | 'meal_log' | 'workout' | 'water'
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks'

export interface UserProfile {
  age: number
  gender: Gender
  height: number          // cm
  weight: number          // kg
  targetWeight?: number   // kg
  goal: Goal
  activityLevel: ActivityLevel
  dietaryPref: DietaryPref
  fitnessLevel: FitnessLevel
  equipment: Equipment
  hostelMode: boolean
  examMode: boolean
  dailyCalorieGoal: number
  dailyWaterGoal: number  // ml
  onboardingComplete: boolean
}

export interface IUser {
  _id: string
  name: string
  email: string
  profile?: UserProfile
  createdAt: string
  updatedAt: string
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface AuthTokenPayload {
  userId: string
  email: string
  iat?: number
  exp?: number
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  user: Omit<IUser, 'profile'>
  accessToken: string
  message: string
}

// ─── Nutrition ───────────────────────────────────────────────────────────────

export interface FoodItem {
  id: string
  name: string
  category: string
  serving: string
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  hostelNote?: string
}

export interface MealLogItem {
  foodId?: string
  name: string
  serving: string
  quantity: number        // multiplier on serving
  calories: number
  protein: number
  carbs: number
  fat: number
}

export interface IMealLog {
  _id: string
  userId: string
  date: string            // ISO date string YYYY-MM-DD
  mealType: MealType
  items: MealLogItem[]
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
  createdAt: string
}

export interface DailyNutritionSummary {
  date: string
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
  calorieGoal: number
  proteinGoal: number
  carbsGoal: number
  fatGoal: number
  meals: IMealLog[]
}

// ─── Hydration ───────────────────────────────────────────────────────────────

export interface WaterEntry {
  amount: number          // ml
  loggedAt: string
}

export interface IWaterLog {
  _id: string
  userId: string
  date: string
  entries: WaterEntry[]
  totalMl: number
  createdAt: string
}

// ─── Fitness ─────────────────────────────────────────────────────────────────

export interface Exercise {
  id: string
  name: string
  muscleGroup: string[]
  equipment: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  sets: number
  reps: string
  instructions: string
}

export interface WorkoutSet {
  weight?: number         // kg
  reps: number
  completed: boolean
}

export interface WorkoutExercise {
  exerciseId: string
  name: string
  sets: WorkoutSet[]
  notes?: string
}

export interface IWorkoutLog {
  _id: string
  userId: string
  date: string
  name: string
  exercises: WorkoutExercise[]
  durationMin: number
  caloriesBurned?: number
  notes?: string
  createdAt: string
}

// ─── Progress ────────────────────────────────────────────────────────────────

export interface IWeightLog {
  _id: string
  userId: string
  weight: number
  date: string
  loggedAt: string
}

// ─── Streaks ─────────────────────────────────────────────────────────────────

export interface IStreak {
  _id: string
  userId: string
  type: StreakType
  current: number
  longest: number
  lastLoggedAt?: string
  updatedAt: string
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export interface DashboardData {
  user: IUser
  nutrition: DailyNutritionSummary
  water: {
    totalMl: number
    goalMl: number
  }
  workout: IWorkoutLog | null
  streaks: IStreak[]
  weightDelta: {
    current: number
    previous: number
    delta: number
  } | null
  vitalityScore: number
}

// ─── AI Coach ────────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  actionChips?: string[]
}

export interface AIContext {
  user: Pick<IUser, 'name'>
  profile: UserProfile
  today: {
    date: string
    caloriesConsumed: number
    waterMl: number
    workoutDone: boolean
  }
}

// ─── API Responses ───────────────────────────────────────────────────────────

export interface ApiSuccess<T = unknown> {
  success: true
  data: T
  message?: string
}

export interface ApiError {
  success: false
  error: string
  details?: unknown
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError
