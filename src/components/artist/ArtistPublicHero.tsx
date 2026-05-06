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
    <section className="relative w-full pt-0 pb-12 z-0 overflow-hidden">
      
      {/* ── FULL-WIDTH COVER IMAGE ── */}
      <div className="absolute top-0 left-0 w-full h-[350px] md:h-[450px] -z-10">
        <Image 
          src="/images/african-art-v2.png" 
          alt="Artist Cover" 
          fill 
          className="object-cover"
          priority
        />
        {/* Dégradé supérieur pour la lisibilité de la NAVBAR */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/70 via-black/20 to-transparent"></div>
        
        {/* Dégradés pour l'intégration basse */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80"></div>
      </div>

      {/* ── CENTERED CONTENT ── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-[180px] md:pt-[240px]">
        <div className="flex flex-col lg:flex-row items-center lg:items-end gap-6 md:gap-12">
          
          {/* Avatar Asymétrique (Chevauchement) */}
          <div className="relative shrink-0 reveal" style={{ transitionDelay: '200ms' }}>
            <div className="relative w-[180px] h-[230px] md:w-[280px] md:h-[360px] rounded-[40%_60%_60%_40%/30%_30%_70%_70%] overflow-hidden border-[8px] border-background bg-background shadow-2xl">
              {isLoading ? (
                <div className="w-full h-full shimmer" />
              ) : (
                <Image 
                  src={artist?.profilePictureUrl || '/images/placeholder.png'} 
                  alt={displayName} 
                  fill 
                  sizes="(max-width: 768px) 180px, 280px"
                  className="object-cover"
                />
              )}
            </div>
            {/* Badge Portfolio Officiel */}
            <div className="absolute -bottom-2 -right-4 bg-accent text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl rotate-6 reveal" style={{ transitionDelay: '600ms' }}>
              Portfolio Personnel
            </div>
          </div>

          {/* Détails Artiste */}
          <div className="flex-1 text-center lg:text-left pb-6 reveal" style={{ transitionDelay: '400ms' }}>
            <div className="mb-3">
              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight text-foreground leading-none">
                {displayName}
              </h1>
              <div className="flex items-center gap-4 mt-4 justify-center lg:justify-start">
                <div className="h-[1px] w-12 bg-accent/40"></div>
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-accent">
                  YowPainter Artist
                </span>
              </div>
            </div>
            
            <div className="max-w-2xl mt-8">
               {isLoading ? (
                  <div className="flex flex-col gap-2 opacity-30">
                    <div className="h-4 w-full bg-foreground/10 rounded animate-pulse" />
                    <div className="h-4 w-4/5 bg-foreground/10 rounded animate-pulse" />
                  </div>
               ) : (
                  <p className="text-lg md:text-2xl text-foreground/70 font-light leading-relaxed italic">
                    "{artist?.bio || 'Découvrez mon univers artistique unique, où chaque trait raconte une histoire.'}"
                  </p>
               )}
            </div>
            
            <div className="flex items-center gap-3 mt-6 justify-center lg:justify-start text-foreground/40 font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
              <span className="text-[10px] uppercase tracking-widest">
                {artist?.location || 'Cameroun'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Blobs décoratifs en arrière-plan */}
      <div className="absolute top-0 right-0 -z-20 opacity-30 pointer-events-none w-full h-full">
        <AnimatedBlob className="absolute top-0 right-0 w-[40vw] h-[40vw] blur-[150px]" color="accent" />
      </div>
    </section>
  )
}
