'use client'

import { useQuery } from '@tanstack/react-query'
import { EventsService } from '@/lib/services/EventsService'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Skeleton } from '@/components/ui/Skeleton'
import { Calendar, ChevronLeft, MapPin, Ticket, User, Users } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function EventDetailPage() {
  const { slug, id } = useParams() as { slug: string; id: string }
  const router = useRouter()
  const [isReserving, setIsReserving] = useState(false)

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event-detail', id],
    queryFn: () => EventsService.getEvent(id),
    enabled: !!id
  })

  const handleReserve = async () => {
    setIsReserving(true)
    try {
      // Logic for reservation
      await EventsService.reserveEvent(id)
      alert("Réservation réussie ! Un email de confirmation vous a été envoyé.")
    } catch (err) {
      alert("Une erreur est survenue lors de la réservation.")
    } finally {
      setIsReserving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 px-6 sm:px-12 max-w-[1400px] mx-auto animate-pulse">
        <Skeleton className="w-full aspect-video rounded-3xl mb-12" />
        <div className="space-y-6">
           <Skeleton className="h-16 w-3/4" />
           <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    )
  }

  if (error || !event) {
     return (
        <div className="min-h-screen flex flex-col items-center justify-center pt-32 text-center">
          <h2 className="font-serif text-4xl mb-6">Événement introuvable</h2>
          <Link href={`/${slug}`} className="text-accent underline uppercase tracking-widest text-xs font-bold">Retour à l'espace artiste</Link>
        </div>
     )
  }

  const startDate = new Date(event.startDateTime!)
  const isExpired = startDate < new Date()

  return (
    <main className="min-h-screen canvas-texture canvas-grain pb-24">
      
      {/* Cover Image Section */}
      <div className="relative w-full h-[60vh] overflow-hidden">
        <Image 
          src={event.posterUrl || '/images/placeholder.png'} 
          alt={event.name || ''} 
          fill 
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent"></div>
        
        <div className="absolute bottom-12 left-6 sm:left-12 max-w-[1400px] mx-auto w-full px-6">
           <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-white/60 hover:text-white transition-colors mb-8"
            >
              <ChevronLeft className="w-4 h-4" /> Retour
            </button>
            <div className="flex items-center gap-4 mb-6">
                <span className="bg-accent text-white px-4 py-1 text-[10px] font-bold uppercase tracking-widest">
                  {event.ticketPrice && event.ticketPrice > 0 ? 'Payant' : 'Gratuit'}
               </span>
            </div>
            <h1 className="font-serif text-5xl md:text-8xl text-foreground font-light tracking-tighter leading-none mb-4 drop-shadow-sm">
               {event.name}
            </h1>
        </div>
      </div>

      <div className="pt-20 px-6 sm:px-12 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
           <section>
              <h2 className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent mb-6 flex items-center gap-4">
                 <span className="w-8 h-[1px] bg-accent"></span> À propos de l'événement
              </h2>
              <div className="prose prose-xl prose-slate dark:prose-invert font-light leading-relaxed text-foreground/80">
                 <p className="whitespace-pre-wrap">{event.description}</p>
              </div>
           </section>

           <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex gap-6 items-start bg-foreground/5 p-8 rounded-3xl border border-foreground/5">
                 <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <Calendar className="w-6 h-6 text-accent" />
                 </div>
                 <div>
                    <span className="block text-[10px] uppercase tracking-widest font-bold text-foreground/40 mb-2">Date & Heure</span>
                    <span className="text-xl font-medium tracking-tight">
                       {startDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    <span className="block text-sm text-foreground/60 mt-1">
                       À {startDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                 </div>
              </div>

              <div className="flex gap-6 items-start bg-foreground/5 p-8 rounded-3xl border border-foreground/5">
                 <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-accent" />
                 </div>
                 <div>
                    <span className="block text-[10px] uppercase tracking-widest font-bold text-foreground/40 mb-2">Lieu</span>
                    <span className="text-xl font-medium tracking-tight">{event.location}</span>
                    <span className="block text-sm text-foreground/60 mt-1">Cameroun</span>
                 </div>
              </div>
           </section>
        </div>

        {/* Sidebar / Ticket */}
        <div className="lg:col-span-1">
           <div className="sticky top-32 bg-foreground text-background p-10 rounded-[2.5rem] shadow-2xl overflow-hidden relative">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="relative z-10 space-y-8">
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase tracking-[0.3em] font-normal text-white/40">Billet d'entrée</span>
                    <Ticket className="w-6 h-6 text-accent" />
                 </div>

                 <div className="space-y-4">
                    <div className="flex justify-between items-baseline">
                       <span className="font-serif text-3xl">Billet</span>
                       <span className="text-4xl font-black text-accent">
                          {event.ticketPrice || '0'} <span className="text-xs">FCFA</span>
                       </span>
                    </div>
                    <div className="flex items-center gap-2 text-white/60">
                       <Users className="w-4 h-4" />
                       <span className="text-[10px] uppercase tracking-widest">Places limitées : {event.maxCapacity || 'Illimité'}</span>
                    </div>
                 </div>

                 <div className="h-[1px] w-full border-t border-dashed border-white/20"></div>

                 <div className="space-y-4">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20">
                         <Image src={'/images/placeholder.png'} alt="Host" fill className="object-cover" />
                      </div>
                      <div>
                         <span className="block text-[10px] text-white/40 uppercase tracking-widest font-bold">L'Événement</span>
                         <span className="font-serif text-lg italic capitalize">
                           {slug.length > 20 ? "Espace Artiste" : slug}
                         </span>
                      </div>
                   </div>
                 </div>

                 <button 
                   onClick={handleReserve}
                   disabled={isReserving || isExpired}
                   className="w-full bg-accent text-white py-5 text-xs uppercase tracking-[0.4em] font-bold hover:bg-white hover:text-black transition-all flex items-center justify-center gap-4"
                 >
                   {isReserving ? 'Réservation...' : isExpired ? 'Événement Passé' : 'Réserver ma place'}
                 </button>

                 <p className="text-[9px] text-white/40 text-center uppercase tracking-widest">
                    Paiement sécurisé via MOMO / ORANGE MONEY
                 </p>
              </div>
           </div>
        </div>

      </div>
    </main>
  )
}
