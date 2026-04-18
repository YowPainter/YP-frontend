import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthResponse } from '@/lib/models/AuthResponse';
import { AuthenticationService } from '@/lib/services/AuthenticationService';
import { ArtistsService } from '@/lib/services/ArtistsService';
import { BuyerProfileService } from '@/lib/services/BuyerProfileService';
import { LoginRequest } from '@/lib/models/LoginRequest';
import { RegisterRequest } from '@/lib/models/RegisterRequest';
import { OpenAPI } from '@/lib/core/OpenAPI';

/** Returns the dashboard path based on the user role */
export function getDashboardRoute(role?: string): string {
    if (role === 'ROLE_ARTIST') return '/artdashboard';
    return '/amadashboard';
}

export interface ExtendedAuthResponse extends AuthResponse {
    id?: string;
    slug?: string;
    bio?: string;
}

interface AuthState {
    user: ExtendedAuthResponse | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (credentials: LoginRequest) => Promise<AuthResponse>;
    register: (data: RegisterRequest) => Promise<AuthResponse>;
    refreshProfile: () => Promise<void>;
    setAuth: (response: AuthResponse) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            login: async (credentials) => {
                const response = await AuthenticationService.login(credentials);
                set({
                    user: response,
                    token: response.accessToken || null,
                    isAuthenticated: !!response.accessToken,
                });
                // Fetch full profile after login
                if (response.accessToken) {
                    // Allow OpenAPI to pick up the token
                    OpenAPI.TOKEN = response.accessToken;
                    try {
                        await get().refreshProfile();
                    } catch (e) {
                        console.warn('Could not refresh profile after login:', e);
                    }
                }
                return get().user as AuthResponse;
            },

            register: async (data) => {
                const response = await AuthenticationService.register(data);
                set({
                    user: response,
                    token: response.accessToken || null,
                    isAuthenticated: !!response.accessToken,
                });
                // Fetch full profile after registration
                if (response.accessToken) {
                    OpenAPI.TOKEN = response.accessToken;
                    try {
                        await get().refreshProfile();
                    } catch (e) {
                        console.warn('Could not refresh profile after registration:', e);
                    }
                }
                return response;
            },

            refreshProfile: async () => {
                const { user } = get();
                if (!user) return;

                try {
                    if (user.role === 'ROLE_ARTIST') {
                        const profile = await ArtistsService.getMyProfile();
                        set((state) => ({
                            user: {
                                ...state.user,
                                id: profile.id ?? state.user?.id,
                                firstName: profile.firstName ?? state.user?.firstName,
                                lastName: profile.lastName ?? state.user?.lastName,
                                profilePictureUrl: profile.profilePictureUrl ?? state.user?.profilePictureUrl,
                                artistName: profile.artistName ?? state.user?.artistName,
                                bio: profile.bio ?? state.user?.bio,
                                slug: profile.slug ?? (state.user as any)?.slug,
                            },
                        }));
                    } else {
                        const profile = await BuyerProfileService.getMe();
                        set((state) => ({
                            user: {
                                ...state.user,
                                id: profile.id ?? state.user?.id,
                                firstName: profile.firstName ?? state.user?.firstName,
                                lastName: profile.lastName ?? state.user?.lastName,
                                profilePictureUrl: profile.profilePictureUrl ?? state.user?.profilePictureUrl,
                                bio: profile.bio ?? state.user?.bio,
                            },
                        }));
                    }
                } catch (e) {
                    console.warn('refreshProfile failed:', e);
                }
            },

            setAuth: (response) => {
                set({
                    user: response,
                    token: response.accessToken || null,
                    isAuthenticated: !!response.accessToken,
                });
            },

            logout: () => {
                OpenAPI.TOKEN = undefined;
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                });
            },
        }),
        {
            name: 'yowpainter-auth',
            onRehydrateStorage: () => (state) => {
                // Restore OpenAPI.TOKEN when Zustand rehydrates from localStorage
                if (state?.token) {
                    OpenAPI.TOKEN = state.token;
                }
            },
        }
    )
);

