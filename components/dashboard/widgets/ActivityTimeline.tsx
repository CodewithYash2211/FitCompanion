'use client'

import * as React from 'react'
import { Utensils, Droplet, Dumbbell, Sparkles } from 'lucide-react'
import { BentoCard } from '../BentoCard'
import type { DashboardData } from '@/services/mock-data'

export function ActivityTimeline({ data }: { data: DashboardData }) {
  return (
    <BentoCard variant="data" delay={0.8} className="col-span-1 md:col-span-2">
      <h3 className="font-semibold text-sm text-foreground mb-6">
        Recent Activity
      </h3>
      
      <div className="space-y-6">
        {data.timeline.map((item, index) => (
          <div key={item.id} className="relative flex gap-4">
            {/* Timeline Line */}
            {index !== data.timeline.length - 1 && (
              <div className="absolute left-3.5 top-8 bottom-[-1.5rem] w-px bg-[#27272a]" />
            )}
            
            {/* Icon */}
            <div className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border ${
              item.type === 'meal' ? 'bg-[#1c1c1f] text-[#f59e0b] border-[#27272a]' :
              item.type === 'water' ? 'bg-[#1c1c1f] text-[#3b82f6] border-[#27272a]' :
              item.type === 'workout' ? 'bg-[#1c1c1f] text-[#10b981] border-[#27272a]' :
              'bg-[#1c1c1f] text-[#8b5cf6] border-[#27272a]'
            }`}>
              {item.type === 'meal' && <Utensils className="w-3.5 h-3.5" />}
              {item.type === 'water' && <Droplet className="w-3.5 h-3.5" />}
              {item.type === 'workout' && <Dumbbell className="w-3.5 h-3.5" />}
              {item.type === 'insight' && <Sparkles className="w-3.5 h-3.5" />}
            </div>
            
            {/* Content */}
            <div className="flex-1 pb-1">
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-medium text-foreground text-sm">{item.title}</span>
                <span className="text-xs text-muted-foreground">{item.time}</span>
              </div>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </BentoCard>
  )
}
