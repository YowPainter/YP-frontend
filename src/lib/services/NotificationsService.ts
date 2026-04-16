/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Notification } from '../models/Notification';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class NotificationsService {
    /**
     * Tout marquer comme lu
     * @returns any OK
     * @throws ApiError
     */
    public static markAllAsRead(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/notifications/mark-all-read',
        });
    }
    /**
     * Marquer une notification comme lue
     * @param id
     * @returns any OK
     * @throws ApiError
     */
    public static markAsRead(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/notifications/{id}/read',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Lister mes notifications
     * @returns Notification OK
     * @throws ApiError
     */
    public static getMyNotifications(): CancelablePromise<Array<Notification>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/notifications',
        });
    }
}
