'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity, Play, History, Trophy, Plus, Dumbbell, Clock, Flame, ChevronRight, Search
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useWorkout } from '@/lib/context/WorkoutContext'

export default function FitnessDashboard() {
  const router = useRouter()
  const { workoutHistory, personalRecords, startWorkout, activeSession, deleteWorkoutHistory } = useWorkout()
  const [searchTerm, setSearchTerm] = React.useState('')

  const handleStartWorkout = () => {
    if (!activeSession) {
      startWorkout('Custom Workout')
    }
    router.push('/fitness/log')
  }

  const filteredHistory = workoutHistory.filter(w => 
    w.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="min-h-screen bg-[#020202] text-white p-6 md:p-12 pb-24 font-sans max-w-7xl mx-auto"
    >
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-8">
        <div>
          <div className="text-white/50 font-bold uppercase tracking-widest text-sm mb-2 flex items-center gap-2">
            Fitness Engine
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl uppercase tracking-tighter leading-none">
            Workouts.
          </h1>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          {activeSession ? (
             <button 
                onClick={() => router.push('/fitness/log')}
                className="h-12 flex-1 md:flex-none px-8 bg-warning text-black font-bold uppercase tracking-widest hover:bg-warning/90 transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(251,191,36,0.3)] animate-pulse"
              >
               <Activity className="w-4 h-4" /> Resume Session
             </button>
          ) : (
             <button 
                onClick={handleStartWorkout}
                className="h-12 flex-1 md:flex-none px-8 bg-white text-black font-bold uppercase tracking-widest hover:bg-white/90 transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95"
              >
               <Plus className="w-4 h-4" /> Start Empty Workout
             </button>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Quick Starts & PRs */}
        <div className="lg:col-span-4 space-y-8">
          {/* Quick Routines */}
          <div className="bg-black border border-white/10 p-6 relative overflow-hidden group hover:border-white/30 transition-colors">
            <h2 className="font-bold text-white/50 uppercase tracking-widest text-xs mb-6 flex items-center justify-between">
              Quick Routines <Dumbbell className="w-4 h-4 text-white" />
            </h2>
            <div className="space-y-3">
              {['Upper Body Power', 'Leg Day Hypertrophy', 'Core & Mobility'].map((routine, i) => (
                <button 
                  key={i}
                  onClick={() => {
                    startWorkout(routine)
                    router.push('/fitness/log')
                  }}
                  className="w-full text-left p-4 border border-white/5 hover:border-white/20 hover:bg-white/[0.02] flex justify-between items-center group/btn transition-colors"
                >
                  <span className="font-bold uppercase tracking-wider text-sm">{routine}</span>
                  <Play className="w-4 h-4 text-white/40 group-hover/btn:text-white transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* Personal Records */}
          <div className="bg-black border border-white/10 p-6 group hover:border-white/30 transition-colors">
            <h2 className="font-bold text-white/50 uppercase tracking-widest text-xs mb-6 flex items-center justify-between">
              Personal Records <Trophy className="w-4 h-4 text-warning" />
            </h2>
            {personalRecords.length === 0 ? (
              <div className="text-center py-8 text-white/30 font-bold uppercase tracking-widest text-xs">
                No PRs yet. Keep pushing!
              </div>
            ) : (
              <div className="space-y-4">
                {personalRecords.map((pr, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-white/[0.02] border border-warning/10">
                    <div>
                      <div className="font-bold uppercase tracking-wider text-sm">{pr.exerciseId}</div>
                      <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">
                        {new Date(pr.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-warning">{pr.weight}kg</div>
                      <div className="text-xs text-warning/70 font-bold">× {pr.reps} reps</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Workout History */}
        <div className="lg:col-span-8 bg-black border border-white/10 p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <h2 className="font-bold text-white/80 uppercase tracking-widest text-lg flex items-center gap-2">
              <History className="w-5 h-5 text-white/50" /> History
            </h2>
            
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input 
                type="text"
                placeholder="SEARCH WORKOUTS..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full h-10 bg-[#0a0a0c] border border-white/10 pl-10 pr-4 text-white text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-white/50 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {filteredHistory.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-center py-16 text-white/30 font-bold uppercase tracking-widest text-sm border border-white/5 border-dashed"
                >
                  No workouts found.
                </motion.div>
              ) : (
                filteredHistory.map((workout) => (
                  <motion.div 
                    key={workout.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group border border-white/10 bg-[#0a0a0c] hover:bg-[#121214] hover:border-white/30 transition-all p-4 md:p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg uppercase tracking-wider mb-1">{workout.name}</h3>
                        <p className="text-xs text-white/50 font-bold uppercase tracking-widest">
                          {new Date(workout.startTime).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} at {new Date(workout.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <button 
                        onClick={() => deleteWorkoutHistory(workout.id)}
                        className="text-[10px] text-danger hover:text-white hover:bg-danger px-3 py-1 border border-danger/20 hover:border-danger transition-colors font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100"
                      >
                        Delete
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-4 py-4 border-y border-white/10 mb-4">
                      <div>
                        <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Time</div>
                        <div className="font-bold">{Math.floor(workout.elapsedSeconds / 60)}m {workout.elapsedSeconds % 60}s</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1 flex items-center gap-1"><Dumbbell className="w-3 h-3" /> Volume</div>
                        <div className="font-bold">{workout.totalVolume.toLocaleString()} kg</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1 flex items-center gap-1"><Flame className="w-3 h-3" /> Burn</div>
                        <div className="font-bold text-success">{workout.caloriesBurned} kcal</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-2">Exercises ({workout.exercises.length})</div>
                      <div className="flex flex-wrap gap-2">
                        {workout.exercises.map(ex => (
                          <span key={ex.id} className="text-xs bg-white/5 border border-white/10 px-2 py-1 uppercase tracking-wider font-bold">
                            {ex.id} × {ex.sets.filter(s => s.completed).length}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
