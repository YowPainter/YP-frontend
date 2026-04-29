'use client'

import { useQuery } from '@tanstack/react-query'
import { ArtworksService } from '@/lib/services/ArtworksService'
import { ShopOrdersService } from '@/lib/services/ShopOrdersService'
import { EventsService } from '@/lib/services/EventsService'
import { ArtistPublicHero } from './ArtistPublicHero'
import FrameCard from '@/components/artdashboard/FrameCard'
import PostModal from '@/components/artdashboard/PostModal'
import { useState } from 'react'
import { ArtistResponse } from '@/lib/models/ArtistResponse'
import { Work } from '../artdashboard/types'
import { Skeleton } from '@/components/ui/Skeleton'
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
  }))

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
              onClick={() => setActiveTab(tab.id)}
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
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="aspect-square wood-outer p-2.5 opacity-40"><Skeleton className="w-full h-full" /></div>
                ))}
              </div>
            ) : WORKS.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
                {WORKS.map((work, i) => (
                  <FrameCard key={work.id} work={work} onClick={() => setModal({ dataset: WORKS, index: i })} />
                ))}
              </div>
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
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-80 w-full rounded-2xl" />)}
              </div>
            ) : products && products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                  <div key={product.id} className="group cursor-pointer">
                    <div className="aspect-[3/4] bg-foreground/5 rounded-2xl overflow-hidden relative mb-4">
                      {/* ProductResponse ne contient pas directement d'image URL dans cette version du DTO */}
                      <div className="absolute inset-0 flex items-center justify-center bg-accent/5 text-accent/20 font-serif text-5xl">YP</div>
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-black">
                        {product.price} FCFA
                      </div>
                    </div>
                    <h3 className="font-serif text-xl mb-1">{product.name}</h3>
                    <p className="text-xs text-foreground/40 uppercase tracking-widest font-bold">Produit de l'artiste</p>
                  </div>
                ))}
              </div>
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
              <div className="grid grid-cols-1 gap-10 md:gap-12">
                {events.map((event) => (
                  <Link 
                    key={event.id}
                    href={`/${slug}/events/${event.id}`}
                    className="group relative h-[400px] md:h-[350px] overflow-hidden border border-foreground/5 shadow-2xl flex flex-col justify-end p-8 md:p-14 transition-all duration-700"
                  >
                    {/* Background Image - Full Bleed landscape */}
                    <Image 
                      src={event.posterUrl || '/images/placeholder.png'} 
                      alt={event.name!} 
                      fill 
                      className="object-cover transition-transform duration-[3s] group-hover:scale-105" 
                    />
                    
                    {/* Decorative Overlay Gradient - Adjusted for horizontal */}
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                    
                    {/* Artistic Line Accent */}
                    <div className="absolute top-0 left-0 w-[2px] h-full bg-accent scale-y-0 group-hover:scale-y-100 transition-transform duration-700 origin-top" />

                    {/* Content Overlay */}
                    <div className="relative z-10 space-y-6 md:space-y-8 max-w-3xl">
                      <div className="flex flex-wrap items-center gap-4">
                        <span className="bg-accent text-white px-5 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] shadow-xl">
                          {new Date(event.startDateTime!).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                        </span>
                        
                        {/* Glass Badge Type */}
                        <span className="bg-white/10 backdrop-blur-xl text-white border border-white/20 px-5 py-1.5 text-[10px] font-bold uppercase tracking-[0.3em]">
                          {getEventTypeName(event.type)}
                        </span>

                        {/* Price Badge */}
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

                    {/* Corner Accent Detail */}
                    <div className="absolute top-10 right-10 w-8 h-8 border-t border-r border-white/10 group-hover:border-accent transition-colors duration-700" />
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState message="L'artiste n'a aucun événement prévu prochainement." />
            )}
          </div>
        )}
      </div>

      {modal && <PostModal dataset={modal.dataset} initialIndex={modal.index} onClose={() => setModal(null)} />}
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
