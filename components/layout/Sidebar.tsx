'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, LayoutGroup } from 'framer-motion'
import { 
  LayoutDashboard, 
  Utensils, 
  Dumbbell, 
  Sparkles, 
  Calculator,
  LineChart,
  History,
  Settings,
  Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/nutrition', label: 'Diet Planner', icon: Utensils },
  { href: '/fitness', label: 'Workout Planner', icon: Dumbbell },
  { href: '/ai-coach', label: 'AI Coach', icon: Sparkles },
  { href: '/calculators', label: 'Calculators', icon: Calculator },
  { href: '/analytics', label: 'Analytics', icon: LineChart },
  { href: '/history', label: 'History', icon: History },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 h-screen border-r border-[#27272a] bg-[#0a0a0c] flex flex-col fixed left-0 top-0 pt-8 pb-6 z-40 shadow-[4px_0_24px_rgba(0,0,0,0.5)]">
      {/* Brand Logo */}
      <div className="px-8 mb-10 flex items-center gap-3 group cursor-pointer">
        <div className="w-8 h-8 rounded-[10px] bg-[#ededef] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
          <Zap className="w-4 h-4 text-[#0a0a0c]" strokeWidth={3} />
        </div>
        <span className="font-semibold text-lg text-foreground tracking-tight">
          FitCompanion
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 relative">
        <LayoutGroup>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors relative',
                  isActive 
                    ? 'text-foreground' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-[#121214]'
                )}
              >
                {/* Active Indicator Background */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-indicator"
                    className="absolute inset-0 bg-[#1c1c1f] rounded-lg border border-[#27272a]"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                
                {/* Active left bar */}
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active-bar"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-[#ededef] rounded-r-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}

                <div className="relative z-10 flex items-center gap-3">
                  <Icon 
                    className={cn(
                      "w-4 h-4 transition-transform duration-300", 
                      isActive ? "text-foreground" : "text-muted-foreground group-hover:scale-110"
                    )} 
                  />
                  <span>{item.label}</span>
                </div>
              </Link>
            )
          })}
        </LayoutGroup>
      </nav>

      {/* Upgrade CTA / User Footer */}
      <div className="px-4 mt-auto">
        <div className="p-4 rounded-xl bg-[#121214] border border-[#27272a] shadow-sm flex flex-col gap-3 group hover:border-[#3f3f46] transition-colors cursor-pointer">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#1c1c1f] border border-[#27272a] flex items-center justify-center text-xs font-semibold">
              Y
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground leading-none mb-1">Yash</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Free Plan</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
