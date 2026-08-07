'use client'

import * as React from 'react'
import { Utensils, Droplet, Dumbbell, Sparkles } from 'lucide-react'
import { BentoCard } from '../BentoCard'
import type { DashboardData } from '@/services/mock-data'

export function ActivityTimeline({ data }: { data: DashboardData }) {
  return (
    <BentoCard delay={0.8} className="col-span-1 md:col-span-2">
      <h3 className="font-display font-semibold text-lg text-foreground mb-4">
        Recent Activity
      </h3>
      
      <div className="space-y-4">
        {data.timeline.map((item, index) => (
          <div key={item.id} className="relative flex gap-4">
            {/* Timeline Line */}
            {index !== data.timeline.length - 1 && (
              <div className="absolute left-4 top-10 bottom-[-1rem] w-px bg-white/10" />
            )}
            
            {/* Icon */}
            <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border ${
              item.type === 'meal' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
              item.type === 'water' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
              item.type === 'workout' ? 'bg-info/10 text-info border-info/20' :
              'bg-brand-500/10 text-brand-400 border-brand-500/20'
            }`}>
              {item.type === 'meal' && <Utensils className="w-3.5 h-3.5" />}
              {item.type === 'water' && <Droplet className="w-3.5 h-3.5" />}
              {item.type === 'workout' && <Dumbbell className="w-3.5 h-3.5" />}
              {item.type === 'insight' && <Sparkles className="w-3.5 h-3.5" />}
            </div>
            
            {/* Content */}
            <div className="flex-1 pb-4">
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-medium text-foreground text-sm">{item.title}</span>
                <span className="text-xs text-muted-foreground">{item.time}</span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </BentoCard>
  )
}
