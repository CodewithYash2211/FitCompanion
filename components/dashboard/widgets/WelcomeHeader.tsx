'use client'

import * as React from 'react'
import { Flame, Sparkles } from 'lucide-react'
import { BentoCard } from '../BentoCard'
import type { DashboardData } from '@/services/mock-data'

interface WelcomeHeaderProps {
  data: DashboardData
}

export function WelcomeHeader({ data }: WelcomeHeaderProps) {
  const greeting = data.timeOfDay === 'Morning' 
    ? 'Good Morning ☀️' 
    : data.timeOfDay === 'Afternoon' 
    ? 'Good Afternoon 🌤️' 
    : 'Good Evening 🌙'

  return (
    <BentoCard delay={0.1} className="col-span-1 md:col-span-3 lg:col-span-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden relative">
      {/* Background ambient glow based on time of day */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: data.timeOfDay === 'Morning' 
            ? 'radial-gradient(ellipse at left top, #FCD34D, transparent 70%)'
            : data.timeOfDay === 'Afternoon'
            ? 'radial-gradient(ellipse at left top, #60A5FA, transparent 70%)'
            : 'radial-gradient(ellipse at left top, #7C3AED, transparent 70%)'
        }}
      />
      
      <div className="relative z-10 flex items-center gap-4">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 p-1">
          <div className="w-full h-full rounded-full bg-gradient-brand flex items-center justify-center font-display font-bold text-xl shadow-inner">
            {data.user.firstName.charAt(0)}
          </div>
        </div>
        
        {/* Greeting text */}
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">
            {greeting}, <span className="text-gradient-brand">{data.user.firstName}</span> 👋
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="flex items-center gap-1 text-sm font-medium text-orange-400 bg-orange-400/10 px-2.5 py-0.5 rounded-full border border-orange-400/20">
              <Flame className="w-3.5 h-3.5" /> {data.user.streak} Day Streak
            </span>
          </div>
        </div>
      </div>

      {/* Motivational Quote */}
      <div className="relative z-10 hidden lg:flex items-center gap-3 bg-white/5 px-4 py-3 rounded-2xl border border-white/10 max-w-sm">
        <Sparkles className="w-5 h-5 text-brand-400 flex-shrink-0" />
        <p className="text-sm font-medium text-muted-foreground italic leading-tight">
          "{data.aiCoach.quote}"
        </p>
      </div>
    </BentoCard>
  )
}
