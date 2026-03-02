import { FontFamily } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    Alert,
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { usePayments } from '@/hooks/usePayments';
import { useDashboardStats } from '@/hooks/useDashboardStats';

const { width } = Dimensions.get('window');

const tabs = ['All', 'By Property', 'By Tenant', 'By Month'];

const PAYMENT_METHODS = ['Cash', 'UPI', 'Cheque', 'Bank Transfer', 'Other'];

export default function RentIncomeScreen() {
    const { payments, dues, recordPayment } = usePayments();
    const { stats } = useDashboardStats();
    const [activeTab, setActiveTab] = useState('All');
    const [modalVisible, setModalVisible] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Real summary totals
    const totalReceived = useMemo(() => payments.reduce((s, p) => s + p.amountPaid, 0), [payments]);
    const totalDue = useMemo(() => dues.reduce((s, d) => s + d.rentDue, 0), [dues]);
    const totalPending = useMemo(() => dues.reduce((s, d) => s + d.balance, 0), [dues]);

    // Income comparison: this month vs last month
    const incomeComparison = useMemo(() => {
        const now = new Date();
        const thisMonth = payments
            .filter((p) => p.month === now.getMonth() + 1 && p.year === now.getFullYear())
            .reduce((s, p) => s + p.amountPaid, 0);
        const lastMonth = payments
            .filter((p) => {
                const d = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                return p.month === d.getMonth() + 1 && p.year === d.getFullYear();
            })
            .reduce((s, p) => s + p.amountPaid, 0);
        if (lastMonth === 0) return null; // Not enough data
        const diff = ((thisMonth - lastMonth) / lastMonth) * 100;
        return `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}%`;
    }, [payments]);

    // Payment mode breakdown from real payments
    const paymentModeStats = useMemo(() => {
        const total = payments.length || 1;
        const modes = [
            { label: 'UPI', key: 'upi', color: '#A5B4FC' },
            { label: 'Cash', key: 'cash', color: '#1E3A8A' },
            { label: 'Bank Transfer', key: 'bank_transfer', color: '#1601AA' },
            { label: 'Cheque', key: 'cheque', color: '#4338CA' },
            { label: 'Others', key: 'other', color: '#C7D2FE' },
        ] as const;
        return modes.map((m) => {
            const count = payments.filter((p) => p.paymentMode === m.key).length;
            const pct = Math.round((count / total) * 100);
            return { ...m, count, pct };
        }).filter((m) => m.count > 0);
    }, [payments]);

    // Monthly bar chart derived from real payments (last 7 months)
    const monthlyIncome = useMemo(() => {
        const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const now = new Date();
        const last7: { label: string; month: number; year: number }[] = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            last7.push({ label: MONTHS[d.getMonth()], month: d.getMonth() + 1, year: d.getFullYear() });
        }
        const incomeByMonth = last7.map(({ label, month, year }) => {
            const total = payments.filter(p => p.month === month && p.year === year).reduce((s, p) => s + p.amountPaid, 0);
            return { label, amount: total };
        });
        const maxIncome = Math.max(...incomeByMonth.map(x => x.amount), 1);
        return incomeByMonth.map(x => ({
            label: x.label,
            amount: x.amount >= 1000 ? `₹${Math.round(x.amount / 1000)}k` : `₹${x.amount}`,
            color: '#1601AA',
            width: `${Math.round((x.amount / maxIncome) * 100)}%`,
        }));
    }, [payments]);

    // Record Payment form state
    const [payTenantId, setPayTenantId] = useState('');
    const [payAmount, setPayAmount] = useState('');
    const [payMethod, setPayMethod] = useState('Cash');
    const [payDate, setPayDate] = useState('');
    const [payNotes, setPayNotes] = useState('');
    const [paymentDone, setPaymentDone] = useState(false);

    const resetForm = () => {
        setPayTenantId('');
        setPayAmount('');
        setPayMethod('Cash');
        setPayDate('');
        setPayNotes('');
        setPaymentDone(false);
        setSubmitting(false);
    };

    const handleMarkComplete = async () => {
        if (!payTenantId.trim() || !payAmount.trim()) {
            Alert.alert('Missing Details', 'Please fill in Tenant ID and amount.');
            return;
        }
        const now = new Date();
        setSubmitting(true);
        try {
            await recordPayment({
                tenantId: payTenantId.trim(),
                month: now.getMonth() + 1,
                year: now.getFullYear(),
                rentDue: Number(payAmount),
                amountPaid: Number(payAmount),
                paymentMode: (payMethod.toLowerCase().replace(' ', '_')) as any,
                paymentDate: payDate || now.toISOString().split('T')[0],
                notes: payNotes,
            });
            setPaymentDone(true);
            Alert.alert('Success', 'Payment recorded successfully.');
        } catch (e: any) {
            Alert.alert('Error', e?.response?.data?.message ?? 'Failed to record payment.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        resetForm();
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Rent &amp; Income</Text>
                    <TouchableOpacity>
                        <Ionicons name="ellipsis-vertical" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>

                {/* Summary Section */}
                <View style={styles.summarySection}>
                    <Text style={styles.summaryDate}>{new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</Text>
                    <View style={styles.summaryAmountRow}>
                        <Text style={styles.summaryAmount}>₹{totalReceived.toLocaleString('en-IN')}</Text>
                    </View>
                    <Text style={styles.summarySubtext}>Total collected this period</Text>
                    <View style={styles.statsRow}>
                        <View style={styles.statBox}>
                            <Text style={styles.statLabel}>Received</Text>
                            <Text style={styles.statValue}>₹{totalReceived.toLocaleString('en-IN')}</Text>
                        </View>
                        <View style={[styles.statBox, styles.statBoxMiddle]}>
                            <Text style={styles.statLabel}>Due</Text>
                            <Text style={styles.statValue}>₹{totalDue.toLocaleString('en-IN')}</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={styles.statLabel}>Overdue</Text>
                            <Text style={styles.statValue}>₹{totalPending.toLocaleString('en-IN')}</Text>
                        </View>
                    </View>
                </View>

                {/* Tabs */}
                <View style={styles.tabsContainer}>
                    {tabs.map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            style={[styles.tab, activeTab === tab && styles.tabActive]}
                            onPress={() => setActiveTab(tab)}
                        >
                            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Quick Monthly Snapshot */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Quick monthly snapshot:</Text>
                    <TouchableOpacity onPress={() => router.push('/occupancy')}>
                        <Text style={styles.detailsLink}>Details</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.snapshotGrid}>
                    <View style={styles.snapshotItem}>
                        <View style={styles.snapshotIconWrap}>
                            <Ionicons name="cash-outline" size={18} color="#1601AA" />
                        </View>
                        <View style={styles.snapshotContent}>
                            <Text style={styles.snapshotValue}>{incomeComparison ?? 'N/A'}</Text>
                            <Text style={styles.snapshotLabel}>Income Comparison</Text>
                        </View>
                    </View>
                    <View style={styles.snapshotItem}>
                        <View style={styles.snapshotIconWrap}>
                            <Ionicons name="construct-outline" size={18} color="#1601AA" />
                        </View>
                        <View style={styles.snapshotContent}>
                            <Text style={styles.snapshotValue}>₹{(stats?.maintenanceCostThisMonth ?? 0).toLocaleString('en-IN')}</Text>
                            <Text style={styles.snapshotLabel}>Maintenance Expense</Text>
                        </View>
                    </View>
                </View>

                {/* Record Payment Card */}
                <View style={styles.recordPaymentCard}>
                    <View style={styles.recordPaymentHeader}>
                        <View style={styles.recordPaymentIconWrap}>
                            <Ionicons name="cash" size={24} color="#D97706" />
                            <View style={styles.recordPaymentCheckBadge}>
                                <Ionicons name="checkmark" size={8} color="#FFFFFF" />
                            </View>
                        </View>
                        <Text style={styles.recordPaymentTitle}>Record payment</Text>
                    </View>
                    <Text style={styles.recordPaymentDesc}>
                        Record money received in Cash, UPI, Cheque or other offline modes.
                    </Text>
                    <TouchableOpacity style={styles.recordPaymentBtn} onPress={() => setModalVisible(true)}>
                        <Text style={styles.recordPaymentBtnText}>Record</Text>
                    </TouchableOpacity>
                </View>

                {/* Monthly Income Trend */}
                <View style={styles.chartCard}>
                    <Text style={styles.chartTitle}>Monthly Income Trend</Text>
                    {monthlyIncome.map((item, index) => (
                        <View key={index} style={styles.expenseRow}>
                            <Text style={styles.expenseLabel}>{item.label}</Text>
                            <View style={styles.expenseBarContainer}>
                                <View style={[styles.expenseBar, { width: item.width as any, backgroundColor: item.color }]}>
                                    <Text style={styles.expenseAmount}>{item.amount}</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Expense Tracker Button */}
                <TouchableOpacity style={styles.expenseTrackerBtn} onPress={() => router.push('/expense-tracker')}>
                    <View style={styles.expenseTrackerIcon}>
                        <Ionicons name="pie-chart-outline" size={24} color="#FFFFFF" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.expenseTrackerTitle}>View Expense Tracker</Text>
                        <Text style={styles.expenseTrackerSubtitle}>Detailed breakdown of all expenses</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#6B7280" />
                </TouchableOpacity>

                {/* Payment Methods */}
                <View style={styles.chartCard}>
                    <Text style={styles.chartTitle}>Payment Methods</Text>
                    {payments.length === 0 ? (
                        <Text style={{ fontSize: 13, fontFamily: FontFamily.lato, color: '#9CA3AF', textAlign: 'center', paddingVertical: 20 }}>No payment data yet.</Text>
                    ) : (
                        paymentModeStats.map((m) => (
                            <View key={m.key} style={styles.expenseRow}>
                                <Text style={styles.expenseLabel}>{m.label}</Text>
                                <View style={styles.expenseBarContainer}>
                                    <View style={[styles.expenseBar, { width: `${m.pct}%` as any, backgroundColor: m.color }]}>
                                        <Text style={styles.expenseAmount}>{m.pct}%</Text>
                                    </View>
                                </View>
                            </View>
                        ))
                    )}
                </View>

                {/* Export Report — placed right after charts */}
                <TouchableOpacity
                    style={styles.exportBtn}
                    onPress={() => Alert.alert('Export Report', 'Your report is being prepared for download.', [{ text: 'OK' }])}
                    activeOpacity={0.85}
                >
                    <Ionicons name="download-outline" size={20} color="#1601AA" />
                    <Text style={styles.exportBtnText}>Export Report</Text>
                </TouchableOpacity>

                {/* Send Payment Reminders */}
                <TouchableOpacity style={styles.primaryBtn}>
                    <Ionicons name="notifications-outline" size={18} color="#FFFFFF" />
                    <Text style={styles.primaryBtnText}>Send Payment Reminders</Text>
                </TouchableOpacity>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* FAB */}
            <TouchableOpacity style={styles.fab} onPress={() => router.push('/add-property')}>
                <Ionicons name="add" size={28} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Tab Bar */}
            <View style={styles.tabBar}>
                <TouchableOpacity style={styles.tabBarItem}>
                    <Ionicons name="grid" size={20} color="#1601AA" />
                    <Text style={[styles.tabBarText, styles.tabBarActive]}>Dashboard</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabBarItem} onPress={() => router.push('/properties')}>
                    <Ionicons name="business-outline" size={20} color="#9CA3AF" />
                    <Text style={styles.tabBarText}>Properties</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabBarItem} onPress={() => router.push('/landlord-requests')}>
                    <Ionicons name="construct-outline" size={20} color="#9CA3AF" />
                    <Text style={styles.tabBarText}>Requests</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabBarItem} onPress={() => router.push('/help-support')}>
                    <Ionicons name="ellipsis-horizontal" size={20} color="#9CA3AF" />
                    <Text style={styles.tabBarText}>More</Text>
                </TouchableOpacity>
            </View>

            {/* ── Record Payment Modal ── */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent
                onRequestClose={handleCloseModal}
            >
                <View style={modal.overlay}>
                    <View style={modal.sheet}>
                        {/* Handle */}
                        <View style={modal.handle} />

                        {paymentDone ? (
                            /* Success State */
                            <View style={modal.successWrap}>
                                <View style={modal.successIcon}>
                                    <Ionicons name="checkmark-circle" size={64} color="#22C55E" />
                                </View>
                                <Text style={modal.successTitle}>Payment Recorded!</Text>
                                <Text style={modal.successSub}>
                                    ₹{payAmount} recorded for Tenant ID: {payTenantId} via {payMethod}.
                                </Text>
                                <TouchableOpacity style={modal.doneBtn} onPress={handleCloseModal}>
                                    <Text style={modal.doneBtnText}>Done</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            /* Form */
                            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                                <View style={modal.headerRow}>
                                    <Text style={modal.title}>Record Payment</Text>
                                    <TouchableOpacity onPress={handleCloseModal}>
                                        <Ionicons name="close" size={22} color="#6B7280" />
                                    </TouchableOpacity>
                                </View>
                                <Text style={modal.subtitle}>Enter details for offline payment received</Text>

                                {/* Tenant ID */}
                                <Text style={modal.label}>Tenant ID *</Text>
                                <TextInput
                                    style={modal.input}
                                    placeholder="e.g. T001"
                                    value={payTenantId}
                                    onChangeText={setPayTenantId}
                                    placeholderTextColor="#9CA3AF"
                                    autoCapitalize="characters"
                                />

                                {/* Amount */}
                                <Text style={modal.label}>Amount Received (₹) *</Text>
                                <TextInput
                                    style={modal.input}
                                    placeholder="e.g. 8000"
                                    value={payAmount}
                                    onChangeText={setPayAmount}
                                    keyboardType="numeric"
                                    placeholderTextColor="#9CA3AF"
                                />

                                {/* Payment Method */}
                                <Text style={modal.label}>Payment Method</Text>
                                <View style={modal.methodRow}>
                                    {PAYMENT_METHODS.map((m) => (
                                        <TouchableOpacity
                                            key={m}
                                            style={[modal.methodChip, payMethod === m && modal.methodChipActive]}
                                            onPress={() => setPayMethod(m)}
                                        >
                                            <Text style={[modal.methodChipText, payMethod === m && modal.methodChipTextActive]}>
                                                {m}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                {/* Date */}
                                <Text style={modal.label}>Date of Payment</Text>
                                <TextInput
                                    style={modal.input}
                                    placeholder="e.g. 21 Feb 2026"
                                    value={payDate}
                                    onChangeText={setPayDate}
                                    placeholderTextColor="#9CA3AF"
                                />

                                {/* Notes */}
                                <Text style={modal.label}>Notes (optional)</Text>
                                <TextInput
                                    style={[modal.input, modal.inputMultiline]}
                                    placeholder="Any additional info…"
                                    value={payNotes}
                                    onChangeText={setPayNotes}
                                    multiline
                                    numberOfLines={3}
                                    placeholderTextColor="#9CA3AF"
                                />

                                {/* Submit */}
                                <TouchableOpacity style={modal.submitBtn} onPress={handleMarkComplete} activeOpacity={0.85}>
                                    <Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" />
                                    <Text style={modal.submitBtnText}>Mark as Completed</Text>
                                </TouchableOpacity>

                                <View style={{ height: 32 }} />
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1601AA',
        paddingTop: 50,
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    backBtn: { padding: 4 },
    headerTitle: { fontSize: 18, fontFamily: FontFamily.interSemiBold, color: '#FFFFFF' },
    summarySection: {
        backgroundColor: '#1601AA',
        paddingHorizontal: 16,
        paddingBottom: 24,
    },
    summaryDate: { fontSize: 13, fontFamily: FontFamily.lato, color: 'rgba(255,255,255,0.7)', marginBottom: 4 },
    summaryAmountRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
    summaryAmount: { fontSize: 42, fontFamily: FontFamily.interBold, color: '#FFFFFF' },
    percentBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3730A3',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 14,
        marginLeft: 14,
    },
    percentText: { fontSize: 13, fontFamily: FontFamily.latoSemiBold, color: '#22C55E', marginLeft: 3 },
    summarySubtext: { fontSize: 12, fontFamily: FontFamily.lato, color: 'rgba(255,255,255,0.6)', marginTop: 4, marginBottom: 4 },
    statsRow: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 14,
        marginTop: 16,
        overflow: 'hidden',
    },
    statBox: { flex: 1, paddingVertical: 14, alignItems: 'flex-start', paddingHorizontal: 14 },
    statBoxMiddle: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
    statLabel: { fontSize: 11, fontFamily: FontFamily.lato, color: 'rgba(255,255,255,0.7)', marginBottom: 6 },
    statValue: { fontSize: 18, fontFamily: FontFamily.interBold, color: '#FFFFFF' },
    scroll: { flex: 1 },
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 8,
    },
    tab: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    tabActive: { backgroundColor: '#1601AA', borderColor: '#1601AA' },
    tabText: { fontSize: 13, fontFamily: FontFamily.latoSemiBold, color: '#6B7280' },
    tabTextActive: { color: '#FFFFFF' },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 12,
        marginTop: 8,
    },
    sectionTitle: { fontSize: 15, fontFamily: FontFamily.interSemiBold, color: '#111827' },
    detailsLink: { fontSize: 13, fontFamily: FontFamily.latoSemiBold, color: '#1601AA' },
    snapshotGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 12,
        marginBottom: 16,
    },
    snapshotItem: {
        width: (width - 40) / 2,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 14,
        margin: 4,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        flexDirection: 'row',
        alignItems: 'center',
    },
    snapshotIconWrap: {
        width: 40, height: 40, borderRadius: 10,
        backgroundColor: '#EEF2FF',
        alignItems: 'center', justifyContent: 'center',
        marginRight: 12,
    },
    snapshotContent: { flex: 1 },
    snapshotValue: { fontSize: 16, fontFamily: FontFamily.interBold, color: '#111827' },
    snapshotLabel: { fontSize: 11, fontFamily: FontFamily.lato, color: '#6B7280', marginTop: 3 },
    chartCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    chartTitle: { fontSize: 16, fontFamily: FontFamily.interBold, color: '#111827', marginBottom: 20 },
    expenseRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    expenseLabel: { width: 40, fontSize: 12, color: '#9CA3AF', textAlign: 'right', marginRight: 12 },
    expenseBarContainer: { flex: 1 },
    expenseBar: {
        height: 28, borderRadius: 6,
        justifyContent: 'center', alignItems: 'flex-end',
        paddingRight: 10,
    },
    expenseAmount: { fontSize: 12, color: '#FFFFFF' },
    pieChartContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 20 },
    pieWrapper: {
        width: 280, height: 240,
        alignItems: 'center', justifyContent: 'center',
        position: 'relative',
    },
    upiLabel: { position: 'absolute', left: 0, top: 16, alignItems: 'flex-start' },
    cashLabel: { position: 'absolute', left: 0, bottom: 88, alignItems: 'flex-start' },
    othersLabel: { position: 'absolute', left: 20, bottom: 32, alignItems: 'flex-start' },
    bankLabel: { position: 'absolute', right: 0, bottom: 52, alignItems: 'flex-end' },
    bankLabelLine: { width: 40, height: 2, backgroundColor: '#1601AA', marginBottom: 4 },
    upiLine: { width: 42, height: 2, backgroundColor: '#4338CA', marginBottom: 4 },
    cashLine: { width: 42, height: 2, backgroundColor: '#4338CA', marginBottom: 4 },
    othersLine: { width: 48, height: 2, backgroundColor: '#4338CA', marginBottom: 4 },
    pieLabelName: { fontSize: 12, fontFamily: FontFamily.lato, color: '#6B7280' },
    pieLabelPercent: { fontSize: 16, fontFamily: FontFamily.interBold, color: '#1601AA' },
    // Export Report — appears right below charts
    exportBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1.5,
        borderColor: '#1601AA',
    },
    exportBtnText: { fontSize: 15, fontFamily: FontFamily.interSemiBold, color: '#1601AA' },
    expenseTrackerBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        gap: 16,
    },
    expenseTrackerIcon: {
        width: 48, height: 48, borderRadius: 12,
        backgroundColor: '#1601AA',
        alignItems: 'center', justifyContent: 'center',
    },
    expenseTrackerTitle: { fontSize: 16, fontFamily: FontFamily.interBold, color: '#111827' },
    expenseTrackerSubtitle: { fontSize: 13, fontFamily: FontFamily.lato, color: '#6B7280', marginTop: 2 },
    primaryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1601AA',
        marginHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 12,
        marginBottom: 12,
        gap: 8,
    },
    primaryBtnText: { fontSize: 15, fontFamily: FontFamily.interSemiBold, color: '#FFFFFF' },
    fab: {
        position: 'absolute',
        bottom: 88,
        alignSelf: 'center',
        width: 52, height: 52, borderRadius: 26,
        backgroundColor: '#1601AA',
        alignItems: 'center', justifyContent: 'center',
        shadowColor: '#1601AA', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3, shadowRadius: 6, elevation: 6,
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingBottom: 22,
        paddingTop: 8,
    },
    tabBarItem: { flex: 1, alignItems: 'center' },
    tabBarText: { fontSize: 10, fontFamily: FontFamily.lato, color: '#9CA3AF', marginTop: 3 },
    tabBarActive: { color: '#1601AA', fontFamily: FontFamily.latoSemiBold },
    recordPaymentCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    recordPaymentHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    recordPaymentIconWrap: {
        width: 40, height: 40, borderRadius: 12,
        backgroundColor: '#FEF3C7',
        alignItems: 'center', justifyContent: 'center',
        marginRight: 12,
        position: 'relative',
    },
    recordPaymentCheckBadge: {
        position: 'absolute',
        bottom: -2, right: -2,
        backgroundColor: '#22C55E',
        width: 14, height: 14, borderRadius: 7,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: '#FFFFFF',
    },
    recordPaymentTitle: { fontSize: 16, fontFamily: FontFamily.interBold, color: '#111827' },
    recordPaymentDesc: { fontSize: 13, fontFamily: FontFamily.lato, color: '#6B7280', marginBottom: 20, lineHeight: 20 },
    recordPaymentBtn: {
        width: '100%', paddingVertical: 12,
        borderRadius: 12, borderWidth: 1.5,
        borderColor: '#1601AA', alignItems: 'center',
    },
    recordPaymentBtnText: { fontSize: 15, fontFamily: FontFamily.interSemiBold, color: '#1601AA' },
});

