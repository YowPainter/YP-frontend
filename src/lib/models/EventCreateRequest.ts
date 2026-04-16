/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EventCreateRequest = {
    name: string;
    description?: string;
    posterUrl?: string;
    startDateTime: string;
    endDateTime: string;
    location?: string;
    type: EventCreateRequest.type;
    maxCapacity?: number;
    ticketPrice?: number;
};
export namespace EventCreateRequest {
    export enum type {
        EXHIBITION = 'EXHIBITION',
        WORKSHOP = 'WORKSHOP',
        AUCTION = 'AUCTION',
        MEETUP = 'MEETUP',
        OTHER = 'OTHER',
    }
}

