import React from 'react'

export function AbstractShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30 dark:opacity-20 z-0 select-none mix-blend-multiply dark:mix-blend-screen">
      {/* Triangle incliné */}
      <svg className="absolute top-[15%] left-[5%] w-32 h-32 text-accent rotate-[15deg] animate-pulse" style={{ animationDuration: '8s' }} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 100 100">
        <polygon points="50,15 90,85 10,85" />
      </svg>
      
      {/* Cercle minimaliste outline */}
      <svg className="absolute top-[40%] right-[8%] w-56 h-56 text-foreground/20" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="48" />
      </svg>
      
      {/* Trait courbé abstrait */}
      <svg className="absolute bottom-[25%] left-[20%] w-72 h-72 text-accent/40 -rotate-[8deg]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" viewBox="0 0 200 200">
        <path d="M 20 150 Q 80 10 120 180 T 180 40" />
      </svg>
      
      {/* Traits Zigzag */}
      <svg className="absolute top-[65%] right-[22%] w-40 h-40 text-foreground/30 rotate-[35deg]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" viewBox="0 0 100 100">
        <polyline points="10,50 30,20 50,80 70,20 90,50" />
      </svg>
      
      {/* Picots / Petits points épars */}
      <svg className="absolute top-[8%] right-[28%] w-32 h-32 text-accent/80" fill="currentColor" viewBox="0 0 100 100">
        <circle cx="20" cy="20" r="1.5" />
        <circle cx="45" cy="55" r="1.5" />
        <circle cx="85" cy="35" r="2" />
        <circle cx="75" cy="85" r="1" />
        <circle cx="30" cy="90" r="1.5" />
      </svg>
      
      {/* Ligne diagonale franche */}
      <svg className="absolute bottom-[5%] right-[5%] w-48 h-48 text-foreground/20 -rotate-[20deg]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 100 100">
        <line x1="10" y1="90" x2="90" y2="10" />
      </svg>
      
      {/* Croix (+) orientée */}
      <svg className="absolute top-[28%] left-[38%] w-16 h-16 text-accent/50 rotate-[12deg]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" viewBox="0 0 100 100">
        <line x1="50" y1="20" x2="50" y2="80" />
        <line x1="20" y1="50" x2="80" y2="50" />
      </svg>
    </div>
  )
}
