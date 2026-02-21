import { FontFamily } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
    Alert,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { TENANT_DATA } from './tenant-directory';

const INFO_FIELDS = [
    { icon: 'bed-outline' as const, label: 'Room Number', key: 'roomNumber' },
    { icon: 'business-outline' as const, label: 'Property', key: 'property' },
    { icon: 'cash-outline' as const, label: 'Rent', key: 'rent' },
    { icon: 'card-outline' as const, label: 'Tenant ID', key: 'tenantId' },
    { icon: 'shield-checkmark-outline' as const, label: 'Security Deposit', key: 'securityDeposit' },
    { icon: 'repeat-outline' as const, label: 'Rent Cycle', key: 'rentCycle' },
];

export default function TenantDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const tenant = TENANT_DATA.find((t) => t.id === id);

    if (!tenant) {
        return (
            <View style={styles.notFound}>
                <Text style={styles.notFoundText}>Tenant not found.</Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backLink}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const handleCall = () => {
        Linking.openURL(`tel:${tenant.phone}`).catch(() =>
            Alert.alert('Error', 'Unable to open the phone dialer.')
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={22} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Tenant Details</Text>
                {/* Call Icon — opens dialer */}
                <TouchableOpacity onPress={handleCall} style={styles.callBtn}>
                    <Ionicons name="call" size={20} color="#1601AA" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarWrap}>
                        <Text style={styles.avatarText}>{tenant.name[0]}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.profileName}>{tenant.name}</Text>
                        <Text style={styles.profileEmail}>{tenant.email}</Text>
                        <Text style={styles.profilePhone}>{tenant.phone}</Text>
                    </View>
                    <View style={[
                        styles.statusBadge,
                        tenant.status === 'Inactive' && styles.statusBadgeInactive,
                        tenant.status === 'Invited' && styles.statusBadgeInvited,
                    ]}>
                        <Text style={[
                            styles.statusText,
                            tenant.status === 'Inactive' && styles.statusTextInactive,
                            tenant.status === 'Invited' && styles.statusTextInvited,
                        ]}>
                            {tenant.status}
                        </Text>
                    </View>
                </View>

                {/* Info Fields */}
                <Text style={styles.sectionTitle}>Tenancy Details</Text>
                <View style={styles.infoCard}>
                    {INFO_FIELDS.map((field, index) => {
                        const value = tenant[field.key as keyof typeof tenant] as string;
                        return (
                            <View key={field.key}>
                                <View style={styles.infoRow}>
                                    <View style={styles.infoIconWrap}>
                                        <Ionicons name={field.icon} size={18} color="#1601AA" />
                                    </View>
                                    <View style={styles.infoContent}>
                                        <Text style={styles.infoLabel}>{field.label}</Text>
                                        <Text style={styles.infoValue}>{value}</Text>
                                    </View>
                                </View>
                                {index < INFO_FIELDS.length - 1 && <View style={styles.divider} />}
                            </View>
                        );
                    })}
                </View>

                {/* Lease Period */}
                <Text style={styles.sectionTitle}>Lease Period</Text>
                <View style={styles.leaseCard}>
                    <Ionicons name="calendar-outline" size={20} color="#1601AA" />
                    <Text style={styles.leaseText}>{tenant.lease}</Text>
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

                    <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/record-payment')}>
                        <View style={[styles.actionIconWrap, { backgroundColor: '#F0FDF4' }]}>
                            <Ionicons name="cash-outline" size={22} color="#16A34A" />
                        </View>
                        <Text style={styles.actionLabel}>Payments</Text>
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
    container: { flex: 1, backgroundColor: '#F9FAFB', paddingTop: 60 },
    notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    notFoundText: { fontSize: 16, fontFamily: FontFamily.lato, color: '#6B7280' },
    backLink: { fontSize: 14, fontFamily: FontFamily.interSemiBold, color: '#1601AA', marginTop: 12 },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 20, paddingBottom: 16,
        backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
    },
    backBtn: {
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center',
    },
    headerTitle: { fontSize: 17, fontFamily: FontFamily.interBold, color: '#111827' },
    callBtn: {
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center',
    },
    scroll: { flex: 1 },
    profileCard: {
        flexDirection: 'row', alignItems: 'center', gap: 14,
        backgroundColor: '#FFFFFF', margin: 16, padding: 16,
        borderRadius: 16, borderWidth: 1, borderColor: '#F3F4F6',
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
    },
    avatarWrap: {
        width: 52, height: 52, borderRadius: 26,
        backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center',
    },
    avatarText: { fontSize: 22, fontFamily: FontFamily.interBold, color: '#1601AA' },
    profileName: { fontSize: 16, fontFamily: FontFamily.interBold, color: '#111827' },
    profileEmail: { fontSize: 12, fontFamily: FontFamily.lato, color: '#6B7280', marginTop: 2 },
    profilePhone: { fontSize: 12, fontFamily: FontFamily.latoSemiBold, color: '#1601AA', marginTop: 2 },
    statusBadge: {
        backgroundColor: '#DCFCE7', paddingHorizontal: 10,
        paddingVertical: 4, borderRadius: 12,
    },
    statusBadgeInactive: { backgroundColor: '#F3F4F6' },
    statusBadgeInvited: { backgroundColor: '#DBEAFE' },
    statusText: { fontSize: 11, fontFamily: FontFamily.interSemiBold, color: '#16A34A' },
    statusTextInactive: { color: '#6B7280' },
    statusTextInvited: { color: '#2563EB' },
    sectionTitle: {
        fontSize: 14, fontFamily: FontFamily.interSemiBold, color: '#111827',
        marginHorizontal: 16, marginBottom: 10, marginTop: 4,
    },
    infoCard: {
        backgroundColor: '#FFFFFF', marginHorizontal: 16, borderRadius: 16,
        padding: 4, marginBottom: 16, borderWidth: 1, borderColor: '#F3F4F6',
    },
    infoRow: { flexDirection: 'row', alignItems: 'center', padding: 12 },
    infoIconWrap: {
        width: 36, height: 36, borderRadius: 10,
        backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center',
        marginRight: 14,
    },
    infoContent: { flex: 1 },
    infoLabel: { fontSize: 11, fontFamily: FontFamily.lato, color: '#9CA3AF' },
    infoValue: { fontSize: 15, fontFamily: FontFamily.interSemiBold, color: '#111827', marginTop: 2 },
    divider: { height: 1, backgroundColor: '#F3F4F6', marginHorizontal: 12 },
    leaseCard: {
        flexDirection: 'row', alignItems: 'center', gap: 12,
        backgroundColor: '#FFFFFF', marginHorizontal: 16, padding: 14,
        borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#F3F4F6',
    },
    leaseText: { fontSize: 14, fontFamily: FontFamily.interSemiBold, color: '#374151' },
    actionsRow: { flexDirection: 'row', marginHorizontal: 16, gap: 12 },
    actionCard: {
        flex: 1, backgroundColor: '#FFFFFF', borderRadius: 14,
        padding: 14, alignItems: 'center', gap: 8,
        borderWidth: 1, borderColor: '#F3F4F6',
    },
    actionIconWrap: {
        width: 48, height: 48, borderRadius: 14,
        alignItems: 'center', justifyContent: 'center',
    },
    actionLabel: { fontSize: 12, fontFamily: FontFamily.interSemiBold, color: '#374151' },
});
