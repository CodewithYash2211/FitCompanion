'use client'

import * as React from 'react'
import { Dumbbell, CheckCircle2, PlayCircle } from 'lucide-react'
import { BentoCard } from '../BentoCard'
import type { DashboardData } from '@/services/mock-data'

export function WorkoutCard({ data }: { data: DashboardData }) {
  const { completed, title, duration } = data.workout

  return (
    <BentoCard delay={0.4} className="col-span-1 flex flex-col justify-between relative overflow-hidden group/workout">
      {/* Background decoration */}
      <div className="absolute -right-6 -bottom-6 opacity-[0.03] transform rotate-[-15deg] group-hover/workout:scale-110 transition-transform duration-700 pointer-events-none">
        <Dumbbell className="w-48 h-48" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display font-semibold text-lg text-foreground flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-info" />
            Workout
          </h3>
          {completed && (
            <span className="text-xs font-medium px-2 py-1 bg-success/10 text-success rounded-md border border-success/20 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Done
            </span>
          )}
        </div>
        
        <p className="text-sm text-muted-foreground mt-4">Today's Plan</p>
        <h4 className="font-display font-bold text-xl text-foreground leading-tight mt-1">
          {title}
        </h4>
        {duration && (
          <p className="text-sm font-medium text-info mt-1">{duration} minutes</p>
        )}
      </div>

      <div className="mt-6">
        {completed ? (
          <button disabled className="w-full h-11 rounded-xl bg-white/5 border border-white/10 text-muted-foreground font-semibold text-sm flex items-center justify-center gap-2 cursor-not-allowed">
            <CheckCircle2 className="w-4 h-4" /> Completed
          </button>
        ) : (
          <button className="w-full h-11 rounded-xl bg-info text-white font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 hover:scale-[1.02] transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <PlayCircle className="w-4 h-4" /> Start Workout
          </button>
        )}
      </div>
    </BentoCard>
  )
}
