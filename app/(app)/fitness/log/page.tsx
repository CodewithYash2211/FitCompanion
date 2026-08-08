'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Search, Check, Minus, Play, Pause, Square, Info, Activity, Flame, Dumbbell, Repeat, X, ArrowRight
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useWorkout, EXERCISE_DB } from '@/lib/context/WorkoutContext'
import Link from 'next/link'

function formatTime(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  if (h > 0) return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

const CATEGORIES = ['All', 'Upper Body', 'Lower Body', 'Core', 'Full Body', 'Cardio']

export default function WorkoutSessionPage() {
  const router = useRouter()
  const { 
    activeSession, 
    addExerciseToSession, 
    addSet, 
    removeSet, 
    updateSet, 
    toggleSetComplete,
    isResting,
    restRemaining,
    restDuration,
    restIsPaused,
    startRestTimer,
    pauseRestTimer,
    resumeRestTimer,
    skipRestTimer,
    pauseWorkout,
    resumeWorkout,
    finishWorkout,
    showSummaryModal,
    dismissSummaryModal
  } = useWorkout()

  const [showExerciseModal, setShowExerciseModal] = React.useState(false)
  const [exerciseSearch, setExerciseSearch] = React.useState('')
  const [selectedCategory, setSelectedCategory] = React.useState('All')

  React.useEffect(() => {
    // If no active session and no summary modal, kick them out
    if (!activeSession && !showSummaryModal) {
      router.push('/fitness')
    }
  }, [activeSession, showSummaryModal, router])

  if (showSummaryModal) {
    return (
      <div className="fixed inset-0 z-[100] bg-black text-white flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 md:p-12 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg bg-[#0a0a0c] border border-white/10 p-8 rounded-3xl text-center shadow-[0_0_50px_rgba(255,255,255,0.05)]"
          >
            <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-success" />
            </div>
            
            <h1 className="font-display font-bold text-4xl uppercase tracking-tighter mb-2">Workout Complete</h1>
            <p className="text-white/50 font-medium mb-10">{showSummaryModal.name}</p>

            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="bg-black border border-white/5 p-4 rounded-2xl">
                <div className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">Duration</div>
                <div className="font-display text-2xl font-bold">{formatTime(showSummaryModal.elapsedSeconds)}</div>
              </div>
              <div className="bg-black border border-white/5 p-4 rounded-2xl">
                <div className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">Volume</div>
                <div className="font-display text-2xl font-bold">{showSummaryModal.totalVolume} kg</div>
              </div>
              <div className="bg-black border border-white/5 p-4 rounded-2xl">
                <div className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">Sets</div>
                <div className="font-display text-2xl font-bold">{showSummaryModal.totalSets}</div>
              </div>
              <div className="bg-black border border-white/5 p-4 rounded-2xl">
                <div className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">Calories</div>
                <div className="font-display text-2xl font-bold text-warning">{showSummaryModal.caloriesBurned} kcal</div>
              </div>
            </div>

            <button 
              onClick={() => {
                dismissSummaryModal()
                router.push('/dashboard')
              }}
              className="w-full h-14 bg-white text-black font-bold uppercase tracking-widest text-sm hover:bg-white/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              Finish & Return <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </div>
    )
  }

  if (!activeSession) return null

  // Live Stats calc
  let liveVolume = 0
  let liveCompletedSets = 0
  let liveCompletedReps = 0
  let liveExercisesCount = 0
  
  activeSession.exercises.forEach(ex => {
    let exHasCompletedSet = false
    ex.sets.forEach(s => {
      if (s.completed) {
        liveVolume += (s.weight * s.reps)
        liveCompletedSets++
        liveCompletedReps += s.reps
        exHasCompletedSet = true
      }
    })
    if (exHasCompletedSet) liveExercisesCount++
  })
  const liveCalories = liveCompletedSets * 12 // roughly 12 cal per set for display

  // Filter Logic
  const filteredExercises = EXERCISE_DB.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(exerciseSearch.toLowerCase())
    if (!matchesSearch) return false
    
    if (selectedCategory === 'All') return true
    if (selectedCategory === 'Upper Body') return ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps'].includes(e.category)
    if (selectedCategory === 'Lower Body') return ['Legs'].includes(e.category)
    if (selectedCategory === 'Core') return ['Core'].includes(e.category)
    if (selectedCategory === 'Cardio') return ['Cardio'].includes(e.category)
    if (selectedCategory === 'Full Body') return true
    
    return e.category === selectedCategory
  })

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans w-full flex flex-col relative pb-40">
      
      {/* Top Fixed Stopwatch UI */}
      <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10 px-4 py-4 md:px-8 flex flex-col items-center">
        <div className="text-xs font-bold text-white/50 uppercase tracking-widest mb-1">{activeSession.name}</div>
        
        <div className="flex items-center gap-6 mb-4">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle cx="32" cy="32" r="30" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
              <motion.circle 
                cx="32" cy="32" r="30" fill="none" stroke={activeSession.isPaused ? '#fbbf24' : '#34C759'} strokeWidth="2"
                strokeDasharray="188.4"
                initial={{ strokeDashoffset: 188.4 }}
                animate={{ strokeDashoffset: activeSession.isPaused ? 188.4 : 0 }}
                transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
              />
            </svg>
            <div className={`font-display font-bold text-xl tracking-tighter ${activeSession.isPaused ? 'text-warning' : 'text-white'}`}>
              {formatTime(activeSession.elapsedSeconds)}
            </div>
          </div>
          
          <div className="flex gap-2">
            {activeSession.isPaused ? (
              <button onClick={resumeWorkout} className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Play className="w-5 h-5 text-white fill-white" />
              </button>
            ) : (
              <button onClick={pauseWorkout} className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Pause className="w-5 h-5 text-white fill-white" />
              </button>
            )}
            <button 
              onClick={finishWorkout}
              className="h-12 px-6 rounded-full bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-white/90 active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <Square className="w-4 h-4 fill-black" /> Finish
            </button>
          </div>
        </div>

        {/* Live Stats */}
        <div className="w-full max-w-4xl mx-auto flex justify-between items-center px-2">
          <div className="text-center">
            <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1 justify-center"><Flame className="w-3 h-3 text-warning" /> Cals</div>
            <div className="font-display font-bold text-lg">{liveCalories}</div>
          </div>
          <div className="w-px h-8 bg-white/10"></div>
          <div className="text-center">
            <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1 justify-center"><Dumbbell className="w-3 h-3" /> Vol</div>
            <div className="font-display font-bold text-lg">{liveVolume}</div>
          </div>
          <div className="w-px h-8 bg-white/10"></div>
          <div className="text-center">
            <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1 justify-center"><Activity className="w-3 h-3" /> Reps</div>
            <div className="font-display font-bold text-lg">{liveCompletedReps}</div>
          </div>
          <div className="w-px h-8 bg-white/10"></div>
          <div className="text-center">
            <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1 justify-center"><Repeat className="w-3 h-3" /> Sets</div>
            <div className="font-display font-bold text-lg">{liveCompletedSets}</div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full p-4 md:p-8 flex-1">
        {/* Exercise List */}
        <div className="space-y-8">
          {activeSession.exercises.map((activeEx, exIdx) => {
            const exDef = EXERCISE_DB.find(d => d.id === activeEx.id)
            if (!exDef) return null

            return (
              <motion.div 
                key={activeEx.id + exIdx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#09090B] border border-white/10 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
              >
                <div className="p-4 border-b border-white/10 bg-[#05050A] flex justify-between items-center">
                  <div>
                    <h3 className="font-display font-bold text-xl uppercase tracking-wider text-white">{exDef.name}</h3>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-white/50 mt-1">
                      {exDef.primaryMuscle} • {exDef.equipment}
                    </div>
                  </div>
                  <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                    <Info className="w-4 h-4 text-white/50" />
                  </button>
                </div>

                <div className="p-4 bg-[#0a0a0c]">
                  {/* Headers */}
                  <div className="grid grid-cols-12 gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40 mb-4 px-2 text-center">
                    <div className="col-span-1 text-left">Set</div>
                    <div className="col-span-4">KG</div>
                    <div className="col-span-4">Reps</div>
                    <div className="col-span-3 text-right">Done</div>
                  </div>

                  <AnimatePresence>
                    {activeEx.sets.map((set, setIdx) => (
                      <motion.div 
                        key={set.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`grid grid-cols-12 gap-2 items-center mb-3 p-2 rounded-xl transition-colors ${set.completed ? 'bg-success/10 border border-success/30' : 'bg-[#18181B] border border-white/5'}`}
                      >
                        <div className="col-span-1 text-xs font-bold text-white/50 text-center">{setIdx + 1}</div>
                        
                        {/* Weight Control */}
                        <div className="col-span-4 flex items-center justify-between bg-black rounded-lg border border-white/10 px-1 py-1">
                          <button onClick={() => updateSet(exIdx, setIdx, 'weight', set.weight - 2.5)} className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white" disabled={set.completed}><Minus className="w-3 h-3" /></button>
                          <span className={`font-bold text-sm ${set.completed ? 'text-white/50' : 'text-white'}`}>{set.weight}</span>
                          <button onClick={() => updateSet(exIdx, setIdx, 'weight', set.weight + 2.5)} className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white" disabled={set.completed}><Plus className="w-3 h-3" /></button>
                        </div>

                        {/* Reps Control */}
                        <div className="col-span-4 flex items-center justify-between bg-black rounded-lg border border-white/10 px-1 py-1">
                          <button onClick={() => updateSet(exIdx, setIdx, 'reps', set.reps - 1)} className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white" disabled={set.completed}><Minus className="w-3 h-3" /></button>
                          <span className={`font-bold text-sm ${set.completed ? 'text-white/50' : 'text-white'}`}>{set.reps}</span>
                          <button onClick={() => updateSet(exIdx, setIdx, 'reps', set.reps + 1)} className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white" disabled={set.completed}><Plus className="w-3 h-3" /></button>
                        </div>

                        <div className="col-span-3 flex justify-end gap-2">
                          <button 
                            onClick={() => toggleSetComplete(exIdx, setIdx)}
                            className={`w-12 h-10 rounded-lg flex items-center justify-center transition-colors shadow-sm ${set.completed ? 'bg-success text-black' : 'bg-white/10 text-white/40 hover:bg-white/20'}`}
                          >
                            <Check className={`w-5 h-5 ${set.completed ? 'stroke-[3px]' : ''}`} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  <button 
                    onClick={() => addSet(exIdx)}
                    className="w-full h-12 mt-2 rounded-xl border border-dashed border-white/20 text-white/50 hover:text-white hover:border-white/50 hover:bg-white/5 transition-colors flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest"
                  >
                    <Plus className="w-4 h-4" /> Add Set
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>

        <button 
          onClick={() => setShowExerciseModal(true)}
          className="w-full h-14 mt-8 bg-white/5 border border-white/20 rounded-2xl text-white font-bold uppercase tracking-widest text-sm hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" /> Add Exercise
        </button>
      </div>

      {/* Exercise Selection Modal */}
      <AnimatePresence>
        {showExerciseModal && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed inset-0 z-[60] bg-black/95 flex flex-col"
          >
            <div className="w-full max-w-4xl mx-auto flex flex-col h-full bg-black">
              {/* Header */}
              <div className="p-4 border-b border-white/10 flex gap-4 items-center bg-[#05050A]">
                <Search className="w-5 h-5 text-white/40" />
                <input 
                  type="text" 
                  autoFocus
                  placeholder="SEARCH EXERCISES..." 
                  value={exerciseSearch}
                  onChange={e => setExerciseSearch(e.target.value)}
                  className="w-full bg-transparent text-white font-bold uppercase tracking-widest text-sm focus:outline-none placeholder:text-white/20"
                />
                <button onClick={() => setShowExerciseModal(false)} className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                  <X className="w-5 h-5 text-white/70" />
                </button>
              </div>
              
              {/* Categories */}
              <div className="flex overflow-x-auto p-4 gap-2 border-b border-white/5 scrollbar-hide">
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-colors border ${selectedCategory === cat ? 'bg-white text-black border-white' : 'bg-transparent text-white/50 border-white/10 hover:border-white/30'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {filteredExercises.map(ex => (
                  <button 
                    key={ex.id}
                    onClick={() => {
                      addExerciseToSession(ex.id)
                      setShowExerciseModal(false)
                      setExerciseSearch('')
                    }}
                    className="w-full text-left p-4 rounded-2xl bg-[#0a0a0c] border border-white/5 hover:border-white/20 hover:bg-[#121214] transition-all group flex justify-between items-center"
                  >
                    <div>
                      <div className="font-display font-bold text-lg uppercase tracking-wider">{ex.name}</div>
                      <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">{ex.primaryMuscle} • {ex.equipment}</div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                      <Plus className="w-4 h-4" />
                    </div>
                  </button>
                ))}
                {filteredExercises.length === 0 && (
                  <div className="text-center py-20 text-white/40 font-bold uppercase tracking-widest">
                    No exercises found
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Rest Timer Overlay */}
      <AnimatePresence>
        {isResting && restRemaining !== null && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-0 left-0 w-full z-[70] bg-[#0a0a0c] border-t border-white/20 p-6 md:p-8 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] rounded-t-[40px] flex flex-col items-center"
          >
            <div className="w-12 h-1.5 bg-white/20 rounded-full mb-6"></div>
            
            <div className="text-xs font-bold text-warning uppercase tracking-widest text-center mb-6">Rest Timer Active</div>
            
            <div className="relative w-40 h-40 flex items-center justify-center mb-8">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="80" cy="80" r="76" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <motion.circle 
                  cx="80" cy="80" r="76" fill="none" stroke={restIsPaused ? '#fbbf24' : '#0A84FF'} strokeWidth="8"
                  strokeDasharray="477.5" // 2 * PI * 76
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: 0 }}
                  animate={{ strokeDashoffset: restDuration ? 477.5 * (1 - restRemaining / restDuration) : 0 }}
                  transition={{ duration: 1, ease: 'linear' }}
                />
              </svg>
              <div className="flex flex-col items-center justify-center">
                <div className={`font-display font-bold text-6xl tracking-tighter ${restIsPaused ? 'text-warning' : 'text-white'}`}>
                  {restRemaining}
                </div>
                <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">Seconds</div>
              </div>
            </div>

            {/* Presets */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 w-full max-w-lg mb-6">
              {[30, 45, 60, 90, 120, 180].map(time => (
                <button 
                  key={time}
                  onClick={() => startRestTimer(time)}
                  className="py-3 bg-[#18181B] border border-white/5 rounded-xl text-xs font-bold uppercase tracking-widest text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                >
                  {time}s
                </button>
              ))}
            </div>
            
            <div className="flex gap-4 w-full max-w-lg">
              {restIsPaused ? (
                <button 
                  onClick={resumeRestTimer}
                  className="flex-1 h-14 bg-white/10 rounded-2xl text-white font-bold uppercase tracking-widest text-xs hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5 fill-white" /> Resume
                </button>
              ) : (
                <button 
                  onClick={pauseRestTimer}
                  className="flex-1 h-14 bg-white/10 rounded-2xl text-white font-bold uppercase tracking-widest text-xs hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                >
                  <Pause className="w-5 h-5 fill-white" /> Pause
                </button>
              )}
              
              <button 
                onClick={skipRestTimer}
                className="flex-[2] h-14 bg-white rounded-2xl text-black font-bold uppercase tracking-widest text-xs hover:bg-white/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                Skip Rest <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
