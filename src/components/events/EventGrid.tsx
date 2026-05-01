'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { EventsService } from '@/lib/services/EventsService';
import { ArtistsService } from '@/lib/services/ArtistsService';
import { EventCard } from './EventCard';
import { EventFilters } from './EventFilters';
import { Skeleton } from '@/components/ui/Skeleton';
import { Pagination } from '@/components/ui/Pagination';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ArtistResponse } from '@/lib/models/ArtistResponse';
import type { EventResponse } from '@/lib/models/EventResponse';

interface EventGridProps {
    artistId?: string;
}

const ITEMS_PER_PAGE = 8;

export function EventGrid({ artistId }: EventGridProps) {
    const [filters, setFilters] = useState({
        eventType: '',
        upcoming: true,
        search: '',
    });
    const [currentPage, setCurrentPage] = useState(1);

    // Reset à la page 1 quand les filtres changent
    useEffect(() => {
        setCurrentPage(1);
    }, [filters]);

    // 1. Fetch events
    const { data: eventsData, isLoading: isLoadingEvents } = useQuery({
        queryKey: ['public-events-aggregated', filters, artistId],
        queryFn: async (): Promise<{ events: EventResponse[] }> => {
            if (filters.search) {
                const events = await EventsService.searchEvents(filters.search);
                return { events };
            }

            if (artistId) {
                const events = await EventsService.getEventsByArtist(artistId);
                return { events };
            }

            // Cas principal : Utiliser l'endpoint global pour tous les événements
            const allEvents = await EventsService.getUpcomingEvents();

            // Trier par date de début (les plus proches d'abord)
            allEvents.sort((a, b) => {
                const dateA = a.startDateTime ? new Date(a.startDateTime).getTime() : 0;
                const dateB = b.startDateTime ? new Date(b.startDateTime).getTime() : 0;
                return dateA - dateB;
            });

            return { events: allEvents };
        },
    });

    const events = eventsData?.events || [];

    // On récupère les IDs d'artistes uniques présents dans les événements
    const uniqueArtistIds = Array.from(
        new Set(events.map(e => e.artistId).filter(Boolean))
    ) as string[];

    const { data: extraArtists, isLoading: isLoadingExtraArtists } = useQuery({
        queryKey: ['event-artists-extra', uniqueArtistIds],
        queryFn: async () => {
            const map = new Map<string, ArtistResponse>();
            const results = await Promise.allSettled(
                uniqueArtistIds.map(id => ArtistsService.getArtistById(id))
            );
            results.forEach((result, index) => {
                if (result.status === 'fulfilled') {
                    map.set(uniqueArtistIds[index], result.value);
                }
            });
            return map;
        },
        enabled: uniqueArtistIds.length > 0,
    });

    // Map d'artistes pour l'affichage
    const mergedArtistsMap = extraArtists || new Map<string, ArtistResponse>();

    const isLoading = isLoadingEvents || (uniqueArtistIds.length > 0 && isLoadingExtraArtists);

    // Filtrage côté client par type (FREE / PAID)
    let displayEvents = events;
    if (filters.eventType) {
        displayEvents = displayEvents.filter(e => {
            const type = (e.ticketPrice && e.ticketPrice > 0) ? 'PAID' : 'FREE';
            return type === filters.eventType;
        });
    }

    const featuredEvents = displayEvents.slice(0, 3);
    const allRegularEvents = displayEvents.slice(3);
    
    // Pagination logic
    const totalPages = Math.ceil(allRegularEvents.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedRegularEvents = allRegularEvents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Scroll fluide vers le début de la section "Tous les événements"
        const section = document.getElementById('all-events-section');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                    <div key={i}>
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
            {featuredEvents.length > 0 && currentPage === 1 && (
                <div>
                    <div className="mb-6">
                        <h2 className="font-serif text-3xl font-light mb-2">À la une</h2>
                        <div className="w-16 h-[1px] bg-accent/40"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredEvents.map((event) => (
                            <EventCard
                                key={event.id}
                                event={event}
                                variant="featured"
                                artist={event.artistId ? mergedArtistsMap.get(event.artistId) : undefined}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Tous les événements */}
            {allRegularEvents.length > 0 && (
                <div id="all-events-section">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="font-serif text-2xl font-light mb-2">
                                Tous les événements
                            </h2>
                            <div className="w-12 h-[1px] bg-accent/40"></div>
                        </div>
                        {totalPages > 1 && (
                            <p className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold">
                                Page {currentPage} sur {totalPages}
                            </p>
                        )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {paginatedRegularEvents.map((event) => (
                            <EventCard
                                key={event.id}
                                event={event}
                                artist={event.artistId ? mergedArtistsMap.get(event.artistId) : undefined}
                            />
                        ))}
                    </div>

                    {/* Pagination UI standardized */}
                    {totalPages > 1 && (
                        <Pagination 
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            className="mt-24"
                        />
                    )}
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
