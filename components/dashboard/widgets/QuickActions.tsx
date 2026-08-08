'use client'

import * as React from 'react'
import { Plus, Utensils, Droplet, Dumbbell, Sparkles } from 'lucide-react'
import { BentoCard } from '../BentoCard'

export function QuickActions() {
  const actions = [
    { icon: Utensils, label: 'Log Meal' },
    { icon: Dumbbell, label: 'Log Workout' },
    { icon: Droplet, label: 'Add Water' },
    { icon: Sparkles, label: 'Ask AI' },
  ]

  return (
    <div className="col-span-1 grid grid-cols-2 gap-3">
      {actions.map((action, i) => {
        const Icon = action.icon
        return (
          <BentoCard 
            key={i}
            variant="action"
            delay={0.8 + (i * 0.05)}
            className="flex flex-col items-center justify-center gap-2 cursor-pointer"
          >
            <Icon className="w-5 h-5 text-muted-foreground transition-colors group-hover:text-foreground" />
            <span className="text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">{action.label}</span>
          </BentoCard>
        )
      })}
    </div>
  )
}
