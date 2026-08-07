/**
 * App Layout — Protected Route Group
 * Wraps all authenticated pages with the sidebar and floating nav.
 */

import { Sidebar } from '@/components/layout/Sidebar'
import { FloatingNav } from '@/components/layout/FloatingNav'
import type { ReactNode } from 'react'

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main
        className={[
          'flex-1',
          'ml-16 lg:ml-60',          // Offset for sidebar (icon-only then full)
          'pb-24 md:pb-0',            // Bottom padding for mobile nav
          'min-h-screen',
        ].join(' ')}
      >
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Floating Nav */}
      <FloatingNav />
    </div>
  )
}
