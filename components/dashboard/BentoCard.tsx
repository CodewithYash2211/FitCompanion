'use client'

import * as React from 'react'
import { motion, HTMLMotionProps, useMotionTemplate, useMotionValue } from 'framer-motion'
import { cn } from '@/lib/utils'

interface BentoCardProps extends Omit<HTMLMotionProps<"div">, 'children'> {
  className?: string
  children: React.ReactNode
  delay?: number
  noPadding?: boolean
}

export function BentoCard({ 
  className, 
  children, 
  delay = 0,
  noPadding = false,
  ...props 
}: BentoCardProps) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent<HTMLDivElement>) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        ease: [0.23, 1, 0.32, 1], 
        delay 
      }}
      className={cn(
        'group relative overflow-hidden rounded-3xl glass border border-white/5 transition-all duration-500 hover:border-white/10 hover:-translate-y-1',
        !noPadding && 'p-6',
        className
      )}
      style={{
        boxShadow: '0 4px 24px -4px rgba(0,0,0,0.4), inset 0 1px 0 0 rgba(255,255,255,0.05)'
      }}
      onMouseMove={handleMouseMove}
      {...props}
    >
      {/* Interactive mouse glow */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-500 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              rgba(124, 58, 237, 0.1),
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
    </motion.div>
  )
}
