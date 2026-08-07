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
    <BentoCard variant="data" delay={0.5} className="col-span-1 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
          <Droplet className="w-4 h-4 text-[#3b82f6]" />
          Water
        </h3>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center py-4">
        <div className="relative w-24 h-24 flex items-center justify-center bg-[#1c1c1f] rounded-full overflow-hidden border border-[#27272a]">
          <motion.div 
            className="absolute bottom-0 left-0 right-0 bg-[#3b82f6]/20 w-full"
            initial={{ height: 0 }}
            animate={{ height: `${fillPercentage}%` }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.6 }}
          >
            <div className="absolute top-0 inset-x-0 h-px bg-[#3b82f6]/50" />
          </motion.div>
          
          <div className="relative z-10 flex flex-col items-center">
            <span className="font-semibold text-xl text-foreground">
              <AnimatedCounter value={current / 1000} format={(v) => v.toFixed(1)} />L
            </span>
            <span className="text-[10px] text-muted-foreground font-medium">
              / {(max / 1000).toFixed(1)}L
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <button className="w-full h-10 rounded-lg bg-[#3b82f6]/10 text-[#3b82f6] font-medium text-sm flex items-center justify-center gap-2 hover:bg-[#3b82f6]/20 transition-colors border border-[#3b82f6]/20">
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>
    </BentoCard>
  )
}
