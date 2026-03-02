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
import { useProperties } from '@/hooks/useProperties';
import type { Property } from '@/types/property.types';

function PropertyCard({ property }: { property: Property }) {
    const total = property.unitCount ?? 0;
    const occupied = property.occupiedCount ?? 0;
    const vacant = total - occupied;
    const occupancyPct = total > 0 ? Math.round((occupied / total) * 100) : 0;

    const typeLabel: Record<string, string> = { building: 'Building', floor: 'Floor', pg: 'PG' };
    const typeColor: Record<string, { bg: string; text: string }> = {
        building: { bg: '#EEF2FF', text: '#1601AA' },
        floor: { bg: '#F0FDF4', text: '#16A34A' },
        pg: { bg: '#FFF7ED', text: '#D97706' },
    };
    const tc = typeColor[property.type] ?? typeColor.building;

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => router.push({ pathname: '/property-details', params: { id: property._id, name: property.name } })}
            activeOpacity={0.7}
        >
            <View style={styles.cardTop}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.propertyName} numberOfLines={1}>{property.name}</Text>
                    <Text style={styles.propertyAddress} numberOfLines={1}>{property.address}</Text>
                </View>
                <View style={[styles.typeBadge, { backgroundColor: tc.bg }]}>
                    <Text style={[styles.typeText, { color: tc.text }]}>{typeLabel[property.type] ?? property.type}</Text>
                </View>
            </View>

            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{total}</Text>
                    <Text style={styles.statLabel}>Total</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: '#16A34A' }]}>{occupied}</Text>
                    <Text style={styles.statLabel}>Occupied</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: '#D97706' }]}>{vacant}</Text>
                    <Text style={styles.statLabel}>Vacant</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: '#1601AA' }]}>{occupancyPct}%</Text>
                    <Text style={styles.statLabel}>Occupancy</Text>
                </View>
            </View>

            {/* Occupancy bar */}
            <View style={styles.barBg}>
                <View style={[styles.barFill, { width: `${occupancyPct}%` as any }]} />
            </View>
        </TouchableOpacity>
    );
}

export default function PropertiesScreen() {
    const { properties, loading, error, refetch } = useProperties();

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={22} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Properties</Text>
                <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => router.push('/add-property')}
                >
                    <Ionicons name="add" size={22} color="#FFFFFF" />
                </TouchableOpacity>
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
            ) : properties.length === 0 ? (
                <View style={styles.center}>
                    <Ionicons name="business-outline" size={56} color="#E5E7EB" />
                    <Text style={styles.emptyTitle}>No properties yet</Text>
                    <Text style={styles.emptySubtitle}>Tap the + button to add your first property</Text>
                    <TouchableOpacity style={styles.addFirstBtn} onPress={() => router.push('/add-property')}>
                        <Ionicons name="add-circle-outline" size={18} color="#FFFFFF" />
                        <Text style={styles.addFirstBtnText}>Add Property</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={properties}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => <PropertyCard property={item} />}
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
    addBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#1601AA', alignItems: 'center', justifyContent: 'center' },
    list: { padding: 16, gap: 14, paddingBottom: 32 },
    card: {
        backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16,
        borderWidth: 1, borderColor: '#F3F4F6',
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
    },
    cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 16 },
    propertyName: { fontSize: 16, fontFamily: FontFamily.interBold, color: '#111827', marginBottom: 3 },
    propertyAddress: { fontSize: 13, fontFamily: FontFamily.lato, color: '#6B7280' },
    typeBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
    typeText: { fontSize: 11, fontFamily: FontFamily.interSemiBold },
    statsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    statItem: { flex: 1, alignItems: 'center' },
    statValue: { fontSize: 18, fontFamily: FontFamily.interBold, color: '#111827' },
    statLabel: { fontSize: 11, fontFamily: FontFamily.lato, color: '#9CA3AF', marginTop: 2 },
    statDivider: { width: 1, height: 32, backgroundColor: '#F3F4F6' },
    barBg: { height: 6, backgroundColor: '#F3F4F6', borderRadius: 3, overflow: 'hidden' },
    barFill: { height: '100%', backgroundColor: '#1601AA', borderRadius: 3 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
    errorText: { fontSize: 14, fontFamily: FontFamily.lato, color: '#6B7280', textAlign: 'center', marginTop: 12 },
    retryBtn: { marginTop: 16, backgroundColor: '#1601AA', borderRadius: 10, paddingHorizontal: 24, paddingVertical: 10 },
    retryText: { fontSize: 14, fontFamily: FontFamily.interSemiBold, color: '#FFFFFF' },
    emptyTitle: { fontSize: 18, fontFamily: FontFamily.interBold, color: '#374151', marginTop: 16 },
    emptySubtitle: { fontSize: 14, fontFamily: FontFamily.lato, color: '#9CA3AF', textAlign: 'center', marginTop: 6 },
    addFirstBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#1601AA', borderRadius: 12, paddingHorizontal: 20, paddingVertical: 12, marginTop: 24 },
    addFirstBtnText: { fontSize: 14, fontFamily: FontFamily.interSemiBold, color: '#FFFFFF' },
});
