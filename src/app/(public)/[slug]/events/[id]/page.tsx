'use client'

import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/Skeleton'
import { Calendar, ChevronLeft, MapPin, Users, Share2, Clock } from 'lucide-react'
import { getEventById } from '@/lib/api/events'
import { TicketReservation } from '@/components/events/TicketReservation'

export default function EventDetailPage() {
  const { slug, id } = useParams() as { slug: string; id: string }
  const router = useRouter()

  // Définir le contexte tenant dans localStorage pour les appels API (multitenant)
  useEffect(() => {
    if (slug) {
      localStorage.setItem('currentTenantSlug', slug)
    }
    return () => {
      localStorage.removeItem('currentTenantSlug')
    }
  }, [slug])

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event-detail', slug, id],
    queryFn: () => getEventById(id),
    enabled: !!id && !!slug,
  })

  const formatDateRange = () => {
    if (!event) return ''
    const start = new Date(event.startDate)
    const end = new Date(event.endDate)

    if (start.toDateString() === end.toDateString()) {
      return `${start.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })} • ${start.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      })}`
    }

    return `Du ${start.toLocaleDateString('fr-FR')} au ${end.toLocaleDateString('fr-FR')}`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 px-6 sm:px-12 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-8">
            <Skeleton className="w-full aspect-[16/10]" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div className="lg:col-span-5">
            <Skeleton className="h-[500px] w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-32 text-center">
        <h2 className="font-serif text-4xl mb-6">Événement introuvable</h2>
        <p className="text-foreground/50 max-w-md mb-10">
          Nous n&apos;avons pas trouvé l&apos;événement demandé dans l&apos;espace de cet artiste.
        </p>
        <Link
          href={`/${slug}`}
          className="text-accent underline uppercase tracking-widest text-xs font-bold"
        >
          Retour à l&apos;espace artiste
        </Link>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen canvas-texture canvas-grain selection:bg-accent selection:text-white pb-32">

      {/* BACKGROUND ARTISTIC ELEMENTS */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <svg className="absolute top-[20%] left-[-5%] w-[30vw] h-[30vw] text-accent/5 dark:text-accent/10 opacity-40 animate-pulse" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M44.7,-76.4C58.3,-69.2,70,-57.9,78.7,-44.5C87.4,-31.1,93.1,-15.5,91.3,-0.9C89.5,13.6,80.3,27.2,71.2,40.1C62.1,53,53.2,65.3,41.4,73.1C29.6,80.9,14.8,84.1,-0.7,85.2C-16.1,86.4,-32.3,85.5,-46.1,78.9C-59.9,72.3,-71.4,60,-79,45.8C-86.6,31.7,-90.4,15.8,-89.4,0.6C-88.3,-14.7,-82.5,-29.3,-74.1,-42.2C-65.7,-55.1,-54.7,-66.2,-41.7,-73.7C-28.7,-81.3,-14.4,-85.2,0.4,-85.9C15.2,-86.6,31.1,-83.7,44.7,-76.4Z" transform="translate(100 100)" />
        </svg>
        <svg className="absolute bottom-[10%] right-[5%] w-[25vw] h-[25vw] text-amber-500/5 dark:text-amber-500/10 opacity-30" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M38.1,-65.4C49.9,-58.4,60.5,-48.5,68.1,-36.4C75.7,-24.3,80.3,-10.1,79.1,3.4C77.9,16.9,70.9,29.8,61.8,40.4C52.7,51.1,41.5,59.5,29.4,64.8C17.3,70.1,4.3,72.3,-8.9,70.8C-22.1,69.3,-35.6,64.2,-47.1,56.1C-58.6,48,-68.1,36.9,-73.6,24C-79.1,11.2,-80.6,-3.4,-77.2,-17.1C-73.8,-30.8,-65.5,-43.6,-54.3,-51.1C-43.1,-58.6,-29,-60.8,-15.8,-64.5C-2.6,-68.2,10.3,-73.4,23.3,-72.1C36.3,-70.8,49.4,-63,38.1,-65.4Z" transform="translate(100 100)" />
        </svg>
      </div>

      {/* NAVIGATION */}
      <nav className="sticky top-0 z-50 px-6 py-6 md:px-12 pointer-events-none">
        <button
          onClick={() => router.back()}
          className="pointer-events-auto inline-flex items-center gap-4 px-8 py-4 bg-white/20 dark:bg-white/5 backdrop-blur-xl border border-white/30 dark:border-white/10 text-foreground group hover:bg-accent hover:text-white transition-all duration-500 shadow-2xl relative"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[11px] font-bold tracking-[0.4em] uppercase">RETOUR</span>
          {/* Decorative corner */}
          <div className="absolute -top-[1px] -left-[1px] w-2 h-2 border-t border-l border-accent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute -bottom-[1px] -right-[1px] w-2 h-2 border-b border-r border-accent opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </nav>

      <main className="relative z-10 max-w-[1500px] mx-auto px-6 md:px-12 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

          {/* LEFT COLUMN: VISUALS & CONTENT */}
          <div className="lg:col-span-7 space-y-12">
            {/* Hero Image / Poster */}
            <div className="relative aspect-[3/4] md:aspect-[16/10] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] group border border-foreground/5">
              <Image
                src={event.posterUrl}
                alt={event.title}
                fill
                sizes="(max-width: 768px) 100vw, 70vw"
                className="object-cover group-hover:scale-105 transition-transform duration-[3s] ease-out"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />

              <div className="absolute bottom-10 left-10 right-10 text-white">
                <span className="inline-block px-5 py-2 bg-accent text-[11px] uppercase tracking-[0.3em] font-bold mb-6 border border-accent/20 shadow-xl">
                  {event.eventType === 'FREE' ? 'OFFERT' : `${event.price?.toLocaleString()} CFA`}
                </span>
                <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-light leading-[1.1] uppercase tracking-tighter">
                  {event.title}
                </h1>
              </div>
            </div>

            {/* Description Card */}
            <div className="space-y-10 bg-white/40 dark:bg-black/40 backdrop-blur-sm p-10 md:p-16 border border-white/50 dark:border-white/10 shadow-sm relative overflow-hidden">
              {/* Artistic Pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] pointer-events-none">
                <div className="absolute inset-0 rotate-45 translate-x-16 -translate-y-16 border-[40px] border-accent" />
              </div>

              <div className="flex items-center gap-4 text-accent">
                <span className="w-16 h-[1px] bg-accent"></span>
                <span className="text-[10px] font-bold uppercase tracking-[0.5em]">Manifeste de l&apos;Événement</span>
              </div>
              
              <div className="space-y-6">
                <h2 className="font-serif text-3xl md:text-4xl italic font-light text-foreground/90">L&apos;artiste vous propose...</h2>
                <div className="relative">
                  <p className="text-xl md:text-3xl text-foreground font-light leading-[1.6] italic border-l-2 border-accent pl-10 py-4">
                    &ldquo;{event.description}&rdquo;
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-12 border-t border-foreground/5 font-mono">
                <div className="space-y-2">
                  <p className="text-[9px] uppercase tracking-[0.3em] text-foreground/30">Artiste</p>
                  <p className="font-bold text-sm tracking-widest text-foreground uppercase">{event.artistName}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[9px] uppercase tracking-[0.3em] text-foreground/30">Type</p>
                  <p className="font-bold text-sm tracking-widest text-accent uppercase">{event.eventType === 'FREE' ? 'Ouvert' : 'Réservé'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[9px] uppercase tracking-[0.3em] text-foreground/30">Capacité</p>
                  <p className="font-bold text-sm tracking-widest text-foreground uppercase">{event.maxAttendees || 'Illimitée'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[9px] uppercase tracking-[0.3em] text-foreground/30">Statut</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 animate-pulse" />
                    <p className="font-bold text-sm tracking-widest text-green-600 uppercase">Confirmé</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: INFOS & TICKET */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 space-y-12">

              {/* Practical Infos Card */}
              <div className="bg-white/95 dark:bg-zinc-950/60 backdrop-blur-md p-10 md:p-14 border border-white dark:border-white/10 shadow-2xl relative">
                {/* Decorative Diamond */}
                <div className="absolute -top-3 -right-3 w-6 h-6 border border-accent rotate-45 flex items-center justify-center bg-background z-10">
                   <div className="w-2 h-2 bg-accent" />
                </div>

                <div className="space-y-12">
                  <div className="flex items-center justify-between border-b border-foreground/5 pb-8">
                    <h3 className="font-serif text-3xl font-light uppercase tracking-tighter">Informations</h3>
                    <button className="p-3 bg-foreground/5 hover:bg-accent hover:text-white transition-all duration-300">
                      <Share2 className="w-5 h-5 opacity-60" />
                    </button>
                  </div>

                  <div className="space-y-10">
                    <div className="flex gap-8 items-start">
                      <div className="w-16 h-16 border border-accent/20 bg-accent/5 flex items-center justify-center flex-shrink-0 relative group">
                        <Calendar className="w-7 h-7 text-accent" />
                        <div className="absolute inset-0 bg-accent/5 scale-0 group-hover:scale-100 transition-transform duration-500" />
                      </div>
                      <div className="pt-1">
                        <p className="text-[9px] uppercase tracking-[0.4em] text-foreground/30 mb-2">Calendrier</p>
                        <p className="text-xl font-bold tracking-tight">{formatDateRange()}</p>
                      </div>
                    </div>

                    <div className="flex gap-8 items-start">
                      <div className="w-16 h-16 border border-amber-500/20 bg-amber-500/5 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-7 h-7 text-amber-600" />
                      </div>
                      <div className="pt-1">
                        <p className="text-[9px] uppercase tracking-[0.4em] text-foreground/30 mb-2">Emplacement</p>
                        <p className="text-xl font-bold tracking-tight">{event.location}</p>
                        <p className="text-xs text-foreground/40 font-mono mt-2 uppercase tracking-widest border-l border-amber-500/30 pl-3">
                          {event.locationType === 'VIRTUAL' ? 'Salon Virtuel YP' : 'Galerie Physique'}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-8 items-start">
                      <div className="w-16 h-16 border border-foreground/10 bg-foreground/5 flex items-center justify-center flex-shrink-0">
                        <Users className="w-7 h-7 text-foreground/40" />
                      </div>
                      <div className="pt-1">
                        <p className="text-[9px] uppercase tracking-[0.4em] text-foreground/30 mb-2">Audience</p>
                        <p className="text-xl font-bold tracking-tight uppercase">{event.currentAttendees} INSCRIT{event.currentAttendees && event.currentAttendees > 1 ? 'S' : ''}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <TicketReservation event={event} artistSlug={slug} />
                  </div>
                </div>
              </div>

              {/* Art Quote */}
              <div className="text-center p-12 border border-foreground/5 bg-foreground/[0.02]">
                <p className="font-serif italic text-foreground/30 text-sm leading-relaxed max-w-xs mx-auto">
                  &ldquo;L&apos;art ne reproduit pas le visible, il rend visible.&rdquo;
                </p>
                <div className="mt-4 w-8 h-[1px] bg-accent/20 mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
