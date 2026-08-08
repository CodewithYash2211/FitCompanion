'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Droplet, Flame, ArrowRight, Plus, Trash2, Edit2, RotateCcw, Activity
} from 'lucide-react'
import Link from 'next/link'
import { useNutrition } from '@/lib/context/NutritionContext'

function CircularProgress({ value, max, label, color, delay = 0 }: { value: number, max: number, label: string, color: string, delay?: number }) {
  const radius = 40
  const circumference = 2 * Math.PI * radius
  
  const validValue = isNaN(value) ? 0 : value
  const validMax = isNaN(max) || max === 0 ? 1 : max
  const ratio = Math.min(validValue / validMax, 1)
  const strokeDashoffset = circumference - ratio * circumference

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="48" cy="48" r={radius} stroke="rgba(255,255,255,0.1)" strokeWidth="6" fill="none" />
          <motion.circle 
            cx="48" cy="48" r={radius} 
            stroke={color} 
            strokeWidth="6" 
            fill="none"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, delay, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-bold text-lg">{Math.round(validValue)}g</span>
        </div>
      </div>
      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{label}</span>
    </div>
  )
}

function formatTime(ts?: number) {
  if (!ts) return 'Unknown'
  return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(ts))
}

export default function NutritionDashboard() {
  const { 
    loggedMeals, 
    dailyKcalTarget, 
    dailyPTarget, 
    dailyCTarget, 
    dailyFTarget,
    isHydrated,
    removeMeal,
    undo
  } = useNutrition()

  const [isOffline, setIsOffline] = React.useState(false)

  React.useEffect(() => {
    setIsOffline(!navigator.onLine)
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-[#020202] text-white p-6 md:p-12 pb-24 flex flex-col gap-6 animate-pulse">
        <div className="h-20 bg-white/5 w-1/3 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 h-80 bg-white/5" />
          <div className="lg:col-span-7 h-80 bg-white/5" />
          <div className="lg:col-span-12 h-64 bg-white/5" />
        </div>
      </div>
    )
  }

  const consumedKcal = loggedMeals.reduce((acc, curr) => acc + (curr.kcal * (curr.qty || 1)), 0)
  const consumedProtein = loggedMeals.reduce((acc, curr) => acc + (curr.p * (curr.qty || 1)), 0)
  const consumedCarbs = loggedMeals.reduce((acc, curr) => acc + (curr.c * (curr.qty || 1)), 0)
  const consumedFat = loggedMeals.reduce((acc, curr) => acc + (curr.f * (curr.qty || 1)), 0)

  const remainingKcal = Math.max(dailyKcalTarget - consumedKcal, 0)
  const calCircumference = 2 * Math.PI * 80
  const calRatio = Math.min(consumedKcal / dailyKcalTarget, 1)

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="min-h-screen bg-[#020202] text-white p-6 md:p-12 pb-24 font-sans"
    >
      <AnimatePresence>
        {isOffline && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-warning text-black font-bold uppercase tracking-widest text-xs py-2 px-4 mb-8 flex items-center justify-center gap-2 overflow-hidden"
          >
            <Activity className="w-4 h-4" /> You're offline. Changes will sync when you're back online.
          </motion.div>
        )}
      </AnimatePresence>

      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-white/10 pb-8 gap-6">
        <div>
          <div className="text-white/50 font-bold uppercase tracking-widest text-sm mb-2 flex items-center gap-2">
            Nutrition Engine
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl uppercase tracking-tighter leading-none">
            Diet Planner.
          </h1>
        </div>
        <div className="flex gap-4">
           <button onClick={undo} className="h-12 w-12 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors group" title="Undo Last Action">
             <RotateCcw className="w-5 h-5 group-hover:text-white text-white/60 transition-colors" />
           </button>
           <Link href="/nutrition/water" className="h-12 w-12 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors group">
             <Droplet className="w-5 h-5 group-hover:text-blue-400 text-white/60 transition-colors" />
           </Link>
           <Link href="/nutrition/log" className="h-12 px-6 bg-white text-black font-bold uppercase tracking-widest hover:bg-white/90 transition-colors text-sm flex items-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
             <Plus className="w-4 h-4" /> Log Meal
           </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Calorie Widget */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-5 bg-black border border-white/10 p-8 flex flex-col group hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(255,255,255,0.05)] hover:border-white/30 transition-all duration-300 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <h2 className="font-bold text-white/50 uppercase tracking-widest text-xs mb-8 flex justify-between items-center">
            Energy Balance
            <Flame className="w-4 h-4 text-white" />
          </h2>
          
          <div className="flex-1 flex flex-col items-center justify-center mb-8 relative">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r="80" stroke="rgba(255,255,255,0.05)" strokeWidth="12" fill="none" />
                <motion.circle 
                  cx="96" cy="96" r="80" 
                  stroke="#ffffff" 
                  strokeWidth="12" 
                  fill="none"
                  strokeDasharray={calCircumference}
                  initial={{ strokeDashoffset: calCircumference }}
                  animate={{ strokeDashoffset: calCircumference * (1 - calRatio) }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display font-bold text-4xl">{Math.round(consumedKcal)}</span>
                <span className="text-xs font-bold text-white/40 uppercase tracking-widest">/ {dailyKcalTarget} kcal</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
            <div>
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Burned (Mock)</div>
              <div className="font-bold text-lg">650 kcal</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Remaining</div>
              <div className="font-bold text-lg text-success">{Math.round(remainingKcal)} kcal</div>
            </div>
          </div>
        </motion.div>

        {/* Macros Breakdown */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-7 bg-black border border-white/10 p-8 group hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(255,255,255,0.05)] hover:border-white/30 transition-all duration-300"
        >
          <h2 className="font-bold text-white/50 uppercase tracking-widest text-xs mb-8">Macro Distribution</h2>
          
          <div className="flex flex-wrap gap-8 justify-around items-center h-48">
            <CircularProgress value={consumedProtein} max={dailyPTarget} label="Protein" color="#ffffff" delay={0.2} />
            <CircularProgress value={consumedCarbs} max={dailyCTarget} label="Carbs" color="#888888" delay={0.4} />
            <CircularProgress value={consumedFat} max={dailyFTarget} label="Fat" color="#444444" delay={0.6} />
          </div>

          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10 mt-8">
            <div className="p-4 bg-white/[0.02] border border-white/5">
               <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Fiber</div>
               <div className="font-bold">{Math.round(consumedCarbs * 0.1)}g <span className="text-white/40 text-xs">/ 30g</span></div>
            </div>
            <div className="p-4 bg-white/[0.02] border border-white/5">
               <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Sugar</div>
               <div className="font-bold text-success">{Math.round(consumedCarbs * 0.2)}g <span className="text-white/40 text-xs">/ 40g</span></div>
            </div>
            <div className="p-4 bg-white/[0.02] border border-white/5">
               <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Sodium</div>
               <div className="font-bold">{Math.round(consumedKcal * 0.8)}mg</div>
            </div>
          </div>
        </motion.div>

        {/* Real-time Timeline History */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-12 bg-black border border-white/10 p-8"
        >
          <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
            <h2 className="font-bold text-white/80 uppercase tracking-widest text-lg">Timeline</h2>
            <Link href="/nutrition/log" className="text-xs font-bold uppercase tracking-widest hover:text-white flex items-center gap-2 border border-white/20 px-4 py-2 bg-white/5 transition-colors">
              + Add Entry
            </Link>
          </div>

          <div className="space-y-0 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
            <AnimatePresence>
              {loggedMeals.length === 0 ? (
                <div className="text-center py-12 text-white/40 font-bold uppercase tracking-widest text-sm relative z-10 bg-black">
                  No meals logged today.
                </div>
              ) : (
                loggedMeals.map((food, i) => (
                  <motion.div 
                    key={`${food.id}-${i}`}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, height: 0, margin: 0, padding: 0 }}
                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active py-4"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-black bg-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_10px_rgba(255,255,255,0.5)] z-10" />
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 border border-white/10 bg-[#0a0a0c] hover:bg-white/[0.03] transition-colors group-hover:border-white/30 flex justify-between items-start gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-xs font-bold text-white/40 uppercase tracking-widest">{formatTime(food.timestamp)}</span>
                          <span className="text-[10px] px-2 py-0.5 border border-white/20 bg-white/5 uppercase tracking-widest">{food.meal}</span>
                        </div>
                        <h3 className="font-bold text-lg mb-1">{food.name} <span className="text-white/50 text-sm">x{food.qty}</span></h3>
                        <p className="text-xs font-mono text-white/50">+{Math.round(food.kcal * (food.qty || 1))} kcal • {Math.round(food.p * (food.qty || 1))}g Protein</p>
                      </div>
                      
                      <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => removeMeal(i)}
                          className="w-8 h-8 rounded bg-danger/10 text-danger flex items-center justify-center hover:bg-danger hover:text-white transition-colors"
                          title="Delete Entry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
