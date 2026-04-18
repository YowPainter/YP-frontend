/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Wallet } from '../models/Wallet';
import type { WalletTransaction } from '../models/WalletTransaction';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WalletPayoutService {
    /**
     * Demander un virement Mobile Money de ses gains
     * @param amount
     * @returns string OK
     * @throws ApiError
     */
    public static requestPayout(
        amount: number,
    ): CancelablePromise<Record<string, string>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/wallet/withdraw',
            query: {
                'amount': amount,
            },
        });
    }
    /**
     * Configurer ses informations de retrait (Mobile Money)
     * @param phoneNumber
     * @param network
     * @returns any OK
     * @throws ApiError
     */
    public static updatePayoutSettings(
        phoneNumber: string,
        network: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/wallet/settings/payout',
            query: {
                'phoneNumber': phoneNumber,
                'network': network,
            },
        });
    }
    /**
     * Consulter l'historique des transactions financières
     * @returns WalletTransaction OK
     * @throws ApiError
     */
    public static getTransactionHistory(): CancelablePromise<Array<WalletTransaction>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/wallet/transactions',
        });
    }
    /**
     * Consulter son solde actuel (Artiste)
     * @returns Wallet OK
     * @throws ApiError
     */
    public static getBalance(): CancelablePromise<Wallet> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/wallet/balance',
        });
    }
}
