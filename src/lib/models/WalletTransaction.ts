/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Wallet } from './Wallet';
export type WalletTransaction = {
    id?: string;
    wallet?: Wallet;
    amount?: number;
    type?: WalletTransaction.type;
    referenceId?: string;
    description?: string;
    createdAt?: string;
};
export namespace WalletTransaction {
    export enum type {
        SALE = 'SALE',
        WITHDRAWAL = 'WITHDRAWAL',
        COMMISSION = 'COMMISSION',
    }
}

