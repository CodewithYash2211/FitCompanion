'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
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
  Zap,
  LogOut,
  User as UserIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/context/AuthContext'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

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
  const router = useRouter()
  const { user, logout } = useAuth()
  
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U'
  const name = user?.name || 'User'
  const email = user?.email || ''

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
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full">
            <div className="p-4 rounded-xl bg-[#121214] border border-[#27272a] shadow-sm flex flex-col gap-3 group hover:border-[#3f3f46] transition-colors cursor-pointer text-left">
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8 rounded-full border border-[#27272a]">
                  <AvatarFallback className="bg-[#1c1c1f] text-xs font-semibold text-foreground">
                    {initial}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-medium text-foreground leading-none mb-1 truncate">
                    {name}
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider truncate">
                    Premium Member
                  </span>
                </div>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-[220px]">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/settings')} className="cursor-pointer">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/settings')} className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="cursor-pointer text-danger focus:text-danger">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
