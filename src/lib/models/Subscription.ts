/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Subscription = {
    id?: string;
    artistId?: string;
    plan?: Subscription.plan;
    startDate?: string;
    endDate?: string;
    createdAt?: string;
    active?: boolean;
};
export namespace Subscription {
    export enum plan {
        FREE = 'FREE',
        PRO = 'PRO',
        ELITE = 'ELITE',
    }
}

