import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontFamily } from '@/constants/theme';
import Badge from '@/components/common/Badge';
import type { MaintenanceRequest } from '@/types/maintenance.types';

interface Props {
    request: MaintenanceRequest;
    onPress: () => void;
}

const CATEGORY_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
    plumbing: 'water',
    electrical: 'flash',
    appliance: 'tv',
    structural: 'construct',
    other: 'ellipsis-horizontal',
};

export default function RequestCard({ request, onPress }: Props) {
    const iconName = CATEGORY_ICON[request.category] ?? 'build';
    const tenantName = (request as any).tenant?.userId?.name ?? 'Tenant';
    const unitNum = (request as any).tenant?.unitId?.unitNumber ?? '';

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
            <View style={styles.iconWrap}>
                <Ionicons name={iconName} size={20} color="#1601AA" />
            </View>
            <View style={styles.info}>
                <Text style={styles.title} numberOfLines={1}>{request.title}</Text>
                <Text style={styles.meta}>{tenantName}{unitNum ? ` · Unit ${unitNum}` : ''}</Text>
                <Text style={styles.date}>{new Date(request.createdAt).toLocaleDateString('en-IN')}</Text>
            </View>
            <View style={styles.right}>
                <Badge type={request.status} />
                <Ionicons name="chevron-forward" size={16} color="#9CA3AF" style={{ marginTop: 8 }} />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#FFFFFF', borderRadius: 14,
        padding: 14, marginBottom: 10,
        borderWidth: 1, borderColor: '#F0F0F5',
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
    },
    iconWrap: {
        width: 44, height: 44, borderRadius: 12,
        backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center', marginRight: 12,
    },
    info: { flex: 1 },
    title: { fontSize: 14, fontFamily: FontFamily.interSemiBold, color: '#111827' },
    meta: { fontSize: 12, fontFamily: FontFamily.lato, color: '#6B7280', marginTop: 2 },
    date: { fontSize: 11, fontFamily: FontFamily.lato, color: '#9CA3AF', marginTop: 3 },
    right: { alignItems: 'flex-end' },
});
