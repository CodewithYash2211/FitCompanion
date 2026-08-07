'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Utensils } from 'lucide-react'
import { BentoCard } from '../BentoCard'
import { AnimatedCounter } from '../AnimatedCounter'
import type { DashboardData } from '@/services/mock-data'

export function NutritionOverview({ data }: { data: DashboardData }) {
  const { calories, protein, carbs, fat } = data.nutrition
  
  return (
    <BentoCard variant="data" delay={0.3} className="col-span-1 md:col-span-2 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
          <Utensils className="w-4 h-4 text-[#10b981]" />
          Nutrition
        </h3>
        <span className="text-xs font-medium px-2 py-1 bg-[#1c1c1f] rounded border border-[#27272a] text-muted-foreground">
          <AnimatedCounter value={calories.max - calories.current} /> kcal left
        </span>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-center h-full">
        {/* Calories Circular */}
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="48" cy="48" r="42" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-[#1c1c1f]" />
            <motion.circle
              initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
              animate={{ strokeDashoffset: (2 * Math.PI * 42) - ((calories.current / calories.max) * (2 * Math.PI * 42)) }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.6 }}
              cx="48" cy="48" r="42"
              stroke="currentColor" strokeWidth="8" fill="transparent" strokeLinecap="round"
              className="text-[#f59e0b]"
              style={{ strokeDasharray: 2 * Math.PI * 42 }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-semibold text-xl leading-none text-foreground">
              <AnimatedCounter value={calories.current} />
            </span>
            <span className="text-[10px] text-muted-foreground font-medium mt-1">/ {calories.max}</span>
          </div>
        </div>

        {/* Macros Bars */}
        <div className="flex-1 w-full space-y-4">
          <MacroBar label="Protein" current={protein.current} max={protein.max} color="bg-[#10b981]" delay={0.7} />
          <MacroBar label="Carbs" current={carbs.current} max={carbs.max} color="bg-[#f59e0b]" delay={0.8} />
          <MacroBar label="Fat" current={fat.current} max={fat.max} color="bg-[#3b82f6]" delay={0.9} />
        </div>
      </div>
    </BentoCard>
  )
}

function MacroBar({ label, current, max, color, delay }: { label: string, current: number, max: number, color: string, delay: number }) {
  const percentage = Math.min(100, Math.round((current / max) * 100))
  
  return (
    <div>
      <div className="flex justify-between text-xs font-medium mb-1.5">
        <span className="text-muted-foreground">{label}</span>
        <span className="text-foreground">
          <AnimatedCounter value={current} />g <span className="text-muted-foreground">/ {max}g</span>
        </span>
      </div>
      <div className="h-1.5 w-full bg-[#1c1c1f] rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut", delay }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  )
}
