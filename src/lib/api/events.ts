// lib/api/events.ts
import { EventsService } from '../services/EventsService';
import { ArtistsService } from '../services/ArtistsService';
import type { EventResponse } from '../models/EventResponse';
import type { Event, TicketReservation, CreateEventDTO } from '@/lib/types/event';

/**
 * Mapper pour convertir EventResponse (Backend) vers Event (Frontend)
 */
async function mapEventResponseToEvent(res: EventResponse): Promise<Event> {
    // Essayer de récupérer le nom de l'artiste si artistId est présent
    let artistName = 'Artiste YP';
    let artistSlug = 'artiste';
    
    if (res.artistId) {
        try {
            const artist = await ArtistsService.getArtistById(res.artistId);
            artistName = artist.artistName || `${artist.firstName} ${artist.lastName}` || 'Artiste YP';
            artistSlug = artist.slug || 'artiste';
        } catch (e) {
            console.warn(`Impossible de récupérer l'artiste ${res.artistId}`, e);
        }
    }

    return {
        id: res.id || '',
        title: res.name || 'Sans titre',
        description: res.description || '',
        startDate: res.startDateTime || new Date().toISOString(),
        endDate: res.endDateTime || new Date().toISOString(),
        location: res.location || 'Lieu non spécifié',
        locationType: (res.location?.toLowerCase().includes('zoom') || res.location?.toLowerCase().includes('ligne')) ? 'VIRTUAL' : 'PHYSICAL',
        posterUrl: res.posterUrl || 'https://images.unsplash.com/photo-1579710838505-4cfa69f0bd2c?w=800&q=80',
        eventType: (res.ticketPrice && res.ticketPrice > 0) ? 'PAID' : 'FREE',
        status: (res.status as any) || 'PUBLISHED',
        maxAttendees: res.maxCapacity || null,
        currentAttendees: res.reservedCount || 0,
        price: res.ticketPrice || null,
        artistId: res.artistId || '',
        artistName: artistName,
        artistSlug: artistSlug,
        isRegistered: false, // À calculer selon l'utilisateur connecté si possible
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
}

// PUBLIC : Récupérer tous les événements publiés
export async function getPublicEvents(filters?: {
    eventType?: string;
    upcoming?: boolean;
    search?: string;
    artistId?: string;
}): Promise<Event[]> {
    let responses: EventResponse[] = [];
    
    if (filters?.artistId) {
        responses = await EventsService.getEventsByArtist(filters.artistId);
    } else if (filters?.search) {
        responses = await EventsService.searchEvents(filters.search);
    } else {
        responses = await EventsService.getUpcomingEvents();
    }

    // Filtrage supplémentaire si nécessaire (le backend devrait normalement le faire)
    if (filters?.eventType) {
        responses = responses.filter(r => {
            const type = (r.ticketPrice && r.ticketPrice > 0) ? 'PAID' : 'FREE';
            return type === filters.eventType;
        });
    }

    // Mapping asynchrone en parallèle
    return Promise.all(responses.map(mapEventResponseToEvent));
}

// PUBLIC : Détail d'un événement
export async function getEventById(id: string): Promise<Event> {
    const res = await EventsService.getEvent(id);
    return mapEventResponseToEvent(res);
}

// PROTÉGÉ : Réserver un billet
export async function reserveTicket(eventId: string, data: {
    userName: string;
    userEmail: string;
    phoneNumber?: string; // Ajouté pour MOMO/Orange
    artistSlug?: string; // Pour le contexte multitenant
}): Promise<any> {
    // Définir le contexte tenant pour les headers API
    if (data.artistSlug) {
        localStorage.setItem('currentTenantSlug', data.artistSlug);
    }
    
    try {
        const reservation = await EventsService.reserveEvent(eventId);
        if (!reservation.id) throw new Error("Erreur lors de la réservation");

        // Si on a un numéro de téléphone (événement payant), on initie le checkout
        if (data.phoneNumber) {
            try {
                // Sanitize phone number: remove all non-digits and add 237 prefix if it's 9 digits
                const digitsOnly = data.phoneNumber.replace(/\D/g, '');
                const formattedPhone = digitsOnly.length === 9 ? `237${digitsOnly}` : digitsOnly;
                
                const checkoutData = await EventsService.checkoutReservation(reservation.id, formattedPhone);
                return {
                    ...reservation,
                    checkout: checkoutData
                };
            } catch (error: any) {
                console.error("Erreur lors du checkout:", error);
                throw new Error(error.message || "Erreur lors de l'initialisation du paiement");
            }
        }

        return reservation;
    } finally {
        // Nettoyer le contexte tenant après les appels
        if (data.artistSlug) {
            localStorage.removeItem('currentTenantSlug');
        }
    }
}

// PROTÉGÉ : Récupérer mes billets
export async function getMyTickets(eventId?: string): Promise<TicketReservation[]> {
    // Dans le cadre de la démo, on récupère les billets du localStorage
    if (typeof window === 'undefined') return [];
    
    const tickets: TicketReservation[] = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('ticket_')) {
            try {
                const ticket = JSON.parse(localStorage.getItem(key) || '');
                if (!eventId || ticket.eventId === eventId || ticket.event?.id === eventId) {
                    tickets.push({
                        id: ticket.id,
                        eventId: ticket.eventId || ticket.event?.id,
                        eventTitle: ticket.eventTitle || ticket.event?.name || 'Événement',
                        userName: ticket.userName || 'Invité',
                        userEmail: ticket.userEmail || '',
                        qrCodeData: ticket.qrCodeData || ticket.id,
                        isScanned: ticket.isScanned || false,
                        purchasedAt: ticket.purchasedAt || ticket.createdAt || new Date().toISOString(),
                        price: ticket.price || 0
                    });
                }
            } catch (e) {
                console.error("Erreur parsing ticket local", e);
            }
        }
    }
    
    // Trier par date d'achat décroissante
    return tickets.sort((a, b) => new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime());
}

// PROTÉGÉ (ARTISTE) : Scanner un billet
export async function validateTicket(qrCodeData: string): Promise<{ valid: boolean; message: string }> {
    const res = await EventsService.validateTicket(qrCodeData);
    return {
        valid: !!res.id,
        message: res.id ? 'Billet valide !' : 'Billet invalide.'
    };
}