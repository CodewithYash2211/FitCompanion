'use client'

import * as React from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

interface AnimatedCounterProps {
  value: number
  format?: (value: number) => string
  className?: string
  duration?: number
}

export function AnimatedCounter({
  value,
  format = (val) => Math.round(val).toLocaleString('en-IN'),
  className,
  duration = 2000,
}: AnimatedCounterProps) {
  const spring = useSpring(0, {
    mass: 1,
    stiffness: 75,
    damping: 15,
    duration,
  })
  
  const displayValue = useTransform(spring, (current) => format(current))

  React.useEffect(() => {
    spring.set(value)
  }, [value, spring])

  return (
    <motion.span className={className}>
      {displayValue}
    </motion.span>
  )
}
