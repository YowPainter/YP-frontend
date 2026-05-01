'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className={cn("flex items-center justify-center gap-3 py-10", className)}>
      {/* Previous */}
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="group relative w-10 h-10 flex items-center justify-center transition-all disabled:opacity-20"
      >
        <div className="absolute inset-0 rotate-45 border border-foreground/10 group-hover:border-accent group-hover:bg-accent/5 transition-all" />
        <ChevronLeft size={16} className="relative z-10 text-foreground/60" />
      </button>

      {/* Pages */}
      <div className="flex items-center gap-4">
        {pages.map((page) => {
          const isActive = page === currentPage
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className="group relative w-10 h-10 flex items-center justify-center transition-all"
            >
              <div
                className={cn(
                  "absolute inset-0 rotate-45 transition-all duration-500 shadow-sm",
                  isActive 
                    ? "bg-accent border-accent scale-110 shadow-accent/20" 
                    : "border border-foreground/10 bg-foreground/[0.02] group-hover:border-accent/40"
                )}
              />
              <span
                className={cn(
                  "relative z-10 font-mono text-[11px] font-bold transition-colors",
                  isActive ? "text-white" : "text-foreground/40 group-hover:text-accent"
                )}
              >
                {page.toString().padStart(2, '0')}
              </span>
            </button>
          )
        })}
      </div>

      {/* Next */}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="group relative w-10 h-10 flex items-center justify-center transition-all disabled:opacity-20"
      >
        <div className="absolute inset-0 rotate-45 border border-foreground/10 group-hover:border-accent group-hover:bg-accent/5 transition-all" />
        <ChevronRight size={16} className="relative z-10 text-foreground/60" />
      </button>
    </div>
  )
}
