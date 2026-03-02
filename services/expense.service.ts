import api from './api';

export interface Expense {
    _id: string;
    landlordId: string;
    label: string;
    category: 'maintenance' | 'utilities' | 'insurance' | 'staff' | 'other';
    amount: number;
    incurredBy: string;
    date: string;
    createdAt: string;
}

export interface CreateExpensePayload {
    label: string;
    category: Expense['category'];
    amount: number;
    incurredBy?: string;
    date?: string;
}

export const getExpenses = async (params?: { category?: string; month?: string }): Promise<{ expenses: Expense[]; total: number }> => {
    const { data } = await api.get('/expenses', { params });
    return { expenses: data.expenses ?? [], total: data.total ?? 0 };
};

export const createExpense = async (payload: CreateExpensePayload): Promise<Expense> => {
    const { data } = await api.post('/expenses', payload);
    return data.expense;
};

export const deleteExpense = async (id: string): Promise<void> => {
    await api.delete(`/expenses/${id}`);
};
