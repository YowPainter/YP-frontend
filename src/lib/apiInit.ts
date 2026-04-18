import { OpenAPI } from './core/OpenAPI';
import { useAuthStore } from '@/store/authStore';

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
    OpenAPI.BASE = process.env.NEXT_PUBLIC_API_URL || 'https://yowpainter-backend.onrender.com';
    
    // Set TOKEN resolver to handle proactive refresh
    OpenAPI.TOKEN = async () => {
        const { token, refreshAccessToken } = useAuthStore.getState();
        
        if (token && isTokenExpired(token)) {
            console.log('Token expired or expiring soon, refreshing...');
            const newToken = await refreshAccessToken();
            return newToken || '';
        }

        return token || '';
    };
}
