/**
 * Aurora Background Component
 * Animated mesh gradient background for auth pages and landing page.
 * Uses CSS animations — no JS computation, GPU-accelerated.
 */

'use client'

import { cn } from '@/lib/utils'

interface AuroraBackgroundProps {
  className?: string
  /** Show more intense blobs (for hero sections) */
  intense?: boolean
}

export function AuroraBackground({ className, intense = false }: AuroraBackgroundProps) {
  return (
    <div
      className={cn(
        'fixed inset-0 overflow-hidden pointer-events-none z-0',
        className
      )}
      aria-hidden="true"
    >
      {/* Violet blob — top-left */}
      <div
        className="aurora-blob"
        style={{
          width: intense ? '600px' : '500px',
          height: intense ? '600px' : '500px',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.18) 0%, transparent 70%)',
          top: '-10%',
          left: '-10%',
          animationDelay: '0s',
          animationDuration: '18s',
        }}
      />

      {/* Indigo blob — bottom-right */}
      <div
        className="aurora-blob"
        style={{
          width: intense ? '700px' : '600px',
          height: intense ? '700px' : '600px',
          background: 'radial-gradient(circle, rgba(79, 70, 229, 0.14) 0%, transparent 70%)',
          bottom: '-15%',
          right: '-10%',
          animationDelay: '-7s',
          animationDuration: '22s',
        }}
      />

      {/* Emerald blob — center-bottom */}
      <div
        className="aurora-blob"
        style={{
          width: intense ? '500px' : '400px',
          height: intense ? '500px' : '400px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.09) 0%, transparent 70%)',
          bottom: '10%',
          left: '30%',
          animationDelay: '-13s',
          animationDuration: '25s',
        }}
      />

      {/* Cyan accent — top-right */}
      {intense && (
        <div
          className="aurora-blob"
          style={{
            width: '350px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(34, 211, 238, 0.08) 0%, transparent 70%)',
            top: '20%',
            right: '15%',
            animationDelay: '-4s',
            animationDuration: '20s',
          }}
        />
      )}
    </div>
  )
}
