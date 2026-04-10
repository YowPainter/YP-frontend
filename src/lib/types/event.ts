// lib/types/event.ts
export type EventType = 'FREE' | 'PAID' | 'PRIVATE';
export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';

export interface Event {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    location: string;
    locationType: 'PHYSICAL' | 'VIRTUAL';
    posterUrl: string;
    eventType: EventType;
    status: EventStatus;
    maxAttendees: number | null;
    currentAttendees: number;
    price: number | null;
    artistId: string;
    artistName: string;
    artistSlug: string;
    isRegistered: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface TicketReservation {
    id: string;
    eventId: string;
    eventTitle: string;
    userName: string;
    userEmail: string;
    qrCodeData: string;
    isScanned: boolean;
    purchasedAt: string;
    price: number;
}

export interface CreateEventDTO {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    location: string;
    locationType: 'PHYSICAL' | 'VIRTUAL';
    posterUrl: string;
    eventType: EventType;
    maxAttendees?: number;
    price?: number;
}