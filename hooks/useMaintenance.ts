import { useState, useEffect, useCallback } from 'react';
import { getRequests, raiseRequest as raiseRequestService, updateRequestStatus } from '@/services/maintenance.service';
import type { MaintenanceRequest, RaiseRequestPayload, UpdateStatusPayload } from '@/types/maintenance.types';

export function useMaintenance(params?: { status?: string; propertyId?: string }) {
    const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetch = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getRequests(params);
            setRequests(data);
        } catch (e: any) {
            setError(e?.response?.data?.message ?? 'Failed to load maintenance requests.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetch(); }, [fetch]);

    const updateStatus = useCallback(async (id: string, payload: UpdateStatusPayload) => {
        try {
            const updated = await updateRequestStatus(id, payload);
            setRequests((prev) => prev.map((r) => (r._id === id ? updated : r)));
            return updated;
        } catch (e: any) {
            console.error('[useMaintenance.updateStatus]', e);
            throw e;
        }
    }, []);

    const raiseRequest = useCallback(async (payload: RaiseRequestPayload) => {
        try {
            const created = await raiseRequestService(payload);
            setRequests((prev) => [...prev, created]);
            return created;
        } catch (e: any) {
            console.error('[useMaintenance.raiseRequest]', e);
            throw e;
        }
    }, []);

    return { requests, loading, error, refetch: fetch, updateStatus, raiseRequest };
}
