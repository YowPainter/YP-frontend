import React from 'react'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-foreground/10 rounded-md ${className}`} />
  )
}

export function SkeletonCircle({ className }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-foreground/10 rounded-full ${className}`} />
  )
}
