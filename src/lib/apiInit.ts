"use client";

import { OpenAPI } from './core/OpenAPI';

/**
 * Initialise le client API.
 * On évite d'importer useAuthStore ici pour ne pas créer de cycles de dépendances
 * ou de problèmes de chunks SSR avec Turbopack.
 */
export function initializeApi() {
    if (typeof window === 'undefined') return;
    
    OpenAPI.BASE = process.env.NEXT_PUBLIC_API_URL || 'https://yowpainter-backend.onrender.com';
    
    // Injection dynamique du token (sécurisée pour le SSR)
    OpenAPI.TOKEN = async () => {
        if (typeof window !== 'undefined') {
            try {
                const storage = localStorage.getItem('yowpainter-auth');
                if (storage) {
                    const parsed = JSON.parse(storage);
                    return parsed.state?.token || '';
                }
            } catch (e) {
                console.warn('Failed to parse auth storage', e);
            }
        }
        return '';
    };

    // Injection dynamique du header Tenant
    OpenAPI.HEADERS = async (): Promise<Record<string, string>> => {
        if (typeof window !== 'undefined') {
            const tenantSlug = localStorage.getItem('currentTenantSlug');
            if (tenantSlug) {
                return { 'X-Tenant-ID': tenantSlug };
            }
        }
        return {};
    };
}
