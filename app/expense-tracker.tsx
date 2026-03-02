import { FontFamily } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useExpenses } from '@/hooks/useExpenses';
import type { CreateExpensePayload } from '@/services/expense.service';

const CATEGORIES = ['maintenance', 'utilities', 'insurance', 'staff', 'other'] as const;
type Category = typeof CATEGORIES[number];

const CATEGORY_COLORS: Record<Category, string> = {
    maintenance: '#1601AA',
    utilities: '#0891B2',
    insurance: '#059669',
    staff: '#9CA3AF',
    other: '#D97706',
};

export default function ExpenseTrackerScreen() {
    const { expenses, total, loading, createExpense, deleteExpense } = useExpenses();

    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [label, setLabel] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState<Category>('maintenance');
    const [incurredBy, setIncurredBy] = useState('');

    const resetForm = () => {
        setLabel('');
        setAmount('');
        setCategory('maintenance');
        setIncurredBy('');
        setSubmitting(false);
    };

    const handleAdd = async () => {
        if (!label.trim() || !amount.trim()) {
            Alert.alert('Missing Fields', 'Please enter a label and amount.');
            return;
        }
        const amt = parseFloat(amount);
        if (isNaN(amt) || amt <= 0) {
            Alert.alert('Invalid Amount', 'Please enter a valid positive amount.');
            return;
        }
        setSubmitting(true);
        try {
            const payload: CreateExpensePayload = { label: label.trim(), category, amount: amt, incurredBy: incurredBy.trim() };
            await createExpense(payload);
            setShowModal(false);
            resetForm();
        } catch (e: any) {
            Alert.alert('Error', e?.response?.data?.message ?? 'Failed to add expense.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = (id: string, label: string) => {
        Alert.alert('Delete Expense', `Remove "${label}"?`, [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => deleteExpense(id) },
        ]);
    };

    // Breakdown by category
    const maxAmount = Math.max(...expenses.map((e) => e.amount), 1);

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Expense Tracker</Text>
                <TouchableOpacity onPress={() => setShowModal(true)} style={styles.addBtn}>
                    <Ionicons name="add" size={22} color="#1601AA" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* Total Expenses Card */}
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryLabel}>Total Expenses (All Time)</Text>
                    <Text style={styles.summaryValue}>₹{total.toLocaleString('en-IN')}</Text>
                </View>

                {loading ? (
                    <ActivityIndicator color="#1601AA" style={{ marginTop: 40 }} />
                ) : expenses.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="receipt-outline" size={48} color="#D1D5DB" />
                        <Text style={styles.emptyTitle}>No Expenses Yet</Text>
                        <Text style={styles.emptySubtitle}>Tap the + button to record your first expense.</Text>
                    </View>
                ) : (
                    <>
                        {/* Expense Breakdown */}
                        <View style={styles.chartCard}>
                            <Text style={styles.chartTitle}>Expense Breakdown</Text>
                            {expenses.map((expense) => (
                                <View key={expense._id} style={styles.expenseRow}>
                                    <View style={styles.expenseLabelRow}>
                                        <Text style={styles.expenseLabel}>{expense.label}</Text>
                                        <Text style={styles.expenseAmount}>₹{expense.amount.toLocaleString('en-IN')}</Text>
                                    </View>
                                    <View style={styles.expenseBarContainer}>
                                        <View style={[styles.expenseBar, {
                                            width: `${Math.round((expense.amount / maxAmount) * 100)}%` as any,
                                            backgroundColor: CATEGORY_COLORS[expense.category] ?? '#1601AA',
                                        }]} />
                                    </View>
                                </View>
                            ))}
                        </View>

                        {/* Detailed Transactions */}
                        <Text style={styles.sectionTitle}>Detailed Transactions</Text>
                        <View style={styles.detailsList}>
                            {expenses.map((expense) => {
                                const date = new Date(expense.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
                                return (
                                    <TouchableOpacity
                                        key={expense._id}
                                        style={styles.detailCard}
                                        onLongPress={() => handleDelete(expense._id, expense.label)}
                                    >
                                        <View style={styles.detailIconWrap}>
                                            <Ionicons name="receipt-outline" size={20} color="#1601AA" />
                                        </View>
                                        <View style={styles.detailContent}>
                                            <Text style={styles.detailTitle}>{expense.label}</Text>
                                            <Text style={styles.detailIncurred}>
                                                Incurred by: <Text style={styles.detailIncurredName}>{expense.incurredBy || '—'}</Text>
                                            </Text>
                                        </View>
                                        <View style={styles.detailRight}>
                                            <Text style={styles.detailAmount}>-₹{expense.amount.toLocaleString('en-IN')}</Text>
                                            <Text style={styles.detailDate}>{date}</Text>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                        <Text style={styles.hint}>Long press a transaction to delete it.</Text>
                    </>
                )}

                <View style={{ height: 40 }} />
            </ScrollView>

            {/* Add Expense Modal */}
            <Modal visible={showModal} animationType="slide" transparent onRequestClose={() => { setShowModal(false); resetForm(); }}>
                <View style={modal.overlay}>
                    <View style={modal.sheet}>
                        <View style={modal.handle} />
                        <Text style={modal.title}>Add Expense</Text>

                        <Text style={modal.label}>Label *</Text>
                        <TextInput style={modal.input} placeholder="e.g. Plumber repair" value={label} onChangeText={setLabel} />

                        <Text style={modal.label}>Amount (₹) *</Text>
                        <TextInput style={modal.input} placeholder="0" keyboardType="numeric" value={amount} onChangeText={setAmount} />

                        <Text style={modal.label}>Category</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                            {CATEGORIES.map((c) => (
                                <TouchableOpacity
                                    key={c}
                                    onPress={() => setCategory(c)}
                                    style={[modal.chip, category === c && modal.chipActive]}
                                >
                                    <Text style={[modal.chipText, category === c && modal.chipTextActive]}>
                                        {c.charAt(0).toUpperCase() + c.slice(1)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <Text style={modal.label}>Incurred By</Text>
                        <TextInput style={modal.input} placeholder="e.g. John Manager" value={incurredBy} onChangeText={setIncurredBy} />

                        <TouchableOpacity style={modal.saveBtn} onPress={handleAdd} disabled={submitting}>
                            <Text style={modal.saveBtnText}>{submitting ? 'Saving...' : 'Save Expense'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={modal.cancelBtn} onPress={() => { setShowModal(false); resetForm(); }}>
                            <Text style={modal.cancelBtnText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 50,
        paddingHorizontal: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backBtn: { padding: 4 },
    addBtn: { padding: 4 },
    headerTitle: { fontSize: 18, fontFamily: FontFamily.interBold, color: '#111827' },
    scroll: { flex: 1 },

    summaryCard: {
        backgroundColor: '#1601AA',
        marginHorizontal: 16,
        borderRadius: 16,
        padding: 20,
        marginTop: 20,
        marginBottom: 20,
        alignItems: 'center',
    },
    summaryLabel: { fontSize: 13, fontFamily: FontFamily.lato, color: '#E0E7FF', marginBottom: 6 },
    summaryValue: { fontSize: 32, fontFamily: FontFamily.interBold, color: '#FFFFFF' },

    emptyState: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 30 },
    emptyTitle: { fontSize: 18, fontFamily: FontFamily.interBold, color: '#374151', marginTop: 16, marginBottom: 8 },
    emptySubtitle: { fontSize: 14, fontFamily: FontFamily.lato, color: '#9CA3AF', textAlign: 'center', lineHeight: 20 },

    chartCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    chartTitle: { fontSize: 16, fontFamily: FontFamily.interBold, color: '#111827', marginBottom: 16 },
    expenseRow: { marginBottom: 16 },
    expenseLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    expenseLabel: { fontSize: 13, fontFamily: FontFamily.interSemiBold, color: '#374151' },
    expenseAmount: { fontSize: 13, fontFamily: FontFamily.interBold, color: '#111827' },
    expenseBarContainer: { height: 8, backgroundColor: '#F3F4F6', borderRadius: 4, overflow: 'hidden' },
    expenseBar: { height: '100%', borderRadius: 4 },

    sectionTitle: { fontSize: 16, fontFamily: FontFamily.interBold, color: '#111827', marginHorizontal: 16, marginBottom: 12 },
    detailsList: { paddingHorizontal: 16, gap: 12 },
    detailCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    detailIconWrap: {
        width: 40, height: 40, borderRadius: 20, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center', marginRight: 12,
    },
    detailContent: { flex: 1 },
    detailTitle: { fontSize: 14, fontFamily: FontFamily.interSemiBold, color: '#111827' },
    detailIncurred: { fontSize: 11, fontFamily: FontFamily.lato, color: '#6B7280', marginTop: 2 },
    detailIncurredName: { fontFamily: FontFamily.latoSemiBold, color: '#4B5563' },
    detailRight: { alignItems: 'flex-end' },
    detailAmount: { fontSize: 14, fontFamily: FontFamily.interBold, color: '#EF4444' },
    detailDate: { fontSize: 11, fontFamily: FontFamily.lato, color: '#9CA3AF', marginTop: 2 },
    hint: { fontSize: 11, fontFamily: FontFamily.lato, color: '#D1D5DB', textAlign: 'center', marginTop: 8, marginBottom: 4 },
});

const modal = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
    sheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
    handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#E5E7EB', alignSelf: 'center', marginBottom: 20 },
    title: { fontSize: 18, fontFamily: FontFamily.interBold, color: '#111827', marginBottom: 20 },
    label: { fontSize: 13, fontFamily: FontFamily.interSemiBold, color: '#374151', marginBottom: 8 },
    input: {
        backgroundColor: '#F9FAFB', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12,
        fontFamily: FontFamily.lato, fontSize: 15, color: '#111827', borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 16,
    },
    chip: {
        paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1,
        borderColor: '#E5E7EB', marginRight: 8, backgroundColor: '#F9FAFB',
    },
    chipActive: { backgroundColor: '#1601AA', borderColor: '#1601AA' },
    chipText: { fontSize: 13, fontFamily: FontFamily.interSemiBold, color: '#374151' },
    chipTextActive: { color: '#FFFFFF' },
    saveBtn: { backgroundColor: '#1601AA', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 4, marginBottom: 8 },
    saveBtnText: { fontSize: 15, fontFamily: FontFamily.interBold, color: '#FFFFFF' },
    cancelBtn: { alignItems: 'center', paddingVertical: 10 },
    cancelBtnText: { fontSize: 14, fontFamily: FontFamily.interSemiBold, color: '#9CA3AF' },
});
