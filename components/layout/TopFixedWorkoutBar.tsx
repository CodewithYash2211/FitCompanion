'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { useWorkout } from '@/lib/context/WorkoutContext'
import { Flame, Timer, Activity } from 'lucide-react'

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export function TopFixedWorkoutBar() {
  const { activeSession, finishWorkout, cancelWorkout } = useWorkout()
  
  if (!activeSession) return null

  const completedSets = activeSession.exercises.reduce((acc, curr) => acc + curr.sets.filter(s => s.completed).length, 0)
  // Mock Calorie Burn
  const estimatedCalories = Math.round(completedSets * 12)

  return (
    <motion.div 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 h-20 bg-black/90 backdrop-blur-md border-b border-white/10 z-50 flex items-center justify-between px-4 md:px-8"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-white/10 flex items-center justify-center shrink-0">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="font-display font-bold text-sm md:text-lg uppercase tracking-widest leading-none">{activeSession.name}</h2>
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-white/50 mt-1">
            <span className="flex items-center gap-1"><Timer className="w-3 h-3 text-white/80" /> {formatTime(activeSession.elapsedSeconds)}</span>
            <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-warning" /> {estimatedCalories} kcal</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={cancelWorkout}
          className="text-[10px] font-bold uppercase tracking-widest text-danger hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button 
          onClick={finishWorkout}
          className="h-10 px-4 md:px-6 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-white/90 transition-all active:scale-95"
        >
          Finish
        </button>
      </div>
    </motion.div>
  )
}
