import { FontFamily } from '@/constants/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    FlatList,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export const TENANT_DATA = [
    {
        id: '1',
        name: 'Pamela Beesly',
        email: 'pam.b@example.com',
        phone: '+91 98765 43210',
        status: 'Active',
        property: 'Riverstone Place',
        roomNumber: 'Unit 11B',
        tenantId: 'TEN-001',
        rent: '₹8,500',
        securityDeposit: '₹17,000',
        rentCycle: 'Monthly, due on 1st',
        lease: 'Aug 2023 - Aug 2024',
    },
    {
        id: '2',
        name: 'Michael Scott',
        email: 'michael.s@example.com',
        phone: '+91 91234 56789',
        status: 'Active',
        property: 'Maple Creek Apts',
        roomNumber: 'Unit 201',
        tenantId: 'TEN-002',
        rent: '₹12,000',
        securityDeposit: '₹24,000',
        rentCycle: 'Monthly, due on 5th',
        lease: 'Jan 2024 - Jan 2025',
    },
    {
        id: '3',
        name: 'Dwight Schrute',
        email: 'dwight.s@example.com',
        phone: '+91 99988 77665',
        status: 'Inactive',
        property: 'Schrute Farms',
        roomNumber: 'Main House',
        tenantId: 'TEN-003',
        rent: '₹6,000',
        securityDeposit: '₹12,000',
        rentCycle: 'Monthly, due on 1st',
        lease: 'Ended: Dec 2023',
    },
    {
        id: '4',
        name: 'Creed Bratton',
        email: 'creed.b@example.com',
        phone: '+91 90000 11122',
        status: 'Invited',
        property: 'Scranton Business Park',
        roomNumber: 'Unit 4',
        tenantId: 'TEN-004',
        rent: '₹9,000',
        securityDeposit: '₹18,000',
        rentCycle: 'Monthly, due on 10th',
        lease: 'Pending Acceptance',
    },
];

const VACANCY_REASONS = [
    { room: 'Unit 3A', tenantId: 'TEN-009', reason: 'End of Lease', daysVacant: 14 },
    { room: 'Unit 7C', tenantId: 'TEN-012', reason: 'Relocated', daysVacant: 28 },
    { room: 'Unit 2B', tenantId: 'TEN-015', reason: 'Eviction', daysVacant: 5 },
];

const RETENTION_MATRIX = [
    { label: 'Avg Tenancy', value: '14 months' },
    { label: 'Renewal Rate', value: '68%' },
    { label: 'Turnover Rate', value: '32%' },
    { label: 'Avg Vacancy', value: '18 days' },
];

