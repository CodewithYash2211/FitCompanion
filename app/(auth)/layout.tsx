import type { ReactNode } from 'react'
import Link from 'next/link'
import { Activity, ArrowLeft } from 'lucide-react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col relative overflow-hidden">
      {/* Subtle Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(255,255,255,0.03)_0%,transparent_60%)] opacity-50" />
      </div>

      {/* Top Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Activity className="w-6 h-6 text-white" strokeWidth={2.5} />
          <span className="font-display font-bold text-xl tracking-tighter uppercase">FITCOMPANION</span>
        </Link>
        <Link href="/" className="flex items-center gap-2 text-sm font-bold text-white/50 hover:text-white uppercase tracking-widest transition-colors">
          <ArrowLeft className="w-4 h-4" /> Return
        </Link>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-[440px]">
          {children}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="relative z-10 p-6 text-center">
        <p className="text-white/20 font-bold uppercase tracking-widest text-[10px]">
          Secure Authentication Protocol
        </p>
      </footer>
    </div>
  )
}
