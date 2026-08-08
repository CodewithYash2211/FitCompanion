import { FoodItem } from '@/lib/context/NutritionContext'
import { WorkoutHistoryEntry, EXERCISE_DB } from '@/lib/context/WorkoutContext'
import { WeightEntry } from '@/lib/context/UserContext'

export type DateRangeFilter = 'today' | 'yesterday' | '7d' | '30d' | '90d' | '180d' | 'ytd' | 'all' | 'custom'

// Helper to get the start time based on filter
export function getStartDateForFilter(filter: DateRangeFilter): number {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  
  if (filter === 'today') return now.getTime()
  if (filter === 'yesterday') return now.getTime() - 86400000
  if (filter === '7d') return now.getTime() - (6 * 86400000)
  if (filter === '30d') return now.getTime() - (29 * 86400000)
  if (filter === '90d') return now.getTime() - (89 * 86400000)
  if (filter === '180d') return now.getTime() - (179 * 86400000)
  if (filter === 'ytd') {
    return new Date(now.getFullYear(), 0, 1).getTime()
  }
  return 0 // 'all'
}

// Generate an array of day labels from start to end (end is today)
export function generateDayBuckets(startDate: number, endDate: number) {
  const buckets: { ts: number; label: string }[] = []
  let curr = startDate
  while (curr <= endDate) {
    const d = new Date(curr)
    buckets.push({
      ts: curr,
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    })
    curr += 86400000
  }
  return buckets
}

export function aggregateNutrition(meals: FoodItem[], filter: DateRangeFilter) {
  const start = getStartDateForFilter(filter)
  const end = new Date().setHours(23, 59, 59, 999)
  
  // Filter meals within range
  let relevantMeals = meals
  if (filter !== 'all') {
     relevantMeals = meals.filter(m => (m.timestamp || 0) >= start && (m.timestamp || 0) <= end)
  }

  // Create buckets if range is bounded
  if (filter === 'today' || filter === 'yesterday') {
    // Single day
    const label = filter === 'today' ? 'Today' : 'Yesterday'
    const calories = relevantMeals.reduce((acc, m) => acc + (m.kcal * (m.qty || 1)), 0)
    const protein = relevantMeals.reduce((acc, m) => acc + (m.p * (m.qty || 1)), 0)
    const carbs = relevantMeals.reduce((acc, m) => acc + (m.c * (m.qty || 1)), 0)
    const fat = relevantMeals.reduce((acc, m) => acc + (m.f * (m.qty || 1)), 0)
    return [{ day: label, calories, protein, carbs, fat }]
  }
  
  if (start > 0) {
    const buckets = generateDayBuckets(start, new Date().setHours(0,0,0,0))
    const aggregated = buckets.map(b => {
      const nextDay = b.ts + 86400000
      const dayMeals = relevantMeals.filter(m => (m.timestamp || 0) >= b.ts && (m.timestamp || 0) < nextDay)
      return {
        day: b.label,
        calories: dayMeals.reduce((acc, m) => acc + (m.kcal * (m.qty || 1)), 0),
        protein: dayMeals.reduce((acc, m) => acc + (m.p * (m.qty || 1)), 0),
        carbs: dayMeals.reduce((acc, m) => acc + (m.c * (m.qty || 1)), 0),
        fat: dayMeals.reduce((acc, m) => acc + (m.f * (m.qty || 1)), 0),
      }
    })
    return aggregated
  }

  return []
}

export function aggregateWeight(weights: WeightEntry[], filter: DateRangeFilter) {
  const start = getStartDateForFilter(filter)
  const relevant = filter === 'all' ? weights : weights.filter(w => w.date >= start)
  return relevant.map(w => ({
    date: new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: w.weight
  }))
}

export function getWeightProgress(weights: WeightEntry[], goalWeight: number) {
  if (weights.length === 0) return null
  const current = weights[weights.length - 1].weight
  const start = weights[0].weight
  const change = current - start
  const remaining = goalWeight - current
  
  // Avg weekly change
  const totalDays = (weights[weights.length - 1].date - weights[0].date) / 86400000
  const weeks = Math.max(1, totalDays / 7)
  const avgWeeklyChange = change / weeks

  return { current, start, change, remaining, avgWeeklyChange }
}

