import api from './api';
import { ENDPOINTS } from '@/constants/api';
import type { Notification } from '@/types/maintenance.types';

export const getNotifications = async (): Promise<{
    notifications: Notification[];
    unreadCount: number;
}> => {
    const { data } = await api.get(ENDPOINTS.NOTIFICATIONS.LIST);
    return data;
};

export const sendRentReminder = async (tenantId: string, message?: string) => {
    const { data } = await api.post(ENDPOINTS.NOTIFICATIONS.REMINDER, { tenantId, message });
    return data;
};

export const markAsRead = async (id: string) => {
    const { data } = await api.patch(ENDPOINTS.NOTIFICATIONS.READ(id));
    return data;
};

export const markAllAsRead = async () => {
    const { data } = await api.patch(ENDPOINTS.NOTIFICATIONS.READ_ALL);
    return data;
};