const modal = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        maxHeight: '92%',
    },
    handle: {
        width: 40, height: 4, borderRadius: 2,
        backgroundColor: '#E5E7EB',
        alignSelf: 'center', marginBottom: 20,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    title: { fontSize: 18, fontFamily: FontFamily.interBold, color: '#111827' },
    subtitle: { fontSize: 13, fontFamily: FontFamily.lato, color: '#6B7280', marginBottom: 20 },
    label: {
        fontSize: 13, fontFamily: FontFamily.interSemiBold,
        color: '#374151', marginBottom: 6, marginTop: 14,
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1, borderColor: '#E5E7EB',
        borderRadius: 10, paddingHorizontal: 14,
        paddingVertical: 11,
        fontSize: 14, fontFamily: FontFamily.lato, color: '#111827',
    },
    inputMultiline: { height: 80, textAlignVertical: 'top', paddingTop: 10 },
    methodRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
    methodChip: {
        paddingHorizontal: 14, paddingVertical: 8,
        borderRadius: 20, borderWidth: 1,
        borderColor: '#E5E7EB', backgroundColor: '#F9FAFB',
    },
    methodChipActive: { backgroundColor: '#1601AA', borderColor: '#1601AA' },
    methodChipText: { fontSize: 13, fontFamily: FontFamily.latoSemiBold, color: '#6B7280' },
    methodChipTextActive: { color: '#FFFFFF' },
    submitBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        gap: 8,
        backgroundColor: '#1601AA',
        borderRadius: 12, paddingVertical: 14,
        marginTop: 24,
    },
    submitBtnText: { fontSize: 15, fontFamily: FontFamily.interSemiBold, color: '#FFFFFF' },
    // Success state
    successWrap: { alignItems: 'center', paddingVertical: 32 },
    successIcon: { marginBottom: 16 },
    successTitle: { fontSize: 22, fontFamily: FontFamily.interBold, color: '#111827', marginBottom: 10 },
    successSub: {
        fontSize: 14, fontFamily: FontFamily.lato, color: '#6B7280',
        textAlign: 'center', lineHeight: 22, paddingHorizontal: 16,
    },
    doneBtn: {
        marginTop: 28, backgroundColor: '#1601AA',
        borderRadius: 12, paddingVertical: 14, paddingHorizontal: 48,
    },
    doneBtnText: { fontSize: 15, fontFamily: FontFamily.interSemiBold, color: '#FFFFFF' },
});
