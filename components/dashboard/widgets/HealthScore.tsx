'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Activity } from 'lucide-react'
import { BentoCard } from '../BentoCard'
import { AnimatedCounter } from '../AnimatedCounter'
import type { DashboardData } from '@/services/mock-data'

export function HealthScore({ data }: { data: DashboardData }) {
  const score = data.healthScore
  
  // Calculate stroke dasharray for circular progress
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <BentoCard delay={0.2} className="col-span-1 flex flex-col justify-between relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-lg text-foreground flex items-center gap-2">
          <Activity className="w-4 h-4 text-brand-400" />
          Health Score
        </h3>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative">
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Background Circle */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-white/5"
            />
            {/* Animated Progress Circle */}
            <motion.circle
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
              cx="64"
              cy="64"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeLinecap="round"
              className={
                score >= 90 ? 'text-success' :
                score >= 70 ? 'text-brand-400' :
                score >= 50 ? 'text-warning' : 'text-danger'
              }
              style={{
                strokeDasharray: circumference,
              }}
            />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display font-bold text-3xl">
              <AnimatedCounter value={score} duration={1500} />%
            </span>
          </div>
        </div>
        
        <p className="mt-4 text-center text-xs text-muted-foreground font-medium">
          {score >= 90 ? 'Excellent progress today!' :
           score >= 70 ? 'Doing well, keep going.' :
           'Needs a little more effort today.'}
        </p>
      </div>
    </BentoCard>
  )
}
