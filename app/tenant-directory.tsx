import { FontFamily } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useCallback } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTenants } from '@/hooks/useTenants';
import type { Tenant } from '@/types/tenant.types';

function TenantCard({ tenant }: { tenant: Tenant }) {
    const user = typeof tenant.userId === 'object' ? tenant.userId : null;
    const unit = typeof tenant.unitId === 'object' ? tenant.unitId : null;
    const property = typeof tenant.propertyId === 'object' ? tenant.propertyId : null;
    const name = user?.name ?? 'Unknown';
    const phone = user?.phone ?? '';
    const unitNumber = unit?.unitNumber ?? '—';
    const propertyName = property?.name ?? '—';
    const initials = name.trim().split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
    const isActive = tenant.status === 'active';

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => router.push({ pathname: '/tenant-detail', params: { id: tenant._id } })}
            activeOpacity={0.7}
        >
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View style={styles.cardContent}>
                <View style={styles.cardTop}>
                    <Text style={styles.tenantName} numberOfLines={1}>{name}</Text>
                    <View style={[styles.statusBadge, !isActive && styles.statusBadgeInactive]}>
                        <Text style={[styles.statusText, !isActive && styles.statusTextInactive]}>
                            {isActive ? 'Active' : 'Moved Out'}
                        </Text>
                    </View>
                </View>
                <Text style={styles.tenantSub}>{propertyName} · Unit {unitNumber}</Text>
                {!!phone && (
                    <View style={styles.phoneRow}>
                        <Ionicons name="call-outline" size={12} color="#9CA3AF" />
                        <Text style={styles.phoneText}>{phone}</Text>
                    </View>
                )}
            </View>
            <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
        </TouchableOpacity>
    );
}

export default function TenantDirectoryScreen() {
    const { tenants, loading, error, refetch } = useTenants({ status: 'active' });
    const [search, setSearch] = useState('');

    const filtered = useCallback(() => {
        if (!search.trim()) return tenants;
        const q = search.toLowerCase();
        return tenants.filter((t) => {
            const user = typeof t.userId === 'object' ? t.userId : null;
            return user?.name?.toLowerCase().includes(q) || user?.phone?.includes(q) || t.tenantId?.toLowerCase().includes(q);
        });
    }, [tenants, search])();

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={22} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Tenant Directory</Text>
                <View style={{ width: 36 }} />
            </View>

            {/* Search */}
            <View style={styles.searchWrap}>
                <Ionicons name="search-outline" size={18} color="#9CA3AF" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by name, phone, or tenant ID…"
                    placeholderTextColor="#9CA3AF"
                    value={search}
                    onChangeText={setSearch}
                />
                {!!search && (
                    <TouchableOpacity onPress={() => setSearch('')} style={styles.clearBtn}>
                        <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                )}
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#1601AA" />
                </View>
            ) : error ? (
                <View style={styles.center}>
                    <Ionicons name="cloud-offline-outline" size={48} color="#D1D5DB" />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryBtn} onPress={refetch}>
                        <Text style={styles.retryText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : filtered.length === 0 ? (
                <View style={styles.center}>
                    <Ionicons name="people-outline" size={56} color="#E5E7EB" />
                    <Text style={styles.emptyTitle}>{search ? 'No results found' : 'No tenants yet'}</Text>
                    <Text style={styles.emptySubtitle}>
                        {search ? 'Try a different search term' : 'Add a tenant from the Add Tenant screen'}
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={filtered}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => <TenantCard tenant={item} />}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    onRefresh={refetch}
                    refreshing={loading}
                />
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
    headerTitle: { fontSize: 18, fontFamily: FontFamily.interBold, color: '#111827' },
    searchWrap: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        backgroundColor: '#FFFFFF', margin: 16, borderRadius: 12,
        borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 12,
    },
    searchIcon: { marginRight: 4 },
    searchInput: { flex: 1, paddingVertical: 12, fontSize: 14, fontFamily: FontFamily.lato, color: '#111827' },
    clearBtn: { padding: 4 },
    list: { paddingHorizontal: 16, paddingBottom: 32, gap: 10 },
    card: {
        flexDirection: 'row', alignItems: 'center', gap: 12,
        backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14,
        borderWidth: 1, borderColor: '#F3F4F6',
    },
    avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center' },
    avatarText: { fontSize: 16, fontFamily: FontFamily.interBold, color: '#1601AA' },
    cardContent: { flex: 1 },
    cardTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 },
    tenantName: { flex: 1, fontSize: 15, fontFamily: FontFamily.interSemiBold, color: '#111827' },
    statusBadge: { backgroundColor: '#DCFCE7', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
    statusBadgeInactive: { backgroundColor: '#F3F4F6' },
    statusText: { fontSize: 11, fontFamily: FontFamily.interSemiBold, color: '#16A34A' },
    statusTextInactive: { color: '#6B7280' },
    tenantSub: { fontSize: 12, fontFamily: FontFamily.lato, color: '#6B7280' },
    phoneRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
    phoneText: { fontSize: 12, fontFamily: FontFamily.lato, color: '#9CA3AF' },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
    errorText: { fontSize: 14, fontFamily: FontFamily.lato, color: '#6B7280', textAlign: 'center', marginTop: 12 },
    retryBtn: { marginTop: 16, backgroundColor: '#1601AA', borderRadius: 10, paddingHorizontal: 24, paddingVertical: 10 },
    retryText: { fontSize: 14, fontFamily: FontFamily.interSemiBold, color: '#FFFFFF' },
    emptyTitle: { fontSize: 17, fontFamily: FontFamily.interBold, color: '#374151', marginTop: 16 },
    emptySubtitle: { fontSize: 13, fontFamily: FontFamily.lato, color: '#9CA3AF', textAlign: 'center', marginTop: 6 },
});
