"use client";

import { OpenAPI } from './core/OpenAPI';

/**
 * Initialise le client API.
 * On évite d'importer useAuthStore ici pour ne pas créer de cycles de dépendances
 * ou de problèmes de chunks SSR avec Turbopack.
 */
/** Simple JWT decoder to check expiration */
function isTokenExpired(token: string): boolean {
    try {
        const payloadBase64 = token.split('.')[1];
        if (!payloadBase64) return true;

        const payload = JSON.parse(atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/')));
        const exp = payload.exp;

        if (!exp) return false; // If no exp, assume it's valid

        // Expired if current time + 30s margin is greater than expiration time
        const currentTime = Math.floor(Date.now() / 1000);
        return (currentTime + 30) >= exp;
    } catch (e) {
        console.error('Error decoding token:', e);
        return true; // Assume expired if decoding fails
    }
}

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
                    let token = parsed.state?.token || '';

                    // Si le token est expiré, on tente de le rafraîchir
                    if (token && isTokenExpired(token)) {
                        try {
                            // Import dynamique pour éviter les cycles de dépendances
                            const { useAuthStore } = await import('@/store/authStore');
                            const refreshedToken = await useAuthStore.getState().refreshAccessToken();
                            if (refreshedToken) {
                                token = refreshedToken;
                            }
                        } catch (refreshError) {
                            console.error('API Init: Failed to auto-refresh token', refreshError);
                        }
                    }
                    
                    return token;
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