export default function TenantDirectoryScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const filtered = TENANT_DATA.filter(
        (t) =>
            (statusFilter === 'All' || t.status === statusFilter) &&
            (t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const renderItem = ({ item }: { item: typeof TENANT_DATA[0] }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => router.push({ pathname: '/tenant-detail', params: { id: item.id } })}
            activeOpacity={0.8}
        >
            <View style={styles.cardHeader}>
                <View style={styles.avatarWrap}>
                    <Text style={styles.avatarText}>{item.name[0]}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.email}>{item.email}</Text>
                </View>
                <View style={[
                    styles.statusBadge,
                    item.status === 'Inactive' && styles.statusBadgeInactive,
                    item.status === 'Invited' && styles.statusBadgeInvited,
                ]}>
                    <Text style={[
                        styles.statusText,
                        item.status === 'Inactive' && styles.statusTextInactive,
                        item.status === 'Invited' && styles.statusTextInvited,
                    ]}>
                        {item.status}
                    </Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
                <Ionicons name="business" size={15} color="#9CA3AF" style={styles.infoIcon} />
                <Text style={styles.infoText}>{item.property} · {item.roomNumber}</Text>
            </View>
            <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={15} color="#9CA3AF" style={styles.infoIcon} />
                <Text style={styles.infoText}>{item.status === 'Inactive' ? '' : 'Lease: '}{item.lease}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.actionRow}>
                <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={(e) => {
                        e.stopPropagation?.();
                        Linking.openURL(`tel:${item.phone}`);
                    }}
                >
                    <View style={[styles.actionIconWrap, { backgroundColor: '#EEF2FF' }]}>
                        <Ionicons name="call" size={16} color="#1601AA" />
                    </View>
                    <Text style={styles.actionText}>Call</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={(e) => {
                        e.stopPropagation?.();
                        router.push('/record-payment');
                    }}
                >
                    <View style={[styles.actionIconWrap, { backgroundColor: '#F0FDF4' }]}>
                        <MaterialCommunityIcons name="receipt-text-outline" size={16} color="#16A34A" />
                    </View>
                    <Text style={styles.actionText}>Payments</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => router.push({ pathname: '/tenant-detail', params: { id: item.id } })}
                >
                    <View style={[styles.actionIconWrap, { backgroundColor: '#FFF7ED' }]}>
                        <Ionicons name="person-outline" size={16} color="#D97706" />
                    </View>
                    <Text style={styles.actionText}>Details</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    const ListFooter = () => (
        <View style={styles.unitsSection}>
            {/* Vacant Count Banner */}
            <View style={styles.vacantBanner}>
                <View style={styles.vacantLeft}>
                    <Ionicons name="home-outline" size={22} color="#EF4444" />
                    <View style={{ marginLeft: 12 }}>
                        <Text style={styles.vacantCount}>{VACANCY_REASONS.length} Vacant Units</Text>
                        <Text style={styles.vacantSubtext}>Require attention</Text>
                    </View>
                </View>
                <View style={styles.vacantBadge}>
                    <Text style={styles.vacantBadgeText}>{VACANCY_REASONS.length}</Text>
                </View>
            </View>

            {/* Retention Data Matrix */}
            <Text style={styles.unitsSectionTitle}>Retention Matrix</Text>
            <View style={styles.retentionGrid}>
                {RETENTION_MATRIX.map((item, i) => (
                    <View key={i} style={styles.retentionCell}>
                        <Text style={styles.retentionValue}>{item.value}</Text>
                        <Text style={styles.retentionLabel}>{item.label}</Text>
                    </View>
                ))}
            </View>

            {/* Vacancy Reasons */}
            <Text style={styles.unitsSectionTitle}>Vacancy Reasons</Text>
            {VACANCY_REASONS.map((v, i) => (
                <View key={i} style={styles.vacancyRow}>
                    <View style={styles.vacancyLeft}>
                        <View style={styles.vacancyRoomBadge}>
                            <Text style={styles.vacancyRoomText}>{v.room}</Text>
                        </View>
                        <View style={{ marginLeft: 10 }}>
                            <Text style={styles.vacancyTenantId}>{v.tenantId}</Text>
                            <Text style={styles.vacancyReason}>{v.reason}</Text>
                        </View>
                    </View>
                    <Text style={styles.vacancyDays}>{v.daysVacant}d vacant</Text>
                </View>
            ))}

            <View style={{ height: 100 }} />
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Tenant</Text>
            </View>

            {/* Search */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search tenants..."
                    placeholderTextColor="#9CA3AF"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* Summary Cards */}
            <View style={{ marginBottom: 16 }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}>
                    <View style={styles.summaryCard}>
                        <View style={[styles.summaryIconWrap, { backgroundColor: '#DCFCE7' }]}>
                            <Ionicons name="enter-outline" size={20} color="#16A34A" />
                        </View>
                        <View>
                            <Text style={styles.summaryCount}>2</Text>
                            <Text style={styles.summaryLabel}>Move In</Text>
                        </View>
                    </View>
                    <View style={styles.summaryCard}>
                        <View style={[styles.summaryIconWrap, { backgroundColor: '#FEF3C7' }]}>
                            <Ionicons name="exit-outline" size={20} color="#D97706" />
                        </View>
                        <View>
                            <Text style={styles.summaryCount}>1</Text>
                            <Text style={styles.summaryLabel}>Move Out</Text>
                        </View>
                    </View>
                    <View style={styles.summaryCard}>
                        <View style={[styles.summaryIconWrap, { backgroundColor: '#FEE2E2' }]}>
                            <MaterialCommunityIcons name="file-remove-outline" size={20} color="#DC2626" />
                        </View>
                        <View>
                            <Text style={styles.summaryCount}>4</Text>
                            <Text style={styles.summaryLabel}>End Agreement</Text>
                        </View>
                    </View>
                </ScrollView>
            </View>

            {/* Filters */}
            <View style={styles.filterRowContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
                    {['All', 'Active', 'Inactive', 'Invited'].map((status) => (
                        <TouchableOpacity
                            key={status}
                            style={[styles.filterChip, statusFilter === status && styles.filterActive]}
                            onPress={() => setStatusFilter(status)}
                        >
                            <Text style={[styles.filterText, statusFilter === status && styles.filterTextActive]}>
                                {status}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Move-out Requests Banner */}
            <View style={styles.bannerContainer}>
                <View style={styles.bannerContent}>
                    <View style={styles.bannerIconContainer}>
                        <MaterialCommunityIcons name="truck-delivery-outline" size={20} color="#DC2626" />
                    </View>
                    <View>
                        <Text style={styles.bannerTitle}>2 Move-out Requests</Text>
                        <Text style={styles.bannerSubtitle}>Action required</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.bannerButton}>
                    <Text style={styles.bannerButtonText}>View</Text>
                </TouchableOpacity>
            </View>

            {/* List with Units as footer */}
            <FlatList
                data={filtered}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={<ListFooter />}
            />

            {/* Bottom Nav */}
            <View style={styles.bottomNavContainer}>
                <TouchableOpacity style={styles.fab} onPress={() => router.push('/add-tenant')}>
                    <Ionicons name="add" size={32} color="#FFFFFF" />
                </TouchableOpacity>
                <View style={styles.bottomNav}>
                    <TouchableOpacity style={styles.navItem} onPress={() => router.push('/landlord-dashboard')}>
                        <Ionicons name="grid-outline" size={24} color="#9CA3AF" />
                        <Text style={styles.navLabel}>Dashboard</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navItem} onPress={() => router.push('/properties')}>
                        <Ionicons name="business" size={24} color="#9CA3AF" />
                        <Text style={styles.navLabel}>Properties</Text>
                    </TouchableOpacity>
                    <View style={{ width: 60 }} />
                    <TouchableOpacity style={styles.navItem} onPress={() => router.push('/landlord-requests')}>
                        <Ionicons name="construct-outline" size={24} color="#9CA3AF" />
                        <Text style={styles.navLabel}>Requests</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navItem}>
                        <Ionicons name="ellipsis-horizontal-circle-outline" size={24} color="#9CA3AF" />
                        <Text style={styles.navLabel}>More</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF', paddingTop: 60 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 },
    backButton: { marginRight: 16 },
    headerTitle: { fontSize: 20, fontFamily: FontFamily.interBold, color: '#111827' },
    searchContainer: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB',
        borderRadius: 12, marginHorizontal: 20, paddingHorizontal: 12,
        height: 48, marginBottom: 16,
    },
    searchIcon: { marginRight: 8 },
    searchInput: { flex: 1, fontSize: 15, fontFamily: FontFamily.lato, color: '#111827' },
    filterRowContainer: { marginBottom: 16 },
    filterRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 10 },
    filterChip: {
        paddingHorizontal: 14, paddingVertical: 8,
        borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB',
        backgroundColor: '#FFFFFF',
    },
    filterActive: { backgroundColor: '#EEF2FF', borderColor: '#C7D2FE' },
    filterText: { fontSize: 13, fontFamily: FontFamily.interSemiBold, color: '#374151' },
    filterTextActive: { color: '#1601AA' },
    summaryCard: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#FFFFFF', padding: 14,
        borderRadius: 14, gap: 12, width: 140,
        borderWidth: 1, borderColor: '#F3F4F6',
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
    },
    summaryIconWrap: {
        width: 40, height: 40, borderRadius: 12,
        alignItems: 'center', justifyContent: 'center',
    },
    summaryCount: { fontSize: 18, fontFamily: FontFamily.interBold, color: '#111827' },
    summaryLabel: { fontSize: 11, fontFamily: FontFamily.lato, color: '#6B7280', marginTop: 2 },
    listContent: { paddingHorizontal: 20, paddingBottom: 20 },
    card: {
        backgroundColor: '#F9FAFB', borderRadius: 16,
        padding: 16, marginBottom: 14,
        borderWidth: 1, borderColor: '#F3F4F6',
    },
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 12 },
    avatarWrap: {
        width: 42, height: 42, borderRadius: 21,
        backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center',
    },
    avatarText: { fontSize: 18, fontFamily: FontFamily.interBold, color: '#1601AA' },
    name: { fontSize: 15, fontFamily: FontFamily.interBold, color: '#111827' },
    email: { fontSize: 12, fontFamily: FontFamily.lato, color: '#6B7280', marginTop: 1 },
    statusBadge: {
        backgroundColor: '#DCFCE7', paddingHorizontal: 10,
        paddingVertical: 4, borderRadius: 12,
    },
    statusBadgeInactive: { backgroundColor: '#F3F4F6' },
    statusBadgeInvited: { backgroundColor: '#DBEAFE' },
    statusText: { fontSize: 11, fontFamily: FontFamily.interSemiBold, color: '#16A34A' },
    statusTextInactive: { color: '#6B7280' },
    statusTextInvited: { color: '#2563EB' },
    divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 10 },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
    infoIcon: { width: 22 },
    infoText: { fontSize: 13, fontFamily: FontFamily.lato, color: '#4B5563' },
    actionRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 4 },
    actionBtn: { alignItems: 'center', gap: 6 },
    actionIconWrap: {
        width: 40, height: 40, borderRadius: 12,
        alignItems: 'center', justifyContent: 'center',
    },
    actionText: { fontSize: 11, fontFamily: FontFamily.interSemiBold, color: '#4B5563' },
    bannerContainer: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: '#FEF2F2', marginHorizontal: 20, marginBottom: 16,
        padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#FECACA',
    },
    bannerContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    bannerIconContainer: {
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center',
    },
    bannerTitle: { fontSize: 14, fontFamily: FontFamily.interSemiBold, color: '#991B1B' },
    bannerSubtitle: { fontSize: 12, fontFamily: FontFamily.lato, color: '#EF4444' },
    bannerButton: {
        backgroundColor: '#FFFFFF', paddingHorizontal: 14, paddingVertical: 6,
        borderRadius: 8, borderWidth: 1, borderColor: '#FECACA',
    },
    bannerButtonText: { fontSize: 12, fontFamily: FontFamily.interSemiBold, color: '#DC2626' },
    // Units Section
    unitsSection: { marginTop: 8 },
    unitsSectionTitle: {
        fontSize: 15, fontFamily: FontFamily.interBold, color: '#111827',
        marginBottom: 12, marginTop: 20,
    },
    vacantBanner: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: '#FEF2F2', borderRadius: 14, padding: 16,
        borderWidth: 1, borderColor: '#FECACA',
    },
    vacantLeft: { flexDirection: 'row', alignItems: 'center' },
    vacantCount: { fontSize: 16, fontFamily: FontFamily.interBold, color: '#991B1B' },
    vacantSubtext: { fontSize: 12, fontFamily: FontFamily.lato, color: '#EF4444', marginTop: 2 },
    vacantBadge: {
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: '#EF4444', alignItems: 'center', justifyContent: 'center',
    },
    vacantBadgeText: { fontSize: 16, fontFamily: FontFamily.interBold, color: '#FFFFFF' },
    retentionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    retentionCell: {
        flex: 1, minWidth: '45%', backgroundColor: '#F9FAFB',
        borderRadius: 12, padding: 14, alignItems: 'center',
        borderWidth: 1, borderColor: '#F3F4F6',
    },
    retentionValue: { fontSize: 20, fontFamily: FontFamily.interBold, color: '#1601AA' },
    retentionLabel: { fontSize: 11, fontFamily: FontFamily.lato, color: '#6B7280', marginTop: 4, textAlign: 'center' },
    vacancyRow: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: '#F9FAFB', borderRadius: 12, padding: 14,
        marginBottom: 10, borderWidth: 1, borderColor: '#F3F4F6',
    },
    vacancyLeft: { flexDirection: 'row', alignItems: 'center' },
    vacancyRoomBadge: {
        backgroundColor: '#EEF2FF', borderRadius: 8,
        paddingHorizontal: 10, paddingVertical: 5,
    },
    vacancyRoomText: { fontSize: 12, fontFamily: FontFamily.interBold, color: '#1601AA' },
    vacancyTenantId: { fontSize: 11, fontFamily: FontFamily.latoSemiBold, color: '#6B7280' },
    vacancyReason: { fontSize: 13, fontFamily: FontFamily.interSemiBold, color: '#111827', marginTop: 2 },
    vacancyDays: { fontSize: 12, fontFamily: FontFamily.lato, color: '#EF4444' },
    bottomNavContainer: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: 'transparent', alignItems: 'center',
    },
    fab: {
        width: 64, height: 64, borderRadius: 32,
        backgroundColor: '#1601AA', alignItems: 'center', justifyContent: 'center',
        marginBottom: -32, zIndex: 10,
        shadowColor: '#1601AA', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
    },
    bottomNav: {
        flexDirection: 'row', backgroundColor: '#FFFFFF', width: '100%',
        paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#E5E7EB',
        justifyContent: 'space-around', paddingBottom: 24, height: 80,
    },
    navItem: { alignItems: 'center', justifyContent: 'center' },
    navLabel: { fontSize: 10, fontFamily: FontFamily.lato, color: '#9CA3AF', marginTop: 4 },
});
