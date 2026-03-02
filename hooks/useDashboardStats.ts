import { useState, useEffect, useCallback } from 'react';
import { getDashboardStats } from '@/services/dashboard.service';
import type { DashboardStats } from '@/services/dashboard.service';

export function useDashboardStats() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetch = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const s = await getDashboardStats();
            setStats(s);
        } catch (e: any) {
            setError(e?.response?.data?.message ?? 'Failed to load dashboard stats.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetch(); }, [fetch]);

    return { stats, loading, error, refetch: fetch };
}
