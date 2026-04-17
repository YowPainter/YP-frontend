'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { EventsService } from '@/lib/services/EventsService';
import { EventCard } from './EventCard';
import { EventFilters } from './EventFilters';
import { Skeleton } from '@/components/ui/Skeleton';

interface EventGridProps {
    artistId?: string; // Pour filtrer par artiste (vitrine isolée)
}

export function EventGrid({ artistId }: EventGridProps) {
    const [filters, setFilters] = useState({
        eventType: '',
        upcoming: true,
        search: '',
    });

    const { data: events, isLoading } = useQuery({
        queryKey: ['public-events', filters, artistId],
        queryFn: () => {
            if (filters.search) {
                return EventsService.searchEvents(filters.search);
            }
            if (artistId) {
                return EventsService.getEventsByArtist(artistId);
            }
            return EventsService.getUpcomingEvents();
        }
    });

    // Séparer les événements en vedette (les 3 premiers)
    const displayEvents = events || [];
    const featuredEvents = displayEvents.slice(0, 3);
    const regularEvents = displayEvents.slice(3);

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                        <Skeleton className="rounded-xl h-48 w-full" />
                        <Skeleton className="h-5 mt-4 w-3/4" />
                        <Skeleton className="h-4 mt-2 w-1/2" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {/* Filtres */}
            <EventFilters filters={filters} onFilterChange={setFilters} />

            {/* Événements à la une */}
            {featuredEvents.length > 0 && (
                <div>
                    <div className="mb-6">
                        <h2 className="font-serif text-3xl font-light mb-2">À la une</h2>
                        <div className="w-16 h-[1px] bg-accent/40"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredEvents.map((event) => (
                            <EventCard key={event.id} event={event} variant="featured" />
                        ))}
                    </div>
                </div>
            )}

            {/* Tous les événements */}
            {regularEvents.length > 0 && (
                <div>
                    <div className="mb-6">
                        <h2 className="font-serif text-2xl font-light mb-2">
                            Tous les événements
                        </h2>
                        <div className="w-12 h-[1px] bg-accent/40"></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {regularEvents.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                </div>
            )}

            {displayEvents.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-foreground/40 text-lg">
                        Aucun événement trouvé pour le moment.
                    </p>
                </div>
            )}
        </div>
    );
}