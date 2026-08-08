'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Utensils, Dumbbell, Droplet, Footprints, Scale, Calendar as CalendarIcon } from 'lucide-react'
import { useNutrition } from '@/lib/context/NutritionContext'
import { useWorkout, EXERCISE_DB } from '@/lib/context/WorkoutContext'
import { useHistoryStore } from '@/lib/historyStore'
import { aggregateDailyHistory, getCalendarDots, DailyHistory } from '@/services/history'

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function HistoryPage() {
  const [currentDate, setCurrentDate] = React.useState(new Date())
  const [selectedDateStr, setSelectedDateStr] = React.useState<string>(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  })
  const [selectedWorkout, setSelectedWorkout] = React.useState<any>(null)

  const { loggedMeals, waterLog } = useNutrition()
  const { workoutHistory } = useWorkout()
  const { weights, steps } = useHistoryStore()

  const aggregatedData = React.useMemo(() => {
    return aggregateDailyHistory(loggedMeals, waterLog, workoutHistory, weights, steps)
  }, [loggedMeals, waterLog, workoutHistory, weights, steps])

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  // Calendar logic
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  
  const calendarDays = []
  // Pad beginning
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null)
  }
  // Actual days
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), i)
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    calendarDays.push({ day: i, dateStr })
  }

  const selectedDayData = aggregatedData[selectedDateStr]

  return (
    <div className="p-4 md:p-8 min-h-screen bg-[#05050A]">
      <h1 className="font-display font-bold text-3xl text-foreground mb-8">History</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CALENDAR SECTION */}
        <div className="lg:col-span-2 glass rounded-3xl p-6 border border-white/5">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-primary" />
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex gap-2">
              <button onClick={prevMonth} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={nextMonth} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2">
            {DAYS_OF_WEEK.map(day => (
              <div key={day} className="text-center text-xs font-bold tracking-widest text-white/40 uppercase py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((cell, idx) => {
              if (!cell) return <div key={`empty-${idx}`} className="aspect-square" />
              
              const isSelected = cell.dateStr === selectedDateStr
              const dayData = aggregatedData[cell.dateStr]
              const dots = getCalendarDots(dayData)
              
              const isToday = cell.dateStr === new Date().toISOString().split('T')[0]

              return (
                <button
                  key={cell.dateStr}
                  onClick={() => setSelectedDateStr(cell.dateStr)}
                  className={`
                    aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-all duration-300
                    ${isSelected ? 'bg-primary/20 border border-primary text-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]' : 'bg-white/5 hover:bg-white/10 border border-transparent'}
                    ${isToday && !isSelected ? 'border-white/20' : ''}
                  `}
                >
                  <span className={`text-lg ${isSelected ? 'font-bold' : 'font-medium'}`}>{cell.day}</span>
                  
                  {/* Dots container */}
                  <div className="absolute bottom-3 flex gap-1">
                    {dots.map((dot, i) => (
                      <div key={i} className={`w-1.5 h-1.5 rounded-full ${dot.color}`} />
                    ))}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* DETAILS SECTION */}
        <div className="lg:col-span-1">
          <div className="glass rounded-3xl p-6 border border-white/5 min-h-[500px] sticky top-8">
            <h3 className="text-lg font-bold mb-6 pb-4 border-b border-white/10 flex items-center justify-between">
              <span>
                {new Date(selectedDateStr + 'T12:00:00').toLocaleDateString('default', { month: 'long', day: 'numeric' })}
              </span>
              {!selectedDayData && <span className="text-xs font-normal text-white/40">No activity logged</span>}
            </h3>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedDateStr}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {!selectedDayData ? (
                  <div className="flex flex-col items-center justify-center h-48 text-white/30 text-center">
                    <CalendarIcon className="w-8 h-8 mb-3 opacity-50" />
                    <p className="text-sm">No records found for this date.</p>
                  </div>
                ) : (
                  <>
                    {/* MEALS */}
                    {selectedDayData.meals.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                          <Utensils className="w-3 h-3" /> Meals
                        </h4>
                        {selectedDayData.meals.map((meal, i) => (
                          <div key={i} className="bg-white/5 rounded-xl p-3 flex justify-between items-center">
                            <div>
                              <p className="font-medium text-sm">{meal.name}</p>
                              <p className="text-xs text-white/50">{meal.portion}</p>
                            </div>
                            <span className="text-sm font-bold text-orange-400">{Math.round(meal.kcal)} kcal</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* WORKOUTS */}
                    {selectedDayData.workouts.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                          <Dumbbell className="w-3 h-3" /> Workouts
                        </h4>
                        {selectedDayData.workouts.map((w, i) => (
                          <div key={i} className="bg-white/5 rounded-xl p-3 cursor-pointer hover:bg-white/10 transition-colors" onClick={() => setSelectedWorkout(w)}>
                            <div className="flex justify-between items-center mb-2">
                              <p className="font-medium text-sm text-primary">{w.name}</p>
                              <span className="text-xs text-white/50">{Math.round(w.elapsedSeconds / 60)} min</span>
                            </div>
                            <div className="space-y-1">
                              {w.exercises.slice(0, 3).map((ex: any, j: number) => (
                                <p key={j} className="text-xs text-white/60 truncate">
                                  • {ex.name || EXERCISE_DB.find(e => e.id === ex.id)?.name || 'Exercise'} 
                                  <span className="text-white/30 ml-1">({ex.sets.length} sets)</span>
                                </p>
                              ))}
                              {w.exercises.length > 3 && (
                                <p className="text-xs text-primary/80 italic mt-1 font-medium underline decoration-primary/30 underline-offset-2">
                                  +{w.exercises.length - 3} more exercises (Click to view full workout)
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* WATER & METRICS */}
                    {(selectedDayData.water > 0 || selectedDayData.weight || selectedDayData.steps) && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                          <Activity className="w-3 h-3" /> Daily Metrics
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedDayData.water > 0 && (
                            <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                                <Droplet className="w-4 h-4 text-blue-400" />
                              </div>
                              <div>
                                <p className="text-xs text-white/50">Water</p>
                                <p className="font-bold text-sm">{(selectedDayData.water / 1000).toFixed(1)}L</p>
                              </div>
                            </div>
                          )}
                          {selectedDayData.steps && (
                            <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                <Footprints className="w-4 h-4 text-green-400" />
                              </div>
                              <div>
                                <p className="text-xs text-white/50">Steps</p>
                                <p className="font-bold text-sm">{selectedDayData.steps.toLocaleString()}</p>
                              </div>
                            </div>
                          )}
                          {selectedDayData.weight && (
                            <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                                <Scale className="w-4 h-4 text-purple-400" />
                              </div>
                              <div>
                                <p className="text-xs text-white/50">Weight</p>
                                <p className="font-bold text-sm">{selectedDayData.weight}kg</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* FULL WORKOUT MODAL */}
      <AnimatePresence>
        {selectedWorkout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedWorkout(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0A0A12] border border-white/10 rounded-3xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">{selectedWorkout.name}</h2>
                  <p className="text-sm text-white/50">
                    {new Date(selectedWorkout.startTime).toLocaleDateString('default', { weekday: 'long', month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedWorkout(null)}
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-8">
                <div className="bg-white/5 rounded-2xl p-3 text-center">
                  <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Duration</p>
                  <p className="font-bold text-white">{Math.round(selectedWorkout.elapsedSeconds / 60)}m</p>
                </div>
                <div className="bg-white/5 rounded-2xl p-3 text-center">
                  <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Volume</p>
                  <p className="font-bold text-white">{selectedWorkout.totalVolume.toLocaleString()}kg</p>
                </div>
                <div className="bg-white/5 rounded-2xl p-3 text-center">
                  <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Calories</p>
                  <p className="font-bold text-orange-400">{Math.round(selectedWorkout.caloriesBurned)} kcal</p>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-white/30 flex items-center gap-2">
                  <Dumbbell className="w-4 h-4" /> Exercises
                </h3>
                
                {selectedWorkout.exercises.map((ex: any, i: number) => (
                  <div key={i} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                    <p className="font-bold text-white mb-3">
                      {i + 1}. {ex.name || EXERCISE_DB.find(e => e.id === ex.id)?.name || 'Exercise'}
                    </p>
                    <div className="space-y-2 pl-4">
                      {ex.sets.map((set: any, j: number) => (
                        <div key={j} className="flex justify-between items-center text-sm">
                          <span className="text-white/40">Set {j + 1}</span>
                          <span className="font-medium text-white/80">
                            {set.weight > 0 ? `${set.weight}kg × ` : ''}{set.reps} reps
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Activity(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/></svg>
}
