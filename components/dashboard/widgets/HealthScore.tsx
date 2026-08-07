'use client'

import * as React from 'react'
import { Activity, AlertTriangle } from 'lucide-react'
import { BentoCard } from '../BentoCard'
import { AnimatedCounter } from '../AnimatedCounter'
import type { DashboardData } from '@/services/mock-data'

export function HealthScore({ data }: { data: DashboardData }) {
  const score = data.healthScore

  return (
    <BentoCard variant="data" className="col-span-1 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#10b981]" />
            Health Score
          </h3>
        </div>
        
        <div className="mt-4 mb-6">
          <div className="flex items-baseline gap-1">
            <span className="font-semibold text-4xl text-foreground tracking-tight">
              <AnimatedCounter value={score} duration={1500} />
            </span>
            <span className="text-xl text-muted-foreground">%</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Daily Optimization</p>
        </div>

        <div className="space-y-2">
          <ScoreRow label="Nutrition" value="+35" color="text-[#10b981]" />
          <ScoreRow label="Workout" value="+25" color="text-[#10b981]" />
          <ScoreRow label="Water" value="+12" color="text-[#3b82f6]" />
          <ScoreRow label="Sleep" value="+10" color="text-[#8b5cf6]" />
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-[#27272a]">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-[#f59e0b] shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-medium text-foreground block">Needs Improvement</span>
            <span className="text-xs text-muted-foreground">Protein Intake</span>
          </div>
        </div>
      </div>
    </BentoCard>
  )
}

function ScoreRow({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">
        <span className={color}>{value}</span>
      </span>
    </div>
  )
}
