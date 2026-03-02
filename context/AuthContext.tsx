import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import type { User } from '@/types/user.types';

interface AuthContextValue {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (token: string, user: User) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // On mount — restore session from SecureStore
    useEffect(() => {
        const restore = async () => {
            try {
                const storedToken = await SecureStore.getItemAsync('auth_token');
                const storedUser = await SecureStore.getItemAsync('auth_user');
                if (storedToken && storedUser) {
                    // Decode JWT payload and check expiry (no external lib needed)
                    try {
                        const payloadB64 = storedToken.split('.')[1];
                        const payloadJson = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
                        const { exp } = JSON.parse(payloadJson) as { exp?: number };
                        if (exp && exp * 1000 < Date.now()) {
                            // Token expired — wipe session silently
                            await SecureStore.deleteItemAsync('auth_token').catch(() => { });
                            await SecureStore.deleteItemAsync('auth_user').catch(() => { });
                            return; // isLoading → false via finally, user stays null
                        }
                    } catch {
                        // Malformed token — treat as unauthenticated
                        await SecureStore.deleteItemAsync('auth_token').catch(() => { });
                        await SecureStore.deleteItemAsync('auth_user').catch(() => { });
                        return;
                    }
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                }
            } catch {
                // Failed to restore — proceed as unauthenticated
            } finally {
                setIsLoading(false);
            }
        };
        restore();
    }, []);

    const login = useCallback(async (newToken: string, newUser: User) => {
        await SecureStore.setItemAsync('auth_token', newToken);
        await SecureStore.setItemAsync('auth_user', JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
    }, []);

    const logout = useCallback(async () => {
        await SecureStore.deleteItemAsync('auth_token').catch(() => { });
        await SecureStore.deleteItemAsync('auth_user').catch(() => { });
        setToken(null);
        setUser(null);
        router.replace('/login');
    }, []);

    const updateUser = useCallback((updates: Partial<User>) => {
        setUser((prev) => {
            if (!prev) return prev;
            const updated = { ...prev, ...updates };
            SecureStore.setItemAsync('auth_user', JSON.stringify(updated)).catch(() => { });
            return updated;
        });
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoading,
                isAuthenticated: !!token && !!user,
                login,
                logout,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used within <AuthProvider>');
    }
    return ctx;
}
