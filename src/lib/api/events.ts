// lib/api/events.ts
import apiClient from './client';
import type { Event, TicketReservation } from '@/lib/types/event';

// MOCK DATA: Événements simulés
const MOCK_EVENTS: Event[] = [
    {
        id: '1',
        title: 'Exposition d\'Art Contemporain',
        description: 'Une exposition captivante des meilleures œuvres d\'art contemporain de la région. Venez découvrir des artistes émergents et confirmés lors de cette soirée unique.',
        startDate: new Date(Date.now() + 86400000 * 5).toISOString(), // Dans 5 jours
        endDate: new Date(Date.now() + 86400000 * 7).toISOString(),
        location: 'Galerie d\'Art Moderne, Douala',
        locationType: 'PHYSICAL',
        posterUrl: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800&q=80',
        eventType: 'FREE',
        status: 'PUBLISHED',
        maxAttendees: 200,
        currentAttendees: 150,
        price: null,
        artistId: 'a1',
        artistName: 'Marius',
        artistSlug: 'marius',
        isRegistered: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '2',
        title: 'Atelier de Peinture en Plein Air',
        description: 'Rejoignez-nous pour une session de peinture en plein air. Tout le matériel est fourni, venez avec votre créativité ! Un moment de détente garanti.',
        startDate: new Date(Date.now() + 86400000 * 2).toISOString(), // Dans 2 jours
        endDate: new Date(Date.now() + 86400000 * 2 + 10800000).toISOString(), // +3h
        location: 'Parc Central, Yaoundé',
        locationType: 'PHYSICAL',
        posterUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80',
        eventType: 'PAID',
        status: 'PUBLISHED',
        maxAttendees: 50,
        currentAttendees: 50, // Complet
        price: 15000,
        artistId: 'a2',
        artistName: 'Sophie',
        artistSlug: 'sophie',
        isRegistered: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '3',
        title: 'Vernissage Privé: "Ombres et Lumières"',
        description: 'Une collection exclusive explorant le contraste entre la lumière et l\'obscurité. Réservé à nos membres VIP et invités spéciaux.',
        startDate: new Date(Date.now() + 86400000 * 15).toISOString(),
        endDate: new Date(Date.now() + 86400000 * 15 + 18000000).toISOString(),
        location: 'Studio privé, Kribi',
        locationType: 'PHYSICAL',
        posterUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80',
        eventType: 'PRIVATE',
        status: 'PUBLISHED',
        maxAttendees: 30,
        currentAttendees: 12,
        price: null,
        artistId: 'a3',
        artistName: 'Alexandre',
        artistSlug: 'alexandre',
        isRegistered: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '4',
        title: 'Masterclass: Techniques de l\'Aquarelle',
        description: 'Une session en ligne intensive pour maîtriser l\'aquarelle avec les meilleurs professionnels du milieu. Interactive et avec des corrections en direct.',
        startDate: new Date(Date.now() + 86400000 * 10).toISOString(),
        endDate: new Date(Date.now() + 86400000 * 10 + 7200000).toISOString(),
        location: 'En ligne (Zoom)',
        locationType: 'VIRTUAL',
        posterUrl: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=800&q=80',
        eventType: 'PAID',
        status: 'PUBLISHED',
        maxAttendees: null,
        currentAttendees: 340,
        price: 5000,
        artistId: 'a4',
        artistName: 'Claire',
        artistSlug: 'claire',
        isRegistered: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '5',
        title: 'Festival des Arts Émergents',
        description: 'Un événement majeur rassemblant les talents de demain. Des concerts, des expos, et plein d\'animations pour tous.',
        startDate: new Date(Date.now() - 86400000 * 2).toISOString(), // Passé (-2 jours)
        endDate: new Date(Date.now() - 86400000 * 1).toISOString(),
        location: 'Grande Place, Douala',
        locationType: 'PHYSICAL',
        posterUrl: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=800&q=80',
        eventType: 'FREE',
        status: 'COMPLETED',
        maxAttendees: 1000,
        currentAttendees: 850,
        price: null,
        artistId: 'a1',
        artistName: 'Marius',
        artistSlug: 'marius',
        isRegistered: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
];

// PUBLIC : Récupérer tous les événements publiés (Mocké)
export async function getPublicEvents(filters?: {
    eventType?: string;
    upcoming?: boolean;
    search?: string;
    artistId?: string;
}): Promise<Event[]> {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 800));

    let results = [...MOCK_EVENTS];

    if (filters?.eventType) {
        results = results.filter(e => e.eventType === filters.eventType);
    }
    
    if (filters?.upcoming) {
        const now = new Date();
        results = results.filter(e => new Date(e.startDate) >= now);
    }
    
    if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        results = results.filter(e => 
            e.title.toLowerCase().includes(searchLower) || 
            e.description.toLowerCase().includes(searchLower) ||
            e.location.toLowerCase().includes(searchLower)
        );
    }
    
    if (filters?.artistId) {
        results = results.filter(e => e.artistId === filters.artistId);
    }

    return results;
}

