'use client'

import * as React from 'react'
import { Plus, Utensils, Droplet, Dumbbell, Sparkles } from 'lucide-react'
import { BentoCard } from '../BentoCard'

export function QuickActions() {
  const actions = [
    { icon: Utensils, label: 'Log Meal', color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' },
    { icon: Dumbbell, label: 'Log Workout', color: 'text-info', bg: 'bg-info/10', border: 'border-info/20' },
    { icon: Droplet, label: 'Add Water', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
    { icon: Sparkles, label: 'Ask AI', color: 'text-brand-400', bg: 'bg-brand-400/10', border: 'border-brand-400/20' },
  ]

  return (
    <BentoCard delay={0.9} className="col-span-1">
      <h3 className="font-display font-semibold text-lg text-foreground mb-4">
        Quick Actions
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, i) => {
          const Icon = action.icon
          return (
            <button 
              key={i}
              className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border ${action.bg} ${action.border} hover:bg-white/10 transition-colors group/btn relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-white/0 group-hover/btn:bg-white/5 transition-colors" />
              <Icon className={`w-5 h-5 ${action.color} group-hover/btn:scale-110 transition-transform`} />
              <span className="text-xs font-medium text-foreground">{action.label}</span>
            </button>
          )
        })}
      </div>
    </BentoCard>
  )
}
