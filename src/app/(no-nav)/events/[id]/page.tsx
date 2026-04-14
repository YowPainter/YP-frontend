// app/(no-nav)/events/[id]/page.tsx
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, Users, User, ArrowLeft, Clock, Share2 } from 'lucide-react';
import { getEventById } from '@/lib/api/events';
import { TicketReservation } from '@/components/events/TicketReservation';
import { MyTickets } from '@/components/events/MyTickets';
import { AnimatedBlob } from '@/components/ui/AnimatedBlob';
import type { Metadata } from 'next';

interface EventPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
    const { id } = await params;
    const event = await getEventById(id).catch(() => null);

    if (!event) {
        return { title: 'Événement non trouvé' };
    }

    return {
        title: `${event.title} | YowPainter`,
        description: event.description.slice(0, 160),
    };
}

export default async function EventDetailPage({ params }: EventPageProps) {
    const { id } = await params;
    const event = await getEventById(id).catch(() => null);

    if (!event) {
        notFound();
    }

    const formatDateRange = () => {
        const start = new Date(event.startDate);
        const end = new Date(event.endDate);

        if (start.toDateString() === end.toDateString()) {
            return `${start.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            })} • ${start.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
            })}`;
        }

        return `Du ${start.toLocaleDateString('fr-FR')} au ${end.toLocaleDateString('fr-FR')}`;
    };

    return (
        <div className="relative min-h-screen canvas-texture canvas-grain selection:bg-accent selection:text-white pb-32">
            
            {/* BACKGROUND ARTISTIC ELEMENTS */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <AnimatedBlob className="top-[-10%] right-[-10%] w-[60vw] h-[60vw]" opacity={0.05} />
                <AnimatedBlob className="bottom-[-10%] left-[-10%] w-[50vw] h-[50vw]" color="amber" delay opacity={0.03} />
                
                {/* Splashes */}
                <svg className="absolute top-[20%] left-[-5%] w-[30vw] h-[30vw] text-accent/5 dark:text-accent/10 opacity-40 animate-pulse" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path fill="currentColor" d="M44.7,-76.4C58.3,-69.2,70,-57.9,78.7,-44.5C87.4,-31.1,93.1,-15.5,91.3,-0.9C89.5,13.6,80.3,27.2,71.2,40.1C62.1,53,53.2,65.3,41.4,73.1C29.6,80.9,14.8,84.1,-0.7,85.2C-16.1,86.4,-32.3,85.5,-46.1,78.9C-59.9,72.3,-71.4,60,-79,45.8C-86.6,31.7,-90.4,15.8,-89.4,0.6C-88.3,-14.7,-82.5,-29.3,-74.1,-42.2C-65.7,-55.1,-54.7,-66.2,-41.7,-73.7C-28.7,-81.3,-14.4,-85.2,0.4,-85.9C15.2,-86.6,31.1,-83.7,44.7,-76.4Z" transform="translate(100 100)" />
                </svg>
                <svg className="absolute bottom-[10%] right-[5%] w-[25vw] h-[25vw] text-amber-500/5 dark:text-amber-500/10 opacity-30" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path fill="currentColor" d="M38.1,-65.4C49.9,-58.4,60.5,-48.5,68.1,-36.4C75.7,-24.3,80.3,-10.1,79.1,3.4C77.9,16.9,70.9,29.8,61.8,40.4C52.7,51.1,41.5,59.5,29.4,64.8C17.3,70.1,4.3,72.3,-8.9,70.8C-22.1,69.3,-35.6,64.2,-47.1,56.1C-58.6,48,-68.1,36.9,-73.6,24C-79.1,11.2,-80.6,-3.4,-77.2,-17.1C-73.8,-30.8,-65.5,-43.6,-54.3,-51.1C-43.1,-58.6,-29,-60.8,-15.8,-64.5C-2.6,-68.2,10.3,-73.4,23.3,-72.1C36.3,-70.8,49.4,-63,38.1,-65.4Z" transform="translate(100 100)" />
                </svg>
            </div>

            {/* CUSTOM NAVIGATION (Back Button) */}
            <nav className="sticky top-0 z-50 px-6 py-6 md:px-12 pointer-events-none">
                <Link 
                    href="/events" 
                    className="pointer-events-auto inline-flex items-center gap-3 px-6 py-3 bg-white/20 dark:bg-white/5 backdrop-blur-xl border border-white/30 dark:border-white/10 text-foreground group hover:bg-accent hover:text-white transition-all duration-500 rounded-full shadow-2xl"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-bold tracking-[0.2em] uppercase">Galerie</span>
                </Link>
            </nav>

            <main className="relative z-10 max-w-[1500px] mx-auto px-6 md:px-12 pt-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                    
                    {/* LEFT COLUMN: VISUALS & CONTENT */}
                    <div className="lg:col-span-7 space-y-12">
                        {/* Hero Image / Poster */}
                        <div className="relative aspect-[3/4] md:aspect-[16/10] overflow-hidden rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] group">
                            <Image
                                src={event.posterUrl}
                                alt={event.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-[3s] ease-out"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                            
                            <div className="absolute bottom-8 left-8 right-8 text-white">
                                <span className="inline-block px-4 py-1.5 bg-accent/90 backdrop-blur-md text-[10px] uppercase tracking-[0.3em] font-bold mb-4">
                                    {event.eventType === 'FREE' ? 'OFFERT' : `${event.price?.toLocaleString()} CFA`}
                                </span>
                                <h1 className="font-serif text-4xl md:text-6xl font-light leading-tight uppercase tracking-tighter">
                                    {event.title}
                                </h1>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-8 bg-white/40 dark:bg-white/5 backdrop-blur-sm p-8 md:p-12 rounded-[2rem] border border-white/50 dark:border-white/10 shadow-sm">
                            <div className="flex items-center gap-4 text-accent">
                                <span className="w-12 h-[1px] bg-accent"></span>
                                <span className="text-xs font-bold uppercase tracking-[0.4em]">Manifeste de l'Événement</span>
                            </div>
                            <h2 className="font-serif text-3xl italic font-light text-foreground/90">L'artiste vous propose...</h2>
                            <p className="text-xl md:text-2xl text-foreground font-light leading-[1.6] italic border-l-4 border-accent pl-8 py-2">
                                &ldquo;{event.description}&rdquo;
                            </p>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-foreground/5">
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase tracking-widest text-foreground/40">Artiste</p>
                                    <p className="font-bold text-sm tracking-wide">{event.artistName}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase tracking-widest text-foreground/40">Type</p>
                                    <p className="font-bold text-sm tracking-wide">{event.eventType === 'FREE' ? 'Ouvert' : 'Sur réservation'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase tracking-widest text-foreground/40">Capacité</p>
                                    <p className="font-bold text-sm tracking-wide">{event.maxAttendees || 'Illimitée'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase tracking-widest text-foreground/40">Statut</p>
                                    <p className="font-bold text-sm tracking-wide text-green-600">CONFIRMÉ</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: INFOS & TICKET */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-28 space-y-8">
                            
                            {/* Practical Infos Card */}
                            <div className="bg-white/90 dark:bg-black/60 backdrop-blur-md rounded-[2.5rem] p-10 shadow-2xl border border-white dark:border-white/10 shadow-accent/5">
                                <div className="space-y-10">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-serif text-3xl font-light">Informations</h3>
                                        <Share2 className="w-5 h-5 text-foreground/30 cursor-pointer hover:text-accent transition-colors" />
                                    </div>

                                    <div className="space-y-8">
                                        <div className="flex gap-6">
                                            <div className="w-14 h-14 rounded-2xl bg-accent/5 flex items-center justify-center flex-shrink-0">
                                                <Calendar className="w-6 h-6 text-accent" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase tracking-widest text-foreground/40 mb-1">Quand ?</p>
                                                <p className="text-lg font-bold">{formatDateRange()}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-6">
                                            <div className="w-14 h-14 rounded-2xl bg-amber-500/5 flex items-center justify-center flex-shrink-0">
                                                <MapPin className="w-6 h-6 text-amber-600" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase tracking-widest text-foreground/40 mb-1">Où ça se passe ?</p>
                                                <p className="text-lg font-bold">{event.location}</p>
                                                <p className="text-sm text-foreground/50 italic mt-1">{event.locationType === 'VIRTUAL' ? 'Salon Virtuel YP' : 'Galerie Physique'}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-6">
                                            <div className="w-14 h-14 rounded-2xl bg-foreground/5 flex items-center justify-center flex-shrink-0">
                                                <Users className="w-6 h-6 text-foreground/40" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase tracking-widest text-foreground/40 mb-1">Participants</p>
                                                <p className="text-lg font-bold">{event.currentAttendees} déjà inscrits</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <TicketReservation event={event} />
                                    </div>
                                </div>
                            </div>

                            {/* Mes billets pour cet événement */}
                            <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
                                <MyTickets eventId={event.id} />
                            </div>

                            {/* Art Quote */}
                            <div className="text-center p-8">
                                <p className="font-serif italic text-foreground/30 text-sm">
                                    &ldquo;L'art ne reproduit pas le visible, il rend visible.&rdquo; 🎨
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}