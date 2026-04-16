/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GlobalSearchResponse } from '../models/GlobalSearchResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class GlobalSearchService {
    /**
     * Suggestions d'autocompletion
     * @param q
     * @returns string OK
     * @throws ApiError
     */
    public static getSuggestions(
        q: string,
    ): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/public/search/suggestions',
            query: {
                'q': q,
            },
        });
    }
    /**
     * Recherche globale (Artistes + Oeuvres + Evenements)
     * @param q
     * @returns GlobalSearchResponse OK
     * @throws ApiError
     */
    public static globalSearch(
        q: string,
    ): CancelablePromise<GlobalSearchResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/public/search/global',
            query: {
                'q': q,
            },
        });
    }
}
