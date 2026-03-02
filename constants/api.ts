/**
 * API Configuration
 * BASE_URL switches based on environment.
 *
 * For physical device testing: replace LAN_IP with your computer's local IP
 * e.g. "http://192.168.1.10:5000/api/v1"
 *
 * For Android emulator: use 10.0.2.2 (maps to localhost on host machine)
 * For iOS simulator: use localhost directly
 */

const LAN_IP = process.env.EXPO_PUBLIC_API_IP ?? 'localhost'; // Set EXPO_PUBLIC_API_IP in bank-app/.env

const DEV_BASE_URL = `http://${LAN_IP}:5000/api/v1`;
const PROD_BASE_URL = 'https://api.blew.in/api/v1'; // ← Update when deployed

export const API_BASE_URL = __DEV__ ? DEV_BASE_URL : PROD_BASE_URL;

export const API_TIMEOUT = 15000; // 15 seconds

export const ENDPOINTS = {
    // Auth
    AUTH: {
        REGISTER: '/auth/register',
        LOGIN: '/auth/login',
        ME: '/auth/me',
        PUSH_TOKEN: '/auth/push-token',
        UPLOAD_SIGNATURE: '/auth/upload-signature',
    },

    // Properties
    PROPERTIES: {
        LIST: '/properties',
        DETAIL: (id: string) => `/properties/${id}`,
        UNITS: (id: string) => `/properties/${id}/units`,
    },

    // Units
    UNITS: {
        DETAIL: (id: string) => `/units/${id}`,
        UPDATE: (id: string) => `/units/${id}`,
    },

    // Tenants
    TENANTS: {
        LIST: '/tenants',
        DETAIL: (id: string) => `/tenants/${id}`,
        ME: '/tenants/me',
        MOVEOUT: (id: string) => `/tenants/${id}/moveout`,
    },

    // Payments
    PAYMENTS: {
        LIST: '/payments',
        RECORD: '/payments',
        DUES: '/payments/dues',
        BY_TENANT: (tenantId: string) => `/payments/tenant/${tenantId}`,
        UPDATE: (id: string) => `/payments/${id}`,
        EXPORT: '/payments/export',
    },

    // Dashboard
    DASHBOARD: {
        STATS: '/dashboard/stats',
        COLLECTION: '/dashboard/collection',
        ACTIVITY: '/dashboard/activity',
    },

    // Maintenance
    MAINTENANCE: {
        LIST: '/maintenance',
        DETAIL: (id: string) => `/maintenance/${id}`,
        UPDATE_STATUS: (id: string) => `/maintenance/${id}/status`,
    },

    // Notifications
    NOTIFICATIONS: {
        LIST: '/notifications',
        REMINDER: '/notifications/reminder',
        READ: (id: string) => `/notifications/${id}/read`,
        READ_ALL: '/notifications/read-all',
    },

    // Admin
    ADMIN: {
        USERS: '/admin/users',
        USER_DETAIL: (id: string) => `/admin/users/${id}`,
        MAINTENANCE: '/admin/maintenance',
        UPDATE_COMPLAINT: (id: string) => `/admin/maintenance/${id}`,
        SUMMARY: '/admin/summary',
    },
} as const;
