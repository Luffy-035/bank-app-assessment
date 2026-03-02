import { useState, useEffect, useCallback } from 'react';
import { getPayments, getDues, recordPayment } from '@/services/payment.service';
import type { Payment, DueSummary, RecordPaymentPayload } from '@/types/payment.types';

export function usePayments(params?: { tenantId?: string; month?: string; status?: string }) {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [dues, setDues] = useState<DueSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetch = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [p, d] = await Promise.all([getPayments(params), getDues()]);
            setPayments(p);
            setDues(d);
        } catch (e: any) {
            setError(e?.response?.data?.message ?? 'Failed to load payments.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetch(); }, [fetch]);

    const record = useCallback(async (payload: RecordPaymentPayload) => {
        try {
            const result = await recordPayment(payload);
            await fetch();
            return result;
        } catch (e: any) {
            console.error('[usePayments.record]', e);
            throw e;
        }
    }, [fetch]);

    return { payments, dues, loading, error, refetch: fetch, recordPayment: record };
}
