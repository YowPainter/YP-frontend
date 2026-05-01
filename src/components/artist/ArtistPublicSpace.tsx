'use client'

import { useQuery } from '@tanstack/react-query'
import { ArtworksService } from '@/lib/services/ArtworksService'
import { ShopOrdersService } from '@/lib/services/ShopOrdersService'
import { EventsService } from '@/lib/services/EventsService'
import { ArtistPublicHero } from './ArtistPublicHero'
import FrameCard from '@/components/artdashboard/FrameCard'
import PostModal from '@/components/artdashboard/PostModal'
import ArtworkPost from '@/components/artdashboard/ArtworkPost'
import ShopArticleCard from '@/components/shop/ShopArticleCard'
import { useState } from 'react'
import { ArtistResponse } from '@/lib/models/ArtistResponse'
import { Work } from '../artdashboard/types'
import { Skeleton } from '@/components/ui/Skeleton'
import { Pagination } from '@/components/ui/Pagination'
import Image from 'next/image'
import Link from 'next/link'

interface ArtistPublicSpaceProps {
  artist: ArtistResponse
  slug: string
}

type TabType = 'gallery' | 'shop' | 'events'

const GRADIENTS = [
  'linear-gradient(135deg,#e8c4a0,#c8804a)',
  'linear-gradient(135deg,#a8c4d0,#5888a8)',
  'linear-gradient(135deg,#d4c4b8,#9a7060)',
  'linear-gradient(135deg,#c8d4a0,#7a9850)',
  'linear-gradient(135deg,#dcc8e0,#9870a8)',
]

