'use client'

import { SafeImage } from '@/components/ui/SafeImage'
import Link from 'next/link'
import { ProductResponse } from '@/lib/models/ProductResponse'
import { ArtworkResponse } from '@/lib/models/ArtworkResponse'
import { formatPrice } from '@/lib/utils'
import { ShoppingCart } from 'lucide-react'

interface ShopArticleCardProps {
  product: ProductResponse
  artist?: {
    name: string
    avatar?: string
    username?: string
    slug?: string
  }
  artwork?: ArtworkResponse
  hideArtistHeader?: boolean
}

export default function ShopArticleCard({ product, artist, artwork, hideArtistHeader }: ShopArticleCardProps) {
  const imageUrl = artwork?.imageUrls?.[0] || '/images/placeholder.png'
  const artistSlug = artist?.slug || artist?.username || product.artistId || 'artist'

  return (
    <article className="bg-background border border-foreground/8 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group flex flex-col h-full">
      
      {/* ── Header: Profil (Optionnel) ── */}
      {!hideArtistHeader && artist && (
        <Link href={`/${artistSlug}`} className="px-5 pt-5 pb-4 flex items-center gap-3 shrink-0 group/header">
          <div className="w-10 h-10 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center font-serif text-base font-semibold text-accent overflow-hidden shrink-0 group-hover/header:border-accent transition-colors">
            {artist.avatar ? (
              <SafeImage src={artist.avatar} alt={artist.name} width={40} height={40} sizes="40px" className="object-cover w-full h-full" />
            ) : (
              <span className="text-sm">{artist.name.charAt(0)}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-serif text-sm font-semibold leading-tight text-foreground truncate group-hover/header:text-accent transition-colors">{artist.name}</div>
            <div className="text-[10px] text-foreground/40 mt-0.5 uppercase tracking-widest font-bold truncate">
              {artist.username ? `@${artist.username}` : 'Artiste Yow'}
            </div>
          </div>
        </Link>
      )}

      {/* ── Body: Image ── */}
      <div className={`px-5 pb-5 ${hideArtistHeader ? 'pt-5' : ''}`}>
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-foreground/[0.02] border border-foreground/5 group-hover:border-accent/20 transition-colors">
            <SafeImage
              src={imageUrl}
              alt={product.name || 'Article'}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-[2s] group-hover:scale-110"
            />
        </div>
      </div>

      {/* ── Footer: Infos ── */}
      <div className="px-5 pb-6 flex flex-col flex-1">
        <div className="mb-6">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h3 className="font-serif text-lg font-semibold leading-tight text-foreground group-hover:text-accent transition-colors">
              {product.name}
            </h3>
            <button 
              className="p-2 rounded-full bg-foreground/5 text-foreground hover:bg-accent hover:text-white transition-all shadow-sm"
              title="Ajouter au panier"
            >
              <ShoppingCart size={16} />
            </button>
          </div>
          <p className="text-[11px] text-foreground/40 font-bold uppercase tracking-widest leading-relaxed">
            {product.description || "Édition limitée & certifiée"}
          </p>
        </div>

        <div className="mt-auto pt-4 border-t border-foreground/5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-[0.2em] text-foreground/30 font-black mb-0.5">Prix d&apos;acquisition</span>
            <span className="font-display text-xl font-black text-accent tracking-tight">
              {formatPrice(product.price || 0)}
            </span>
          </div>
          
          <Link 
            href={`/${artistSlug}/gallery/${artwork?.id || product.artworkId}`}
            className="text-[10px] uppercase tracking-widest font-black text-foreground hover:text-accent transition-colors border-b border-foreground/10 hover:border-accent pb-1"
          >
            Voir les détails →
          </Link>
        </div>
      </div>
    </article>
  )
}
