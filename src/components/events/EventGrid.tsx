'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { EventsService } from '@/lib/services/EventsService';
import { ArtistsService } from '@/lib/services/ArtistsService';
import { EventCard } from './EventCard';
import { EventFilters } from './EventFilters';
import { Skeleton } from '@/components/ui/Skeleton';
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

    // 1. Fetch all artists (via searchArtists('') qui retourne tous les artistes)
    const { data: allArtists } = useQuery({
        queryKey: ['all-artists-for-events'],
        queryFn: () => ArtistsService.searchArtists(''),
        enabled: !artistId, // Ne fetch que si on est sur la page globale
    });

    // 2. Fetch events — stratégie : agréger les événements de chaque artiste par slug
    const { data: eventsData, isLoading: isLoadingEvents } = useQuery({
        queryKey: ['public-events-aggregated', filters, artistId, allArtists?.map(a => a.slug)],
        queryFn: async (): Promise<{ events: EventResponse[]; artistsMap: Map<string, ArtistResponse> }> => {
            // Cas recherche
            if (filters.search) {
                const events = await EventsService.searchEvents(filters.search);
                return { events, artistsMap: new Map() };
            }

            // Cas filtrage par artiste spécifique (via artistId)
            if (artistId) {
                const events = await EventsService.getEventsByArtist(artistId);
                return { events, artistsMap: new Map() };
            }

            // Cas principal : Utiliser l'endpoint global pour tous les événements
            const allEvents = await EventsService.getUpcomingEvents();
            
            const artistsMap = new Map<string, ArtistResponse>();
            if (allArtists) {
                allArtists.forEach(artist => {
                    if (artist.id) artistsMap.set(artist.id, artist);
                });
            }

            // Trier par date de début (les plus proches d'abord)
            allEvents.sort((a, b) => {
                const dateA = a.startDateTime ? new Date(a.startDateTime).getTime() : 0;
                const dateB = b.startDateTime ? new Date(b.startDateTime).getTime() : 0;
                return dateA - dateB;
            });

            return { events: allEvents, artistsMap };
        },
        enabled: !!artistId || !!allArtists,
    });

    const events = eventsData?.events || [];
    const artistsMap = eventsData?.artistsMap || new Map<string, ArtistResponse>();

    // Pour les cas recherche/artiste spécifique, on fetch les artistes séparément
    const uniqueArtistIds = Array.from(
        new Set(events.map(e => e.artistId).filter(Boolean))
    ).filter(id => !artistsMap.has(id!)) as string[];

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

    // Fusionner les deux maps d'artistes
    const mergedArtistsMap = new Map<string, ArtistResponse>([
        ...artistsMap.entries(),
        ...(extraArtists?.entries() || []),
    ]);

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

                    {/* Pagination UI */}
                    {totalPages > 1 && (
                        <div className="mt-24 flex justify-center items-center gap-6">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="w-9 h-9 rotate-45 border border-foreground/10 flex items-center justify-center hover:bg-accent hover:text-white hover:border-accent transition-all duration-300 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-current group"
                            >
                                <ChevronLeft className="w-5 h-5 -rotate-45 transition-transform group-hover:scale-110" />
                            </button>
                            
                            <div className="flex items-center gap-4">
                                {[...Array(totalPages)].map((_, i) => {
                                    const pageNum = i + 1;
                                    const isActive = currentPage === pageNum;
                                    
                                    // Afficher seulement quelques numéros de page si trop nombreux
                                    if (
                                        totalPages > 5 && 
                                        pageNum !== 1 && 
                                        pageNum !== totalPages && 
                                        Math.abs(pageNum - currentPage) > 1
                                    ) {
                                        if (pageNum === 2 || pageNum === totalPages - 1) {
                                            return <span key={pageNum} className="text-foreground/20 font-serif mx-1">...</span>;
                                        }
                                        return null;
                                    }

                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => handlePageChange(pageNum)}
                                            className={`relative w-9 h-9 rotate-45 flex items-center justify-center transition-all duration-500 ${
                                                isActive 
                                                ? 'bg-accent text-white shadow-[0_10px_20px_rgba(0,0,0,0.15)] scale-110 z-10' 
                                                : 'bg-background border border-foreground/5 text-foreground/40 hover:border-accent/40 hover:text-accent hover:bg-accent/5'
                                            }`}
                                        >
                                            <span className="-rotate-45 block text-[11px] font-bold tracking-tighter">
                                                {pageNum.toString().padStart(2, '0')}
                                            </span>
                                            
                                            {/* Subtle diamond inner border for active state */}
                                            {isActive && (
                                                <div className="absolute inset-[3px] border border-white/30 pointer-events-none"></div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="w-9 h-9 rotate-45 border border-foreground/10 flex items-center justify-center hover:bg-accent hover:text-white hover:border-accent transition-all duration-300 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-current group"
                            >
                                <ChevronRight className="w-5 h-5 -rotate-45 transition-transform group-hover:scale-110" />
                            </button>
                        </div>
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
