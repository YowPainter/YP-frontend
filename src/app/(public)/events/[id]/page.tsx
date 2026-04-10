// app/(public)/events/[id]/page.tsx
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Calendar, MapPin, Users, Clock, User } from 'lucide-react';
import { getEventById } from '@/lib/api/events';
import { TicketReservation } from '@/components/events/TicketReservation';
import { MyTickets } from '@/components/events/MyTickets';
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
            })} - ${end.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
            })}`;
        }

        return `Du ${start.toLocaleDateString('fr-FR')} au ${end.toLocaleDateString('fr-FR')}`;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero avec affiche */}
            <div className="relative h-[60vh] w-full">
                <Image
                    src={event.posterUrl}
                    alt={event.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <div className="max-w-[1400px] mx-auto">
                        <p className="text-accent text-sm uppercase tracking-wider mb-2">
                            {event.eventType === 'FREE' ? 'Événement gratuit' :
                                event.eventType === 'PAID' ? 'Événement payant' :
                                    'Événement privé'}
                        </p>
                        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">
                            {event.title}
                        </h1>
                        <p className="text-lg text-white/80 max-w-2xl">
                            Organisé par {event.artistName}
                        </p>
                    </div>
                </div>
            </div>

            {/* Contenu */}
            <div className="max-w-[1400px] mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Colonne gauche - Infos */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Description */}
                        <div>
                            <h2 className="text-2xl font-serif font-bold mb-4">À propos</h2>
                            <p className="text-foreground/70 leading-relaxed whitespace-pre-wrap">
                                {event.description}
                            </p>
                        </div>

                        {/* Informations pratiques */}
                        <div>
                            <h2 className="text-2xl font-serif font-bold mb-4">Informations pratiques</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm">
                                    <Calendar className="w-5 h-5 text-accent mt-0.5" />
                                    <div>
                                        <p className="font-semibold">Date et horaire</p>
                                        <p className="text-sm text-foreground/60">{formatDateRange()}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm">
                                    <MapPin className="w-5 h-5 text-accent mt-0.5" />
                                    <div>
                                        <p className="font-semibold">Lieu</p>
                                        <p className="text-sm text-foreground/60">{event.location}</p>
                                        <p className="text-xs text-foreground/40 mt-1">
                                            {event.locationType === 'VIRTUAL' ? 'Événement en ligne' : 'Événement physique'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm">
                                    <Users className="w-5 h-5 text-accent mt-0.5" />
                                    <div>
                                        <p className="font-semibold">Participants</p>
                                        <p className="text-sm text-foreground/60">
                                            {event.currentAttendees} inscrit(s)
                                            {event.maxAttendees && ` sur ${event.maxAttendees} maximum`}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm">
                                    <User className="w-5 h-5 text-accent mt-0.5" />
                                    <div>
                                        <p className="font-semibold">Organisateur</p>
                                        <a
                                            href={`/${event.artistSlug}`}
                                            className="text-sm text-accent hover:underline"
                                        >
                                            {event.artistName}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Colonne droite - Réservation */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <TicketReservation
                                event={event}
                            />

                            {/* Mes billets pour cet événement */}
                            {event.isRegistered && (
                                <div className="mt-6">
                                    <MyTickets eventId={event.id} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}