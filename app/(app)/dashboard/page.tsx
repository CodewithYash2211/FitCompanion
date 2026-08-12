'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity, Flame, Droplet, Bell, TrendingUp, Zap, ArrowUpRight, Crosshair, Check, Footprints, Target, Dumbbell, Scale, BrainCircuit
} from 'lucide-react'
import { useNutrition } from '@/lib/context/NutritionContext'
import { useWorkout, WorkoutHistoryEntry } from '@/lib/context/WorkoutContext'
import { useUser, WeightEntry } from '@/lib/context/UserContext'
import { aggregateNutrition, DateRangeFilter } from '@/services/analytics'
import { toast } from 'sonner'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useHistoryStore, getLocalDateString } from '@/lib/historyStore'
import { useAuth } from '@/lib/context/AuthContext'

function AnimatedProgress({ value, max }: { value: number, max: number }) {
  const pct = Math.min(100, Math.max(0, (value / (max || 1)) * 100))
  return (
    <div className="h-1 bg-white/10 w-full mt-2 relative overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1, delay: 0.2 }}
        className={`absolute inset-y-0 left-0 ${pct >= 100 ? 'bg-success' : 'bg-white'}`}
      />
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [activeFilter, setActiveFilter] = React.useState<DateRangeFilter>('today')
  const [showNotifications, setShowNotifications] = React.useState(false)
  const [notifications, setNotifications] = React.useState<{id:number, text:string, time:string, unread:boolean}[]>([])

  const { loggedMeals, waterLog } = useNutrition()
  const { workoutHistory } = useWorkout()
  const { profile, targets } = useUser()
  const { weights, steps } = useHistoryStore(user?._id || 'guest')
  
  React.useEffect(() => {
    setIsLoaded(true)
  }, [])

  if (!isLoaded) {
    return (
      <div className="p-8 space-y-8 animate-pulse bg-[#020202] min-h-screen">
        <div className="h-20 bg-white/5 w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-64 bg-white/5 lg:col-span-1" />
          <div className="h-64 bg-white/5 lg:col-span-2" />
        </div>
      </div>
    )
  }

  // Define time bounds based on filter
  const now = new Date()
  let startTimestamp = 0
  let endTimestamp = Date.now()

  if (activeFilter === 'today') {
    startTimestamp = new Date(now).setHours(0,0,0,0)
    endTimestamp = new Date(now).setHours(23,59,59,999)
  } else if (activeFilter === 'yesterday') {
    startTimestamp = new Date(now).setHours(0,0,0,0) - 86400000
    endTimestamp = startTimestamp + 86400000 - 1
  }

  // -- TODAY NUTRITION --
  const activeMeals = loggedMeals.filter(m => (m.timestamp || 0) >= startTimestamp && (m.timestamp || 0) <= endTimestamp)
  const consumedKcal = activeMeals.reduce((acc, m) => acc + (m.kcal * (m.qty || 1)), 0)
  const consumedProtein = activeMeals.reduce((acc, m) => acc + (m.p * (m.qty || 1)), 0)
  const consumedCarbs = activeMeals.reduce((acc, m) => acc + (m.c * (m.qty || 1)), 0)
  const consumedFat = activeMeals.reduce((acc, m) => acc + (m.f * (m.qty || 1)), 0)

  // -- TODAY ACTIVITY --
  const dayWater = waterLog.find(w => w.date >= startTimestamp && w.date <= endTimestamp)?.amount || 0
  
  const targetDateStr = getLocalDateString(startTimestamp)
  const dayStepsEntry = steps.find(s => s.date === targetDateStr)
  const daySteps = dayStepsEntry ? dayStepsEntry.steps : 0

  // -- TODAY FITNESS --
  const dayWorkouts = workoutHistory.filter(w => w.startTime >= startTimestamp && w.startTime <= endTimestamp)
  const workoutCalories = dayWorkouts.reduce((acc, w) => acc + w.caloriesBurned, 0)
  const workoutVolume = dayWorkouts.reduce((acc, w) => acc + w.totalVolume, 0)
  const workoutDuration = dayWorkouts.reduce((acc, w) => acc + w.elapsedSeconds, 0) / 60
  
  // -- BODY --
  const dayWeightEntry = weights.find(w => w.date === targetDateStr)
  const currentWeight = dayWeightEntry ? dayWeightEntry.weight : (weights.length > 0 ? weights[weights.length - 1].weight : 0)
  
  let goalWeightText = "Not set"
  if (profile.targetWeight) {
    goalWeightText = `${profile.targetWeight} kg`
  }

  let weightChange = 0
  if (weights.length > 1) {
    weightChange = currentWeight - weights[weights.length - 2].weight
  }

  // -- PROGRESS (Weekly Averages) --
  const weekStart = new Date(now).setHours(0,0,0,0) - (6 * 86400000)
  const weekMeals = loggedMeals.filter(m => (m.timestamp || 0) >= weekStart)
  const weekKcalAvg = Math.round(weekMeals.reduce((acc, m) => acc + (m.kcal * (m.qty || 1)), 0) / 7)
  const weekProteinAvg = Math.round(weekMeals.reduce((acc, m) => acc + (m.p * (m.qty || 1)), 0) / 7)
  const weekWorkouts = workoutHistory.filter(w => w.startTime >= weekStart).length

  // -- AI INSIGHT --
  const getAIInsight = () => {
    if (dayWorkouts.length > 0 && consumedProtein >= targets.protein) {
      return "Perfect execution today. You crushed your workout and hit your protein goal. Recovery is initiated."
    } else if (dayWorkouts.length > 0) {
      return `Workout complete! You still need ${Math.max(0, targets.protein - consumedProtein)}g of protein to maximize muscle synthesis.`
    } else if (consumedKcal > targets.calories) {
      return "Caloric surplus detected. If you haven't trained today, consider a short activity session to utilize the energy."
    } else {
      return "Rest day or haven't trained yet. Focus on hydration and keeping protein high to maintain mass."
    }
  }

  const unreadCount = notifications.filter(n => n.unread).length
  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })))
    toast.success('All notifications marked as read', { duration: 2000 })
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="min-h-screen bg-[#020202] text-white p-6 md:p-12 pb-24 font-sans selection:bg-white/20"
    >
      {/* Header */}
      <header className="flex justify-between items-end mb-12 border-b border-white/10 pb-8 relative">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-white/50 font-bold uppercase tracking-widest text-sm mb-2 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full bg-success opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 bg-success"></span>
            </span>
            Telemetry Online
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl uppercase tracking-tighter leading-none">
            Dashboard
          </h1>
        </motion.div>
        
        <div className="hidden md:flex gap-4 relative items-center">
           {/* Date Range Dropdown */}
           <div className="relative border border-white/10 hover:border-white/30 transition-colors bg-black h-12 flex items-center px-4 cursor-pointer group">
             <select 
               value={activeFilter}
               onChange={(e) => setActiveFilter(e.target.value as DateRangeFilter)}
               className="bg-transparent text-white uppercase tracking-widest font-bold text-xs focus:outline-none appearance-none cursor-pointer w-full pr-8"
             >
               <option value="today" className="bg-black">Today</option>
               <option value="yesterday" className="bg-black">Yesterday</option>
             </select>
             <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/50 group-hover:text-white transition-colors text-xs">▼</div>
           </div>

           {/* Notifications Dropdown */}
           <div className="relative">
             <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="h-12 w-12 border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors relative"
              >
               <Bell className="w-5 h-5" />
               {unreadCount > 0 && (
                 <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-danger rounded-full border-2 border-[#020202]" />
               )}
             </button>
             
             <AnimatePresence>
               {showNotifications && (
                 <motion.div 
                   initial={{ opacity: 0, y: 10, scale: 0.95 }}
                   animate={{ opacity: 1, y: 0, scale: 1 }}
                   exit={{ opacity: 0, y: 10, scale: 0.95 }}
                   className="absolute top-14 right-0 w-80 bg-[#0a0a0c] border border-white/10 shadow-2xl z-50 overflow-hidden"
                 >
                   <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black">
                     <span className="font-bold text-xs uppercase tracking-widest text-white/50">Alerts</span>
                     {unreadCount > 0 && (
                       <button onClick={markAllRead} className="text-[10px] font-bold text-white hover:text-white/70 uppercase">Mark All Read</button>
                     )}
                   </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-white/50 text-xs font-bold uppercase tracking-widest">
                          No notifications yet.
                        </div>
                      ) : (
                        notifications.map(n => (
                          <div key={n.id} className={`p-4 border-b border-white/5 flex gap-3 ${n.unread ? 'bg-white/[0.02]' : 'opacity-60'}`}>
                            <div className="mt-1">
                              {n.unread ? <div className="w-2 h-2 rounded-full bg-danger" /> : <Check className="w-3 h-3 text-white/40" />}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white/90 leading-snug">{n.text}</p>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mt-2">{n.time}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
               )}
             </AnimatePresence>
           </div>
           
           <button 
              onClick={() => router.push('/fitness')}
              className="h-12 px-6 bg-white text-black font-bold uppercase tracking-widest hover:bg-white/90 transition-colors text-sm hover:scale-105 active:scale-95 duration-200"
            >
             Log Workout
           </button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: TODAY NUTRITION & ACTIVITY */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <h2 className="font-bold text-white/50 uppercase tracking-widest text-xs flex items-center gap-2">
            <Flame className="w-4 h-4" /> Today's Overview
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Calories Card */}
            <div className="bg-[#05050A] border border-white/10 p-6 relative group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-duration-700" />
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-white/50 font-bold uppercase tracking-widest text-xs mb-1">Calories Consumed</div>
                  <div className="font-display font-bold text-4xl tracking-tighter">
                    {consumedKcal.toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white/50 font-bold uppercase tracking-widest text-xs mb-1">Target</div>
                  <div className="font-bold text-xl">{targets.calories > 0 ? targets.calories.toLocaleString() : 'Not set'}</div>
                </div>
              </div>
              <AnimatedProgress value={consumedKcal} max={targets.calories || 1} />
              <div className="mt-4 flex justify-between text-xs font-bold uppercase tracking-widest text-white/40">
                <span>Burned Active: {workoutCalories}</span>
                <span>Remaining: {targets.calories > 0 ? Math.max(0, targets.calories - consumedKcal).toLocaleString() : 'N/A'}</span>
              </div>
            </div>

            {/* Macros Card */}
            <div className="bg-[#05050A] border border-white/10 p-6 flex flex-col justify-between">
              <div className="text-white/50 font-bold uppercase tracking-widest text-xs mb-4">Macronutrients</div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm font-bold uppercase tracking-widest mb-1">
                    <span className="text-white">Protein <span className="text-white/40">({targets.protein > 0 ? `${targets.protein}g` : 'Not set'})</span></span>
                    <span>{consumedProtein}g</span>
                  </div>
                  <AnimatedProgress value={consumedProtein} max={targets.protein || 1} />
                </div>
                <div>
                  <div className="flex justify-between text-sm font-bold uppercase tracking-widest mb-1">
                    <span className="text-white">Carbs <span className="text-white/40">({targets.carbs > 0 ? `${targets.carbs}g` : 'Not set'})</span></span>
                    <span>{consumedCarbs}g</span>
                  </div>
                  <AnimatedProgress value={consumedCarbs} max={targets.carbs || 1} />
                </div>
                <div>
                  <div className="flex justify-between text-sm font-bold uppercase tracking-widest mb-1">
                    <span className="text-white">Fat <span className="text-white/40">({targets.fat > 0 ? `${targets.fat}g` : 'Not set'})</span></span>
                    <span>{consumedFat}g</span>
                  </div>
                  <AnimatedProgress value={consumedFat} max={targets.fat || 1} />
                </div>
              </div>
            </div>

            {/* Activity Card */}
            <div className="bg-[#05050A] border border-white/10 p-6 md:col-span-2 grid grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 text-white/50 font-bold uppercase tracking-widest text-xs mb-2">
                  <Droplet className="w-4 h-4 text-[#3b82f6]" /> Hydration
                </div>
                <div className="font-display font-bold text-3xl tracking-tighter mb-1">
                  {(dayWater / 1000).toFixed(1)} <span className="text-lg text-white/50">L</span>
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2">
                  Target: {targets.water > 0 ? `${targets.water / 1000}L` : 'Not set'}
                </div>
                <AnimatedProgress value={dayWater} max={targets.water || 1} />
              </div>
              <div>
                <div className="flex items-center gap-2 text-white/50 font-bold uppercase tracking-widest text-xs mb-2">
                  <Footprints className="w-4 h-4 text-[#10b981]" /> Steps
                </div>
                <div className="font-display font-bold text-3xl tracking-tighter mb-1">
                  {daySteps.toLocaleString()} <span className="text-lg text-white/50">{targets.steps > 0 ? `/ ${targets.steps.toLocaleString()}` : ''}</span>
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2">
                  Target: {targets.steps > 0 ? targets.steps.toLocaleString() : 'Not set'}
                </div>
                <AnimatedProgress value={daySteps} max={targets.steps || 1} />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: FITNESS, BODY & AI */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Fitness Status */}
          <div className="bg-black border border-white/10 p-6 relative overflow-hidden group">
            <h2 className="font-bold text-white/50 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
              <Dumbbell className="w-4 h-4" /> Fitness Status
            </h2>
            {dayWorkouts.length > 0 ? (
              <div>
                <div className="text-success font-bold text-sm flex items-center gap-2 mb-4 uppercase tracking-widest">
                  <Check className="w-4 h-4" /> Workout Completed
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-white/50 text-sm font-bold uppercase tracking-widest">Duration</span>
                    <span className="font-bold">{Math.round(workoutDuration)} min</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-white/50 text-sm font-bold uppercase tracking-widest">Volume</span>
                    <span className="font-bold">{workoutVolume.toLocaleString()} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50 text-sm font-bold uppercase tracking-widest">Burned</span>
                    <span className="font-bold">{workoutCalories} kcal</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-white/5 flex items-center justify-center rounded-full mx-auto mb-4">
                  <Dumbbell className="w-6 h-6 text-white/30" />
                </div>
                <p className="text-white/50 font-bold text-sm uppercase tracking-widest mb-4">No workout logged yet</p>
                <Link href="/fitness" className="inline-block border border-white/20 px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
                  Start Training
                </Link>
              </div>
            )}
          </div>

          {/* Body Metrics */}
          <div className="bg-[#05050A] border border-white/10 p-6">
            <h2 className="font-bold text-white/50 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
              <Scale className="w-4 h-4" /> Body Metrics
            </h2>
            <div className="flex items-end justify-between mb-4">
              <div>
                <div className="font-display font-bold text-4xl tracking-tighter">
                  {currentWeight.toFixed(1)} <span className="text-xl text-white/50">kg</span>
                </div>
                <div className={`text-xs font-bold uppercase tracking-widest mt-1 ${weights.length > 1 ? (weightChange < 0 ? 'text-success' : 'text-danger') : 'text-white/50'}`}>
                  {weights.length > 1 ? `${weightChange > 0 ? '+' : ''}${weightChange.toFixed(1)} kg since last` : 'No prior data'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-white/50 font-bold uppercase tracking-widest text-[10px] mb-1">Target</div>
                <div className="font-bold text-lg">{goalWeightText}</div>
              </div>
            </div>
          </div>

          {/* AI Coach Insight */}
          <div className="bg-[#121214] border border-white/10 p-6 relative overflow-hidden group hover:border-white/30 transition-colors">
            <h2 className="font-bold text-white/50 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-primary" /> AI Coach Insight
            </h2>
            <p className="text-sm text-white/80 leading-relaxed font-medium">
              {getAIInsight()}
            </p>
            <div className="mt-4 pt-4 border-t border-white/5">
              <Link href="/ai-coach" className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-1 hover:text-white/70 transition-colors">
                Ask Coach <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

        </div>
      </div>
      
      {/* Weekly Progress Section */}
      <div className="mt-6 border-t border-white/10 pt-8">
        <h2 className="font-bold text-white/50 uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" /> 7-Day Trajectory
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#05050A] border border-white/5 p-4 flex justify-between items-center">
            <span className="text-white/50 text-xs font-bold uppercase tracking-widest">Avg Calories</span>
            <span className="font-bold">{weekKcalAvg.toLocaleString()} kcal</span>
          </div>
          <div className="bg-[#05050A] border border-white/5 p-4 flex justify-between items-center">
            <span className="text-white/50 text-xs font-bold uppercase tracking-widest">Avg Protein</span>
            <span className="font-bold">{weekProteinAvg.toLocaleString()} g</span>
          </div>
          <div className="bg-[#05050A] border border-white/5 p-4 flex justify-between items-center">
            <span className="text-white/50 text-xs font-bold uppercase tracking-widest">Training Frequency</span>
            <span className="font-bold">{weekWorkouts} sessions</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
