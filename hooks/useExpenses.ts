import { useState, useEffect, useCallback } from 'react';
import { getExpenses, createExpense, deleteExpense } from '@/services/expense.service';
import type { Expense, CreateExpensePayload } from '@/services/expense.service';

export function useExpenses() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetch = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getExpenses();
            setExpenses(result.expenses);
            setTotal(result.total);
        } catch (e: any) {
            setError(e?.response?.data?.message ?? 'Failed to load expenses.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetch(); }, [fetch]);

    const create = useCallback(async (payload: CreateExpensePayload) => {
        try {
            const expense = await createExpense(payload);
            await fetch();
            return expense;
        } catch (e: any) {
            console.error('[useExpenses.create]', e);
            throw e;
        }
    }, [fetch]);

    const remove = useCallback(async (id: string) => {
        try {
            await deleteExpense(id);
            await fetch();
        } catch (e: any) {
            console.error('[useExpenses.remove]', e);
            throw e;
        }
    }, [fetch]);

    return { expenses, total, loading, error, refetch: fetch, createExpense: create, deleteExpense: remove };
}
