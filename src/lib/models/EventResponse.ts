/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EventResponse = {
    id?: string;
    artistId?: string;
    name?: string;
    description?: string;
    posterUrl?: string;
    startDateTime?: string;
    endDateTime?: string;
    location?: string;
    type?: EventResponse.type;
    maxCapacity?: number;
    reservedCount?: number;
    ticketPrice?: number;
    status?: EventResponse.status;
};
export namespace EventResponse {
    export enum type {
        EXHIBITION = 'EXHIBITION',
        WORKSHOP = 'WORKSHOP',
        AUCTION = 'AUCTION',
        MEETUP = 'MEETUP',
        OTHER = 'OTHER',
    }
    export enum status {
        DRAFT = 'DRAFT',
        PUBLISHED = 'PUBLISHED',
        FULL = 'FULL',
        ONGOING = 'ONGOING',
        COMPLETED = 'COMPLETED',
        CANCELLED = 'CANCELLED',
    }
}

