/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ArtistAnalyticsResponse } from '../models/ArtistAnalyticsResponse';
import type { ArtistResponse } from '../models/ArtistResponse';
import type { ArtistUpdateRequest } from '../models/ArtistUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ArtistsService {
    /**
     * Recuperer mon propre profil (Artiste connecte)
     * @returns ArtistResponse OK
     * @throws ApiError
     */
    public static getMyProfile(): CancelablePromise<ArtistResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/artist/me',
        });
    }
    /**
     * Mettre a jour mon profil artiste
     * @param requestBody
     * @returns ArtistResponse OK
     * @throws ApiError
     */
    public static updateMyProfile(
        requestBody: ArtistUpdateRequest,
    ): CancelablePromise<ArtistResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/artist/me',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Recuperer le profil public d'un artiste par son slug
     * @param slug
     * @returns ArtistResponse OK
     * @throws ApiError
     */
    public static getArtistBySlug(
        slug: string,
    ): CancelablePromise<ArtistResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/public/artists/{slug}',
            path: {
                'slug': slug,
            },
        });
    }
    /**
     * Rechercher des artistes par nom ou slug
     * @param q
     * @returns ArtistResponse OK
     * @throws ApiError
     */
    public static searchArtists(
        q: string,
    ): CancelablePromise<Array<ArtistResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/public/artists/search',
            query: {
                'q': q,
            },
        });
    }
    /**
     * Recuperer un artiste par son ID
     * @param id
     * @returns ArtistResponse OK
     * @throws ApiError
     */
    public static getArtistById(
        id: string,
    ): CancelablePromise<ArtistResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/public/artists/id/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Recuperer les statistiques de mon dashboard
     * @returns ArtistAnalyticsResponse OK
     * @throws ApiError
     */
    public static getMyAnalytics(): CancelablePromise<ArtistAnalyticsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/artist/me/analytics',
        });
    }
}
