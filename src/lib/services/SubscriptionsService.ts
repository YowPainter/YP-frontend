/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Subscription } from '../models/Subscription';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SubscriptionsService {
    /**
     * Initier le paiement Mobile Money pour un forfait
     * @param plan
     * @param phoneNumber
     * @returns string OK
     * @throws ApiError
     */
    public static checkoutUpgrade(
        plan: 'FREE' | 'PRO' | 'ELITE',
        phoneNumber: string,
    ): CancelablePromise<Record<string, string>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/subscription/upgrade/checkout',
            query: {
                'plan': plan,
                'phoneNumber': phoneNumber,
            },
        });
    }
    /**
     * Lister les forfaits disponibles
     * @returns any OK
     * @throws ApiError
     */
    public static getPlans(): CancelablePromise<Array<Record<string, any>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/subscription/plans',
        });
    }
    /**
     * Consulter mon forfait actuel
     * @returns Subscription OK
     * @throws ApiError
     */
    public static getMyPlan(): CancelablePromise<Subscription> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/subscription/my-plan',
        });
    }
    /**
     * Resilier son abonnement
     * @returns any OK
     * @throws ApiError
     */
    public static cancelSubscription(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/subscription/cancel',
        });
    }
}
