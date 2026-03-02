import { useState, useEffect, useCallback } from 'react';
import { getProperties, addProperty } from '@/services/property.service';
import type { Property, AddPropertyPayload } from '@/types/property.types';

export function useProperties() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetch = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getProperties();
            setProperties(data);
        } catch (e: any) {
            setError(e?.response?.data?.message ?? 'Failed to load properties.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetch(); }, [fetch]);

    const create = useCallback(async (payload: AddPropertyPayload) => {
        try {
            const newProp = await addProperty(payload);
            setProperties((prev) => [...prev, newProp]);
            return newProp;
        } catch (e: any) {
            console.error('[useProperties.create]', e);
            throw e;
        }
    }, []);

    return { properties, loading, error, refetch: fetch, addProperty: create };
}
