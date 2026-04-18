'use client'

import { useQuery } from '@tanstack/react-query'
import { ArtistsService } from '@/lib/services/ArtistsService'
import { ArtistPublicSpace } from '@/components/artist/ArtistPublicSpace'
import { Skeleton } from '@/components/ui/Skeleton'
import Link from 'next/link'
import { ArtistResponse } from '@/lib/models/ArtistResponse'

interface ArtistSpaceContentProps {
  slug: string
  initialArtist?: ArtistResponse | null
}

function ArtistPageSkeleton() {
  return (
    <div className="min-h-screen canvas-texture canvas-grain overflow-x-hidden">
      <section className="relative w-full pt-32 pb-16 px-6 sm:px-12 max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row items-center lg:items-end gap-12 lg:gap-20">
          <div className="relative shrink-0">
            <div className="w-[200px] h-[250px] md:w-[280px] md:h-[350px] rounded-[30%_70%_70%_30%/30%_30%_70%_70%] shimmer" />
            <div className="absolute -bottom-4 -right-4 bg-foreground/5 shimmer px-8 py-2 rounded-full w-36 h-8" />
          </div>
          <div className="flex-1 text-center lg:text-left">
            <div className="mb-6">
              <Skeleton className="h-16 md:h-24 w-3/4 mb-4" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="h-[1px] w-20 bg-accent/20 mb-8 mx-auto lg:mx-0" />
            <div className="flex flex-col gap-3 max-w-xl">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </section>
      <section className="sticky top-0 bg-background/80 backdrop-blur-xl z-20 border-y border-foreground/5 mb-12">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12 flex justify-center sm:justify-start gap-12 py-6">
          {['Galerie', 'Boutique', 'Expositions'].map((t) => (
            <Skeleton key={t} className="h-4 w-20" />
          ))}
        </div>
      </section>
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12 py-12">
        <div className="flex items-center gap-6 mb-12">
          <Skeleton className="h-8 w-48" />
          <div className="h-[1px] flex-1 bg-foreground/5" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] shimmer rounded-sm" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ArtistSpaceContent({ slug, initialArtist }: ArtistSpaceContentProps) {
  const { data: artist, isLoading, error } = useQuery({
    queryKey: ['artist-profile', slug],
    queryFn: () => ArtistsService.getArtistBySlug(slug),
    enabled: !!slug,
    retry: 1,
    initialData: initialArtist ?? undefined,
  })

  if (isLoading && !initialArtist) {
    return <ArtistPageSkeleton />
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
