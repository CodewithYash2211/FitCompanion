/**
 * Sidebar Navigation — Desktop
 * Fixed 240px glass sidebar for app routes.
 * Collapses to icon-only on tablet (64px).
 */

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Bot, Salad, Dumbbell, BarChart3,
  History, Calculator, Settings, Zap, LogOut, ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Nav Items ────────────────────────────────────────────────────────────────

const navItems = [
  { href: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/ai-coach',     icon: Bot,             label: 'AI Coach',    badge: 'AI' },
  { href: '/nutrition',    icon: Salad,           label: 'Nutrition' },
  { href: '/fitness',      icon: Dumbbell,        label: 'Fitness' },
  { href: '/analytics',    icon: BarChart3,       label: 'Analytics' },
  { href: '/history',      icon: History,         label: 'History' },
]

const toolItems = [
  { href: '/calculators', icon: Calculator, label: 'Calculators' },
  { href: '/settings',    icon: Settings,   label: 'Settings' },
]

// ─── NavItem Component ────────────────────────────────────────────────────────

interface NavItemProps {
  href: string
  icon: React.ElementType
  label: string
  badge?: string
  isActive: boolean
}

function NavItem({ href, icon: Icon, label, badge, isActive }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative',
        isActive
          ? 'bg-brand-500/15 text-brand-400 border border-brand-500/20'
          : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
      )}
    >
      <Icon
        className={cn(
          'w-4 h-4 flex-shrink-0 transition-colors',
          isActive ? 'text-brand-400' : 'text-muted-foreground group-hover:text-foreground'
        )}
      />
      <span className="flex-1 hidden lg:block">{label}</span>
      {badge && (
        <span className="hidden lg:block text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-brand-500/20 text-brand-400">
          {badge}
        </span>
      )}
      {isActive && (
        <div className="absolute right-0 w-1 h-4 bg-brand-500 rounded-l-full" />
      )}
    </Link>
  )
}

// ─── Sidebar Component ────────────────────────────────────────────────────────

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-full z-40',
        'w-16 lg:w-60',
        'glass-heavy border-r border-white/8',
        'flex flex-col',
        'transition-all duration-300'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-4 border-b border-white/8">
        <div
          className="w-8 h-8 rounded-xl bg-gradient-brand flex items-center justify-center flex-shrink-0"
          style={{ boxShadow: '0 0 16px rgba(124, 58, 237, 0.4)' }}
        >
          <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
        </div>
        <span className="hidden lg:block font-display font-bold text-base text-foreground tracking-tight">
          FitCompanion
        </span>
      </div>

      {/* Primary nav */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            {...item}
            isActive={pathname === item.href || pathname.startsWith(item.href + '/')}
          />
        ))}

        {/* Divider */}
        <div className="my-3 border-t border-white/5" />

        {/* Tool items */}
        {toolItems.map((item) => (
          <NavItem
            key={item.href}
            {...item}
            isActive={pathname === item.href}
          />
        ))}
      </nav>

      {/* User section */}
      <div className="p-2 border-t border-white/8">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold text-brand-400">A</span>
          </div>
          <div className="hidden lg:flex flex-col min-w-0 flex-1">
            <span className="text-sm font-medium text-foreground truncate">Arjun</span>
            <span className="text-xs text-muted-foreground truncate">arjun@example.com</span>
          </div>
          <ChevronRight className="hidden lg:block w-4 h-4 text-muted-foreground group-hover:text-foreground" />
        </div>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-danger hover:bg-danger/5 transition-all mt-1">
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span className="hidden lg:block">Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
