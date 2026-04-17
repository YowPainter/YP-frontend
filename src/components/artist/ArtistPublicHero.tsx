'use client'

import Image from 'next/image'
import { ArtistResponse } from '@/lib/models/ArtistResponse'
import { Skeleton } from '@/components/ui/Skeleton'
import { AnimatedBlob } from '@/components/ui/AnimatedBlob'

interface ArtistPublicHeroProps {
  artist: ArtistResponse | null
  isLoading: boolean
}

export function ArtistPublicHero({ artist, isLoading }: ArtistPublicHeroProps) {
  const displayName = artist?.artistName || (artist ? `${artist.firstName} ${artist.lastName}` : 'Artiste')

  return (
    <section className="relative w-full pt-32 pb-16 px-6 sm:px-12 max-w-[1400px] mx-auto z-10">
      
      {/* Background Blobs for specific artist personality */}
      <div className="absolute top-0 right-0 -z-10 opacity-30 pointer-events-none">
        <AnimatedBlob className="w-[40vw] h-[40vw] blur-[120px]" color="accent" />
      </div>

      <div className="flex flex-col lg:flex-row items-center lg:items-end gap-12 lg:gap-20">
        
        {/* Avatar Asymétrique */}
        <div className="relative shrink-0 reveal">
          <div className="w-[200px] h-[250px] md:w-[280px] md:h-[350px] rounded-[30%_70%_70%_30%/30%_30%_70%_70%] overflow-hidden border border-foreground/10 bg-white p-2 shadow-2xl">
            {isLoading ? (
              <div className="w-full h-full bg-foreground/5 animate-pulse" />
            ) : (
              <Image 
                src={artist?.profilePictureUrl || '/images/placeholder.png'} 
                alt={displayName} 
                fill 
                className="object-cover"
              />
            )}
          </div>
          {/* Badge Artiste Certifié */}
          <div className="absolute -bottom-4 -right-4 bg-accent text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg rotate-3">
            Portfolio Officiel
          </div>
        </div>

        {/* Info Texte */}
        <div className="flex-1 text-center lg:text-left reveal-delay-1">
          <div className="flex flex-col lg:flex-row lg:items-baseline gap-4 mb-6">
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-medium tracking-tighter leading-none">
              {isLoading ? <Skeleton className="h-16 w-64 inline-block" /> : displayName}
            </h1>
            <span className="text-xs uppercase tracking-[0.5em] text-accent font-bold">
              {artist?.location || 'YowPainter Artist'}
            </span>
          </div>
          
          <div className="max-w-xl">
             <div className="h-[1px] w-20 bg-accent mb-8 mx-auto lg:mx-0"></div>
             {isLoading ? (
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                </div>
             ) : (
                <p className="text-xl md:text-2xl text-foreground/70 font-light leading-relaxed italic">
                  "{artist?.bio || 'Découvrez mon univers artistique unique, où chaque trait raconte une histoire.'}"
                </p>
             )}
          </div>
        </div>
      </div>
    </section>
  )
}
