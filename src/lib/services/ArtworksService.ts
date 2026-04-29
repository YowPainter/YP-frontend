/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ArtworkCreateRequest } from '../models/ArtworkCreateRequest';
import type { ArtworkResponse } from '../models/ArtworkResponse';
import type { ArtistResponse } from '../models/ArtistResponse';
import type { CommentRequest } from '../models/CommentRequest';
import type { CommentResponse } from '../models/CommentResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
import { ArtistsService } from './ArtistsService';
export class ArtworksService {
    /**
     * Modifier une oeuvre (Artiste proprietaire)
     * @param id
     * @param requestBody
     * @returns ArtworkResponse OK
     * @throws ApiError
     */
    public static updateArtwork(
        id: string,
        requestBody: ArtworkCreateRequest,
    ): CancelablePromise<ArtworkResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/artworks/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Liker ou unliker une oeuvre dans une boutique spécifique
     * @param artistSlug
     * @param id
     * @returns any OK
     * @throws ApiError
     */
    public static toggleLike(
        artistSlug: string,
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/public/{artistSlug}/artworks/{id}/like',
            path: {
                'artistSlug': artistSlug,
                'id': id,
            },
        });
    }
    /**
     * Lister les commentaires d'une oeuvre spécifique
     * @param artistSlug
     * @param id
     * @returns CommentResponse OK
     * @throws ApiError
     */
    public static getComments(
        artistSlug: string,
        id: string,
    ): CancelablePromise<Array<CommentResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/public/{artistSlug}/artworks/{id}/comments',
            path: {
                'artistSlug': artistSlug,
                'id': id,
            },
        });
    }
    /**
     * Ajouter un commentaire sur une oeuvre spécifique
     * @param artistSlug
     * @param id
     * @param requestBody
     * @returns CommentResponse OK
     * @throws ApiError
     */
    public static addComment(
        artistSlug: string,
        id: string,
        requestBody: CommentRequest,
    ): CancelablePromise<CommentResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/public/{artistSlug}/artworks/{id}/comments',
            path: {
                'artistSlug': artistSlug,
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Créer une oeuvre (Artiste)
     * @param requestBody
     * @returns ArtworkResponse OK
     * @throws ApiError
     */
    public static createArtwork(
        requestBody: ArtworkCreateRequest,
    ): CancelablePromise<ArtworkResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/artworks',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Changer l'etat d'une oeuvre (PUBLISHED, ON_SALE, ARCHIVED...)
     * @param id
     * @param status
     * @returns any OK
     * @throws ApiError
     */
    public static updateStatus(
        id: string,
        status: 'DRAFT' | 'PUBLISHED' | 'ON_SALE' | 'SUSPENDED' | 'SOLD' | 'ARCHIVED' | 'DELETED',
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/artworks/{id}/status',
            path: {
                'id': id,
            },
            query: {
                'status': status,
            },
        });
    }
    /**
     * Mise à jour groupée du statut
     * @param status
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static bulkUpdateStatus(
        status: 'DRAFT' | 'PUBLISHED' | 'ON_SALE' | 'SUSPENDED' | 'SOLD' | 'ARCHIVED' | 'DELETED',
        requestBody: Array<string>,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/artworks/bulk-status',
            query: {
                'status': status,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Lister les oeuvres d'une boutique (tenant spécifique)
     * @param artistSlug
     * @returns ArtworkResponse OK
     * @throws ApiError
     */
    public static getAllPublicArtworks(
        artistSlug: string,
    ): CancelablePromise<Array<ArtworkResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/public/{artistSlug}/artworks',
            path: {
                'artistSlug': artistSlug,
            },
        });
    }
    /**
     * Voir les details d'une oeuvre dans une boutique
     * @param artistSlug
     * @param id
     * @returns ArtworkResponse OK
     * @throws ApiError
     */
    public static getArtwork(
        artistSlug: string,
        id: string,
    ): CancelablePromise<ArtworkResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/public/{artistSlug}/artworks/{id}',
            path: {
                'artistSlug': artistSlug,
                'id': id,
            },
        });
    }
    /**
     * Rechercher des oeuvres dans une boutique spécifique
     * @param artistSlug
     * @param q
     * @returns ArtworkResponse OK
     * @throws ApiError
     */
    public static searchArtworks(
        artistSlug: string,
        q: string,
    ): CancelablePromise<Array<ArtworkResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/public/{artistSlug}/artworks/search',
            path: {
                'artistSlug': artistSlug,
            },
            query: {
                'q': q,
            },
        });
    }
    /**
     * Lister les techniques disponibles pour les filtres
     * @returns string OK
     * @throws ApiError
     */
    public static getTechniques(): CancelablePromise<Array<'OIL' | 'ACRYLIC' | 'WATERCOLOR' | 'GOUACHE' | 'PASTEL' | 'CHARCOAL' | 'PENCIL' | 'MIXED_MEDIA' | 'OTHER'>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/public/artworks/metadata/techniques',
        });
    }
    /**
     * Lister les styles disponibles pour les filtres
     * @returns string OK
     * @throws ApiError
     */
    public static getStyles(): CancelablePromise<Array<'ABSTRACT' | 'FIGURATIVE' | 'PORTRAIT' | 'LANDSCAPE' | 'STILL_LIFE' | 'SURREALISM' | 'IMPRESSIONISM' | 'POP_ART' | 'CONTEMPORARY' | 'OTHER'>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/public/artworks/metadata/styles',
        });
    }
    /**
     * Recuperer les oeuvres récentes (tous artistes confondus)
     * @returns ArtworkResponse OK
     * @throws ApiError
     */
    public static getLatestArtworks(): CancelablePromise<Array<ArtworkResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/public/artworks/latest',
        });
    }
    /**
     * Recuperer les oeuvres mises en avant
     * @returns ArtworkResponse OK
     * @throws ApiError
     */
    public static getFeatured(): CancelablePromise<Array<ArtworkResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/public/artworks/featured',
        });
    }
    /**
     * Lister mes oeuvres (Artiste - Dashboard)
     * @returns ArtworkResponse OK
     * @throws ApiError
     */
    public static getMyArtworks(): CancelablePromise<Array<ArtworkResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/artworks/me',
        });
    }
    /**
     * Suppression groupée d'oeuvres
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static bulkDelete(
        requestBody: Array<string>,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/artworks/bulk-delete',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}

export interface GalleryViewerContext {
    role?: string;
    artistSlug?: string;
    artistName?: string;
    artistProfilePictureUrl?: string;
}

export interface GalleryArtwork extends ArtworkResponse {
    artistSlug?: string;
    artistProfilePictureUrl?: string;
}

const normalizeFilterValue = (value?: string) =>
    value?.trim().toUpperCase().replace(/[\s-]+/g, "_");

const matchesSearch = (artwork: ArtworkResponse, query?: string) => {
    if (!query) return true;

    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return true;

    return [
        artwork.title,
        artwork.description,
        artwork.artistName,
        artwork.technique,
        artwork.style,
        ...(artwork.tags || []),
    ]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(normalizedQuery));
};

const applyGalleryFilters = (
    artworks: Array<GalleryArtwork>,
    filters: {
        technique?: string;
        style?: string;
        search?: string;
        forSale?: boolean;
    },
) => {
    const normalizedTechnique = normalizeFilterValue(filters.technique);
    const normalizedStyle = normalizeFilterValue(filters.style);

    return artworks.filter((artwork) => {
        if (
            normalizedTechnique &&
            normalizeFilterValue(artwork.technique) !== normalizedTechnique
        ) {
            return false;
        }

        if (
            normalizedStyle &&
            normalizeFilterValue(artwork.style) !== normalizedStyle
        ) {
            return false;
        }

        if (filters.forSale && artwork.status !== 'ON_SALE') {
            return false;
        }

        return matchesSearch(artwork, filters.search);
    });
};

const dedupeGalleryArtworks = (artworks: Array<GalleryArtwork>) => {
    const byId = new Map<string, GalleryArtwork>();

    artworks.forEach((artwork) => {
        if (!artwork.id) return;
        byId.set(artwork.id, artwork);
    });

    return Array.from(byId.values()).sort((a, b) => {
        const dateA = new Date(a.publishedAt || a.createdAt || 0).getTime();
        const dateB = new Date(b.publishedAt || b.createdAt || 0).getTime();
        return dateB - dateA;
    });
};

export async function getGalleryArtworks(
    filters: {
        technique?: string;
        style?: string;
        search?: string;
        forSale?: boolean;
    },
    artistSlug?: string,
    viewer?: GalleryViewerContext,
): Promise<Array<GalleryArtwork>> {
    if (artistSlug) {
        try {
            const artist = await ArtistsService.getArtistBySlug(artistSlug);
            const artworks = filters.search
                ? await ArtworksService.searchArtworks(artistSlug, filters.search)
                : await ArtworksService.getAllPublicArtworks(artistSlug);

            return applyGalleryFilters(
                artworks.map((artwork) => ({
                    ...artwork,
                    artistSlug,
                    artistProfilePictureUrl: artist.profilePictureUrl,
                    artistName: artwork.artistName || artist.artistName,
                })),
                filters,
            );
        } catch {
            return [];
        }
    }

    const merged: Array<GalleryArtwork> = [];

    try {
        const latestArtworks = await ArtworksService.getLatestArtworks();
        if (latestArtworks.length > 0) {
            const enriched = await Promise.all(
                latestArtworks.map(async (artwork) => {
                    let artist: ArtistResponse | undefined;

                    if (artwork.artistId) {
                        try {
                            artist = await ArtistsService.getArtistById(artwork.artistId);
                        } catch {
                            artist = undefined;
                        }
                    }

                    return {
                        ...artwork,
                        artistSlug: artist?.slug,
                        artistProfilePictureUrl: artist?.profilePictureUrl,
                        artistName: artwork.artistName || artist?.artistName,
                    };
                }),
            );

            merged.push(...enriched);
        }
    } catch {
        // Keep going with authenticated fallback.
    }

    if (merged.length === 0 && viewer) {
        try {
            const myArtworks = await ArtworksService.getMyArtworks();
            merged.push(
                ...myArtworks.map((artwork) => ({
                    ...artwork,
                    artistSlug: viewer.artistSlug,
                    artistProfilePictureUrl: viewer.artistProfilePictureUrl,
                    artistName: artwork.artistName || viewer.artistName,
                })),
            );
        } catch {
            // Ignore if the deployed backend does not expose /api/artworks/me.
        }
    }

    return applyGalleryFilters(dedupeGalleryArtworks(merged), filters);
}
