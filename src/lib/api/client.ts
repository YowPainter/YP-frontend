// src/lib/api/client.ts
import axios from 'axios';

// Configuration de base
const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Intercepteur pour ajouter le token JWT
apiClient.interceptors.request.use(
    (config) => {
        // Récupérer le token du localStorage ou des cookies
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Intercepteur pour gérer les erreurs et le refresh token
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Si erreur 401 et pas déjà retenté
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Tenter de rafraîchir le token
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
                    refreshToken,
                });

                const { token, refreshToken: newRefreshToken } = response.data;
                localStorage.setItem('token', token);
                localStorage.setItem('refreshToken', newRefreshToken);

                // Réessayer la requête originale
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                // Refresh failed, redirect to login
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;