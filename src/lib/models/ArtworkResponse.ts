/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ArtworkResponse = {
    id?: string;
    artistId?: string;
    artistName?: string;
    title?: string;
    description?: string;
    technique?: ArtworkResponse.technique;
    style?: ArtworkResponse.style;
    dimensions?: string;
    tags?: Array<string>;
    status?: ArtworkResponse.status;
    viewCount?: number;
    likeCount?: number;
    imageUrls?: Array<string>;
    publishedAt?: string;
    createdAt?: string;
};
export namespace ArtworkResponse {
    export enum technique {
        OIL = 'OIL',
        ACRYLIC = 'ACRYLIC',
        WATERCOLOR = 'WATERCOLOR',
        GOUACHE = 'GOUACHE',
        PASTEL = 'PASTEL',
        CHARCOAL = 'CHARCOAL',
        PENCIL = 'PENCIL',
        MIXED_MEDIA = 'MIXED_MEDIA',
        OTHER = 'OTHER',
    }
    export enum style {
        ABSTRACT = 'ABSTRACT',
        FIGURATIVE = 'FIGURATIVE',
        PORTRAIT = 'PORTRAIT',
        LANDSCAPE = 'LANDSCAPE',
        STILL_LIFE = 'STILL_LIFE',
        SURREALISM = 'SURREALISM',
        IMPRESSIONISM = 'IMPRESSIONISM',
        POP_ART = 'POP_ART',
        CONTEMPORARY = 'CONTEMPORARY',
        OTHER = 'OTHER',
    }
    export enum status {
        DRAFT = 'DRAFT',
        PUBLISHED = 'PUBLISHED',
        ON_SALE = 'ON_SALE',
        SUSPENDED = 'SUSPENDED',
        SOLD = 'SOLD',
        ARCHIVED = 'ARCHIVED',
        DELETED = 'DELETED',
    }
}

