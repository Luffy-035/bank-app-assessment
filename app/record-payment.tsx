import { FontFamily } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { usePayments } from '@/hooks/usePayments';
import type { RecordPaymentPayload } from '@/types/payment.types';

type PaymentMode = 'cash' | 'upi' | 'cheque' | 'bank_transfer' | 'other';

const PAYMENT_MODES: { key: PaymentMode; label: string; icon: string }[] = [
    { key: 'cash', label: 'Cash', icon: '💵' },
    { key: 'upi', label: 'UPI', icon: '📱' },
    { key: 'cheque', label: 'Cheque', icon: '📝' },
    { key: 'bank_transfer', label: 'Bank Transfer', icon: '🏦' },
    { key: 'other', label: 'Other', icon: '📋' },
];

export default function RecordPaymentScreen() {
    const { tenantId, tenantDisplayId, name } = useLocalSearchParams<{
        tenantId: string;
        tenantDisplayId: string;
        name: string;
    }>();

    const { dues, recordPayment } = usePayments();

    const now = new Date();
    const [rentDue, setRentDue] = useState('');
    const [amountPaid, setAmountPaid] = useState('');
    const [paymentMode, setPaymentMode] = useState<PaymentMode>('cash');
    const [notes, setNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Pre-fill rent due from the dues list
    useEffect(() => {
        if (!dues || !tenantId) return;
        const due = dues.find((d: any) => {
            const tid = typeof d.tenant === 'object' ? d.tenant?._id : d.tenantId;
            return tid === tenantId;
        });
        if (due) {
            setRentDue(String(due.rentDue));
            setAmountPaid(String(due.balance > 0 ? due.balance : due.rentDue));
        }
    }, [dues, tenantId]);

    const balance = (Number(rentDue) || 0) - (Number(amountPaid) || 0);

    const handleSubmit = async () => {
        const rentDueNum = Number(rentDue);
        const amountPaidNum = Number(amountPaid);
        if (!tenantId) { Alert.alert('Error', 'No tenant ID provided.'); return; }
        if (!rentDueNum || rentDueNum <= 0) { Alert.alert('Validation', 'Please enter a valid Rent Due amount.'); return; }
        if (!amountPaidNum || amountPaidNum <= 0) { Alert.alert('Validation', 'Please enter a valid Amount Paid.'); return; }

        setSubmitting(true);
        try {
            const payload: RecordPaymentPayload = {
                tenantId,
                month: now.getMonth() + 1,
                year: now.getFullYear(),
                rentDue: rentDueNum,
                amountPaid: amountPaidNum,
                paymentMode,
                paymentDate: new Date().toISOString(),
                notes,
            };
            await recordPayment(payload);
            Alert.alert('Success', `Payment of ₹${amountPaidNum.toLocaleString('en-IN')} recorded for ${name ?? tenantDisplayId}.`, [
                { text: 'OK', onPress: () => router.back() },
            ]);
        } catch (e: any) {
            Alert.alert('Error', e?.response?.data?.message ?? 'Failed to record payment. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Record Payment</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* Tenant Info */}
                {(name || tenantDisplayId) && (
                    <View style={styles.tenantCard}>
                        <View style={styles.tenantAvatar}>
                            <Text style={styles.tenantAvatarText}>
                                {(name ?? tenantDisplayId ?? 'T').trim().split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)}
                            </Text>
                        </View>
                        <View>
                            <Text style={styles.tenantName}>{name ?? 'Tenant'}</Text>
                            <Text style={styles.tenantId}>{tenantDisplayId}</Text>
                        </View>
                    </View>
                )}

                {/* Period */}
                <View style={styles.periodCard}>
                    <Ionicons name="calendar-outline" size={18} color="#1601AA" />
                    <Text style={styles.periodText}>
                        {now.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                    </Text>
                </View>

                {/* Summary Card */}
                <View style={styles.summaryCard}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Rent Due</Text>
                        <Text style={styles.summaryAmount}>₹{(Number(rentDue) || 0).toLocaleString('en-IN')}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <View style={styles.deductRow}>
                            <View style={styles.minusCircle}><Text style={styles.minusText}>−</Text></View>
                            <Text style={styles.summaryLabel}>Amount Paid</Text>
                        </View>
                        <Text style={styles.paidAmount}>₹{(Number(amountPaid) || 0).toLocaleString('en-IN')}</Text>
                    </View>
                    <View style={styles.dashedDivider} />
                    <View style={styles.summaryRow}>
                        <View style={styles.deductRow}>
                            <View style={styles.equalsCircle}><Text style={styles.equalsText}>=</Text></View>
                            <Text style={styles.dueLabel}>Balance Due</Text>
                        </View>
                        <Text style={[styles.dueAmount, { color: balance <= 0 ? '#16A34A' : '#EF4444' }]}>
                            ₹{Math.max(0, balance).toLocaleString('en-IN')}
                        </Text>
                    </View>
                </View>

                <View style={styles.form}>
                    {/* Rent Due */}
                    <Text style={styles.label}>Rent Due (₹)</Text>
                    <View style={styles.currencyInput}>
                        <Text style={styles.currencySymbol}>₹</Text>
                        <TextInput
                            style={styles.currencyField}
                            placeholder="0"
                            placeholderTextColor="#9CA3AF"
                            value={rentDue}
                            onChangeText={setRentDue}
                            keyboardType="numeric"
                        />
                    </View>

                    {/* Amount Paid */}
                    <Text style={styles.label}>Amount Paid (₹)</Text>
                    <View style={styles.currencyInput}>
                        <Text style={styles.currencySymbol}>₹</Text>
                        <TextInput
                            style={styles.currencyField}
                            placeholder="0"
                            placeholderTextColor="#9CA3AF"
                            value={amountPaid}
                            onChangeText={setAmountPaid}
                            keyboardType="numeric"
                        />
                    </View>

                    {/* Payment Mode */}
                    <Text style={styles.label}>Payment Mode</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.modesRow}>
                        {PAYMENT_MODES.map((mode) => (
                            <TouchableOpacity
                                key={mode.key}
                                style={[styles.modeChip, paymentMode === mode.key && styles.modeChipActive]}
                                onPress={() => setPaymentMode(mode.key)}
                            >
                                <Text>{mode.icon}</Text>
                                <Text style={[styles.modeText, paymentMode === mode.key && styles.modeTextActive]}>{mode.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Notes */}
                    <Text style={styles.label}>Notes (optional)</Text>
                    <TextInput
                        style={styles.notesInput}
                        placeholder="Any additional notes…"
                        placeholderTextColor="#9CA3AF"
                        value={notes}
                        onChangeText={setNotes}
                        multiline
                        numberOfLines={3}
                    />
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Submit Button */}
            <View style={styles.footer}>
                <TouchableOpacity style={[styles.submitBtn, submitting && { opacity: 0.7 }]} onPress={handleSubmit} disabled={submitting}>
                    {submitting
                        ? <ActivityIndicator color="#FFFFFF" />
                        : <Text style={styles.submitBtnText}>Record Payment</Text>
                    }
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: '#FFFFFF', paddingTop: 56, paddingBottom: 14, paddingHorizontal: 20,
        borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
    },
    backButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 17, fontFamily: FontFamily.interBold, color: '#111827' },
    scroll: { flex: 1 },
    tenantCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFFFFF', margin: 16, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#F3F4F6' },
    tenantAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center' },
    tenantAvatarText: { fontSize: 16, fontFamily: FontFamily.interBold, color: '#1601AA' },
    tenantName: { fontSize: 15, fontFamily: FontFamily.interSemiBold, color: '#111827' },
    tenantId: { fontSize: 12, fontFamily: FontFamily.lato, color: '#9CA3AF', marginTop: 2 },
    periodCard: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#EEF2FF', marginHorizontal: 16, borderRadius: 10, padding: 12, marginBottom: 12 },
    periodText: { fontSize: 13, fontFamily: FontFamily.interSemiBold, color: '#1601AA' },
    summaryCard: { backgroundColor: '#FFFFFF', marginHorizontal: 16, borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#F3F4F6' },
    summaryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 },
    summaryLabel: { fontSize: 14, fontFamily: FontFamily.lato, color: '#374151' },
    summaryAmount: { fontSize: 16, fontFamily: FontFamily.interBold, color: '#111827' },
    deductRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    minusCircle: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#FEE2E2', alignItems: 'center', justifyContent: 'center' },
    minusText: { fontSize: 12, color: '#EF4444', fontFamily: FontFamily.interBold },
    paidAmount: { fontSize: 16, fontFamily: FontFamily.interBold, color: '#16A34A' },
    dashedDivider: { height: 1, borderStyle: 'dashed', borderWidth: 1, borderColor: '#E5E7EB', marginVertical: 4 },
    equalsCircle: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#DCFCE7', alignItems: 'center', justifyContent: 'center' },
    equalsText: { fontSize: 11, color: '#16A34A', fontFamily: FontFamily.interBold },
    dueLabel: { fontSize: 14, fontFamily: FontFamily.interSemiBold, color: '#374151' },
    dueAmount: { fontSize: 18, fontFamily: FontFamily.interBold },
    form: { paddingHorizontal: 16 },
    label: { fontSize: 13, fontFamily: FontFamily.interSemiBold, color: '#374151', marginBottom: 6, marginTop: 14 },
    currencyInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 14 },
    currencySymbol: { fontSize: 16, fontFamily: FontFamily.interSemiBold, color: '#6B7280', marginRight: 8 },
    currencyField: { flex: 1, paddingVertical: 14, fontSize: 16, fontFamily: FontFamily.interSemiBold, color: '#111827' },
    modesRow: { gap: 8, paddingBottom: 4 },
    modeChip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FFFFFF', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 9, borderWidth: 1, borderColor: '#E5E7EB' },
    modeChipActive: { backgroundColor: '#1601AA', borderColor: '#1601AA' },
    modeText: { fontSize: 13, fontFamily: FontFamily.interSemiBold, color: '#374151' },
    modeTextActive: { color: '#FFFFFF' },
    notesInput: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, fontFamily: FontFamily.lato, color: '#111827', textAlignVertical: 'top', minHeight: 80 },
    footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', padding: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
    submitBtn: { backgroundColor: '#1601AA', borderRadius: 14, paddingVertical: 16, alignItems: 'center', justifyContent: 'center', minHeight: 52 },
    submitBtnText: { fontSize: 16, fontFamily: FontFamily.interBold, color: '#FFFFFF' },
});
