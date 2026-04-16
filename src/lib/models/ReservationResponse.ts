/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ReservationResponse = {
    id?: string;
    eventId?: string;
    eventName?: string;
    userId?: string;
    userName?: string;
    userEmail?: string;
    status?: ReservationResponse.status;
    createdAt?: string;
};
export namespace ReservationResponse {
    export enum status {
        PENDING = 'PENDING',
        CONFIRMED = 'CONFIRMED',
        CANCELLED = 'CANCELLED',
    }
}

