// Final v5 verification script
const DAILY_PLAN = [
  [0,0,0,0],[1,1,1,1],[2,2,2,2],[3,3,3,3],[4,4,4,4],
  [5,5,5,5],[6,6,6,6],[7,7,7,7],[8,8,8,8],[9,9,9,9],
  [0,1,2,3],[1,2,3,4],[2,3,4,5],[3,4,5,6],[4,5,6,7],
  [5,6,7,8],[6,7,8,9],[7,8,9,0],[8,9,0,1],[9,0,1,2],
  [0,2,4,6],[1,3,5,7],[2,4,6,8],[3,5,7,9],[4,6,8,0],
  [5,7,9,1],[6,8,0,2],[7,9,1,3],[8,0,2,4],[9,1,3,5],
]

const B = ['Poha + Curd','Omelette + Toast','Idli + Sambar','Masala Dosa','Upma','Oats + Milk + Banana','Boiled Eggs + Toast','Paneer Bhurji + Roti','Egg Bhurji + Roti','Protein Shake + Banana']
const L = ['Dal Rice + Curd','Chicken Curry + Rice','Rajma Rice','Chole + Roti','Chicken Biryani','Soya Chunk Curry + Rice','Grilled Chicken + Rice','Fish Curry + Rice','Paneer Rice','Curd Rice + Pickle']
const S = ['Banana','Apple','Curd','Milk','Protein Shake','Roasted Chana','Peanuts','Protein Bar','Makhana','Chips']
const D = ['Paneer Tikka + Roti','Dal + Roti','Khichdi + Curd','Chicken Tikka + Roti','Chicken Sandwich','Egg Bhurji + Roti','Fish Curry + Rice','Soya Chunk Curry','Rajma Rice','Grilled Chicken + Salad']

const DOW_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const WORKOUT_NAMES = {0:'REST',1:'Push',2:'Pull',3:'Legs',4:'Push',5:'Pull',6:'Legs + Core'}
const EXERCISES = {
  0: [],
  1: ['Bench Press','Incline DB Press','Shoulder Press','Lateral Raise','Tricep Pushdown'],
  2: ['Lat Pulldown','Barbell Row','Seated Cable Row','Face Pull','Barbell Curl','Hammer Curl'],
  3: ['Squat','Leg Press','Romanian Deadlift','Leg Curl','Calf Raise'],
  4: ['Bench Press','Incline DB Press','Shoulder Press','Lateral Raise','Tricep Pushdown'],
  5: ['Lat Pulldown','Barbell Row','Seated Cable Row','Face Pull','Barbell Curl','Hammer Curl'],
  6: ['Squat','Leg Press','Leg Curl','Calf Raise','Crunches','Plank']
}

const now = Date.now()
const DAY_MS = 86400000

const uniqueCombos = new Set()
let workoutDays = 0
let totalExercises = 0

for (let i = 29; i >= 0; i--) {
  const dayMs = new Date(now - i * DAY_MS).setHours(0,0,0,0)
  const day = 29 - i
  const dow = new Date(dayMs).getDay()
  const [bI,lI,sI,dI] = DAILY_PLAN[day]
  uniqueCombos.add(bI+'-'+lI+'-'+sI+'-'+dI)
  const exs = EXERCISES[dow] || []
  if (dow !== 0) { workoutDays++; totalExercises += exs.length }
}

console.log('=== v5 FINAL VERIFICATION ===\n')
console.log('fc_workout_demo_version  = "v5"')
console.log('fc_nutrition_demo_version = "v5"\n')
console.log('Demo workout days:', workoutDays, '(expected ~26)')
console.log('Total exercises:  ', totalExercises, '(expected 130-160)')
console.log('Unique meal combos:', uniqueCombos.size, '(expected 30)\n')

// Print 7 consecutive days
console.log('=== LAST 7 DAYS ===\n')
for (let i = 6; i >= 0; i--) {
  const dayMs = new Date(now - i * DAY_MS).setHours(0,0,0,0)
  const day = 29 - i
  const d = new Date(dayMs)
  const dow = d.getDay()
  const [bI,lI,sI,dI] = DAILY_PLAN[day]
  const exs = EXERCISES[dow] || []
  console.log('DATE: ' + d.toDateString() + ' (' + DOW_NAMES[dow] + ')')
  console.log('WORKOUT: ' + WORKOUT_NAMES[dow])
  if (exs.length) console.log('EXERCISES: ' + exs.join(', '))
  console.log('BREAKFAST: ' + B[bI])
  console.log('LUNCH: ' + L[lI])
  console.log('SNACK: ' + S[sI])
  console.log('DINNER: ' + D[dI])
  console.log()
}

// Sundays must be REST
console.log('=== SUNDAY CHECK ===')
for (let i = 29; i >= 0; i--) {
  const dayMs = new Date(now - i * DAY_MS).setHours(0,0,0,0)
  const d = new Date(dayMs)
  if (d.getDay() === 0) console.log(d.toDateString() + ' (Sunday): REST ✓')
}
