// src/components/events/EventGrid.tsx
'use client';

import { useState, useEffect } from 'react';
import { EventCard } from './EventCard';
import { EventFilters } from './EventFilters';
import { getPublicEvents } from '@/lib/api/events';
import type { Event } from '@/lib/types/event';

interface EventGridProps {
    initialEvents?: Event[];
    artistId?: string; // Pour filtrer par artiste (vitrine isolée)
}

export function EventGrid({ initialEvents, artistId }: EventGridProps) {
    const [events, setEvents] = useState<Event[]>(initialEvents || []);
    const [loading, setLoading] = useState(!initialEvents);
    const [filters, setFilters] = useState({
        eventType: '',
        upcoming: true,
        search: '',
    });

    useEffect(() => {
        if (!initialEvents) {
            loadEvents();
        }
    }, [filters, artistId]);

    const loadEvents = async () => {
        setLoading(true);
        try {
            // Correction : passer artistId dans les filtres ou séparément
            const data = await getPublicEvents({
                ...filters,
                artistId: artistId, // Ajouter artistId aux filtres
            });
            setEvents(data);
        } catch (error) {
            console.error('Erreur chargement événements:', error);
        } finally {
            setLoading(false);
        }
    };

    // Séparer les événements en vedette (les 3 premiers)
    const featuredEvents = events.slice(0, 3);
    const regularEvents = events.slice(3);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                        <div className="bg-gray-200 rounded-xl h-48"></div>
                        <div className="h-5 bg-gray-200 mt-4 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 mt-2 rounded w-1/2"></div>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {regularEvents.map((event) => (
                            <EventCard key={event.id} event={event} variant="featured" />
                        ))}
                    </div>
                </div>
            )}

            {events.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-foreground/40 text-lg">
                        Aucun événement trouvé pour le moment.
                    </p>
                </div>
            )}
        </div>
    );
}