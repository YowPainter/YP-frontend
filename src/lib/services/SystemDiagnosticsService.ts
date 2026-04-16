/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SystemDiagnosticsService {
    /**
     * Recuperer la version du build
     * @returns string OK
     * @throws ApiError
     */
    public static version(): CancelablePromise<Record<string, string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/system/version',
        });
    }
    /**
     * Ping simple pour test de latence
     * @returns string OK
     * @throws ApiError
     */
    public static ping(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/system/ping',
        });
    }
    /**
     * Recuperer des metriques de base (JVM)
     * @returns any OK
     * @throws ApiError
     */
    public static metrics(): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/system/metrics',
        });
    }
    /**
     * Verifie la sante du systeme
     * @returns string OK
     * @throws ApiError
     */
    public static health(): CancelablePromise<Record<string, string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/system/health',
        });
    }
}
