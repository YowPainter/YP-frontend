'use client'

import { useQuery } from '@tanstack/react-query'
import { ArtworksService } from '@/lib/services/ArtworksService'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Skeleton } from '@/components/ui/Skeleton'
import { ChevronLeft, Eye, Heart, MessageSquare, Share2 } from 'lucide-react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

const isValidImageSrc = (value?: string) => {
  if (!value) return false

  try {
    const url = new URL(value)
    const allowedHosts = new Set([
      'res.cloudinary.com',
      'images.unsplash.com',
    ])

    const hasImageExtension = /\.(jpg|jpeg|png|webp|gif|avif|svg)$/i.test(url.pathname)
    return allowedHosts.has(url.hostname) || hasImageExtension
  } catch {
    return value.startsWith('/')
  }
}

export default function ArtworkDetailPage() {
  const { slug, id } = useParams() as { slug: string; id: string }
  const router = useRouter()

  const { data: artwork, isLoading, error } = useQuery({
    queryKey: ['artwork-detail', slug, id],
    queryFn: () => ArtworksService.getArtwork(slug, id),
    enabled: !!slug && !!id
  })

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 px-6 sm:px-12 max-w-[1400px] mx-auto animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
           <Skeleton className="aspect-square rounded-3xl" />
           <div className="space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-32 w-full" />
           </div>
        </div>
      </div>
    )
  }

  if (error || !artwork) {
     return (
        <div className="min-h-screen flex flex-col items-center justify-center pt-32 text-center">
          <h2 className="font-serif text-4xl mb-6">Œuvre introuvable</h2>
          <Link href={`/${slug}`} className="text-accent underline uppercase tracking-widest text-xs font-bold">Retour à la galerie</Link>
        </div>
     )
  }

  const artworkImageSrc: string =
  artwork.imageUrls?.[0] && isValidImageSrc(artwork.imageUrls[0])
    ? artwork.imageUrls[0]
    : '/images/placeholder.png'

  return (
    <main className="min-h-screen canvas-texture canvas-grain pb-24">
      <div className="pt-32 px-6 sm:px-12 max-w-[1400px] mx-auto">
        
        {/* Navigation */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-foreground/40 hover:text-accent transition-colors mb-12"
        >
          <ChevronLeft className="w-4 h-4" /> Retour
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Image Section */}
          <div className="relative aspect-square md:aspect-[4/5] bg-white p-4 shadow-2xl border border-foreground/5 transform -rotate-1 group">
             <div className="relative h-full w-full overflow-hidden">
                <Image 
                  src={artworkImageSrc}
                  alt={artwork.title || ''} 
                  fill 
                  className="object-cover"
                />
             </div>
             {/* Signature effect */}
             <div className="absolute bottom-10 right-10 font-serif italic text-foreground/20 text-xl pointer-events-none">
                {artwork.artistName}
             </div>
          </div>

          {/* Details Section */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-6">
              <span className="bg-accent/10 text-accent px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                {artwork.style}
              </span>
              <span className="text-foreground/40 text-[10px] font-bold uppercase tracking-widest">
                {artwork.technique}
              </span>
            </div>

            <h1 className="font-serif text-5xl md:text-7xl leading-tight tracking-tighter mb-8">
              {artwork.title}
            </h1>

            <div className="h-[1px] w-full bg-foreground/5 mb-8"></div>

            <div className="flex items-center justify-between mb-12">
              <div className="flex flex-col">
                 <span className="text-xs text-foreground/40 uppercase tracking-widest font-bold mb-1">Prix de l'œuvre</span>
                 <span className="text-4xl font-black tracking-tighter text-accent">
                   {formatPrice(350000)} {/* Placeholder price logic */}
                 </span>
              </div>
              <div className="flex gap-4">
                 <button className="w-14 h-14 rounded-full border border-foreground/10 flex items-center justify-center hover:bg-accent hover:border-accent hover:text-white transition-all">
                    <Heart className="w-6 h-6" />
                 </button>
                 <button className="w-14 h-14 rounded-full border border-foreground/10 flex items-center justify-center hover:bg-accent hover:border-accent hover:text-white transition-all">
                    <Share2 className="w-6 h-6" />
                 </button>
              </div>
            </div>

            <div className="prose prose-slate dark:prose-invert mb-12 font-light leading-relaxed text-foreground/70">
              <p>{artwork.description || "Aucune description fournie pour cette œuvre."}</p>
            </div>

            <div className="mb-12 rounded-2xl border border-foreground/8 bg-foreground/[0.02] p-5">
              <div className="flex items-center justify-between text-sm text-foreground/55">
                <span className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  {artwork.likeCount || 0} j&apos;aime
                </span>
                <span className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  {artwork.viewCount || 0} vues
                </span>
              </div>
              <div className="mt-4 border-t border-foreground/8 pt-4">
                <button className="flex items-center gap-2 text-sm font-medium text-foreground/65 hover:text-accent transition-colors">
                  <MessageSquare className="w-4 h-4" />
                  Commenter cette œuvre
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-12 border-y border-foreground/5 py-8">
               <div>
                  <span className="block text-[10px] text-foreground/30 uppercase tracking-widest font-bold mb-2">Dimensions</span>
                  <span className="font-mono text-sm">{artwork.dimensions || 'N/A'}</span>
               </div>
               <div>
                  <span className="block text-[10px] text-foreground/30 uppercase tracking-widest font-bold mb-2">Artiste</span>
                  <Link href={`/${slug}`} className="font-serif text-lg hover:text-accent transition-colors">{artwork.artistName}</Link>
               </div>
            </div>

            <button 
              disabled={artwork.status !== 'ON_SALE'}
              className="w-full bg-foreground text-background py-6 text-xs uppercase tracking-[0.5em] font-bold hover:bg-accent transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xl"
            >
              Initialiser l'acquisition
            </button>
          </div>

        </div>
      </div>
    </main>
  )
}
