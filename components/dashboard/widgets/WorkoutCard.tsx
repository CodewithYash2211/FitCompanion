'use client'

import * as React from 'react'
import { Dumbbell, CheckCircle2, PlayCircle } from 'lucide-react'
import { BentoCard } from '../BentoCard'
import type { DashboardData } from '@/services/mock-data'

export function WorkoutCard({ data }: { data: DashboardData }) {
  const { completed, title, duration } = data.workout

  return (
    <BentoCard variant="data" delay={0.4} className="col-span-1 flex flex-col justify-between group/workout">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-[#3b82f6]" />
            Workout
          </h3>
          {completed && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-[#10b981]/10 text-[#10b981] rounded-full flex items-center gap-1">
              Done
            </span>
          )}
        </div>
        
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Today's Plan</p>
        <h4 className="font-medium text-lg text-foreground leading-tight">
          {title}
        </h4>
        {duration && (
          <p className="text-sm text-muted-foreground mt-1">{duration} min</p>
        )}
      </div>

      <div className="mt-6">
        {completed ? (
          <button disabled className="w-full h-10 rounded-lg bg-[#1c1c1f] border border-[#27272a] text-muted-foreground font-medium text-sm flex items-center justify-center gap-2 cursor-not-allowed">
            <CheckCircle2 className="w-4 h-4" /> Completed
          </button>
        ) : (
          <button className="w-full h-10 rounded-lg bg-foreground text-background font-medium text-sm flex items-center justify-center gap-2 hover:bg-foreground/90 transition-colors">
            <PlayCircle className="w-4 h-4" /> Start
          </button>
        )}
      </div>
    </BentoCard>
  )
}
