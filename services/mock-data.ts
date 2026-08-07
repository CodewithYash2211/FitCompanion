/**
 * Mock Data Service for Phase 3 Dashboard
 * Simulates a realistic student profile (not 100% perfect).
 */

export interface DashboardData {
  timeOfDay: 'Morning' | 'Afternoon' | 'Evening'
  user: {
    firstName: string
    streak: number
  }
  healthScore: number
  nutrition: {
    calories: { current: number; max: number }
    protein: { current: number; max: number }
    carbs: { current: number; max: number }
    fat: { current: number; max: number }
  }
  water: { current: number; max: number }
  workout: {
    completed: boolean
    title: string
    duration?: number // minutes
  }
  steps: number
  sleep: { hours: number; minutes: number }
  weight: { current: number; trend: number; history: Array<{ day: string; weight: number }> }
  aiCoach: {
    quote: string
    insight: string
  }
  timeline: Array<{ id: string; time: string; title: string; description: string; type: 'meal' | 'water' | 'workout' | 'insight' }>
}

export function getMockDashboardData(): DashboardData {
  const currentHour = new Date().getHours()
  let timeOfDay: 'Morning' | 'Afternoon' | 'Evening' = 'Afternoon'
  
  if (currentHour >= 5 && currentHour < 12) {
    timeOfDay = 'Morning'
  } else if (currentHour >= 12 && currentHour < 17) {
    timeOfDay = 'Afternoon'
  } else {
    timeOfDay = 'Evening'
  }

  // Generate realistic weight history (slightly fluctuating but trending down)
  const weightHistory = [
    { day: 'Mon', weight: 56.5 },
    { day: 'Tue', weight: 56.1 },
    { day: 'Wed', weight: 55.8 },
    { day: 'Thu', weight: 55.9 },
    { day: 'Fri', weight: 55.5 },
    { day: 'Sat', weight: 55.4 },
    { day: 'Sun', weight: 55.2 },
  ]

  // Time-based AI context
  const aiContext = timeOfDay === 'Morning' 
    ? {
        quote: "Discipline is doing what you hate to do, but doing it like you love it.",
        insight: "Good morning! Based on your 6h 45m sleep, let's keep today's workout light. Focus on protein early to curb cravings later.",
      }
    : {
        quote: "Success is what happens when you survive all your mistakes.",
        insight: "You're slightly below today's protein target. A glass of milk with roasted chana or paneer before bed will help you reach your goal.",
      }

  return {
    timeOfDay,
    user: {
      firstName: 'Yash',
      streak: 11,
    },
    healthScore: 82, // Realistic, not perfect
    nutrition: {
      calories: { current: 2100, max: 2600 },
      protein: { current: 96, max: 130 },
      carbs: { current: 220, max: 300 },
      fat: { current: 58, max: 75 },
    },
    water: { current: 2100, max: 3000 }, // in ml
    workout: {
      completed: true,
      title: 'Upper Body Power',
      duration: 45,
    },
    steps: 6842,
    sleep: { hours: 6, minutes: 45 },
    weight: {
      current: 55.2,
      trend: -1.3, // -1.3kg this week
      history: weightHistory,
    },
    aiCoach: aiContext,
    timeline: [
      { id: '1', time: '10 mins ago', title: 'Water logged', description: '250ml drank', type: 'water' },
      { id: '2', time: '2 hours ago', title: 'Hostel Dinner', description: 'Dal makhani, 3 rotis', type: 'meal' },
      { id: '3', time: '5 hours ago', title: 'Workout completed', description: 'Upper Body Power (45m)', type: 'workout' },
      { id: '4', time: '8 hours ago', title: 'Hostel Lunch', description: 'Rice, mixed veg, curd', type: 'meal' },
    ]
  }
}
