/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderCreateRequest } from '../models/OrderCreateRequest';
import type { OrderResponse } from '../models/OrderResponse';
import type { ProductCreateRequest } from '../models/ProductCreateRequest';
import type { ProductResponse } from '../models/ProductResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ShopOrdersService {
    /**
     * Passer une commande dans une boutique spécifique
     * @param artistSlug
     * @param requestBody
     * @returns OrderResponse OK
     * @throws ApiError
     */
    public static placeOrder(
        artistSlug: string,
        requestBody: OrderCreateRequest,
    ): CancelablePromise<OrderResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/shop/v1/public/{artistSlug}/orders',
            path: {
                'artistSlug': artistSlug,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Mettre un produit / oeuvre en vente (Artiste)
     * @param requestBody
     * @returns ProductResponse OK
     * @throws ApiError
     */
    public static createProduct(
        requestBody: ProductCreateRequest,
    ): CancelablePromise<ProductResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/shop/products',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Initier le paiement Mobile Money (MOMO/Orange) pour une commande
     * @param id
     * @param phoneNumber
     * @returns string OK
     * @throws ApiError
     */
    public static checkoutOrder(
        id: string,
        phoneNumber: string,
    ): CancelablePromise<Record<string, string>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/shop/orders/{id}/checkout',
            path: {
                'id': id,
            },
            query: {
                'phoneNumber': phoneNumber,
            },
        });
    }
    /**
     * Mettre a jour le statut d'une commande (SHIPPED, DELIVERED...)
     * @param id
     * @param status
     * @returns any OK
     * @throws ApiError
     */
    public static updateOrderStatus(
        id: string,
        status: 'PENDING_PAYMENT' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED',
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/shop/orders/{id}/status',
            path: {
                'id': id,
            },
            query: {
                'status': status,
            },
        });
    }
    /**
     * Lister le catalogue de ventes d'une boutique (tenant spécifique)
     * @param artistSlug
     * @returns ProductResponse OK
     * @throws ApiError
     */
    public static getProductsByArtist(
        artistSlug: string,
    ): CancelablePromise<Array<ProductResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/shop/v1/public/{artistSlug}/products',
            path: {
                'artistSlug': artistSlug,
            },
        });
    }
    /**
     * Lister tous les produits en vente sur la plateforme (tous artistes confondus)
     * @returns ProductResponse OK
     * @throws ApiError
     */
    public static getGlobalProducts(): CancelablePromise<Array<ProductResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/shop/v1/public/products',
        });
    }
    /**
     * Details d'une commande
     * @param id
     * @returns OrderResponse OK
     * @throws ApiError
     */
    public static getOrderById(
        id: string,
    ): CancelablePromise<OrderResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/shop/orders/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Lister les commandes RECUES (Artiste)
     * @returns OrderResponse OK
     * @throws ApiError
     */
    public static getMySales(): CancelablePromise<Array<OrderResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/shop/orders/my-sales',
        });
    }
    /**
     * Lister mes commandes PASSEES (Acheteur)
     * @returns OrderResponse OK
     * @throws ApiError
     */
    public static getMyPurchases(): CancelablePromise<Array<OrderResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/shop/orders/my-purchases',
        });
    }
    /**
     * Consulter son inventaire de produits (Artiste)
     * @returns ProductResponse OK
     * @throws ApiError
     */
    public static getInventory(): CancelablePromise<Array<ProductResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/shop/inventory',
        });
    }
}
