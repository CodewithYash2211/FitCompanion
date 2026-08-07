'use client'

import * as React from 'react'
import { Sparkles, ArrowRight } from 'lucide-react'
import { BentoCard } from '../BentoCard'
import type { DashboardData } from '@/services/mock-data'

export function AiCoachWidget({ data }: { data: DashboardData }) {
  return (
    <BentoCard delay={0.7} className="col-span-1 md:col-span-2 relative overflow-hidden group/ai bg-gradient-to-br from-brand-900/40 to-black border-brand-500/20">
      <div className="absolute top-0 right-0 p-6 opacity-20 transform translate-x-4 -translate-y-4 group-hover/ai:scale-110 group-hover/ai:opacity-30 transition-all duration-700 pointer-events-none">
        <Sparkles className="w-32 h-32 text-brand-400" />
      </div>

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-brand-500/30 bg-brand-500/10 text-brand-300 mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
            </span>
            AI Insight
          </div>
          
          <p className="text-foreground font-medium leading-relaxed pr-8">
            "{data.aiCoach.insight}"
          </p>
        </div>

        <button className="mt-6 w-max inline-flex items-center gap-2 text-sm font-semibold text-brand-400 hover:text-brand-300 transition-colors group/btn">
          Chat with Coach <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </BentoCard>
  )
}
