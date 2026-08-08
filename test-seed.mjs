// test-seed.mjs
function mulberry32(a) {
  return function() {
    var t = a += 0x6D2B79F5
    t = Math.imul(t ^ t >>> 15, t | 1)
    t ^= t + Math.imul(t ^ t >>> 7, t | 61)
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}

const rng = mulberry32(12345)
const now = Date.now()
const DAY_MS = 86400000

const meals = []
const workouts = []
let mealIdCounter = 1000

for (let i = 29; i >= 0; i--) {
  const dayStart = new Date(now - i * DAY_MS).setHours(0, 0, 0, 0)
  
  const breakfasts = [
    { name: 'Poha + curd', portion: '1 plate', baseKcal: 350, baseP: 10, baseC: 60, baseF: 8 },
    { name: 'Omelette + toast', portion: '2 eggs', baseKcal: 320, baseP: 18, baseC: 30, baseF: 14 },
    { name: 'Idli + sambar', portion: '3 pieces', baseKcal: 380, baseP: 12, baseC: 75, baseF: 4 },
    { name: 'Masala dosa', portion: '1 dosa', baseKcal: 420, baseP: 10, baseC: 65, baseF: 15 },
    { name: 'Upma', portion: '1 bowl', baseKcal: 300, baseP: 8, baseC: 50, baseF: 10 },
    { name: 'Oats + milk + banana', portion: '1 bowl', baseKcal: 450, baseP: 15, baseC: 75, baseF: 10 },
    { name: 'Boiled eggs + toast', portion: '3 eggs', baseKcal: 380, baseP: 22, baseC: 30, baseF: 18 },
    { name: 'Paneer bhurji + roti', portion: '1 plate', baseKcal: 450, baseP: 20, baseC: 45, baseF: 22 },
    { name: 'Protein shake + fruit', portion: '1 scoop', baseKcal: 250, baseP: 25, baseC: 35, baseF: 2 }
  ]

  const lunches = [
    { name: 'Dal rice + curd', portion: '1 plate', baseKcal: 550, baseP: 18, baseC: 90, baseF: 12 },
    { name: 'Chicken curry + rice', portion: '1 plate', baseKcal: 650, baseP: 45, baseC: 75, baseF: 20 },
    { name: 'Rajma rice', portion: '1 plate', baseKcal: 600, baseP: 22, baseC: 100, baseF: 10 },
    { name: 'Chole + roti', portion: '1 plate', baseKcal: 580, baseP: 20, baseC: 85, baseF: 15 },
    { name: 'Chicken biryani', portion: '1 plate', baseKcal: 750, baseP: 40, baseC: 95, baseF: 25 },
    { name: 'Soya chunk curry + rice', portion: '1 plate', baseKcal: 550, baseP: 35, baseC: 80, baseF: 12 },
    { name: 'Curd rice + pickle', portion: '1 plate', baseKcal: 400, baseP: 10, baseC: 65, baseF: 10 }
  ]

  const dinners = [
    { name: 'Paneer tikka', portion: '1 plate', baseKcal: 450, baseP: 25, baseC: 15, baseF: 32 },
    { name: 'Grilled chicken + veg', portion: '1 plate', baseKcal: 450, baseP: 50, baseC: 20, baseF: 15 },
    { name: 'Egg bhurji + roti', portion: '1 plate', baseKcal: 480, baseP: 22, baseC: 45, baseF: 25 },
    { name: 'Chicken sandwich', portion: '2 pieces', baseKcal: 450, baseP: 30, baseC: 50, baseF: 16 },
    { name: 'Fish curry + rice', portion: '1 plate', baseKcal: 600, baseP: 40, baseC: 70, baseF: 18 },
    { name: 'Khichdi + curd', portion: '1 bowl', baseKcal: 420, baseP: 14, baseC: 70, baseF: 10 },
    { name: 'Chicken tikka + roti', portion: '1 plate', baseKcal: 550, baseP: 45, baseC: 40, baseF: 20 }
  ]

  const snacks = [
    { name: 'Banana', portion: '1 medium', baseKcal: 105, baseP: 1, baseC: 27, baseF: 0 },
    { name: 'Apple', portion: '1 medium', baseKcal: 95, baseP: 0, baseC: 25, baseF: 0 },
    { name: 'Curd', portion: '1 cup', baseKcal: 150, baseP: 8, baseC: 12, baseF: 8 },
    { name: 'Milk', portion: '1 glass', baseKcal: 150, baseP: 8, baseC: 12, baseF: 8 },
    { name: 'Protein shake', portion: '1 scoop', baseKcal: 120, baseP: 25, baseC: 3, baseF: 1 },
    { name: 'Roasted chana', portion: '1 handful', baseKcal: 120, baseP: 6, baseC: 18, baseF: 2 },
    { name: 'Peanuts', portion: '1 handful', baseKcal: 160, baseP: 7, baseC: 5, baseF: 14 },
    { name: 'Protein bar', portion: '1 bar', baseKcal: 200, baseP: 20, baseC: 22, baseF: 6 },
    { name: 'Makhana', portion: '1 bowl', baseKcal: 120, baseP: 3, baseC: 20, baseF: 2 },
    { name: 'Chips occasionally', portion: 'small packet', baseKcal: 150, baseP: 2, baseC: 15, baseF: 10 }
  ]

  // Use day offset (i) to deterministically ensure no consecutive day uses the same index combo
  const bMenu = breakfasts[(i + Math.floor(rng() * 3)) % breakfasts.length]
  meals.push({
    id: mealIdCounter++,
    name: bMenu.name, portion: bMenu.portion,
    kcal: bMenu.baseKcal + Math.floor(rng() * 20 - 10),
    p: bMenu.baseP + Math.floor(rng() * 4 - 2),
    c: bMenu.baseC + Math.floor(rng() * 10 - 5),
    f: bMenu.baseF + Math.floor(rng() * 6 - 3),
    qty: 1, timestamp: dayStart + 8 * 3600000, date: dayStart,
    isDemo: true
  })

  const lMenu = lunches[(i + 2 + Math.floor(rng() * 3)) % lunches.length]
  meals.push({
    id: mealIdCounter++,
    name: lMenu.name, portion: lMenu.portion,
    kcal: lMenu.baseKcal + Math.floor(rng() * 30 - 15),
    p: lMenu.baseP + Math.floor(rng() * 6 - 3),
    c: lMenu.baseC + Math.floor(rng() * 12 - 6),
    f: lMenu.baseF + Math.floor(rng() * 8 - 4),
    qty: 1, timestamp: dayStart + 13 * 3600000, date: dayStart,
    isDemo: true
  })

  const sMenu = snacks[(i + 4 + Math.floor(rng() * 3)) % snacks.length]
  meals.push({
    id: mealIdCounter++,
    name: sMenu.name, portion: sMenu.portion,
    kcal: sMenu.baseKcal, p: sMenu.baseP, c: sMenu.baseC, f: sMenu.baseF,
    qty: 1, timestamp: dayStart + 16 * 3600000, date: dayStart,
    isDemo: true
  })

  const dMenu = dinners[(i + 1 + Math.floor(rng() * 3)) % dinners.length]
  meals.push({
    id: mealIdCounter++,
    name: dMenu.name, portion: dMenu.portion,
    kcal: dMenu.baseKcal + Math.floor(rng() * 30 - 15),
    p: dMenu.baseP + Math.floor(rng() * 6 - 3),
    c: dMenu.baseC + Math.floor(rng() * 10 - 5),
    f: dMenu.baseF + Math.floor(rng() * 8 - 4),
    qty: 1, timestamp: dayStart + 20 * 3600000, date: dayStart,
    isDemo: true
  })

  // Workouts (Push, Pull, Legs PPL Split. Sunday Rest)
  const dayOfWeek = new Date(dayStart).getDay()
  if (dayOfWeek !== 0) { // Not Sunday
    const splitMap = {
      1: 'Push',
      2: 'Pull',
      3: 'Legs',
      4: 'Push',
      5: 'Pull',
      6: 'Legs + Core'
    }
    const workoutName = splitMap[dayOfWeek] || 'Full Body'
    
    const exercises = []
    
    if (dayOfWeek === 1 || dayOfWeek === 4) { // Push
      exercises.push({ id: 'c1', name: 'Barbell Bench Press' })
      exercises.push({ id: 'c2', name: 'Incline Dumbbell Press' })
      exercises.push({ id: 's1', name: 'Shoulder Press' })
      exercises.push({ id: 's2', name: 'Lateral Raise' })
      exercises.push({ id: 't1', name: 'Tricep Pushdown' })
    } else if (dayOfWeek === 2 || dayOfWeek === 5) { // Pull
      exercises.push({ id: 'b2', name: 'Lat Pulldown' })
      exercises.push({ id: 'b3', name: 'Barbell Row' })
      exercises.push({ id: 'b5', name: 'Seated Cable Row' })
      exercises.push({ id: 's3', name: 'Face Pull' })
      exercises.push({ id: 'a1', name: 'Barbell Curl' })
      exercises.push({ id: 'a2', name: 'Hammer Curl' })
    } else if (dayOfWeek === 3 || dayOfWeek === 6) { // Legs / Legs + Core
      exercises.push({ id: 'l1', name: 'Barbell Squat' })
      exercises.push({ id: 'l2', name: 'Leg Press' })
      exercises.push({ id: 'b4', name: 'Romanian Deadlift' })
      exercises.push({ id: 'l4', name: 'Hamstring Curl' })
      exercises.push({ id: 'l5', name: 'Calf Raise' })

      if (dayOfWeek === 6) { // Add core
        exercises.push({ id: 'core1', name: 'Crunches' })
        exercises.push({ id: 'core2', name: 'Plank' })
      }
    }
    
    workouts.push({
      name: workoutName,
      date: dayStart,
      exercises
    })
  }
}

// Verification output
let totalWorkouts = workouts.length;
let totalExercises = workouts.reduce((sum, w) => sum + w.exercises.length, 0);
let totalMeals = meals.length;

let uniqueCombinations = new Set();
for (let i = 29; i >= 0; i--) {
  const dayStart = new Date(now - i * DAY_MS).setHours(0, 0, 0, 0)
  const dayMeals = meals.filter(m => m.date === dayStart).map(m => m.name).join(' | ');
  uniqueCombinations.add(dayMeals);
}

console.log("Demo seed version: v4\n")
console.log("Demo workouts: " + totalWorkouts)
console.log("Demo workout exercises: " + totalExercises)
console.log("Demo meals: " + totalMeals)
console.log("Demo meal variety: " + uniqueCombinations.size + " unique combinations\n")

for (let i = 29; i >= 25; i--) { // Print 5 days
  const dayStart = new Date(now - i * DAY_MS).setHours(0, 0, 0, 0)
  const dateStr = new Date(dayStart).toDateString()
  
  const w = workouts.find(w => w.date === dayStart)
  const wName = w ? w.name : "REST DAY"
  const exList = w ? w.exercises.map(e => e.name).join(', ') : "None"
  
  const dayMeals = meals.filter(m => m.date === dayStart)
  let tKcal = 0, tP = 0, tC = 0, tF = 0;
  dayMeals.forEach(m => { tKcal+=m.kcal; tP+=m.p; tC+=m.c; tF+=m.f; })

  console.log(`DATE: ${dateStr}`)
  console.log(`WORKOUT: ${wName}`)
  console.log(`EXERCISES: ${exList}`)
  console.log(`BREAKFAST: ${dayMeals[0]?.name}`)
  console.log(`LUNCH: ${dayMeals[1]?.name}`)
  console.log(`SNACK: ${dayMeals[2]?.name}`)
  console.log(`DINNER: ${dayMeals[3]?.name}`)
  console.log(`CALORIES: ${tKcal}`)
  console.log(`PROTEIN: ${tP}`)
  console.log(`CARBS: ${tC}`)
  console.log(`FAT: ${tF}\n`)
}
