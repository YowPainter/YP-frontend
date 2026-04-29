"use client";

import { useAuthStore } from '@/store/authStore';
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
    
    // Public GET routes must not carry the artist token, otherwise the backend
    // can resolve the tenant from JWT before applying the public slug route.
    OpenAPI.TOKEN = async (options) => {
        const isPublicRead =
            options.method === 'GET' &&
            (options.url.startsWith('/api/public/') || options.url.startsWith('/api/v1/public/'));

        if (isPublicRead) {
            return '';
        }

        const token = useAuthStore.getState().token;
        return token || '';
    };
}
