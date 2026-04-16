/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EventCreateRequest } from '../models/EventCreateRequest';
import type { EventResponse } from '../models/EventResponse';
import type { ReservationResponse } from '../models/ReservationResponse';
import type { TicketResponse } from '../models/TicketResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class EventsService {
    /**
     * Modifier un evenement (Artiste proprietaire)
     * @param id
     * @param requestBody
     * @returns EventResponse OK
     * @throws ApiError
     */
    public static updateEvent(
        id: string,
        requestBody: EventCreateRequest,
    ): CancelablePromise<EventResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/events/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Annuler/Supprimer un evenement
     * @param id
     * @returns any OK
     * @throws ApiError
     */
    public static cancelEvent(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/events/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Creer un evenement (Artiste)
     * @param requestBody
     * @returns EventResponse OK
     * @throws ApiError
     */
    public static createEvent(
        requestBody: EventCreateRequest,
    ): CancelablePromise<EventResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/events',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * RESERVER une place
     * @param eventId
     * @returns ReservationResponse OK
     * @throws ApiError
     */
    public static reserveEvent(
        eventId: string,
    ): CancelablePromise<ReservationResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/events/{eventId}/reservations',
            path: {
                'eventId': eventId,
            },
        });
    }
    /**
     * Valider un billet par QR Code
     * @param qrCodeData
     * @returns TicketResponse OK
     * @throws ApiError
     */
    public static validateTicket(
        qrCodeData: string,
    ): CancelablePromise<TicketResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/events/tickets/validate',
            query: {
                'qrCodeData': qrCodeData,
            },
        });
    }
    /**
     * Initier le paiement Mobile Money (MOMO/Orange) pour une réservation
     * @param id
     * @param phoneNumber
     * @returns string OK
     * @throws ApiError
     */
    public static checkoutReservation(
        id: string,
        phoneNumber: string,
    ): CancelablePromise<Record<string, string>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/events/reservations/{id}/checkout',
            path: {
                'id': id,
            },
            query: {
                'phoneNumber': phoneNumber,
            },
        });
    }
    /**
     * Lister les evenements a venir
     * @returns EventResponse OK
     * @throws ApiError
     */
    public static getUpcomingEvents(): CancelablePromise<Array<EventResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/public/events',
        });
    }
    /**
     * Voir les details d'un evenement
     * @param id
     * @returns EventResponse OK
     * @throws ApiError
     */
    public static getEvent(
        id: string,
    ): CancelablePromise<EventResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/public/events/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Rechercher des evenements par nom ou lieu
     * @param q
     * @returns EventResponse OK
     * @throws ApiError
     */
    public static searchEvents(
        q: string,
    ): CancelablePromise<Array<EventResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/public/events/search',
            query: {
                'q': q,
            },
        });
    }
    /**
     * Lister les lieux disponibles pour les filtres
     * @returns string OK
     * @throws ApiError
     */
    public static getLocations(): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/public/events/metadata/locations',
        });
    }
    /**
     * Lister les événements d'un artiste spécifique
     * @param artistId
     * @returns EventResponse OK
     * @throws ApiError
     */
    public static getEventsByArtist(
        artistId: string,
    ): CancelablePromise<Array<EventResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/public/artists/{artistId}/events',
            path: {
                'artistId': artistId,
            },
        });
    }
    /**
     * Lister les inscrits (Artiste proprietaire)
     * @param id
     * @returns ReservationResponse OK
     * @throws ApiError
     */
    public static getReservations(
        id: string,
    ): CancelablePromise<Array<ReservationResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/events/{id}/reservations',
            path: {
                'id': id,
            },
        });
    }
}
