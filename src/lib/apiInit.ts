import { OpenAPI } from './core/OpenAPI';
import { useAuthStore } from '@/store/authStore';

export function initializeApi() {
    OpenAPI.BASE = process.env.NEXT_PUBLIC_API_URL || 'https://yowpainter-backend.onrender.com';
    
    // Set TOKEN resolver to return an empty string if no token.
    // request.ts checks isStringWithValue(token), so '' will omit the header.
    OpenAPI.TOKEN = async () => {
        const token = useAuthStore.getState().token;
        return token || '';
    };
}
