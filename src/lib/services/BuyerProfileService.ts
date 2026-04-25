/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BuyerProfileResponse } from '../models/BuyerProfileResponse';
import type { BuyerUpdateRequest } from '../models/BuyerUpdateRequest';
import type { UpdateProfilePictureRequest } from '../models/UpdateProfilePictureRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BuyerProfileService {
    /**
     * Récupérer le profil de l'acheteur connecté
     * @returns BuyerProfileResponse OK
     * @throws ApiError
     */
    public static getMe(): CancelablePromise<BuyerProfileResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/buyer/me',
        });
    }
    /**
     * Mettre à jour le profil de l'acheteur
     * @param requestBody
     * @returns BuyerProfileResponse OK
     * @throws ApiError
     */
    public static updateProfile(
        requestBody: BuyerUpdateRequest,
    ): CancelablePromise<BuyerProfileResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/buyer/me',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Mettre à jour la photo de profil de l'acheteur
     * @param requestBody
     * @returns BuyerProfileResponse OK
     * @throws ApiError
     */
    public static updateProfilePicture(
        requestBody: UpdateProfilePictureRequest,
    ): CancelablePromise<BuyerProfileResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/buyer/me/profile-picture',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
