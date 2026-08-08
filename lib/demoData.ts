import { FoodItem } from './context/NutritionContext'
import { WorkoutHistoryEntry } from './context/WorkoutContext'
import { WeightEntry } from './context/UserContext'

export interface DemoData {
  weights: WeightEntry[]
  meals: FoodItem[]
  workouts: WorkoutHistoryEntry[]
  waterLog: { date: number, amount: number }[]
  stepsLog: { date: number, count: number }[]
}

function mulberry32(a: number) {
  return function() {
    var t = a += 0x6D2B79F5
    t = Math.imul(t ^ t >>> 15, t | 1)
    t ^= t + Math.imul(t ^ t >>> 7, t | 61)
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}

function makeSetId(day: number, exIdx: number, setIdx: number) {
  return `s_${day}_${exIdx}_${setIdx}`
}

// ─── MEAL DATA ────────────────────────────────────────────────────────────────
// 10 options each for B/L/S/D
// Fields: name, portion, kcal, p, c, f
type MealOpt = [string, string, number, number, number, number]

const BKFSTS: MealOpt[] = [
  ['Poha + Curd',            '1 plate',       350, 10, 60,  8],
  ['Omelette + Toast',       '2 eggs + 2 sl', 320, 18, 30, 14],
  ['Idli + Sambar',          '3 idlis',       380, 12, 75,  4],
  ['Masala Dosa',            '1 dosa',        420, 10, 65, 15],
  ['Upma',                   '1 bowl',        300,  8, 50, 10],
  ['Oats + Milk + Banana',   '1 bowl',        450, 15, 75, 10],
  ['Boiled Eggs + Toast',    '3 eggs',        380, 22, 30, 18],
  ['Paneer Bhurji + Roti',   '1 plate',       450, 20, 45, 22],
  ['Egg Bhurji + Roti',      '2 eggs',        380, 20, 35, 18],
  ['Protein Shake + Banana', '1 scoop',       250, 25, 35,  3],
]

const LUNCHES: MealOpt[] = [
  ['Dal Rice + Curd',         '1 plate', 550, 18,  90, 12],
  ['Chicken Curry + Rice',    '1 plate', 650, 45,  75, 20],
  ['Rajma Rice',              '1 plate', 600, 22, 100, 10],
  ['Chole + Roti',            '1 plate', 580, 20,  85, 15],
  ['Chicken Biryani',         '1 plate', 750, 40,  95, 25],
  ['Soya Chunk Curry + Rice', '1 plate', 550, 35,  80, 12],
  ['Grilled Chicken + Rice',  '1 plate', 580, 50,  60, 14],
  ['Fish Curry + Rice',       '1 plate', 620, 40,  72, 16],
  ['Paneer Rice',             '1 plate', 560, 22,  80, 18],
  ['Curd Rice + Pickle',      '1 plate', 400, 10,  65, 10],
]

const SNACKS: MealOpt[] = [
  ['Banana',             '1 medium',     105,  1, 27,  0],
  ['Apple',              '1 medium',      95,  0, 25,  0],
  ['Curd',               '1 cup',        150,  8, 12,  8],
  ['Milk',               '1 glass',      150,  8, 12,  8],
  ['Protein Shake',      '1 scoop',      120, 25,  3,  1],
  ['Roasted Chana',      '1 handful',    120,  6, 18,  2],
  ['Peanuts',            '1 handful',    160,  7,  5, 14],
  ['Protein Bar',        '1 bar',        200, 20, 22,  6],
  ['Makhana',            '1 bowl',       120,  3, 20,  2],
  ['Chips (occasional)', 'small packet', 150,  2, 15, 10],
]

const DINNERS: MealOpt[] = [
  ['Paneer Tikka + Roti',   '1 plate', 480, 25, 35, 28],
  ['Dal + Roti',            '1 plate', 450, 16, 70, 12],
  ['Khichdi + Curd',        '1 bowl',  420, 14, 70, 10],
  ['Chicken Tikka + Roti',  '1 plate', 550, 45, 40, 20],
  ['Chicken Sandwich',      '2 pcs',   450, 30, 50, 16],
  ['Egg Bhurji + Roti',     '1 plate', 470, 22, 45, 24],
  ['Fish Curry + Rice',     '1 plate', 600, 40, 70, 18],
  ['Soya Chunk Curry',      '1 bowl',  420, 35, 45, 10],
  ['Rajma Rice',            '1 plate', 560, 20, 90, 10],
  ['Grilled Chicken + Salad','1 plate',420, 50, 15, 14],
]

// 30 hard-coded daily plans — [bIdx, lIdx, sIdx, dIdx]
// Every row is unique (verified by inspection)
const DAILY_PLAN: [number,number,number,number][] = [
  [0,0,0,0],[1,1,1,1],[2,2,2,2],[3,3,3,3],[4,4,4,4],
  [5,5,5,5],[6,6,6,6],[7,7,7,7],[8,8,8,8],[9,9,9,9],
  [0,1,2,3],[1,2,3,4],[2,3,4,5],[3,4,5,6],[4,5,6,7],
  [5,6,7,8],[6,7,8,9],[7,8,9,0],[8,9,0,1],[9,0,1,2],
  [0,2,4,6],[1,3,5,7],[2,4,6,8],[3,5,7,9],[4,6,8,0],
  [5,7,9,1],[6,8,0,2],[7,9,1,3],[8,0,2,4],[9,1,3,5],
]

export function generateDemoData(): DemoData {
  const rng = mulberry32(99991)
  const now = Date.now()
  const DAY_MS = 86400000

  const weights: WeightEntry[] = []
  const meals: FoodItem[] = []
  const workouts: WorkoutHistoryEntry[] = []
  const waterLog: { date: number, amount: number }[] = []
  const stepsLog: { date: number, count: number }[] = []

  let mealIdCounter = 2000

  const nr = (base: number, spread: number) => Math.max(0, base + Math.floor(rng() * spread - spread / 2))
  const ri = (base: number, spread: number) => Math.round(base + rng() * spread)

  const stepCycle = [6200, 7450, 8100, 5900, 9200, 7800, 10100, 8600, 7300, 9400, 8250, 6850]

  for (let i = 29; i >= 0; i--) {
    const dayStart = new Date(now - i * DAY_MS).setHours(0, 0, 0, 0)
    const day = 29 - i // 0 = oldest day, 29 = today

    // Weight
    const w = 53.8 + ((55.4 - 53.8) / 30) * day + (rng() * 0.2 - 0.1)
    weights.push({ id: `w_demo_${i}`, weight: parseFloat(w.toFixed(1)), date: dayStart + 8 * 3600000 })

    // Water & Steps
    waterLog.push({ date: dayStart, amount: Math.floor(2000 + rng() * 1500) })
    stepsLog.push({ date: dayStart, count: stepCycle[day % stepCycle.length] + Math.floor(rng() * 500 - 250) })

    // Meals — guaranteed unique combination per day
    const [bIdx, lIdx, sIdx, dIdx] = DAILY_PLAN[day]
    const [bName, bPor, bKcal, bP, bC, bF] = BKFSTS[bIdx]
    const [lName, lPor, lKcal, lP, lC, lF] = LUNCHES[lIdx]
    const [sName, sPor, sKcal, sP, sC, sF] = SNACKS[sIdx]
    const [dName, dPor, dKcal, dP, dC, dF] = DINNERS[dIdx]

    meals.push({ id: mealIdCounter++, name: bName, portion: bPor, kcal: nr(bKcal,30), p: nr(bP,4), c: nr(bC,10), f: nr(bF,4), qty: 1, timestamp: dayStart + 8*3600000, isDemo: true } as any)
    meals.push({ id: mealIdCounter++, name: lName, portion: lPor, kcal: nr(lKcal,40), p: nr(lP,6), c: nr(lC,14), f: nr(lF,6), qty: 1, timestamp: dayStart + 13*3600000, isDemo: true } as any)
    meals.push({ id: mealIdCounter++, name: sName, portion: sPor, kcal: sKcal,        p: sP,       c: sC,         f: sF,       qty: 1, timestamp: dayStart + 16*3600000, isDemo: true } as any)
    meals.push({ id: mealIdCounter++, name: dName, portion: dPor, kcal: nr(dKcal,40), p: nr(dP,6), c: nr(dC,12), f: nr(dF,6), qty: 1, timestamp: dayStart + 20*3600000, isDemo: true } as any)

    // Workouts — PPL split, Sunday rest
    const dow = new Date(dayStart).getDay()
    if (dow === 0) continue

    type ExSet = { id: string; weight: number; reps: number; completed: boolean }
    type Ex = { id: string; name: string; sets: ExSet[] }
    const exs: Ex[] = []

    const mkSet = (exIdx: number, setIdx: number, weight: number, reps: number): ExSet =>
      ({ id: makeSetId(day, exIdx, setIdx), weight, reps, completed: true })

    if (dow === 1 || dow === 4) {
      // PUSH
      exs.push({ id: 'c1', name: 'Bench Press', sets: [mkSet(0,0,ri(62,15),ri(9,3)), mkSet(0,1,ri(70,10),ri(7,2)), mkSet(0,2,ri(75,8),ri(6,2))] })
      exs.push({ id: 'c2', name: 'Incline Dumbbell Press', sets: [mkSet(1,0,ri(20,5),ri(12,3)), mkSet(1,1,ri(22,5),ri(10,2)), mkSet(1,2,ri(25,4),ri(8,2))] })
      exs.push({ id: 's1', name: 'Shoulder Press', sets: [mkSet(2,0,ri(40,10),ri(10,3)), mkSet(2,1,ri(45,8),ri(8,2)), mkSet(2,2,ri(50,8),ri(6,2))] })
      exs.push({ id: 's2', name: 'Lateral Raise', sets: [mkSet(3,0,ri(10,3),ri(15,3)), mkSet(3,1,ri(10,3),ri(15,2)), mkSet(3,2,ri(12,3),ri(12,2))] })
      exs.push({ id: 't1', name: 'Tricep Pushdown', sets: [mkSet(4,0,ri(25,5),ri(12,3)), mkSet(4,1,ri(27,5),ri(10,2)), mkSet(4,2,ri(30,5),ri(8,2))] })
    } else if (dow === 2 || dow === 5) {
      // PULL
      exs.push({ id: 'b2', name: 'Lat Pulldown', sets: [mkSet(0,0,ri(55,10),ri(12,3)), mkSet(0,1,ri(60,10),ri(10,2)), mkSet(0,2,ri(65,8),ri(8,2))] })
      exs.push({ id: 'b3', name: 'Barbell Row', sets: [mkSet(1,0,ri(50,10),ri(10,3)), mkSet(1,1,ri(55,10),ri(10,2)), mkSet(1,2,ri(60,8),ri(8,2))] })
      exs.push({ id: 'b5', name: 'Seated Cable Row', sets: [mkSet(2,0,ri(45,8),ri(12,3)), mkSet(2,1,ri(50,8),ri(10,2)), mkSet(2,2,ri(55,6),ri(8,2))] })
      exs.push({ id: 's3', name: 'Face Pull', sets: [mkSet(3,0,ri(15,5),ri(15,3)), mkSet(3,1,ri(18,5),ri(15,3)), mkSet(3,2,ri(20,5),ri(12,2))] })
      exs.push({ id: 'a1', name: 'Barbell Curl', sets: [mkSet(4,0,ri(25,5),ri(12,3)), mkSet(4,1,ri(28,5),ri(10,2)), mkSet(4,2,ri(30,5),ri(8,2))] })
      exs.push({ id: 'a2', name: 'Hammer Curl', sets: [mkSet(5,0,ri(12,4),ri(12,3)), mkSet(5,1,ri(14,4),ri(10,2)), mkSet(5,2,ri(15,4),ri(10,2))] })
    } else if (dow === 3) {
      // LEGS
      exs.push({ id: 'l1', name: 'Squat', sets: [mkSet(0,0,ri(82,20),ri(8,3)), mkSet(0,1,ri(92,15),ri(6,2)), mkSet(0,2,ri(100,12),ri(5,2))] })
      exs.push({ id: 'l2', name: 'Leg Press', sets: [mkSet(1,0,ri(150,20),ri(10,3)), mkSet(1,1,ri(165,20),ri(8,2)), mkSet(1,2,ri(180,15),ri(6,2))] })
      exs.push({ id: 'b4', name: 'Romanian Deadlift', sets: [mkSet(2,0,ri(60,15),ri(10,3)), mkSet(2,1,ri(70,12),ri(8,2)), mkSet(2,2,ri(80,10),ri(8,2))] })
      exs.push({ id: 'l4', name: 'Leg Curl', sets: [mkSet(3,0,ri(35,8),ri(15,3)), mkSet(3,1,ri(40,8),ri(12,2)), mkSet(3,2,ri(45,8),ri(10,2))] })
      exs.push({ id: 'l5', name: 'Calf Raise', sets: [mkSet(4,0,ri(60,20),ri(20,4)), mkSet(4,1,ri(65,20),ri(15,3)), mkSet(4,2,ri(70,20),ri(15,3))] })
    } else if (dow === 6) {
      // LEGS + CORE
      exs.push({ id: 'l1', name: 'Squat', sets: [mkSet(0,0,ri(75,20),ri(8,3)), mkSet(0,1,ri(85,15),ri(6,2)), mkSet(0,2,ri(95,12),ri(5,2))] })
      exs.push({ id: 'l2', name: 'Leg Press', sets: [mkSet(1,0,ri(140,20),ri(10,3)), mkSet(1,1,ri(155,20),ri(8,2)), mkSet(1,2,ri(170,15),ri(6,2))] })
      exs.push({ id: 'l4', name: 'Leg Curl', sets: [mkSet(2,0,ri(35,8),ri(15,3)), mkSet(2,1,ri(40,8),ri(12,2)), mkSet(2,2,ri(45,8),ri(10,2))] })
      exs.push({ id: 'l5', name: 'Calf Raise', sets: [mkSet(3,0,ri(60,20),ri(20,4)), mkSet(3,1,ri(65,20),ri(18,3)), mkSet(3,2,ri(70,20),ri(15,3))] })
      exs.push({ id: 'core1', name: 'Crunches', sets: [mkSet(4,0,0,ri(20,5)), mkSet(4,1,0,ri(20,5)), mkSet(4,2,0,ri(20,5))] })
      exs.push({ id: 'core2', name: 'Plank', sets: [mkSet(5,0,0,ri(60,15)), mkSet(5,1,0,ri(60,15)), mkSet(5,2,0,ri(60,15))] })
    }

    let vol = 0, totalSets = 0, totalReps = 0
    for (const ex of exs) {
      for (const s of ex.sets) {
        vol += s.weight > 0 ? s.weight * s.reps : s.reps
        totalReps += s.reps
        totalSets++
      }
    }

    const splitName = dow === 1 || dow === 4 ? 'Push' :
                      dow === 2 || dow === 5 ? 'Pull' :
                      dow === 3 ? 'Legs' : 'Legs + Core'
    const dur = ri(2700, 900)

    workouts.push({
      id: `wk_demo_${i}`, name: splitName,
      startTime: dayStart + 17 * 3600000,
      endTime: dayStart + 17 * 3600000 + dur * 1000,
      elapsedSeconds: dur, isPaused: false,
      exercises: exs, totalVolume: vol,
      caloriesBurned: ri(260, 100),
      totalSets, totalReps,
      isDemo: true,
    } as any)
  }

  return { weights, meals, workouts, waterLog, stepsLog }
}
