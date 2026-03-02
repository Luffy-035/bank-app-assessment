import api from './api';
import { ENDPOINTS } from '@/constants/api';
import type { Tenant, AddTenantPayload } from '@/types/tenant.types';

export const getTenants = async (params?: {
    propertyId?: string;
    status?: string;
    search?: string;
}): Promise<Tenant[]> => {
    const { data } = await api.get(ENDPOINTS.TENANTS.LIST, { params });
    return data.tenants ?? data;
};

export const getTenant = async (id: string): Promise<Tenant> => {
    const { data } = await api.get(ENDPOINTS.TENANTS.DETAIL(id));
    return data.tenant ?? data;
};

export const getMyTenantProfile = async (): Promise<Tenant> => {
    const { data } = await api.get(ENDPOINTS.TENANTS.ME);
    return data.tenant ?? data;
};

export const addTenant = async (payload: AddTenantPayload): Promise<{
    tenant: Tenant;
    tenantId: string;
}> => {
    const { data } = await api.post(ENDPOINTS.TENANTS.LIST, payload);
    return data;
};

export const updateTenant = async (id: string, payload: Partial<AddTenantPayload>): Promise<Tenant> => {
    const { data } = await api.patch(ENDPOINTS.TENANTS.DETAIL(id), payload);
    return data.tenant ?? data;
};

export const moveTenantOut = async (id: string): Promise<void> => {
    await api.patch(ENDPOINTS.TENANTS.MOVEOUT(id));
};
