'use client'

import * as React from 'react'
import { Sparkles, ArrowRight } from 'lucide-react'
import { BentoCard } from '../BentoCard'
import type { DashboardData } from '@/services/mock-data'

export function AiCoachWidget({ data }: { data: DashboardData }) {
  return (
    <BentoCard variant="ai" delay={0.7} className="col-span-1 md:col-span-2 flex flex-col justify-between group/ai">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-md bg-[#8b5cf6]/10 flex items-center justify-center border border-[#8b5cf6]/20">
            <Sparkles className="w-3.5 h-3.5 text-[#8b5cf6]" />
          </div>
          <span className="text-sm font-medium text-[#8b5cf6]">AI Coach Insight</span>
        </div>
        
        <p className="text-sm text-foreground leading-relaxed">
          "{data.aiCoach.insight}"
        </p>
      </div>

      <button className="mt-6 w-max inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors group/btn">
        Chat with Coach <ArrowRight className="w-3.5 h-3.5 transform group-hover/btn:translate-x-1 transition-transform" />
      </button>
    </BentoCard>
  )
}
