import { AuroraBackground } from '@/components/layout/AuroraBackground'
import { Zap, Quote } from 'lucide-react'
import type { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 relative bg-bg-base overflow-hidden">
      {/* Background for mobile (full) and desktop (left half) */}
      <AuroraBackground className="lg:w-[50vw]" />
      
      {/* Left side: Form content */}
      <div className="relative z-10 flex flex-col justify-center px-6 py-12 lg:px-16 xl:px-24">
        {/* Logo */}
        <div className="absolute top-6 left-6 lg:top-10 lg:left-12 flex items-center gap-2 group">
          <div
            className="w-8 h-8 rounded-xl bg-gradient-brand flex items-center justify-center shadow-lg"
            style={{ boxShadow: '0 0 20px rgba(124, 58, 237, 0.5)' }}
          >
            <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-lg text-foreground tracking-tight">
            FitCompanion
          </span>
        </div>
        
        {/* Form Container */}
        <div className="w-full max-w-md mx-auto mt-12 lg:mt-0">
          {children}
        </div>
      </div>

      {/* Right side: Branding/Visual (Hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-between p-12 relative bg-black/40 border-l border-white/5 backdrop-blur-3xl overflow-hidden">
        {/* Subtle right-side aurora effect */}
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none mix-blend-screen"
          style={{
            background: 'radial-gradient(circle at top right, rgba(124, 58, 237, 0.4) 0%, transparent 60%)'
          }}
        />

        <div className="relative z-10 text-right">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium glass border border-white/10 text-brand-400 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
            </span>
            System Online
          </span>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg mb-12">
          <Quote className="w-10 h-10 text-white/20" />
          <h2 className="font-display font-medium text-3xl leading-snug text-foreground">
            &quot;The personalized nutrition plans literally saved me during finals week. I stopped eating junk food and finally got my diet under control.&quot;
          </h2>
          <div className="flex items-center gap-4 pt-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-600 to-info flex items-center justify-center text-white font-bold">
              AK
            </div>
            <div>
              <div className="font-medium text-foreground">Arjun K.</div>
              <div className="text-sm text-muted-foreground">Engineering Student</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
