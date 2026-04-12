// src/lib/hooks/useSession.ts
'use client';

import { useState, useEffect } from 'react';

interface User {
    id: string;
    email: string;
    name: string;
    role: 'ROLE_BUYER' | 'ROLE_ARTIST' | 'ROLE_ADMIN';
    tenantId?: string;
    artistId?: string;
    artistName?: string;
}

interface Session {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (token: string, refreshToken: string) => void;
    logout: () => void;
}

// Fonction pour décoder le JWT (sans installer jwt-decode)
function decodeJWT(token: string): any {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Erreur décodage JWT:', error);
        return null;
    }
}

export function useSession(): Session {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Récupérer le token du localStorage
        const token = localStorage.getItem('token');

        if (token) {
            try {
                const decoded = decodeJWT(token);

                // Transformer les données du JWT en objet User
                const userData: User = {
                    id: decoded.sub || decoded.userId || decoded.id,
                    email: decoded.email,
                    name: decoded.name || decoded.userName || decoded.email?.split('@')[0],
                    role: decoded.role || decoded.roles?.[0] || 'ROLE_BUYER',
                    tenantId: decoded.tenantId,
                    artistId: decoded.artistId,
                    artistName: decoded.artistName,
                };

                setUser(userData);
            } catch (error) {
                console.error('Erreur parsing token:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                setUser(null);
            }
        } else {
            // MOCK MODE : Pour tester sans page login implémentée
            setUser({
                id: 'mock-user-123',
                email: 'test@yowpainter.com',
                name: 'Visiteur Test',
                role: 'ROLE_BUYER'
            });
        }

        setLoading(false);
    }, []);

    const login = (token: string, refreshToken: string) => {
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);

        const decoded = decodeJWT(token);
        const userData: User = {
            id: decoded.sub || decoded.userId || decoded.id,
            email: decoded.email,
            name: decoded.name || decoded.userName || decoded.email?.split('@')[0],
            role: decoded.role || decoded.roles?.[0] || 'ROLE_BUYER',
            tenantId: decoded.tenantId,
            artistId: decoded.artistId,
            artistName: decoded.artistName,
        };

        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setUser(null);
        window.location.href = '/';
    };

    return {
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
    };
}