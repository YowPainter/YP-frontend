'use client'

import { useQuery } from '@tanstack/react-query'
import { ArtistsService } from '@/lib/services/ArtistsService'
import { ArtistPublicSpace } from '@/components/artist/ArtistPublicSpace'
import { useParams } from 'next/navigation'
import { Skeleton } from '@/components/ui/Skeleton'
import Link from 'next/link'
import { useEffect } from 'react'

export default function ArtistSlugPage() {
  const { slug } = useParams() as { slug: string }

  // Définir le contexte tenant pour les requêtes API dans cet espace
  useEffect(() => {
    if (slug) {
      localStorage.setItem('currentTenantSlug', slug)
    }
    // Nettoyage optionnel au démontage
    return () => {
      // On ne nettoie que si le slug correspond pour éviter d'effacer 
      // un nouveau slug si on navigue vite entre deux artistes
      if (localStorage.getItem('currentTenantSlug') === slug) {
        localStorage.removeItem('currentTenantSlug')
      }
    }
  }, [slug])

  const { data: artist, isLoading, error } = useQuery({
    queryKey: ['artist-profile', slug],
    queryFn: () => ArtistsService.getArtistBySlug(slug),
    enabled: !!slug,
    retry: 1, // Limiter les retries pour les 404
  })

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 px-12">
        <div className="max-w-[1400px] mx-auto flex gap-12 items-center">
          <Skeleton className="w-[280px] h-[350px] rounded-3xl" />
          <div className="flex-1">
             <Skeleton className="h-16 w-3/4 mb-6" />
             <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !artist) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-32 px-6 text-center">
        <h2 className="font-serif text-5xl mb-6">Profil Introuvable</h2>
        <p className="text-foreground/50 max-w-md mb-10">
          Nous n'avons pas trouvé l'artiste correspondant au lien "{slug}". Il se peut que le lien ait expiré ou que l'artiste ait changé de nom.
        </p>
        <Link href="/artists" className="px-10 py-4 bg-foreground text-background text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-white transition-all rounded-full">
           Parcourir les artistes
        </Link>
      </div>
    )
  }

  return (
    <main className="min-h-screen canvas-texture canvas-grain overflow-x-hidden">
      <ArtistPublicSpace artist={artist} slug={slug} />
    </main>
  )
}
