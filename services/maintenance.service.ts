import api from './api';
import { ENDPOINTS } from '@/constants/api';
import type { MaintenanceRequest, RaiseRequestPayload, UpdateStatusPayload } from '@/types/maintenance.types';

export const getRequests = async (params?: {
    status?: string;
    propertyId?: string;
    category?: string;
}): Promise<MaintenanceRequest[]> => {
    const { data } = await api.get(ENDPOINTS.MAINTENANCE.LIST, { params });
    return data.requests ?? data;
};

export const getRequest = async (id: string): Promise<MaintenanceRequest> => {
    const { data } = await api.get(ENDPOINTS.MAINTENANCE.DETAIL(id));
    return data.request ?? data;
};

export const raiseRequest = async (payload: RaiseRequestPayload): Promise<MaintenanceRequest> => {
    const { data } = await api.post(ENDPOINTS.MAINTENANCE.LIST, payload);
    return data.request ?? data;
};

export const updateRequestStatus = async (
    id: string,
    payload: UpdateStatusPayload
): Promise<MaintenanceRequest> => {
    const { data } = await api.patch(ENDPOINTS.MAINTENANCE.UPDATE_STATUS(id), payload);
    return data.request ?? data;
};
