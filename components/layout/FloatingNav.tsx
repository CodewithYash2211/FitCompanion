/**
 * Floating Navigation — Mobile
 * Bottom pill navigation bar for screens < 768px.
 * Center FAB button opens Quick Log sheet.
 */

'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Salad, Plus, Dumbbell, User as UserIcon, LogOut, Settings } from 'lucide-react'
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

const navItems = [
  { href: '/dashboard',  icon: LayoutDashboard, label: 'Home' },
  { href: '/nutrition',  icon: Salad,            label: 'Nutrition' },
  null, // FAB placeholder
  { href: '/fitness',    icon: Dumbbell,         label: 'Fitness' },
  { isProfileMenu: true, icon: UserIcon,         label: 'Profile' },
]

export function FloatingNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  
  const name = user?.name || 'User'
  const email = user?.email || ''

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

        const { href, icon: Icon, label, isProfileMenu } = item
        const isActive = href ? (pathname === href || pathname.startsWith(href + '/')) : false

        if (isProfileMenu) {
          return (
            <DropdownMenu key="profile-menu">
              <DropdownMenuTrigger
                aria-label={label}
                className={cn(
                  'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl',
                  'transition-all duration-200 min-w-[52px]',
                  'text-muted-foreground outline-none'
                )}
              >
                <Icon className="w-5 h-5 transition-all" />
                <span className="text-[10px] font-medium">{label}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="top" sideOffset={16} className="w-[220px]">
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
          )
        }

        return (
          <Link
            key={href}
            href={href as string}
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
