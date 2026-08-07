'use client'

import * as React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

interface BentoCardProps extends Omit<HTMLMotionProps<"div">, 'children'> {
  className?: string
  children: React.ReactNode
  delay?: number
  variant?: 'data' | 'analytics' | 'ai' | 'action'
}

export function BentoCard({ 
  className, 
  children, 
  delay = 0,
  variant = 'data',
  ...props 
}: BentoCardProps) {
  
  const getVariantStyles = () => {
    switch (variant) {
      case 'data': return 'widget-data hover-lift'
      case 'analytics': return 'widget-analytics hover-lift'
      case 'ai': return 'widget-ai hover-lift'
      case 'action': return 'widget-action'
      default: return 'widget-data hover-lift'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        ease: [0.23, 1, 0.32, 1], 
        delay 
      }}
      className={cn(getVariantStyles(), className)}
      {...props}
    >
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
    </motion.div>
  )
}
