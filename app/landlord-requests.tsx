import { FontFamily } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useCallback } from 'react';
import {
    ActivityIndicator,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useMaintenance } from '@/hooks/useMaintenance';
import type { MaintenanceRequest } from '@/types/maintenance.types';

type FilterTab = 'all' | 'pending' | 'in_progress' | 'resolved';

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
    pending: { label: 'Pending', color: '#D97706', bg: '#FEF3C7' },
    in_progress: { label: 'In Progress', color: '#2563EB', bg: '#DBEAFE' },
    resolved: { label: 'Resolved', color: '#16A34A', bg: '#DCFCE7' },
    closed: { label: 'Closed', color: '#6B7280', bg: '#F3F4F6' },
    rejected: { label: 'Rejected', color: '#EF4444', bg: '#FEE2E2' },
};

const FILTERS: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'resolved', label: 'Resolved' },
];

const CATEGORIES = ['all', 'plumbing', 'electrical', 'cleaning', 'security', 'other'];

function RequestCard({ request, onStatusChange }: { request: MaintenanceRequest; onStatusChange: (id: string, status: string) => void }) {
    // Normalize status: use the raw value if it's a known key, otherwise derive from the badge lookup
    const rawStatus = request.status as string;
    const knownStatuses = ['pending', 'in_progress', 'resolved', 'closed', 'rejected'];
    const normalizedStatus = knownStatuses.includes(rawStatus) ? rawStatus : 'pending';
    const status = STATUS_MAP[normalizedStatus] ?? STATUS_MAP.pending;
    const tenantName = typeof request.tenantId === 'object'
        ? (request.tenantId as any)?.userId?.name ?? 'Unknown'
        : 'Unknown';
    const unitNumber = typeof request.unitId === 'object'
        ? (request.unitId as any)?.unitNumber ?? '—'
        : '—';
    const propertyName = typeof request.propertyId === 'object'
        ? (request.propertyId as any)?.name ?? '—'
        : '—';

    const date = new Date(request.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle} numberOfLines={1}>{request.title}</Text>
                    <Text style={styles.cardMeta}>{tenantName} · {propertyName} · Unit {unitNumber}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                    <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
                </View>
            </View>

            <Text style={styles.cardDescription} numberOfLines={2}>{request.description}</Text>

            <View style={styles.cardFooter}>
                <View style={styles.categoryTag}>
                    <Text style={styles.categoryText}>{request.category}</Text>
                </View>
                <Text style={styles.dateText}>{date}</Text>
            </View>

            {/* Status actions */}
            {normalizedStatus === 'pending' && (
                <View style={styles.actions}>
                    <TouchableOpacity style={styles.actionBtnBlue} onPress={() => onStatusChange(request._id, 'in_progress')}>
                        <Text style={styles.actionBtnBlueText}>Mark In Progress</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtnGreen} onPress={() => onStatusChange(request._id, 'resolved')}>
                        <Text style={styles.actionBtnGreenText}>Resolve</Text>
                    </TouchableOpacity>
                </View>
            )}
            {normalizedStatus === 'in_progress' && (
                <View style={styles.actions}>
                    <TouchableOpacity style={styles.actionBtnGreen} onPress={() => onStatusChange(request._id, 'resolved')}>
                        <Text style={styles.actionBtnGreenText}>Mark Resolved</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

export default function LandlordRequestsScreen() {
    const { requests, loading, error, refetch, updateStatus } = useMaintenance();
    const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
    const [activeCategory, setActiveCategory] = useState('all');

    const filtered = useCallback(() => {
        return requests.filter((r: MaintenanceRequest) => {
            const statusMatch = activeFilter === 'all' || r.status === activeFilter;
            const catMatch = activeCategory === 'all' || r.category === activeCategory;
            return statusMatch && catMatch;
        });
    }, [requests, activeFilter, activeCategory])();

    const handleStatusChange = async (id: string, status: string) => {
        await updateStatus(id, { status: status as any });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={22} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Maintenance Requests</Text>
                <View style={{ width: 36 }} />
            </View>

            {/* Status filter tabs */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsRow}>
                {FILTERS.map((f) => (
                    <TouchableOpacity
                        key={f.key}
                        style={[styles.filterChip, activeFilter === f.key && styles.filterChipActive]}
                        onPress={() => setActiveFilter(f.key)}
                    >
                        <Text style={[styles.filterChipText, activeFilter === f.key && styles.filterChipTextActive]}>{f.label}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Category filter */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
                {CATEGORIES.map((cat) => (
                    <TouchableOpacity
                        key={cat}
                        style={[styles.catChip, activeCategory === cat && styles.catChipActive]}
                        onPress={() => setActiveCategory(cat)}
                    >
                        <Text style={[styles.catChipText, activeCategory === cat && styles.catChipTextActive]}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {loading ? (
                <View style={styles.center}><ActivityIndicator size="large" color="#1601AA" /></View>
            ) : error ? (
                <View style={styles.center}>
                    <Ionicons name="cloud-offline-outline" size={48} color="#D1D5DB" />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryBtn} onPress={refetch}><Text style={styles.retryText}>Retry</Text></TouchableOpacity>
                </View>
            ) : filtered.length === 0 ? (
                <View style={styles.center}>
                    <Ionicons name="construct-outline" size={56} color="#E5E7EB" />
                    <Text style={styles.emptyTitle}>No requests found</Text>
                    <Text style={styles.emptySubtitle}>No maintenance requests match the selected filters</Text>
                </View>
            ) : (
                <FlatList
                    data={filtered}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => <RequestCard request={item} onStatusChange={handleStatusChange} />}
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
    tabsRow: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
    filterChip: { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7, backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB' },
    filterChipActive: { backgroundColor: '#1601AA', borderColor: '#1601AA' },
    filterChipText: { fontSize: 13, fontFamily: FontFamily.interSemiBold, color: '#6B7280' },
    filterChipTextActive: { color: '#FFFFFF' },
    catRow: { paddingHorizontal: 16, paddingBottom: 8, gap: 6 },
    catChip: { borderRadius: 8, paddingHorizontal: 12, paddingVertical: 5, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB' },
    catChipActive: { backgroundColor: '#EEF2FF', borderColor: '#C7D2FE' },
    catChipText: { fontSize: 12, fontFamily: FontFamily.interSemiBold, color: '#6B7280' },
    catChipTextActive: { color: '#1601AA' },
    list: { paddingHorizontal: 16, paddingBottom: 32, gap: 12 },
    card: {
        backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16,
        borderWidth: 1, borderColor: '#F3F4F6',
    },
    cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 6 },
    cardTitle: { fontSize: 15, fontFamily: FontFamily.interSemiBold, color: '#111827', marginBottom: 2 },
    cardMeta: { fontSize: 12, fontFamily: FontFamily.lato, color: '#9CA3AF' },
    statusBadge: { borderRadius: 10, paddingHorizontal: 9, paddingVertical: 3 },
    statusText: { fontSize: 11, fontFamily: FontFamily.interSemiBold },
    cardDescription: { fontSize: 13, fontFamily: FontFamily.lato, color: '#6B7280', lineHeight: 18, marginBottom: 10 },
    cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    categoryTag: { backgroundColor: '#F3F4F6', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
    categoryText: { fontSize: 11, fontFamily: FontFamily.interSemiBold, color: '#374151' },
    dateText: { fontSize: 12, fontFamily: FontFamily.lato, color: '#9CA3AF' },
    actions: { flexDirection: 'row', gap: 8, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
    actionBtnBlue: { flex: 1, backgroundColor: '#EEF2FF', borderRadius: 8, paddingVertical: 8, alignItems: 'center' },
    actionBtnBlueText: { fontSize: 12, fontFamily: FontFamily.interSemiBold, color: '#1601AA' },
    actionBtnGreen: { flex: 1, backgroundColor: '#DCFCE7', borderRadius: 8, paddingVertical: 8, alignItems: 'center' },
    actionBtnGreenText: { fontSize: 12, fontFamily: FontFamily.interSemiBold, color: '#16A34A' },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
    errorText: { fontSize: 14, fontFamily: FontFamily.lato, color: '#6B7280', textAlign: 'center', marginTop: 12 },
    retryBtn: { marginTop: 16, backgroundColor: '#1601AA', borderRadius: 10, paddingHorizontal: 24, paddingVertical: 10 },
    retryText: { fontSize: 14, fontFamily: FontFamily.interSemiBold, color: '#FFFFFF' },
    emptyTitle: { fontSize: 17, fontFamily: FontFamily.interBold, color: '#374151', marginTop: 16 },
    emptySubtitle: { fontSize: 13, fontFamily: FontFamily.lato, color: '#9CA3AF', textAlign: 'center', marginTop: 6 },
});
