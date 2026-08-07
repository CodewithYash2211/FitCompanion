import { AuroraBackground } from '@/components/layout/AuroraBackground'
import type { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <AuroraBackground />
      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
