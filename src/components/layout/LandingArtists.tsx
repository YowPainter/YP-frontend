'use client'

import { useQuery } from '@tanstack/react-query'
import { ArtistsService } from '@/lib/services/ArtistsService'
import { ArtistCard, ArtistCardSkeleton } from '@/components/ui/ArtistCard'
import Link from 'next/link'

export function LandingArtists() {
  const { data: artists, isLoading } = useQuery({
    queryKey: ['landing-artists'],
    queryFn: () => ArtistsService.searchArtists(''),
  })

  // On n'affiche que les 3 premiers
  const displayArtists = artists?.slice(0, 3) || []

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col relative z-10">
      
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-background/20 pb-8 gap-8">
        <div className="w-full md:w-1/2">
          <span className="w-12 h-[1px] bg-accent block mb-6"></span>
          <h2 className="font-serif text-4xl md:text-6xl font-medium mb-4">Le Village des Créateurs.</h2>
          <p className="text-background/60 font-light text-lg">
            Des centaines de talents internationaux possèdent leur propre galerie sur YowPainter. Explorez leurs univers.
          </p>
        </div>
        
        {/* Bouton de navigation directe (plus compact sur mobile) */}
        <Link 
          href="/artists" 
          className="text-xs uppercase tracking-[0.4em] font-bold text-accent border border-accent/30 px-8 py-3 hover:bg-accent hover:text-white transition-all whitespace-nowrap mb-2"
        >
          Voir tous les artistes
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16 w-full mb-16">
        {isLoading ? (
          <>
            <ArtistCardSkeleton index={0} />
            <ArtistCardSkeleton index={1} />
            <ArtistCardSkeleton index={2} />
          </>
        ) : (
          displayArtists.map((artist, idx) => (
            <ArtistCard key={artist.id} artist={artist} index={idx} />
          ))
        )}
      </div>

      {(!isLoading && displayArtists.length === 0) && (
        <div className="text-center py-12 text-background/40 font-light italic border border-dashed border-background/10 rounded-3xl mb-12">
          La galerie se prépare... Nos premiers artistes arrivent bientôt.
        </div>
      )}
    </div>
  )
}
