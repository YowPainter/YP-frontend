// components/events/EventCard.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Users, Ticket } from 'lucide-react';
import type { Event } from '@/lib/types/event';

interface EventCardProps {
    event: Event;
    variant?: 'grid' | 'featured';
}

export function EventCard({ event, variant = 'grid' }: EventCardProps) {
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat('fr-FR', {
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    const isSoldOut = event.maxAttendees
        ? event.currentAttendees >= event.maxAttendees
        : false;

    if (variant === 'featured') {
        return (
            <Link href={`/events/${event.id}`}>
                <div className="group cursor-pointer relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                    <div className="relative h-64 overflow-hidden">
                        <Image
                            src={event.posterUrl}
                            alt={event.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Badge type événement */}
                        <div className="absolute top-4 right-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${event.eventType === 'FREE' ? 'bg-green-500 text-white' :
                                    event.eventType === 'PAID' ? 'bg-accent text-white' :
                                        'bg-purple-500 text-white'
                                }`}>
                                {event.eventType === 'FREE' ? 'GRATUIT' :
                                    event.eventType === 'PAID' ? `💰 ${event.price?.toLocaleString()} CFA` :
                                        'PRIVÉ'}
                            </span>
                        </div>
                    </div>

                    <div className="p-6">
                        <h3 className="font-serif text-2xl font-bold mb-2 group-hover:text-accent transition-colors">
                            {event.title}
                        </h3>
                        <p className="text-foreground/60 text-sm line-clamp-2 mb-4">
                            {event.description}
                        </p>

                        <div className="space-y-2 text-sm text-foreground/70">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(event.startDate)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <span>{event.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                <span>
                                    {event.currentAttendees} participant(s)
                                    {event.maxAttendees && ` / ${event.maxAttendees} max`}
                                </span>
                            </div>
                        </div>

                        {isSoldOut && (
                            <div className="mt-4 text-red-500 text-sm font-semibold">
                                Complet !
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        );
    }

    return (
        <Link href={`/events/${event.id}`}>
            <div className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer">
                <div className="relative h-48 overflow-hidden">
                    <Image
                        src={event.posterUrl}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${event.eventType === 'FREE' ? 'bg-green-500 text-white' :
                                event.eventType === 'PAID' ? 'bg-accent text-white' :
                                    'bg-purple-500 text-white'
                            }`}>
                            {event.eventType === 'FREE' ? 'Gratuit' :
                                event.eventType === 'PAID' ? `${event.price?.toLocaleString()} CFA` :
                                    'Privé'}
                        </span>
                    </div>
                </div>

                <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1 line-clamp-1">{event.title}</h3>
                    <p className="text-xs text-foreground/50 mb-2">
                        Par {event.artistName}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-foreground/60">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(event.startDate).toLocaleDateString('fr-FR')}</span>
                        <MapPin className="w-3 h-3 ml-2" />
                        <span className="truncate">{event.location}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}