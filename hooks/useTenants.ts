import { useState, useEffect, useCallback } from 'react';
import { getTenants, addTenant } from '@/services/tenant.service';
import type { Tenant, AddTenantPayload } from '@/types/tenant.types';

export function useTenants(params?: { propertyId?: string; status?: string }) {
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetch = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getTenants(params);
            setTenants(data);
        } catch (e: any) {
            setError(e?.response?.data?.message ?? 'Failed to load tenants.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetch(); }, [fetch]);

    const create = useCallback(async (payload: AddTenantPayload) => {
        try {
            const result = await addTenant(payload);
            await fetch();
            return result;
        } catch (e: any) {
            console.error('[useTenants.create]', e);
            throw e;
        }
    }, [fetch]);

    return { tenants, loading, error, refetch: fetch, addTenant: create };
}
