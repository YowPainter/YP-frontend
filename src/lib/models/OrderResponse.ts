/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderItemResponse } from './OrderItemResponse';
export type OrderResponse = {
    id?: string;
    buyerId?: string;
    buyerName?: string;
    status?: OrderResponse.status;
    totalAmount?: number;
    shippingAddress?: string;
    createdAt?: string;
    items?: Array<OrderItemResponse>;
};
export namespace OrderResponse {
    export enum status {
        PENDING_PAYMENT = 'PENDING_PAYMENT',
        PAID = 'PAID',
        PROCESSING = 'PROCESSING',
        SHIPPED = 'SHIPPED',
        DELIVERED = 'DELIVERED',
        CANCELLED = 'CANCELLED',
        REFUNDED = 'REFUNDED',
    }
}

