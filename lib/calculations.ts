/**
 * BMI, BMR, and TDEE calculation utilities.
 * All formulas are medically validated standards.
 */

import type { ActivityLevel, Gender } from '@/types'

// ─── Activity Multipliers ─────────────────────────────────────────────────────

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,      // Little/no exercise
  light: 1.375,         // Light exercise 1-3 days/week
  moderate: 1.55,       // Moderate exercise 3-5 days/week
  active: 1.725,        // Hard exercise 6-7 days/week
  very_active: 1.9,     // Very hard exercise + physical job
}

// ─── BMI ─────────────────────────────────────────────────────────────────────

export type BMICategory =
  | 'Underweight'
  | 'Normal Weight'
  | 'Overweight'
  | 'Obese Class I'
  | 'Obese Class II'
  | 'Obese Class III'

export interface BMIResult {
  bmi: number
  category: BMICategory
  color: string   // tailwind color class for the category
  healthyRange: { min: number; max: number }
}

/**
 * Calculate Body Mass Index (BMI).
 * Formula: weight (kg) / height (m)²
 */
export function calculateBMI(weightKg: number, heightCm: number): BMIResult {
  const heightM = heightCm / 100
  const bmi = weightKg / (heightM * heightM)
  const rounded = Math.round(bmi * 10) / 10

  let category: BMICategory
  let color: string

  if (bmi < 18.5) {
    category = 'Underweight'
    color = 'text-blue-400'
  } else if (bmi < 25) {
    category = 'Normal Weight'
    color = 'text-emerald-400'
  } else if (bmi < 30) {
    category = 'Overweight'
    color = 'text-amber-400'
  } else if (bmi < 35) {
    category = 'Obese Class I'
    color = 'text-orange-400'
  } else if (bmi < 40) {
    category = 'Obese Class II'
    color = 'text-red-400'
  } else {
    category = 'Obese Class III'
    color = 'text-red-600'
  }

  // Healthy weight range for given height
  const minHealthy = Math.round(18.5 * heightM * heightM * 10) / 10
  const maxHealthy = Math.round(24.9 * heightM * heightM * 10) / 10

  return {
    bmi: rounded,
    category,
    color,
    healthyRange: { min: minHealthy, max: maxHealthy },
  }
}

// ─── BMR ─────────────────────────────────────────────────────────────────────

/**
 * Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor equation.
 * Most accurate for general population.
 *
 * Male:   BMR = 10W + 6.25H - 5A + 5
 * Female: BMR = 10W + 6.25H - 5A - 161
 */
export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: Gender
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age
  const bmr = gender === 'male' ? base + 5 : base - 161
  return Math.round(bmr)
}

// ─── TDEE ─────────────────────────────────────────────────────────────────────

export interface TDEEResult {
  tdee: number
  bmr: number
  deficit: number   // -500 kcal (weight loss)
  maintenance: number
  surplus: number   // +300 kcal (muscle gain)
}

/**
 * Calculate Total Daily Energy Expenditure (TDEE).
 * TDEE = BMR × Activity Multiplier
 */
export function calculateTDEE(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: Gender,
  activityLevel: ActivityLevel
): TDEEResult {
  const bmr = calculateBMR(weightKg, heightCm, age, gender)
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel]
  const tdee = Math.round(bmr * multiplier)

  return {
    tdee,
    bmr,
    deficit: tdee - 500,
    maintenance: tdee,
    surplus: tdee + 300,
  }
}

// ─── Macro Targets ───────────────────────────────────────────────────────────

export interface MacroTargets {
  calories: number
  protein: number   // grams
  carbs: number     // grams
  fat: number       // grams
}

/**
 * Calculate daily macro targets based on calorie goal.
 * Uses recommended ratios: 30% protein, 40% carbs, 30% fat
 * Adjusts protein based on goal (higher for muscle gain/fat loss)
 */
export function calculateMacroTargets(
  calories: number,
  weightKg: number,
  goal: string
): MacroTargets {
  let proteinRatio = 0.30
  let carbsRatio = 0.40
  let fatRatio = 0.30

  if (goal === 'build_muscle') {
    proteinRatio = 0.35
    carbsRatio = 0.40
    fatRatio = 0.25
  } else if (goal === 'lose_weight') {
    proteinRatio = 0.35
    carbsRatio = 0.35
    fatRatio = 0.30
  }

  // Protein: at least 1.6g per kg body weight
  const minProteinG = Math.round(weightKg * 1.6)
  const proteinFromRatio = Math.round((calories * proteinRatio) / 4)
  const protein = Math.max(minProteinG, proteinFromRatio)

  // Redistribute remaining calories to carbs and fat
  const proteinCalories = protein * 4
  const remaining = calories - proteinCalories
  const carbs = Math.round((remaining * (carbsRatio / (carbsRatio + fatRatio))) / 4)
  const fat = Math.round((remaining * (fatRatio / (carbsRatio + fatRatio))) / 9)

  return { calories, protein, carbs, fat }
}

// ─── Vitality Score ──────────────────────────────────────────────────────────

/**
 * Calculate the daily vitality score (0-100).
 * Composite of nutrition adherence, hydration, and workout completion.
 */
export function calculateVitalityScore(params: {
  caloriesConsumed: number
  calorieGoal: number
  waterMl: number
  waterGoalMl: number
  workoutDone: boolean
}): number {
  const { caloriesConsumed, calorieGoal, waterMl, waterGoalMl, workoutDone } = params

  // Nutrition score (40 points): within ±200 kcal of goal = full marks
  const calorieDiff = Math.abs(caloriesConsumed - calorieGoal)
  const nutritionScore = Math.max(0, 40 - (calorieDiff / calorieGoal) * 40)

  // Hydration score (30 points): linear to goal
  const hydrationScore = Math.min(30, (waterMl / waterGoalMl) * 30)

  // Workout score (30 points): binary
  const workoutScore = workoutDone ? 30 : 0

  return Math.round(nutritionScore + hydrationScore + workoutScore)
}
