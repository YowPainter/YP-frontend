import React from 'react'
import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("shimmer bg-foreground/5 rounded-md", className)} />
  )
}

export function SkeletonCircle({ className }: SkeletonProps) {
  return (
    <div className={cn("shimmer bg-foreground/5 rounded-full", className)} />
  )
}