// PUBLIC : Détail d'un événement (Mocké)
export async function getEventById(id: string): Promise<Event> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const event = MOCK_EVENTS.find(e => e.id === id);
    if (!event) throw new Error('Événement non trouvé');
    return event;
}

// Helper pour gérer la persistance locale en mode démo
const getPersistedTickets = (): TicketReservation[] => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('yp_mock_tickets');
    return saved ? JSON.parse(saved) : [];
};

const saveTickets = (tickets: TicketReservation[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('yp_mock_tickets', JSON.stringify(tickets));
};

let MOCK_TICKETS: TicketReservation[] = [
    {
        id: 'tkt-12345',
        eventId: '1',
        eventTitle: 'Exposition d\'Art Contemporain',
        userName: 'John Doe',
        userEmail: 'john@example.com',
        qrCodeData: 'mock-qr-code-data',
        isScanned: false,
        purchasedAt: new Date().toISOString(),
        price: 0
    }
];

// Initialiser avec les données du localStorage si on est dans le navigateur
if (typeof window !== 'undefined') {
    const persisted = getPersistedTickets();
    if (persisted.length > 0) {
        MOCK_TICKETS = persisted;
    } else {
        saveTickets(MOCK_TICKETS);
    }
}

// PROTÉGÉ : Réserver un billet (gratuit) (Mocké)
export async function reserveTicket(eventId: string, data: {
    userName: string;
    userEmail: string;
}): Promise<TicketReservation> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const event = MOCK_EVENTS.find(e => e.id === eventId);
    if (!event) throw new Error("Événement non trouvé");

    const newTicket: TicketReservation = {
        id: `tkt-${Math.random().toString(36).substring(2, 9)}`,
        eventId,
        eventTitle: event.title,
        userName: data.userName,
        userEmail: data.userEmail,
        qrCodeData: `mock-qr-${Date.now()}`,
        isScanned: false,
        purchasedAt: new Date().toISOString(),
        price: event.price || 0,
    };
    
    MOCK_TICKETS.push(newTicket);
    saveTickets(MOCK_TICKETS); // Sauvegarder !
    
    // Mettre à jour l'événement pour la démo
    event.currentAttendees += 1;
    event.isRegistered = true;

    return newTicket;
}

// PROTÉGÉ : Récupérer mes billets (Mocké)
export async function getMyTickets(eventId?: string): Promise<TicketReservation[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // S'assurer de charger les dernières données du localStorage
    const currentTickets = typeof window !== 'undefined' ? getPersistedTickets() : MOCK_TICKETS;
    
    if (eventId) {
        return currentTickets.filter(t => t.eventId === eventId);
    }
    return currentTickets;
}

// PROTÉGÉ (ARTISTE) : Scanner un billet (validation entrée) (Mocké)
export async function validateTicket(qrCodeData: string): Promise<{ valid: boolean; message: string }> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const ticketIndex = MOCK_TICKETS.findIndex(t => t.qrCodeData === qrCodeData);
    
    if (ticketIndex === -1) {
        return { valid: false, message: 'Billet introuvable ou invalide.' };
    }
    
    if (MOCK_TICKETS[ticketIndex].isScanned) {
        return { valid: false, message: 'Ce billet a déjà été scanné !' };
    }
    
    MOCK_TICKETS[ticketIndex].isScanned = true;
    return { valid: true, message: 'Billet valide et scanné avec succès !' };
}