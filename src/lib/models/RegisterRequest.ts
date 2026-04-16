/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RegisterRequest = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: RegisterRequest.role;
    artistName?: string;
    /**
     * Slug unique (URL). Sera auto-généré si vide.
     */
    slug?: string;
};
export namespace RegisterRequest {
    export enum role {
        ROLE_ARTIST = 'ROLE_ARTIST',
        ROLE_BUYER = 'ROLE_BUYER',
    }
}

