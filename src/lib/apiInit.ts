import { OpenAPI } from './core/OpenAPI';
import { useAuthStore } from '@/store/authStore';

export function initializeApi() {
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
