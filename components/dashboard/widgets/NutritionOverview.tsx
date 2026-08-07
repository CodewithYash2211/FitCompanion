'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { PieChart, Utensils } from 'lucide-react'
import { BentoCard } from '../BentoCard'
import { AnimatedCounter } from '../AnimatedCounter'
import type { DashboardData } from '@/services/mock-data'

export function NutritionOverview({ data }: { data: DashboardData }) {
  const { calories, protein, carbs, fat } = data.nutrition
  
  const calcWidth = (current: number, max: number) => Math.min(100, Math.round((current / max) * 100))

  return (
    <BentoCard delay={0.3} className="col-span-1 md:col-span-2 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-lg text-foreground flex items-center gap-2">
          <Utensils className="w-4 h-4 text-orange-400" />
          Nutrition
        </h3>
        <span className="text-xs font-medium px-2 py-1 bg-white/5 rounded-md text-muted-foreground border border-white/10">
          <AnimatedCounter value={calories.max - calories.current} /> kcal left
        </span>
      </div>

      <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-center h-full">
        {/* Calories Circular (Simulated with simple CSS conic-gradient or SVG, opting for SVG for smooth animation) */}
        <div className="relative w-28 h-28 flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
            <motion.circle
              initial={{ strokeDashoffset: 2 * Math.PI * 48 }}
              animate={{ strokeDashoffset: (2 * Math.PI * 48) - ((calories.current / calories.max) * (2 * Math.PI * 48)) }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.6 }}
              cx="56" cy="56" r="48"
              stroke="currentColor" strokeWidth="12" fill="transparent" strokeLinecap="round"
              className="text-orange-400"
              style={{ strokeDasharray: 2 * Math.PI * 48 }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-display font-bold text-lg leading-none">
              <AnimatedCounter value={calories.current} />
            </span>
            <span className="text-[10px] text-muted-foreground font-medium uppercase mt-1">/ {calories.max}</span>
          </div>
        </div>

        {/* Macros Bars */}
        <div className="flex-1 w-full space-y-4">
          <MacroBar label="Protein" current={protein.current} max={protein.max} color="bg-macro-protein" delay={0.7} />
          <MacroBar label="Carbs" current={carbs.current} max={carbs.max} color="bg-macro-carbs" delay={0.8} />
          <MacroBar label="Fat" current={fat.current} max={fat.max} color="bg-macro-fat" delay={0.9} />
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
      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
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
