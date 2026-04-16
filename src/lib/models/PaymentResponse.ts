/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PaymentResponse = {
    id?: string;
    referenceId?: string;
    referenceType?: string;
    amount?: number;
    currency?: string;
    status?: PaymentResponse.status;
    createdAt?: string;
};
export namespace PaymentResponse {
    export enum status {
        PENDING = 'PENDING',
        SUCCEEDED = 'SUCCEEDED',
        FAILED = 'FAILED',
        REFUNDED = 'REFUNDED',
    }
}

