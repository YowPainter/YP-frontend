'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ArtistsService } from '@/lib/services/ArtistsService'
import { ArtistCard, ArtistCardSkeleton } from '@/components/ui/ArtistCard'
import { AnimatedBlob } from '@/components/ui/AnimatedBlob'
import { AbstractShapes } from '@/components/ui/AbstractShapes'
import { Pagination } from '@/components/ui/Pagination'

export default function ArtistsPage() {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 8

  const { data: artists, isLoading } = useQuery({
    queryKey: ['artists-directory', search],
    queryFn: () => ArtistsService.searchArtists(search),
  })

  const paginatedArtists = artists ? artists.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE) : []
  const totalPages = artists ? Math.ceil(artists.length / ITEMS_PER_PAGE) : 0;

  return (
    <div className="min-h-screen bg-background text-foreground antialiased font-sans canvas-texture canvas-grain relative selection:bg-accent/30 pt-32 pb-24">
      
      {/* Ambient Backgrounds artistiques */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden mix-blend-multiply dark:mix-blend-screen opacity-70">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(194,109,92,0.1),transparent_60%)]"></div>
        <AnimatedBlob className="top-[-10%] right-[-5%] w-[50vw] h-[50vw] blur-3xl opacity-20" color="accent" />
        <AnimatedBlob className="bottom-[10%] left-[-10%] w-[40vw] h-[40vw] blur-3xl opacity-15" color="slate" />
        <AbstractShapes />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 sm:px-12 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-foreground/5 pb-12 gap-8">
          <div className="w-full md:w-1/2">
            <span className="w-24 h-[1px] bg-accent block mb-8"></span>
            <h1 className="font-serif text-6xl md:text-8xl font-light mb-6 tracking-tighter">
              Nos <span className="italic font-normal text-accent">Artistes</span>
            </h1>
            <p className="text-foreground/50 font-light text-2xl max-w-lg leading-tight">
              Explorez une collection de talents visionnaires sélectionnés pour leur audace et leur maîtrise.
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-1/3 relative group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-foreground/30 group-focus-within:text-accent transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un nom, un style..." 
              className="w-full bg-foreground/5 dark:bg-white/5 border border-foreground/10 rounded-full py-4 pl-14 pr-6 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-accent focus:bg-foreground/[0.08] transition-all text-lg font-light shadow-sm"
            />
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-12 gap-y-20">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <ArtistCardSkeleton key={i} />
            ))
          ) : (
            paginatedArtists?.map((artist, idx) => (
              <ArtistCard key={artist.id} artist={artist} index={idx} />
            ))
          )}
        </div>

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(p) => {
              setCurrentPage(p);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="mt-24"
          />
        )}

        {/* Empty State */}
        {!isLoading && artists?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 rounded-full bg-foreground/5 flex items-center justify-center mb-6">
               <svg className="w-10 h-10 text-foreground/20" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                 <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"/><path d="M8 12h8"/>
               </svg>
            </div>
            <h3 className="font-serif text-3xl font-medium mb-3">Aucun artiste trouvé</h3>
            <p className="text-foreground/40 max-w-sm">
              Nous n'avons pas trouvé de correspondant pour "{search}". Essayez avec un autre terme.
            </p>
            <button 
              onClick={() => setSearch('')}
              className="mt-8 text-xs uppercase tracking-widest font-bold border-b border-foreground/20 hover:border-accent hover:text-accent transition-all pb-1"
            >
              Réinitialiser la recherche
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
