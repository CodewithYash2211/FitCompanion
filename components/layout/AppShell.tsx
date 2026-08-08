'use client'

import * as React from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { FloatingNav } from '@/components/layout/FloatingNav'
import { useWorkout } from '@/lib/context/WorkoutContext'
import { Toaster } from 'sonner'
import { TopFixedWorkoutBar } from '@/components/layout/TopFixedWorkoutBar'

export function AppShell({ children }: { children: React.ReactNode }) {
  const { activeSession } = useWorkout()
  const isWorkoutMode = !!activeSession

  return (
    <>
      <div className="flex min-h-screen">
        {/* Only show Sidebar if not in workout mode */}
        {!isWorkoutMode && <Sidebar />}

        {/* Fixed Top Bar for Workout Mode */}
        {isWorkoutMode && <TopFixedWorkoutBar />}

        {/* Main Content Area */}
        <main
          className={[
            'flex-1',
            isWorkoutMode ? 'ml-0 pt-20' : 'ml-16 lg:ml-60', // No margin if workout mode, plus top padding for fixed bar
            !isWorkoutMode ? 'pb-24 md:pb-0' : 'pb-0',
            'min-h-screen relative',
          ].join(' ')}
        >
          <div className={isWorkoutMode ? 'w-full' : 'p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto'}>
            {children}
          </div>
        </main>

        {/* Mobile Nav */}
        {!isWorkoutMode && <FloatingNav />}
      </div>
      <Toaster theme="dark" position="bottom-right" visibleToasts={1} />
    </>
  )
}
