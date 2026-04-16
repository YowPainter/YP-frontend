/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaymentResponse } from '../models/PaymentResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PaymentsService {
    /**
     * Point d'entrée pour les callbacks CamPay
     * @param requestBody
     * @returns string OK
     * @throws ApiError
     */
    public static handleCampayCallback(
        requestBody: Record<string, string>,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/payment/callback',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Consulter son historique de paiements
     * @returns PaymentResponse OK
     * @throws ApiError
     */
    public static getPaymentHistory(): CancelablePromise<Array<PaymentResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/payment/history',
        });
    }
}
