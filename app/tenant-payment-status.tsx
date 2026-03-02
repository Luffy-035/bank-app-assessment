import { FontFamily } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { usePayments } from '@/hooks/usePayments';
import type { DueSummary } from '@/types/payment.types';

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
    paid: { bg: '#DCFCE7', text: '#16A34A', label: 'Paid' },
    partial: { bg: '#FEF3C7', text: '#D97706', label: 'Partial' },
    pending: { bg: '#FEE2E2', text: '#EF4444', label: 'Pending' },
};

function DueCard({ due }: { due: DueSummary }) {
    const sc = STATUS_COLORS[due.status] ?? STATUS_COLORS.pending;
    const tenantName = due.tenant?.userId?.name ?? 'Unknown';
    const tenantId = due.tenant?.tenantId ?? '—';
    const unitNumber = due.unit?.unitNumber ?? '—';
    const propertyName = due.property?.name ?? '—';
    const initials = tenantName.trim().split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);

    return (
        <View style={styles.card}>
            <View style={styles.cardTop}>
                <View style={styles.avatarWrap}>
                    <Text style={styles.avatarText}>{initials}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.tenantName} numberOfLines={1}>{tenantName}</Text>
                    <Text style={styles.tenantMeta}>{propertyName} · Unit {unitNumber}</Text>
                    <Text style={styles.tenantId}>{tenantId}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: sc.bg }]}>
                    <Text style={[styles.statusText, { color: sc.text }]}>{sc.label}</Text>
                </View>
            </View>

            <View style={styles.amountRow}>
                <View style={styles.amountItem}>
                    <Text style={styles.amountLabel}>Rent Due</Text>
                    <Text style={styles.amountValue}>₹{due.rentDue.toLocaleString('en-IN')}</Text>
                </View>
                <View style={styles.amountDivider} />
                <View style={styles.amountItem}>
                    <Text style={styles.amountLabel}>Paid</Text>
                    <Text style={[styles.amountValue, { color: '#16A34A' }]}>₹{due.amountPaid.toLocaleString('en-IN')}</Text>
                </View>
                <View style={styles.amountDivider} />
                <View style={styles.amountItem}>
                    <Text style={styles.amountLabel}>Balance</Text>
                    <Text style={[styles.amountValue, { color: due.balance > 0 ? '#EF4444' : '#16A34A' }]}>
                        ₹{due.balance.toLocaleString('en-IN')}
                    </Text>
                </View>
            </View>
        </View>
    );
}

