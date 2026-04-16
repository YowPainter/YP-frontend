/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminRegisterRequest } from '../models/AdminRegisterRequest';
import type { AuthResponse } from '../models/AuthResponse';
import type { LoginRequest } from '../models/LoginRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminAuthenticationService {
    /**
     * Inscription d'un nouvel Administrateur (Restreint)
     * @param requestBody
     * @returns AuthResponse OK
     * @throws ApiError
     */
    public static register1(
        requestBody: AdminRegisterRequest,
    ): CancelablePromise<AuthResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/auth/register',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Connexion Administrateur
     * @param requestBody
     * @returns AuthResponse OK
     * @throws ApiError
     */
    public static login1(
        requestBody: LoginRequest,
    ): CancelablePromise<AuthResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/auth/login',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
