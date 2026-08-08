'use client'

import * as React from 'react'
import { motion, animate, AnimatePresence } from 'framer-motion'
import {
  Droplet, ArrowLeft, History, Plus
} from 'lucide-react'
import Link from 'next/link'
import { useNutrition } from '@/lib/context/NutritionContext'
import confetti from 'canvas-confetti'

function AnimatedCounter({ value, suffix = '' }: { value: number, suffix?: string }) {
  const [count, setCount] = React.useState(0)
  
  React.useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate(val) {
        setCount(Math.floor(val))
      }
    })
    return () => controls.stop()
  }, [value])
  
  return <>{count}{suffix}</>
}

export default function WaterTrackerPage() {
  const { waterAmount, waterTarget, addWater, removeWater, undo } = useNutrition()
  const [showCelebration, setShowCelebration] = React.useState(false)
  const prevProgress = React.useRef(0)

  const progress = Math.min((waterAmount / waterTarget) * 100, 100)

  React.useEffect(() => {
    if (progress >= 100 && prevProgress.current < 100) {
      // Trigger Confetti Celebration
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#60a5fa', '#93c5fd', '#ffffff']
      })
      setShowCelebration(true)
    } else if (progress < 100) {
      setShowCelebration(false)
    }
    prevProgress.current = progress
  }, [progress])

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="min-h-screen bg-[#020202] text-white p-6 md:p-12 pb-24 font-sans max-w-4xl mx-auto"
    >
      <header className="mb-16">
        <Link href="/nutrition" className="text-white/50 hover:text-white flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="font-display font-bold text-4xl uppercase tracking-tighter leading-none mb-2">
              Hydration.
            </h1>
            <p className="text-white/50 text-sm font-bold uppercase tracking-widest">Daily Target: {(waterTarget/1000).toFixed(1)} L</p>
          </div>
          <button onClick={undo} className="h-10 px-4 border border-white/10 hover:border-white/30 text-white/70 hover:text-white transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-black">
            Undo
          </button>
          <button className="h-10 px-4 border border-white/10 hover:border-white/30 text-white/70 hover:text-white transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-black">
            <History className="w-4 h-4" /> Log
          </button>
        </div>
      </header>

      {/* Main Visualizer */}
      <div className="flex flex-col items-center justify-center mb-24 relative">
        
        {/* Success Banner */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="absolute -top-16 bg-blue-500/20 border border-blue-500/50 text-blue-200 px-6 py-3 rounded-full flex items-center gap-2 font-bold uppercase tracking-widest text-xs z-50 backdrop-blur-md"
            >
              🎉 Congratulations! You hit today's goal!
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative w-64 h-80 border-4 border-white/10 rounded-b-3xl rounded-t-sm overflow-hidden bg-[#050505] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {/* Beautiful Blue Water Fill Animation */}
          <motion.div 
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-700/80 to-blue-400/50 backdrop-blur-sm"
            initial={{ height: '0%' }}
            animate={{ height: `${progress}%` }}
            transition={{ type: "spring", stiffness: 40, damping: 15 }}
          >
            {/* Wave effect at top of water */}
            <motion.div 
              className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-blue-300/40 to-transparent"
              animate={{ y: [-4, 4, -4], skewY: [-2, 2, -2] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            />
          </motion.div>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 drop-shadow-2xl mix-blend-difference text-white">
            <Droplet className="w-8 h-8 mb-4 fill-white text-white" />
            <div className="font-display font-bold text-5xl tracking-tighter">
              <AnimatedCounter value={waterAmount} /> <span className="text-xl font-sans opacity-70">ml</span>
            </div>
            <div className="text-sm font-bold uppercase tracking-widest mt-2 opacity-80">
              {progress >= 100 ? 'Target Reached' : `${(waterTarget - waterAmount)}ml remaining`}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Add Buttons */}
      <div className="grid grid-cols-3 gap-4 md:gap-6">
        {[
          { amount: 250, label: 'Glass' },
          { amount: 500, label: 'Bottle' },
          { amount: 1000, label: 'Jug' },
        ].map((item, i) => (
          <motion.button
            key={i}
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => addWater(item.amount)}
            className="p-6 border border-white/10 bg-[#0a0a0c] hover:border-blue-500/50 hover:bg-blue-500/5 transition-all duration-300 group flex flex-col items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-blue-400 group-hover:bg-blue-500/10 transition-colors relative overflow-hidden">
              <Plus className="w-6 h-6 text-white group-hover:text-blue-400 transition-colors z-10" />
            </div>
            <div className="text-center">
              <div className="font-bold text-xl uppercase tracking-tighter">+{item.amount}</div>
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest group-hover:text-blue-400/70 transition-colors">{item.label}</div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* AI Insight */}
      <div className="mt-12 p-6 border border-blue-900/30 bg-[#020617] flex items-start gap-4">
        <div className="w-8 h-8 bg-blue-900/50 flex items-center justify-center shrink-0 border border-blue-500/30">
          <Droplet className="w-4 h-4 text-blue-400" />
        </div>
        <div>
          <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Hydration Protocol</div>
          <p className="text-sm font-medium text-blue-100/70">
            {progress >= 100 
              ? 'Hydration optimal. Your muscles are fully saturated, reducing fatigue and injury risk for tomorrow.' 
              : 'Consistent hydration speeds up metabolic clearance. Drink your next glass within 2 hours.'}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
