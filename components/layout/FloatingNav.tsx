/**
 * Floating Navigation — Mobile
 * Bottom pill navigation bar for screens < 768px.
 * Center FAB button opens Quick Log sheet.
 */

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Salad, Plus, Dumbbell, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard',  icon: LayoutDashboard, label: 'Home' },
  { href: '/nutrition',  icon: Salad,            label: 'Nutrition' },
  null, // FAB placeholder
  { href: '/fitness',    icon: Dumbbell,         label: 'Fitness' },
  { href: '/settings',   icon: User,             label: 'Profile' },
]

export function FloatingNav() {
  const pathname = usePathname()

  return (
    <nav
      className={cn(
        'fixed bottom-4 left-1/2 -translate-x-1/2 z-50',
        'flex items-center gap-1 px-3 py-2',
        'rounded-full glass-heavy border border-white/10',
        'md:hidden', // Only visible on mobile
      )}
      style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,58,237,0.15)' }}
      role="navigation"
      aria-label="Mobile navigation"
    >
      {navItems.map((item, index) => {
        // FAB in the center
        if (!item) {
          return (
            <button
              key="fab"
              aria-label="Quick log"
              className={cn(
                'w-12 h-12 -mt-4 rounded-full',
                'bg-gradient-brand flex items-center justify-center',
                'transition-all duration-200 active:scale-95',
              )}
              style={{ boxShadow: '0 0 20px rgba(124, 58, 237, 0.6)' }}
            >
              <Plus className="w-5 h-5 text-white" strokeWidth={2.5} />
            </button>
          )
        }

        const { href, icon: Icon, label } = item
        const isActive = pathname === href || pathname.startsWith(href + '/')

        return (
          <Link
            key={href}
            href={href}
            aria-label={label}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl',
              'transition-all duration-200 min-w-[52px]',
              isActive
                ? 'text-brand-400'
                : 'text-muted-foreground'
            )}
          >
            <Icon
              className={cn(
                'w-5 h-5 transition-all',
                isActive && 'scale-110'
              )}
            />
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