export function aggregateWorkouts(workouts: WorkoutHistoryEntry[], filter: DateRangeFilter) {
  const start = getStartDateForFilter(filter)
  const end = new Date().setHours(23, 59, 59, 999)
  const relevant = filter === 'all' ? workouts : workouts.filter(w => w.endTime >= start && w.endTime <= end)

  let totalVolume = 0
  let totalSets = 0
  let totalReps = 0
  let totalDuration = 0
  let totalCalories = 0
  const muscleGroups: Record<string, number> = {}

  relevant.forEach(w => {
    totalVolume += w.totalVolume
    totalSets += w.totalSets
    totalReps += w.totalReps
    totalDuration += w.elapsedSeconds
    totalCalories += w.caloriesBurned

    // Muscle groups (count sets per category)
    w.exercises.forEach(ex => {
      const def = EXERCISE_DB.find(d => d.id === ex.id)
      if (def) {
        const completedSets = ex.sets.filter(s => s.completed).length
        if (completedSets > 0) {
          muscleGroups[def.category] = (muscleGroups[def.category] || 0) + completedSets
        }
      }
    })
  })

  const muscleArray = Object.keys(muscleGroups).map(k => ({
    name: k,
    value: muscleGroups[k]
  })).sort((a, b) => b.value - a.value)

  return {
    totalWorkouts: relevant.length,
    totalVolume,
    totalSets,
    totalReps,
    totalDuration: Math.round(totalDuration / 60), // in mins
    totalCalories,
    muscleDistribution: muscleArray
  }
}

export function aggregateActivity(waterLog: {date: number, amount: number}[], stepsLog: {date: number, count: number}[], filter: DateRangeFilter) {
  const start = getStartDateForFilter(filter)
  const end = new Date().setHours(23, 59, 59, 999)
  
  const relevantWater = filter === 'all' ? waterLog : waterLog.filter(w => w.date >= start && w.date <= end)
  const relevantSteps = filter === 'all' ? stepsLog : stepsLog.filter(s => s.date >= start && s.date <= end)
  
  if (filter === 'today' || filter === 'yesterday') {
    const label = filter === 'today' ? 'Today' : 'Yesterday'
    const totalWater = relevantWater.reduce((acc, w) => acc + w.amount, 0)
    const totalSteps = relevantSteps.reduce((acc, s) => acc + s.count, 0)
    return [{ day: label, water: totalWater, steps: totalSteps }]
  }
  
  if (start > 0) {
    const buckets = generateDayBuckets(start, new Date().setHours(0,0,0,0))
    return buckets.map(b => {
      const nextDay = b.ts + 86400000
      const dayWater = relevantWater.filter(w => w.date >= b.ts && w.date < nextDay)
      const daySteps = relevantSteps.filter(s => s.date >= b.ts && s.date < nextDay)
      return {
        day: b.label,
        water: dayWater.reduce((acc, w) => acc + w.amount, 0),
        steps: daySteps.reduce((acc, s) => acc + s.count, 0)
      }
    })
  }
  return []
}

export function aggregatePRs(workouts: WorkoutHistoryEntry[]) {
  // Returns max weight for each exercise
  const bests: Record<string, { weight: number, reps: number, date: number, volume: number }> = {}
  workouts.forEach(w => {
    w.exercises.forEach(ex => {
      ex.sets.forEach(s => {
        if (s.completed && s.weight > 0) {
          const currentBest = bests[ex.id]
          if (!currentBest || s.weight > currentBest.weight || (s.weight === currentBest.weight && s.reps > currentBest.reps)) {
            bests[ex.id] = {
              weight: s.weight,
              reps: s.reps,
              date: w.startTime,
              volume: s.weight * s.reps
            }
          }
        }
      })
    })
  })
  return bests
}
