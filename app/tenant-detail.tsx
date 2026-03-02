import { FontFamily } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
    ActivityIndicator,
    Alert,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { getTenant } from '@/services/tenant.service';
import type { Tenant } from '@/types/tenant.types';

export default function TenantDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [tenant, setTenant] = useState<Tenant | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) { setError('No tenant ID provided.'); setLoading(false); return; }
        getTenant(id)
            .then(setTenant)
            .catch((e: any) => setError(e?.response?.data?.message ?? 'Failed to load tenant.'))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#1601AA" />
            </View>
        );
    }

    if (error || !tenant) {
        return (
            <View style={styles.center}>
                <Ionicons name="person-remove-outline" size={48} color="#D1D5DB" />
                <Text style={styles.errorText}>{error ?? 'Tenant not found.'}</Text>
                <TouchableOpacity onPress={() => router.back()} style={styles.backLinkBtn}>
                    <Text style={styles.backLink}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Resolved fields
    const user = typeof tenant.userId === 'object' ? tenant.userId : null;
    const unit = typeof tenant.unitId === 'object' ? tenant.unitId : null;
    const property = typeof tenant.propertyId === 'object' ? tenant.propertyId : null;

    const name = user?.name ?? 'Unknown';
    const email = user?.email ?? '';
    const phone = user?.phone ?? '';
    const unitNumber = unit?.unitNumber ?? '—';
    const propertyName = property?.name ?? '—';
    const initials = name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    const isActive = tenant.status === 'active';

    const leaseStart = new Date(tenant.leaseStart).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const leaseEnd = new Date(tenant.leaseEnd).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const rentCycleSuffix = (() => {
        const n = tenant.rentCycle;
        const s = ['th', 'st', 'nd', 'rd'];
        const v = n % 100;
        return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]);
    })();

    const handleCall = () => {
        if (!phone) { Alert.alert('No Phone', 'No phone number available for this tenant.'); return; }
        Linking.openURL(`tel:${phone}`).catch(() => Alert.alert('Error', 'Unable to open the phone dialer.'));
    };

    const INFO_FIELDS = [
        { icon: 'bed-outline' as const, label: 'Unit Number', value: unitNumber },
        { icon: 'business-outline' as const, label: 'Property', value: propertyName },
        { icon: 'cash-outline' as const, label: 'Rent Amount', value: `₹${tenant.rentAmount.toLocaleString('en-IN')}` },
        { icon: 'card-outline' as const, label: 'Tenant ID', value: tenant.tenantId },
        { icon: 'shield-checkmark-outline' as const, label: 'Security Deposit', value: `₹${tenant.securityDeposit.toLocaleString('en-IN')}` },
        { icon: 'repeat-outline' as const, label: 'Rent Cycle', value: `${rentCycleSuffix} of every month` },
    ];

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={22} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Tenant Details</Text>
                <TouchableOpacity onPress={handleCall} style={styles.callBtn}>
                    <Ionicons name="call" size={20} color="#1601AA" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarWrap}>
                        <Text style={styles.avatarText}>{initials}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.profileName}>{name}</Text>
                        {!!email && <Text style={styles.profileEmail}>{email}</Text>}
                        {!!phone && <Text style={styles.profilePhone}>{phone}</Text>}
                    </View>
                    <View style={[styles.statusBadge, !isActive && styles.statusBadgeInactive]}>
                        <Text style={[styles.statusText, !isActive && styles.statusTextInactive]}>
                            {isActive ? 'Active' : 'Moved Out'}
                        </Text>
                    </View>
                </View>

                {/* Tenancy Details */}
                <Text style={styles.sectionTitle}>Tenancy Details</Text>
                <View style={styles.infoCard}>
                    {INFO_FIELDS.map((field, index) => (
                        <View key={field.label}>
                            <View style={styles.infoRow}>
                                <View style={styles.infoIconWrap}>
                                    <Ionicons name={field.icon} size={18} color="#1601AA" />
                                </View>
                                <View style={styles.infoContent}>
                                    <Text style={styles.infoLabel}>{field.label}</Text>
                                    <Text style={styles.infoValue}>{field.value}</Text>
                                </View>
                            </View>
                            {index < INFO_FIELDS.length - 1 && <View style={styles.divider} />}
                        </View>
                    ))}
                </View>

                {/* Lease Period */}
                <Text style={styles.sectionTitle}>Lease Period</Text>
                <View style={styles.leaseCard}>
                    <Ionicons name="calendar-outline" size={20} color="#1601AA" />
                    <Text style={styles.leaseText}>{leaseStart} — {leaseEnd}</Text>
                </View>

                {/* Quick Actions */}
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.actionsRow}>
                    <TouchableOpacity style={styles.actionCard} onPress={handleCall}>
                        <View style={[styles.actionIconWrap, { backgroundColor: '#EEF2FF' }]}>
                            <Ionicons name="call" size={22} color="#1601AA" />
                        </View>
                        <Text style={styles.actionLabel}>Call</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionCard}
                        onPress={() => router.push({
                            pathname: '/record-payment',
                            params: { tenantId: tenant._id, tenantDisplayId: tenant.tenantId, name },
                        })}
                    >
                        <View style={[styles.actionIconWrap, { backgroundColor: '#F0FDF4' }]}>
                            <Ionicons name="cash-outline" size={22} color="#16A34A" />
                        </View>
                        <Text style={styles.actionLabel}>Payment</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/landlord-requests')}>
                        <View style={[styles.actionIconWrap, { backgroundColor: '#FFF7ED' }]}>
                            <Ionicons name="construct-outline" size={22} color="#D97706" />
                        </View>
                        <Text style={styles.actionLabel}>Requests</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ height: 60 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB', paddingTop: 56 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9FAFB', padding: 32, paddingTop: 80 },
    errorText: { fontSize: 15, fontFamily: FontFamily.lato, color: '#6B7280', textAlign: 'center', marginTop: 12 },
    backLinkBtn: { marginTop: 16 },
    backLink: { fontSize: 14, fontFamily: FontFamily.interSemiBold, color: '#1601AA' },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 20, paddingBottom: 14,
        backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
    },
    backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 17, fontFamily: FontFamily.interBold, color: '#111827' },
    callBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center' },
    scroll: { flex: 1 },
    profileCard: {
        flexDirection: 'row', alignItems: 'center', gap: 14,
        backgroundColor: '#FFFFFF', margin: 16, padding: 16,
        borderRadius: 16, borderWidth: 1, borderColor: '#F3F4F6',
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
    },
    avatarWrap: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center' },
    avatarText: { fontSize: 20, fontFamily: FontFamily.interBold, color: '#1601AA' },
    profileName: { fontSize: 16, fontFamily: FontFamily.interBold, color: '#111827' },
    profileEmail: { fontSize: 12, fontFamily: FontFamily.lato, color: '#6B7280', marginTop: 2 },
    profilePhone: { fontSize: 12, fontFamily: FontFamily.interSemiBold, color: '#1601AA', marginTop: 2 },
    statusBadge: { backgroundColor: '#DCFCE7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    statusBadgeInactive: { backgroundColor: '#F3F4F6' },
    statusText: { fontSize: 11, fontFamily: FontFamily.interSemiBold, color: '#16A34A' },
    statusTextInactive: { color: '#6B7280' },
    sectionTitle: { fontSize: 14, fontFamily: FontFamily.interSemiBold, color: '#111827', marginHorizontal: 16, marginBottom: 10, marginTop: 4 },
    infoCard: { backgroundColor: '#FFFFFF', marginHorizontal: 16, borderRadius: 16, padding: 4, marginBottom: 16, borderWidth: 1, borderColor: '#F3F4F6' },
    infoRow: { flexDirection: 'row', alignItems: 'center', padding: 12 },
    infoIconWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
    infoContent: { flex: 1 },
    infoLabel: { fontSize: 11, fontFamily: FontFamily.lato, color: '#9CA3AF' },
    infoValue: { fontSize: 15, fontFamily: FontFamily.interSemiBold, color: '#111827', marginTop: 2 },
    divider: { height: 1, backgroundColor: '#F3F4F6', marginHorizontal: 12 },
    leaseCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFFFFF', marginHorizontal: 16, padding: 14, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#F3F4F6' },
    leaseText: { fontSize: 14, fontFamily: FontFamily.interSemiBold, color: '#374151' },
    actionsRow: { flexDirection: 'row', marginHorizontal: 16, gap: 12 },
    actionCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, alignItems: 'center', gap: 8, borderWidth: 1, borderColor: '#F3F4F6' },
    actionIconWrap: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    actionLabel: { fontSize: 12, fontFamily: FontFamily.interSemiBold, color: '#374151' },
});
