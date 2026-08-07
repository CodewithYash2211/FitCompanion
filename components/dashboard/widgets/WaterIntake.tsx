'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Droplet, Plus } from 'lucide-react'
import { BentoCard } from '../BentoCard'
import { AnimatedCounter } from '../AnimatedCounter'
import type { DashboardData } from '@/services/mock-data'

export function WaterIntake({ data }: { data: DashboardData }) {
  const { current, max } = data.water
  
  const fillPercentage = Math.min(100, Math.round((current / max) * 100))
  
  return (
    <BentoCard delay={0.5} className="col-span-1 flex flex-col justify-between group/water">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-lg text-foreground flex items-center gap-2">
          <Droplet className="w-4 h-4 text-blue-400" />
          Water
        </h3>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center pt-2">
        {/* Animated Water Drop */}
        <div className="relative w-24 h-24 flex items-center justify-center bg-blue-400/10 rounded-full border border-blue-400/20 overflow-hidden shadow-inner">
          {/* Wave fill effect */}
          <motion.div 
            className="absolute bottom-0 left-0 right-0 bg-blue-400/30 w-full"
            initial={{ height: 0 }}
            animate={{ height: `${fillPercentage}%` }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.6 }}
          >
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-t from-blue-400/40 to-transparent transform -translate-y-full" />
          </motion.div>
          
          <div className="relative z-10 flex flex-col items-center">
            <span className="font-display font-bold text-xl text-foreground">
              <AnimatedCounter value={current / 1000} format={(v) => v.toFixed(1)} />L
            </span>
            <span className="text-[10px] text-muted-foreground uppercase font-medium">
              / {(max / 1000).toFixed(1)}L
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button className="w-full h-10 rounded-lg bg-blue-400/10 text-blue-400 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-blue-400/20 transition-colors border border-blue-400/20">
          <Plus className="w-4 h-4" /> Add 250ml
        </button>
      </div>
    </BentoCard>
  )
}
