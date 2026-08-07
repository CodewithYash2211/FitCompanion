'use client'

import * as React from 'react'
import { Flame } from 'lucide-react'
import { motion } from 'framer-motion'
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

  const focusText = data.timeOfDay === 'Morning' 
    ? "Today's Focus: Hit your protein target and stay hydrated."
    : "Today's Summary: You need 34g more protein and 900ml water to hit your goals."

  return (
    <motion.header 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="col-span-1 md:col-span-4 flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-[#27272a] mb-6"
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-[#1c1c1f] border border-[#27272a] flex items-center justify-center font-medium text-lg text-foreground shadow-sm">
          {data.user.firstName.charAt(0)}
        </div>
        
        {/* Greeting text */}
        <div>
          <h1 className="font-semibold text-2xl text-foreground tracking-tight">
            {greeting}, {data.user.firstName}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {focusText}
          </p>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1c1c1f] border border-[#27272a] shadow-sm">
        <Flame className="w-4 h-4 text-orange-500" />
        <span className="text-sm font-medium text-foreground">{data.user.streak} Day Streak</span>
      </div>
    </motion.header>
  )
}
