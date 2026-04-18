'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function NavigationProgress() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // When the route changes, start the bar
    setLoading(true)
    setProgress(0)

    // Simulate progression
    const timer1 = setTimeout(() => setProgress(40), 50)
    const timer2 = setTimeout(() => setProgress(70), 300)
    const timer3 = setTimeout(() => setProgress(90), 600)

    // Complete and hide
    const done = setTimeout(() => {
      setProgress(100)
      setTimeout(() => setLoading(false), 300)
    }, 800)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(done)
    }
  }, [pathname, searchParams])

  if (!loading && progress === 0) return null

  return (
    <div
      className="fixed top-0 left-0 z-[9999] h-[2px] bg-accent transition-all duration-300 ease-out pointer-events-none"
      style={{
        width: `${progress}%`,
        opacity: loading ? 1 : 0,
        boxShadow: '0 0 8px 2px rgba(194, 109, 92, 0.5)',
      }}
    />
  )
}
