'use client'

import { SafeImage } from './SafeImage'
import Link from 'next/link'
import { ArtistResponse } from '@/lib/models/ArtistResponse'

interface ArtistCardProps {
  artist: ArtistResponse
  index: number
}

const SHAPES = [
  "rounded-[60%_40%_30%_70%/60%_30%_70%_40%]",
  "rounded-[30%_70%_70%_30%/30%_30%_70%_70%]",
  "rounded-[75%_25%_67%_33%/45%_74%_26%_55%]",
  "rounded-[46%_54%_21%_79%/51%_26%_74%_49%]"
]

export function ArtistCard({ artist, index }: ArtistCardProps) {
  const shapeClass = SHAPES[index % SHAPES.length]
  const artistUrl = `/${artist.slug || artist.id}`

  return (
    <Link 
      href={artistUrl} 
      className="flex flex-col group cursor-pointer transition-all duration-700"
    >
      <div className={`w-full aspect-[4/5] mb-8 overflow-hidden relative ${shapeClass} border border-foreground/10 dark:border-background/20 transition-all duration-700 shadow-sm group-hover:shadow-xl`}>
        <SafeImage 
          src={artist.profilePictureUrl || '/images/placeholder.png'} 
          alt={artist.artistName || 'Artiste'} 
          fill 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" 
        />
        
        {/* Badge Pays / Location */}
        <div className="absolute top-6 left-6 mix-blend-difference">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/80">
            {artist.location || 'YowPainter'}
          </span>
        </div>
      </div>
      
      <div className="flex flex-col items-center text-center px-2">
        <h3 className="font-serif text-3xl font-medium mb-2 group-hover:text-accent transition-colors">
          {artist.artistName || `${artist.firstName} ${artist.lastName}`}
        </h3>
        <div className="w-8 h-[1px] bg-accent/40 mb-3 group-hover:w-20 transition-all duration-700"></div>
        <p className="text-foreground/40 dark:text-background/40 uppercase tracking-[0.4em] text-[10px] font-bold truncate w-full">
          {artist.bio ? (artist.bio.length > 30 ? artist.bio.substring(0, 30) + '...' : artist.bio) : 'Artiste Contemporain'}
        </p>
      </div>
    </Link>
  )
}

export function ArtistCardSkeleton({ index = 0 }: { index?: number }) {
  const shapeClass = SHAPES[index % SHAPES.length]
  return (
    <div className="flex flex-col">
      <div className={`w-full aspect-[4/5] mb-8 shimmer bg-current/[0.05] ${shapeClass} border border-current/[0.05]`}></div>
      <div className="flex flex-col items-center">
        <div className="shimmer h-8 w-3/4 mb-3 bg-current/[0.05] rounded-md"></div>
        <div className="h-[1px] w-8 bg-accent/30 mb-3"></div>
        <div className="shimmer h-3 w-1/2 bg-current/[0.05] rounded-md"></div>
      </div>
    </div>
  )
}