export default function TenantPaymentStatusScreen() {
    const { dues, loading, error, refetch } = usePayments();

    const now = new Date();
    const totalDue = dues.reduce((s: number, d: DueSummary) => s + d.rentDue, 0);
    const totalPaid = dues.reduce((s: number, d: DueSummary) => s + d.amountPaid, 0);
    const totalBalance = dues.reduce((s: number, d: DueSummary) => s + d.balance, 0);
    const paidCount = dues.filter((d: DueSummary) => d.status === 'paid').length;
    const pendingCount = dues.filter((d: DueSummary) => d.status !== 'paid').length;

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={22} color="#111827" />
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerTitle}>Payment Status</Text>
                    <Text style={styles.headerSub}>{now.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</Text>
                </View>
                <View style={{ width: 36 }} />
            </View>

            {loading ? (
                <View style={styles.center}><ActivityIndicator size="large" color="#1601AA" /></View>
            ) : error ? (
                <View style={styles.center}>
                    <Ionicons name="cloud-offline-outline" size={48} color="#D1D5DB" />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryBtn} onPress={refetch}><Text style={styles.retryText}>Retry</Text></TouchableOpacity>
                </View>
            ) : (
                <>
                    {/* Summary Banner */}
                    <View style={styles.summaryBanner}>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryValue}>₹{totalDue.toLocaleString('en-IN')}</Text>
                            <Text style={styles.summaryLabel}>Total Due</Text>
                        </View>
                        <View style={styles.summaryDivider} />
                        <View style={styles.summaryItem}>
                            <Text style={[styles.summaryValue, { color: '#16A34A' }]}>₹{totalPaid.toLocaleString('en-IN')}</Text>
                            <Text style={styles.summaryLabel}>Collected</Text>
                        </View>
                        <View style={styles.summaryDivider} />
                        <View style={styles.summaryItem}>
                            <Text style={[styles.summaryValue, { color: totalBalance > 0 ? '#EF4444' : '#16A34A' }]}>₹{totalBalance.toLocaleString('en-IN')}</Text>
                            <Text style={styles.summaryLabel}>Pending</Text>
                        </View>
                    </View>

                    {/* Status counts */}
                    <View style={styles.countRow}>
                        <View style={[styles.countChip, { backgroundColor: '#DCFCE7' }]}>
                            <Text style={[styles.countChipText, { color: '#16A34A' }]}>{paidCount} Paid</Text>
                        </View>
                        <View style={[styles.countChip, { backgroundColor: '#FEE2E2' }]}>
                            <Text style={[styles.countChipText, { color: '#EF4444' }]}>{pendingCount} Pending</Text>
                        </View>
                    </View>

                    {dues.length === 0 ? (
                        <View style={styles.center}>
                            <Ionicons name="checkmark-circle-outline" size={56} color="#E5E7EB" />
                            <Text style={styles.emptyTitle}>No dues found</Text>
                            <Text style={styles.emptySubtitle}>All tenants are up to date for this month!</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={dues as DueSummary[]}
                            keyExtractor={(item) => item.tenant?._id ?? Math.random().toString()}
                            renderItem={({ item }) => <DueCard due={item} />}
                            contentContainerStyle={styles.list}
                            showsVerticalScrollIndicator={false}
                            onRefresh={refetch}
                            refreshing={loading}
                        />
                    )}
                </>
            )}
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
    backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 17, fontFamily: FontFamily.interBold, color: '#111827' },
    headerSub: { fontSize: 12, fontFamily: FontFamily.lato, color: '#9CA3AF', textAlign: 'center', marginTop: 2 },
    summaryBanner: { flexDirection: 'row', backgroundColor: '#FFFFFF', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    summaryItem: { flex: 1, alignItems: 'center' },
    summaryValue: { fontSize: 18, fontFamily: FontFamily.interBold, color: '#111827' },
    summaryLabel: { fontSize: 11, fontFamily: FontFamily.lato, color: '#9CA3AF', marginTop: 3 },
    summaryDivider: { width: 1, backgroundColor: '#F3F4F6' },
    countRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 10 },
    countChip: { borderRadius: 10, paddingHorizontal: 12, paddingVertical: 5 },
    countChipText: { fontSize: 12, fontFamily: FontFamily.interSemiBold },
    list: { padding: 16, gap: 12, paddingBottom: 32 },
    card: {
        backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16,
        borderWidth: 1, borderColor: '#F3F4F6',
    },
    cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 14 },
    avatarWrap: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center' },
    avatarText: { fontSize: 15, fontFamily: FontFamily.interBold, color: '#1601AA' },
    tenantName: { fontSize: 14, fontFamily: FontFamily.interSemiBold, color: '#111827', marginBottom: 2 },
    tenantMeta: { fontSize: 12, fontFamily: FontFamily.lato, color: '#6B7280' },
    tenantId: { fontSize: 11, fontFamily: FontFamily.lato, color: '#9CA3AF', marginTop: 2 },
    statusBadge: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
    statusText: { fontSize: 11, fontFamily: FontFamily.interSemiBold },
    amountRow: { flexDirection: 'row', backgroundColor: '#F9FAFB', borderRadius: 10, padding: 12 },
    amountItem: { flex: 1, alignItems: 'center' },
    amountLabel: { fontSize: 11, fontFamily: FontFamily.lato, color: '#9CA3AF', marginBottom: 4 },
    amountValue: { fontSize: 14, fontFamily: FontFamily.interBold, color: '#111827' },
    amountDivider: { width: 1, backgroundColor: '#E5E7EB' },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
    errorText: { fontSize: 14, fontFamily: FontFamily.lato, color: '#6B7280', textAlign: 'center', marginTop: 12 },
    retryBtn: { marginTop: 16, backgroundColor: '#1601AA', borderRadius: 10, paddingHorizontal: 24, paddingVertical: 10 },
    retryText: { fontSize: 14, fontFamily: FontFamily.interSemiBold, color: '#FFFFFF' },
    emptyTitle: { fontSize: 17, fontFamily: FontFamily.interBold, color: '#374151', marginTop: 16 },
    emptySubtitle: { fontSize: 13, fontFamily: FontFamily.lato, color: '#9CA3AF', textAlign: 'center', marginTop: 6 },
});
