/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ArtworkCreateRequest = {
    title: string;
    description?: string;
    technique: ArtworkCreateRequest.technique;
    style: ArtworkCreateRequest.style;
    dimensions?: string;
    tags?: Array<string>;
    imageUrls?: Array<string>;
};
export namespace ArtworkCreateRequest {
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
}

