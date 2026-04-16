/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdministrationService {
    /**
     * Activer ou suspendre un tenant
     * @param id
     * @param status
     * @returns any OK
     * @throws ApiError
     */
    public static updateTenantStatus(
        id: string,
        status: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/admin/tenants/{id}/status',
            path: {
                'id': id,
            },
            query: {
                'status': status,
            },
        });
    }
    /**
     * Lister tous les utilisateurs de la plateforme
     * @returns any OK
     * @throws ApiError
     */
    public static getAllUsers(): CancelablePromise<Array<Record<string, any>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/users',
        });
    }
    /**
     * Lister tous les artistes / tenants enregistres
     * @returns any OK
     * @throws ApiError
     */
    public static getAllTenants(): CancelablePromise<Array<Record<string, any>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/tenants',
        });
    }
    /**
     * Statistiques globales de la plateforme
     * @returns any OK
     * @throws ApiError
     */
    public static getGlobalStats(): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/stats',
        });
    }
    /**
     * Récupérer le profil de l'administrateur connecté
     * @returns string OK
     * @throws ApiError
     */
    public static getMe1(): CancelablePromise<Record<string, string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/me',
        });
    }
    /**
     * Consulter les logs d'audit (Mock)
     * @returns string OK
     * @throws ApiError
     */
    public static getAuditLogs(): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/logs',
        });
    }
    /**
     * Supprimer definitivement un utilisateur
     * @param id
     * @returns any OK
     * @throws ApiError
     */
    public static deleteUser(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/admin/users/{id}',
            path: {
                'id': id,
            },
        });
    }
}
