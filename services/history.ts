import { FoodItem } from '@/lib/context/NutritionContext'
import { WorkoutHistoryEntry } from '@/lib/context/WorkoutContext'
import { WeightHistoryEntry, StepsHistoryEntry } from '@/lib/historyStore'

export interface DailyHistory {
  dateStr: string
  meals: FoodItem[]
  workouts: WorkoutHistoryEntry[]
  water: number
  weight: number | null
  steps: number | null
}

export function aggregateDailyHistory(
  loggedMeals: FoodItem[],
  waterLog: { date: number, amount: number }[],
  workoutHistory: WorkoutHistoryEntry[],
  weights: WeightHistoryEntry[],
  steps: StepsHistoryEntry[]
): Record<string, DailyHistory> {
  const historyMap: Record<string, DailyHistory> = {}

  const getOrCreate = (dateStr: string) => {
    if (!historyMap[dateStr]) {
      historyMap[dateStr] = {
        dateStr,
        meals: [],
        workouts: [],
        water: 0,
        weight: null,
        steps: null
      }
    }
    return historyMap[dateStr]
  }

  const getLocalDateString = (ts: number) => {
    const d = new Date(ts)
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  }

  loggedMeals.forEach(m => {
    if (!m.timestamp) return
    getOrCreate(getLocalDateString(m.timestamp)).meals.push(m)
  })

  waterLog.forEach(w => {
    getOrCreate(getLocalDateString(w.date)).water += w.amount
  })

  workoutHistory.forEach(w => {
    getOrCreate(getLocalDateString(w.startTime)).workouts.push(w)
  })

  weights.forEach(w => {
    getOrCreate(w.date).weight = w.weight
  })

  steps.forEach(s => {
    getOrCreate(s.date).steps = s.steps
  })

  return historyMap
}

export function getCalendarDots(day: DailyHistory | undefined) {
  if (!day) return []
  const dots: { color: string, label: string }[] = []
  
  if (day.workouts.length > 0) dots.push({ color: 'bg-primary', label: 'Workout' })
  if (day.meals.length > 0) dots.push({ color: 'bg-orange-500', label: 'Meals' })
  if (day.water > 0) dots.push({ color: 'bg-blue-400', label: 'Water' })
  
  return dots
}
