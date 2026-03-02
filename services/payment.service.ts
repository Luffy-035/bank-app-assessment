import api from './api';
import { ENDPOINTS } from '@/constants/api';
import type { Payment, DueSummary, RecordPaymentPayload } from '@/types/payment.types';

export const getPayments = async (params?: {
    tenantId?: string;
    month?: string;
    propertyId?: string;
    status?: string;
    page?: number;
    limit?: number;
}): Promise<Payment[]> => {
    const { data } = await api.get(ENDPOINTS.PAYMENTS.LIST, { params });
    return data.payments ?? data;
};

export const getDues = async (): Promise<DueSummary[]> => {
    const { data } = await api.get(ENDPOINTS.PAYMENTS.DUES);
    return data.dues ?? data;
};

export const getPaymentsByTenant = async (tenantId: string): Promise<Payment[]> => {
    const { data } = await api.get(ENDPOINTS.PAYMENTS.BY_TENANT(tenantId));
    return data.payments ?? data;
};

export const recordPayment = async (payload: RecordPaymentPayload): Promise<Payment> => {
    const { data } = await api.post(ENDPOINTS.PAYMENTS.RECORD, payload);
    return data.payment ?? data;
};

export const updatePayment = async (id: string, payload: Partial<RecordPaymentPayload>): Promise<Payment> => {
    const { data } = await api.patch(ENDPOINTS.PAYMENTS.UPDATE(id), payload);
    return data.payment ?? data;
};

export const exportPayments = async (params: {
    format: 'csv' | 'pdf';
    month?: string;
    propertyId?: string;
}) => {
    const response = await api.get(ENDPOINTS.PAYMENTS.EXPORT, {
        params,
        responseType: 'blob',
    });
    return response;
};
