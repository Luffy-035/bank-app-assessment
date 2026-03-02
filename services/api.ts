import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL, API_TIMEOUT } from '@/constants/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ── Request interceptor: attach token from SecureStore
api.interceptors.request.use(
    async (config) => {
        try {
            const token = await SecureStore.getItemAsync('auth_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch {
            // SecureStore unavailable — continue without token
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ── Response interceptor: handle 401 globally
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Clear stored token — AuthContext listener will handle redirect
            await SecureStore.deleteItemAsync('auth_token').catch(() => { });
        }
        return Promise.reject(error);
    }
);

export default api;
