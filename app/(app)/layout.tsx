/**
 * App Layout — Protected Route Group
 * Wraps all authenticated pages with the sidebar and floating nav.
 */

import { Sidebar } from '@/components/layout/Sidebar'
import { FloatingNav } from '@/components/layout/FloatingNav'
import { AuthProvider } from '@/lib/context/AuthContext'
import { UserProvider } from '@/lib/context/UserContext'
import { NutritionProvider } from '@/lib/context/NutritionContext'
import { WorkoutProvider } from '@/lib/context/WorkoutContext'
import { AppShell } from '@/components/layout/AppShell'
import type { ReactNode } from 'react'

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <UserProvider>
        <NutritionProvider>
          <WorkoutProvider>
            <AppShell>
              {children}
            </AppShell>
          </WorkoutProvider>
        </NutritionProvider>
      </UserProvider>
    </AuthProvider>
  )
}
