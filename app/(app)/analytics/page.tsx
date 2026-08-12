'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid, ReferenceLine,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, Scatter, ScatterChart, ZAxis
} from 'recharts'
import { useNutrition } from '@/lib/context/NutritionContext'
import { useWorkout, WorkoutHistoryEntry, EXERCISE_DB } from '@/lib/context/WorkoutContext'
import { useUser, WeightEntry } from '@/lib/context/UserContext'
import { aggregateNutrition, aggregateWorkouts, getWeightProgress, aggregateActivity, aggregatePRs, DateRangeFilter } from '@/services/analytics'
import { Plus, Target, Flame, Dumbbell, Droplet, Check, Zap, Footprints, Scale, TrendingUp, Activity } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { useHistoryStore } from '@/lib/historyStore'
import { useAuth } from '@/lib/context/AuthContext'

export default function AnalyticsPage() {
  const { user } = useAuth()
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [activeFilter, setActiveFilter] = React.useState<DateRangeFilter>('30d')
  const [nutritionMetric, setNutritionMetric] = React.useState<'calories' | 'protein' | 'carbs'>('calories')
  
  const { loggedMeals, waterLog } = useNutrition()
  const { workoutHistory } = useWorkout()
  const { profile, targets, currentWeight } = useUser()
  const { weights, steps, saveWeight } = useHistoryStore(user?._id || 'guest')

  const [showWeightModal, setShowWeightModal] = React.useState(false)
  const [weightInput, setWeightInput] = React.useState('')

  React.useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Data Aggregation
  const nutritionData = aggregateNutrition(loggedMeals, activeFilter)
  const workoutMetrics = aggregateWorkouts(workoutHistory, activeFilter)
  
  // Directly use the dedicated stores
  const weightData = weights
  const stepsData = steps
  
  const activityData = aggregateActivity(waterLog, [], activeFilter) // Just for water now
  const prData = aggregatePRs(workoutHistory)
  
  const targetWeightNum = profile.targetWeight

  const weightProgress = React.useMemo(() => {
    if (weights.length === 0) return null
    const current = weights[weights.length - 1].weight
    const start = weights[0].weight
    const change = current - start
    const remaining = targetWeightNum ? (targetWeightNum - current) : null
    const totalDays = (new Date(weights[weights.length - 1].date).getTime() - new Date(weights[0].date).getTime()) / 86400000
    const weeks = Math.max(1, totalDays / 7)
    const avgWeeklyChange = change / weeks
    return { current, start, change, remaining, avgWeeklyChange }
  }, [weights, targetWeightNum])

  if (!isLoaded) {
    return (
      <div className="p-8 space-y-8 animate-pulse bg-[#020202] min-h-screen">
        <div className="h-20 bg-white/5 w-1/3" />
        <div className="h-64 bg-white/5" />
      </div>
    )
  }

  const handleLogWeight = (e: React.FormEvent) => {
    e.preventDefault()
    const w = parseFloat(weightInput)
    if (!isNaN(w) && w > 20 && w < 300) {
      saveWeight(w)
      setWeightInput('')
      setShowWeightModal(false)
      toast.success(`Weight logged: ${w}kg`)
    } else {
      toast.error('Please enter a valid weight')
    }
  }

  const CATEGORY_COLORS: Record<string, string> = {
    'Chest': '#ffffff',
    'Back': '#d4d4d8',
    'Shoulders': '#a1a1aa',
    'Biceps': '#71717a',
    'Triceps': '#52525b',
    'Legs': '#3f3f46',
    'Core': '#27272a',
    'Cardio': '#18181b',
    'Mobility': '#09090b'
  }
  const PIE_COLORS = ['#ffffff', '#cccccc', '#999999', '#666666', '#333333', '#1a1a1a']
  
  // Calculate Step Stats from Dedicated Store
  const totalSteps = stepsData.reduce((acc, d) => acc + d.steps, 0)
  const avgSteps = stepsData.length > 0 ? Math.round(totalSteps / stepsData.length) : 0
  const bestStepDay = stepsData.length > 0 ? Math.max(...stepsData.map(d => d.steps)) : 0

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black border border-white/20 p-3 shadow-2xl">
          <p className="font-bold text-xs uppercase tracking-widest text-white/50 mb-1">{label}</p>
          <p className="font-bold text-lg">
            {payload[0].value} <span className="text-sm font-normal text-white/50">{payload[0].name}</span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="min-h-screen bg-[#020202] text-white p-6 md:p-12 pb-24 font-sans selection:bg-white/20"
    >
      {/* Header & Filter */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-white/10 pb-8 gap-6 relative">
        <div>
          <div className="text-white/50 font-bold uppercase tracking-widest text-sm mb-2">Metrics & Trends</div>
          <h1 className="font-display font-bold text-4xl md:text-5xl uppercase tracking-tighter leading-none">
            Analytics
          </h1>
        </div>

        <div className="flex gap-2 bg-[#121214] p-1 border border-white/5 rounded-md self-start md:self-end overflow-x-auto max-w-full">
          {(['7d', '30d', '90d', '180d', 'ytd', 'all'] as DateRangeFilter[]).map((t) => {
            const isActive = activeFilter === t;
            const label = t === '7d' ? '7D' : t === '30d' ? '1M' : t === '90d' ? '3M' : t === '180d' ? '6M' : t.toUpperCase()
            return (
              <button 
                key={t}
                onClick={() => setActiveFilter(t)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors rounded-sm relative whitespace-nowrap ${isActive ? 'text-black' : 'text-white/50 hover:text-white'}`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="analyticsFilterBg" 
                    className="absolute inset-0 bg-white" 
                    style={{ borderRadius: 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{label}</span>
              </button>
            )
          })}
        </div>
      </header>

      <div className="space-y-12">
        {/* 1. PROGRESS OVERVIEW & WEIGHT */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <h2 className="font-bold text-white/50 uppercase tracking-widest text-xs flex items-center gap-2">
              <Scale className="w-4 h-4" /> Weight Progress
            </h2>
            <button 
              onClick={() => setShowWeightModal(true)}
              className="text-xs font-bold uppercase tracking-widest border border-white/20 px-4 py-2 hover:bg-white hover:text-black transition-colors"
            >
              Log Weight
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-[#05050A] border border-white/10 p-6">
              <div className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">Current</div>
              <div className="font-display font-bold text-3xl tracking-tighter">{weightProgress?.current.toFixed(1) || '--'} kg</div>
            </div>
            <div className="bg-[#05050A] border border-white/10 p-6">
              <div className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">Starting</div>
              <div className="font-display font-bold text-3xl tracking-tighter">{weightProgress?.start.toFixed(1) || '--'} kg</div>
            </div>
            <div className="bg-[#05050A] border border-white/10 p-6">
              <div className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">Change</div>
              <div className={`font-display font-bold text-3xl tracking-tighter ${(weightProgress?.change || 0) < 0 ? 'text-success' : 'text-danger'}`}>
                {(weightProgress?.change || 0) > 0 ? '+' : ''}{weightProgress?.change.toFixed(1) || '--'} kg
              </div>
            </div>
            <div className="bg-[#05050A] border border-white/10 p-6">
              <div className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">Avg Weekly</div>
              <div className="font-display font-bold text-3xl tracking-tighter">
                {(weightProgress?.avgWeeklyChange || 0) > 0 ? '+' : ''}{(weightProgress?.avgWeeklyChange || 0).toFixed(2)} kg
              </div>
            </div>
          </div>
          
          <div className="h-72 bg-black border border-white/10 p-4">
            {weightData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weightData}>
                  <defs>
                    <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ffffff" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="date" stroke="#ffffff40" tick={{fill: '#ffffff40', fontSize: 10}} tickLine={false} axisLine={false} />
                  <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="#ffffff40" tick={{fill: '#ffffff40', fontSize: 10}} tickLine={false} axisLine={false} width={30} />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="weight" name="kg" stroke="#ffffff" strokeWidth={2} fillOpacity={1} fill="url(#weightGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-white/30 text-sm font-bold uppercase tracking-widest">No weight data in range</div>
            )}
          </div>
        </section>

        {/* 2. NUTRITION */}
        <section>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
            <h2 className="font-bold text-white/50 uppercase tracking-widest text-xs flex items-center gap-2">
              <Flame className="w-4 h-4" /> Nutrition Trends
            </h2>
            <div className="flex gap-2">
              {(['calories', 'protein', 'carbs'] as const).map(m => (
                <button 
                  key={m}
                  onClick={() => setNutritionMetric(m)}
                  className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest transition-colors rounded-sm ${nutritionMetric === m ? 'bg-white text-black' : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-72 bg-black border border-white/10 p-4">
            {nutritionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={nutritionData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="day" stroke="#ffffff40" tick={{fill: '#ffffff40', fontSize: 10}} tickLine={false} axisLine={false} />
                  <YAxis stroke="#ffffff40" tick={{fill: '#ffffff40', fontSize: 10}} tickLine={false} axisLine={false} />
                  <RechartsTooltip content={<CustomTooltip />} />
                  {/* Reference line for target */}
                  <ReferenceLine 
                    y={targets[nutritionMetric === 'calories' ? 'calories' : nutritionMetric]} 
                    stroke="#ffffff40" strokeDasharray="3 3" 
                  />
                  <Bar dataKey={nutritionMetric} name={nutritionMetric === 'calories' ? 'kcal' : 'g'} fill="#ffffff" radius={[2, 2, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-white/30 text-sm font-bold uppercase tracking-widest">No nutrition data in range</div>
            )}
          </div>
        </section>

        {/* 3. HYDRATION & ACTIVITY */}
        <section>
          <h2 className="font-bold text-white/50 uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
            <Activity className="w-4 h-4" /> Activity & Hydration
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black border border-white/10 p-6 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <div className="text-white/50 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <Footprints className="w-4 h-4 text-[#10b981]" /> Steps Trend
                </div>
              </div>
              <div className="flex justify-between items-end mb-6">
                <div>
                  <div className="text-white/50 text-[10px] uppercase tracking-widest mb-1">Total Steps</div>
                  <div className="font-bold text-xl">{totalSteps.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-white/50 text-[10px] uppercase tracking-widest mb-1">Avg Daily</div>
                  <div className="font-bold text-xl">{avgSteps.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-white/50 text-[10px] uppercase tracking-widest mb-1">Best Day</div>
                  <div className="font-bold text-xl text-[#10b981]">{bestStepDay.toLocaleString()}</div>
                </div>
              </div>
              <div className="h-48 mt-auto">
                {stepsData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stepsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                      <XAxis dataKey="date" hide />
                      <YAxis hide domain={['dataMin', 'dataMax + 1000']} />
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Line type="monotone" dataKey="steps" name="steps" stroke="#10b981" strokeWidth={3} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-white/30 text-[10px] font-bold uppercase tracking-widest">No data</div>
                )}
              </div>
            </div>
            
            <div className="bg-black border border-white/10 p-6">
              <div className="text-white/50 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                <Droplet className="w-4 h-4 text-[#3b82f6]" /> Hydration Trend
              </div>
              <div className="h-48">
                {activityData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={activityData}>
                      <defs>
                        <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                      <XAxis dataKey="day" hide />
                      <YAxis hide domain={[0, 'dataMax + 1000']} />
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="water" name="ml" stroke="#3b82f6" strokeWidth={3} fill="url(#waterGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-white/30 text-[10px] font-bold uppercase tracking-widest">No data</div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 4. WORKOUT PERFORMANCE & 5. MUSCLE DISTRIBUTION */}
        <section>
          <h2 className="font-bold text-white/50 uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
            <Dumbbell className="w-4 h-4" /> Workout Performance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-[#05050A] border border-white/10 p-6">
              <div className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">Sessions</div>
              <div className="font-display font-bold text-3xl tracking-tighter">{workoutMetrics.totalWorkouts}</div>
            </div>
            <div className="bg-[#05050A] border border-white/10 p-6">
              <div className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">Volume</div>
              <div className="font-display font-bold text-3xl tracking-tighter">{workoutMetrics.totalVolume.toLocaleString()} <span className="text-sm font-normal">kg</span></div>
            </div>
            <div className="bg-[#05050A] border border-white/10 p-6">
              <div className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">Duration</div>
              <div className="font-display font-bold text-3xl tracking-tighter">{workoutMetrics.totalDuration.toLocaleString()} <span className="text-sm font-normal">min</span></div>
            </div>
            <div className="bg-[#05050A] border border-white/10 p-6">
              <div className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">Reps</div>
              <div className="font-display font-bold text-3xl tracking-tighter">{workoutMetrics.totalReps.toLocaleString()}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black border border-white/10 p-6 flex flex-col">
              <div className="text-white/50 text-xs font-bold uppercase tracking-widest mb-4">Muscle Group Distribution (Sets)</div>
              <div className="flex-1 min-h-[250px] relative">
                {workoutMetrics.muscleDistribution.length > 0 ? (
                  <div className="flex h-full items-center">
                    <div className="w-1/2 h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={workoutMetrics.muscleDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                            stroke="none"
                          >
                            {workoutMetrics.muscleDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || PIE_COLORS[index % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="w-1/2 pl-4 space-y-2">
                      {workoutMetrics.muscleDistribution.map((entry, index) => (
                        <div key={entry.name} className="flex justify-between items-center text-sm font-bold">
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[entry.name] || PIE_COLORS[index % PIE_COLORS.length] }}></span>
                            <span>{entry.name}</span>
                          </div>
                          <span className="text-white/50">{entry.value} sets</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-white/30 text-[10px] font-bold uppercase tracking-widest">No data</div>
                )}
              </div>
            </div>
            
            <div className="bg-black border border-white/10 p-6 flex flex-col">
              <div className="text-white/50 text-xs font-bold uppercase tracking-widest mb-4">Personal Records (All Time)</div>
              <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                {Object.keys(prData).length > 0 ? (
                  Object.keys(prData).map(exId => {
                    const def = EXERCISE_DB.find(d => d.id === exId)
                    const exName = def ? def.name : exId
                    const pr = prData[exId]
                    return (
                      <div key={exId} className="flex justify-between items-center border-b border-white/5 pb-3">
                        <div>
                          <div className="font-bold text-sm flex items-center gap-2">
                            <span>🏋️</span> {exName}
                          </div>
                          <div className="text-white/50 text-[10px] uppercase tracking-widest mt-1">
                            {new Date(pr.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-base bg-white/5 px-2 py-1 inline-block border border-white/10 rounded-sm">
                            {pr.weight} kg <span className="text-white/50 text-sm">× {pr.reps}</span>
                          </div>
                          {pr.volume > 0 && <div className="text-[10px] font-bold text-success mt-1">PR ACHIEVED</div>}
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                      <TrendingUp className="w-6 h-6 text-white/30" />
                    </div>
                    <p className="text-white font-bold text-sm mb-1">No personal records yet</p>
                    <p className="text-white/50 text-xs">Complete a few workouts and your best lifts will appear here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Log Weight Modal */}
      <AnimatePresence>
        {showWeightModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-[#0a0a0c] border border-white/10 p-8 w-full max-w-md shadow-2xl relative"
            >
              <button 
                onClick={() => setShowWeightModal(false)}
                className="absolute top-4 right-4 text-white/50 hover:text-white"
              >
                ✕
              </button>
              <h2 className="font-display font-bold text-2xl mb-6">Log Weight</h2>
              <form onSubmit={handleLogWeight}>
                <input 
                  type="number"
                  step="0.1"
                  value={weightInput}
                  onChange={e => setWeightInput(e.target.value)}
                  placeholder="e.g. 75.5"
                  className="w-full bg-black border border-white/10 p-4 text-xl font-bold focus:outline-none focus:border-white transition-colors mb-6 text-center"
                  autoFocus
                />
                <button type="submit" className="w-full bg-white text-black font-bold uppercase tracking-widest p-4 hover:bg-white/90 transition-colors">
                  Save Entry
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
