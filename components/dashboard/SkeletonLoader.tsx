'use client'

import { cn } from '@/lib/utils'

interface SkeletonLoaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SkeletonLoader({ className, ...props }: SkeletonLoaderProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-3xl bg-white/5 border border-white/5',
        className
      )}
      {...props}
    />
  )
}