export function ArtistPublicSpace({ artist, slug }: ArtistPublicSpaceProps) {
  const [activeTab, setActiveTab] = useState<TabType>('gallery')
  const [modal, setModal] = useState<{ dataset: Work[]; index: number } | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 8

  // Reset page when tab changes
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  // Helpers pour les événements
  const getEventTypeName = (type?: string) => {
    switch (type) {
      case 'EXHIBITION': return 'Exposition'
      case 'WORKSHOP': return 'Atelier'
      case 'AUCTION': return 'Vente aux enchères'
      case 'MEETUP': return 'Rencontre'
      default: return 'Événement'
    }
  }

  const getStatusStyles = (status?: string) => {
    switch (status) {
      case 'FULL': return 'bg-red-500/10 text-red-500'
      case 'CANCELLED': return 'bg-gray-500/10 text-gray-500'
      case 'COMPLETED': return 'bg-foreground/5 text-foreground/40'
      default: return 'bg-green-500/10 text-green-500'
    }
  }

  // 1. Fetch Artworks
  const { data: worksData, isLoading: isLoadingWorks } = useQuery({
    queryKey: ['artist-public-works', slug],
    queryFn: () => ArtworksService.getAllPublicArtworks(slug),
  })

  // 2. Fetch Shop Products
  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['artist-public-products', slug],
    queryFn: () => ShopOrdersService.getProductsByArtist(slug),
  })

  // 3. Fetch Events (Utilise le slug pour une résolution tenant robuste)
  const { data: events, isLoading: isLoadingEvents } = useQuery({
    queryKey: ['artist-public-events', slug],
    queryFn: () => EventsService.getEventsByArtistSlug(slug),
    enabled: !!slug
  })

  const WORKS: Work[] = (worksData || []).map((w, index) => ({
    id: w.id!,
    title: w.title!,
    type: w.imageUrls && w.imageUrls.length > 0 ? 'image' : 'video',
    bg: GRADIENTS[index % GRADIENTS.length],
    likes: w.likeCount || 0,
    comments: 0,
    shares: 0,
    date: new Date(w.publishedAt || w.createdAt!).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
    desc: w.description || '',
    tags: w.tags || [],
    imageUrls: w.imageUrls || [],
  }))

  const paginatedWorks = WORKS.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
  const paginatedProducts = (products || []).slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
  const paginatedEvents = (events || []).slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const totalPagesWorks = Math.ceil(WORKS.length / ITEMS_PER_PAGE)
  const totalPagesProducts = Math.ceil((products || []).length / ITEMS_PER_PAGE)
  const totalPagesEvents = Math.ceil((events || []).length / ITEMS_PER_PAGE)

  return (
    <div className="w-full">
      <ArtistPublicHero artist={artist} isLoading={false} />

      {/* Tab Navigation Navigation Premium */}
      <section className="sticky top-0 bg-background/80 backdrop-blur-xl z-20 border-y border-foreground/5 mb-12">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12 flex justify-center sm:justify-start gap-12">
          {[
            { id: 'gallery' as TabType, label: 'Galerie' },
            { id: 'shop' as TabType, label: 'Boutique' },
            { id: 'events' as TabType, label: 'Expositions' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`py-6 text-xs uppercase tracking-[0.3em] font-bold transition-all relative ${
                activeTab === tab.id ? 'text-accent' : 'text-foreground/40 hover:text-foreground/60'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-accent transition-all animate-in slide-in-from-left-2" />
              )}
            </button>
          ))}
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-6 sm:px-12 py-12 min-h-[500px]">
        {/* GALERIE SECTION */}
        {activeTab === 'gallery' && (
          <div className="reveal">
            <div className="flex items-center gap-6 mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight">Œuvres de l'artiste</h2>
              <div className="h-[1px] flex-1 bg-foreground/10"></div>
              <span className="text-xs uppercase tracking-widest font-bold text-foreground/40">{WORKS.length} items</span>
            </div>

            {isLoadingWorks ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="aspect-square wood-outer p-2.5"><Skeleton className="w-full h-full" /></div>
                ))}
              </div>
            ) : WORKS.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {paginatedWorks.map((work, i) => (
                    <ArtworkPost 
                      key={work.id} 
                      work={work}
                      inlineComments
                      artist={{
                        name: artist.artistName || `${artist.firstName} ${artist.lastName}`.trim(),
                        avatar: artist.profilePictureUrl,
                        username: artist.email?.split('@')[0],
                        slug: artist.slug
                      }}
                    />
                  ))}
                </div>
                {totalPagesWorks > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPagesWorks}
                    onPageChange={setCurrentPage}
                    className="mt-12"
                  />
                )}
              </>
            ) : (
              <EmptyState message="L'artiste n'a pas encore publié d'œuvres." />
            )}
          </div>
        )}

        {/* BOUTIQUE SECTION */}
        {activeTab === 'shop' && (
          <div className="reveal">
             <div className="flex items-center gap-6 mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight">La Boutique</h2>
              <div className="h-[1px] flex-1 bg-foreground/10"></div>
              <span className="text-xs uppercase tracking-widest font-bold text-foreground/40">{(products || []).length} articles</span>
            </div>

            {isLoadingProducts ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i}>
                    <Skeleton className="aspect-[4/5] rounded-2xl mb-4" />
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : products && products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {paginatedProducts.map((product) => {
                    // Trouver l'oeuvre associée pour l'image
                    const associatedArtwork = worksData?.find(w => w.id === product.artworkId)
                    return (
                      <ShopArticleCard 
                        key={product.id} 
                        product={product} 
                        artwork={associatedArtwork}
                        artist={{
                          name: artist.artistName || `${artist.firstName} ${artist.lastName}`.trim(),
                          avatar: artist.profilePictureUrl,
                          username: artist.slug || artist.id, // Fallback safe
                          slug: artist.slug
                        }}
                        hideArtistHeader // On cache car on est sur son profil
                      />
                    )
                  })}
                </div>
                {totalPagesProducts > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPagesProducts}
                    onPageChange={setCurrentPage}
                    className="mt-12"
                  />
                )}
              </>
            ) : (
              <EmptyState message="Aucun article en vente pour le moment." />
            )}
          </div>
        )}

        {/* ÉVÉNEMENTS SECTION */}
        {activeTab === 'events' && (
          <div className="reveal">
             <div className="flex items-center gap-6 mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight">Expositions & Vernissages</h2>
              <div className="h-[1px] flex-1 bg-foreground/10"></div>
              <span className="text-xs uppercase tracking-widest font-bold text-foreground/40">{(events || []).length} dates</span>
            </div>

            {isLoadingEvents ? (
              <div className="grid grid-cols-1 gap-10">
                {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-[350px] w-full" />)}
              </div>
            ) : events && events.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-10 md:gap-12">
                  {paginatedEvents.map((event) => (
                    <Link 
                      key={event.id}
                      href={`/${slug}/events/${event.id}`}
                      className="group relative h-[400px] md:h-[350px] overflow-hidden border border-foreground/5 shadow-2xl flex flex-col justify-end p-8 md:p-14 transition-all duration-700"
                    >
                      {/* ... (Event content) ... */}
                      <Image 
                        src={event.posterUrl || '/images/placeholder.png'} 
                        alt={event.name!} 
                        fill 
                        sizes="(max-width: 768px) 100vw, 80vw"
                        className="object-cover transition-transform duration-[3s] group-hover:scale-105" 
                      />
                      
                      <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                      
                      <div className="absolute top-0 left-0 w-[2px] h-full bg-accent scale-y-0 group-hover:scale-y-100 transition-transform duration-700 origin-top" />

                      <div className="relative z-10 space-y-6 md:space-y-8 max-w-3xl">
                        <div className="flex flex-wrap items-center gap-4">
                          <span className="bg-accent text-white px-5 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] shadow-xl">
                            {new Date(event.startDateTime!).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                          </span>
                          <span className="bg-white/10 backdrop-blur-xl text-white border border-white/20 px-5 py-1.5 text-[10px] font-bold uppercase tracking-[0.3em]">
                            {getEventTypeName(event.type)}
                          </span>
                          <span className="bg-white/5 backdrop-blur-xl text-white/80 border border-white/10 px-5 py-1.5 text-[10px] font-bold uppercase tracking-[0.3em]">
                            {event.ticketPrice === 0 ? 'Entrée Libre' : `${event.ticketPrice?.toLocaleString()} FCFA`}
                          </span>
                        </div>

                        <div className="space-y-4">
                          <h3 className="font-serif text-4xl md:text-6xl text-white font-light uppercase tracking-tighter group-hover:text-accent transition-colors duration-700 leading-[0.9]">
                            {event.name}
                          </h3>
                          <p className="text-white/50 font-light text-sm md:text-base line-clamp-2 max-w-2xl italic group-hover:text-white/80 transition-colors">
                            {event.description}
                          </p>
                        </div>

                        <div className="pt-6 flex flex-wrap items-center gap-10">
                           <div className="flex items-center gap-3">
                              <span className="text-[11px] text-accent font-black uppercase tracking-[0.5em] group-hover:translate-x-4 transition-all duration-500">
                                Réserver mon pass →
                              </span>
                           </div>
                           <div className="h-[1px] w-12 bg-white/20 group-hover:w-20 transition-all duration-700" />
                           <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">{event.location}</span>
                        </div>
                      </div>

                      <div className="absolute top-10 right-10 w-8 h-8 border-t border-r border-white/10 group-hover:border-accent transition-colors duration-700" />
                    </Link>
                  ))}
                </div>
                {totalPagesEvents > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPagesEvents}
                    onPageChange={setCurrentPage}
                    className="mt-12"
                  />
                )}
              </>
            ) : (
              <EmptyState message="L'artiste n'a aucun événement prévu prochainement." />
            )}
          </div>
        )}
      </div>


    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-24 text-foreground/40 font-light italic border border-dashed border-foreground/10 rounded-3xl">
      {message}
    </div>
  )
}
