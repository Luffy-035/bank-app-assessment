import { FontFamily } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { getMyTenantProfile } from '@/services/tenant.service';
import { usePayments } from '@/hooks/usePayments';
import type { Tenant } from '@/types/tenant.types';

export default function TenantHomeScreen() {
    const { user } = useAuth();
    const { dues, loading: duesLoading } = usePayments();

    const [profile, setProfile] = useState<Tenant | null>(null);
    const [profileLoading, setProfileLoading] = useState(true);
    const [profileError, setProfileError] = useState<string | null>(null);

    useEffect(() => {
        getMyTenantProfile()
            .then(setProfile)
            .catch((e: any) => setProfileError(e?.response?.data?.message ?? 'Profile unavailable'))
            .finally(() => setProfileLoading(false));
    }, []);

    const unitNumber = profile && typeof profile.unitId === 'object' ? profile.unitId.unitNumber : '—';
    const propertyName = profile && typeof profile.propertyId === 'object' ? profile.propertyId.name : '—';
    const leaseEnd = profile ? new Date(profile.leaseEnd).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
    const rentAmount = profile?.rentAmount ?? 0;
    const tenantId = profile?.tenantId ?? '—';

    // My due from dues list — DueSummary uses tenant._id (not tenantId)
    const myDue = dues.find((d: any) => {
        const tid = typeof d.tenant === 'object' ? d.tenant?._id : d.tenant;
        return tid === profile?._id;
    });
    const dueAmount = myDue?.balance ?? 0;
    const dueStatus: 'paid' | 'partial' | 'pending' = myDue?.status ?? 'pending';

    const dueColor = dueStatus === 'paid' ? '#16A34A' : dueStatus === 'partial' ? '#D97706' : '#EF4444';
    const dueBg = dueStatus === 'paid' ? '#DCFCE7' : dueStatus === 'partial' ? '#FEF3C7' : '#FEE2E2';
    const dueLabel = dueStatus === 'paid' ? 'Paid' : dueStatus === 'partial' ? 'Partial' : 'Pending';

    const initials = (user?.name ?? 'T').trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Good {getTimeOfDay()}, 👋</Text>
                    <Text style={styles.userName}>{user?.name ?? 'Tenant'}</Text>
                </View>
                <View style={styles.avatarCircle}>
                    <Text style={styles.avatarText}>{initials}</Text>
                </View>
            </View>

            {profileLoading ? (
                <View style={styles.profileLoading}>
                    <ActivityIndicator color="#1601AA" />
                </View>
            ) : profileError ? (
                <View style={styles.errorBanner}>
                    <Ionicons name="alert-circle-outline" size={16} color="#D97706" />
                    <Text style={styles.errorBannerText}>{profileError} — Contact your landlord to be linked.</Text>
                </View>
            ) : (
                <>
                    {/* Rent Due Card */}
                    <View style={styles.dueCard}>
                        <View style={styles.dueCardTop}>
                            <View>
                                <Text style={styles.dueCardLabel}>This Month's Rent</Text>
                                <Text style={styles.dueCardAmount}>₹{rentAmount.toLocaleString('en-IN')}</Text>
                            </View>
                            <View style={[styles.dueBadge, { backgroundColor: dueBg }]}>
                                <Text style={[styles.dueBadgeText, { color: dueColor }]}>{dueLabel}</Text>
                            </View>
                        </View>
                        {duesLoading ? (
                            <ActivityIndicator size="small" color="#FFFFFF" style={{ marginTop: 8 }} />
                        ) : dueAmount > 0 ? (
                            <Text style={styles.dueBalance}>₹{dueAmount.toLocaleString('en-IN')} outstanding</Text>
                        ) : null}
                    </View>

                    {/* Tenancy Info */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Your Tenancy</Text>
                        <View style={styles.infoCard}>
                            {[
                                { icon: 'business-outline' as const, label: 'Property', value: propertyName },
                                { icon: 'bed-outline' as const, label: 'Unit', value: `Unit ${unitNumber}` },
                                { icon: 'card-outline' as const, label: 'Tenant ID', value: tenantId },
                                { icon: 'calendar-outline' as const, label: 'Lease Ends', value: leaseEnd },
                                { icon: 'shield-checkmark-outline' as const, label: 'Security Deposit', value: `₹${(profile?.securityDeposit ?? 0).toLocaleString('en-IN')}` },
                            ].map((item, i, arr) => (
                                <View key={item.label}>
                                    <View style={styles.infoRow}>
                                        <View style={styles.infoIconWrap}>
                                            <Ionicons name={item.icon} size={16} color="#1601AA" />
                                        </View>
                                        <View style={styles.infoContent}>
                                            <Text style={styles.infoLabel}>{item.label}</Text>
                                            <Text style={styles.infoValue}>{item.value}</Text>
                                        </View>
                                    </View>
                                    {i < arr.length - 1 && <View style={styles.divider} />}
                                </View>
                            ))}
                        </View>
                    </View>
                </>
            )}

            {/* Quick Actions */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.actionsGrid}>
                    {[
                        { icon: 'construct-outline' as const, label: 'Maintenance', color: '#D97706', bg: '#FFF7ED', route: '/request-maintenance' as const },
                        { icon: 'document-text-outline' as const, label: 'Documents', color: '#1601AA', bg: '#EEF2FF', route: '/documents' as const },
                        { icon: 'help-circle-outline' as const, label: 'Support', color: '#16A34A', bg: '#F0FDF4', route: '/request-support' as const },
                        { icon: 'log-out-outline' as const, label: 'Move Out', color: '#EF4444', bg: '#FEF2F2', route: '/(tabs)/requests/move-out' as const },
                    ].map((action) => (
                        <TouchableOpacity
                            key={action.label}
                            style={styles.actionCard}
                            onPress={() => router.push(action.route)}
                        >
                            <View style={[styles.actionIcon, { backgroundColor: action.bg }]}>
                                <Ionicons name={action.icon} size={24} color={action.color} />
                            </View>
                            <Text style={styles.actionLabel}>{action.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

function getTimeOfDay() {
    const h = new Date().getHours();
    if (h < 12) return 'morning';
    if (h < 17) return 'afternoon';
    return 'evening';
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: '#FFFFFF', paddingTop: 56, paddingBottom: 16, paddingHorizontal: 20,
        borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
    },
    greeting: { fontSize: 13, fontFamily: FontFamily.lato, color: '#9CA3AF' },
    userName: { fontSize: 20, fontFamily: FontFamily.interBold, color: '#111827', marginTop: 2 },
    avatarCircle: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center' },
    avatarText: { fontSize: 16, fontFamily: FontFamily.interBold, color: '#1601AA' },
    profileLoading: { height: 100, alignItems: 'center', justifyContent: 'center' },
    errorBanner: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: '#FEF3C7', margin: 16, borderRadius: 12, padding: 14 },
    errorBannerText: { flex: 1, fontSize: 13, fontFamily: FontFamily.lato, color: '#92400E', lineHeight: 18 },
    dueCard: { backgroundColor: '#1601AA', margin: 16, borderRadius: 18, padding: 20 },
    dueCardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    dueCardLabel: { fontSize: 12, fontFamily: FontFamily.lato, color: '#C7D2FE', marginBottom: 4 },
    dueCardAmount: { fontSize: 28, fontFamily: FontFamily.interBold, color: '#FFFFFF' },
    dueBadge: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
    dueBadgeText: { fontSize: 12, fontFamily: FontFamily.interSemiBold },
    dueBalance: { fontSize: 13, fontFamily: FontFamily.lato, color: '#A5B4FC', marginTop: 8 },
    section: { paddingHorizontal: 16, marginTop: 8, marginBottom: 8 },
    sectionTitle: { fontSize: 15, fontFamily: FontFamily.interBold, color: '#111827', marginBottom: 12 },
    infoCard: {
        backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#F3F4F6',
        padding: 4,
    },
    infoRow: { flexDirection: 'row', alignItems: 'center', padding: 12 },
    infoIconWrap: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    infoContent: { flex: 1 },
    infoLabel: { fontSize: 11, fontFamily: FontFamily.lato, color: '#9CA3AF' },
    infoValue: { fontSize: 14, fontFamily: FontFamily.interSemiBold, color: '#111827', marginTop: 2 },
    divider: { height: 1, backgroundColor: '#F3F4F6', marginHorizontal: 12 },
    actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    actionCard: {
        width: '47%', backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16,
        alignItems: 'center', gap: 10, borderWidth: 1, borderColor: '#F3F4F6',
    },
    actionIcon: { width: 50, height: 50, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    actionLabel: { fontSize: 13, fontFamily: FontFamily.interSemiBold, color: '#374151' },
});
