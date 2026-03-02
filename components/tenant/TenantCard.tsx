import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontFamily } from '@/constants/theme';
import type { Tenant } from '@/types/tenant.types';

interface Props {
    tenant: Tenant;
    onPress: () => void;
}

export default function TenantCard({ tenant, onPress }: Props) {
    const user = typeof tenant.userId === 'object' ? tenant.userId : null;
    const unit = typeof tenant.unitId === 'object' ? tenant.unitId : null;
    const property = typeof tenant.propertyId === 'object' ? tenant.propertyId : null;

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
            <View style={styles.avatarWrap}>
                <Text style={styles.avatarText}>{user?.name?.[0]?.toUpperCase() ?? 'T'}</Text>
            </View>
            <View style={styles.info}>
                <Text style={styles.name}>{user?.name ?? 'Tenant'}</Text>
                <Text style={styles.meta}>
                    {property ? (property as any).name : ''}{unit ? ` · Unit ${(unit as any).unitNumber}` : ''}
                </Text>
                <Text style={styles.tenantId}>ID: {tenant.tenantId}</Text>
            </View>
            <View style={styles.right}>
                <Text style={styles.rent}>₹{tenant.rentAmount.toLocaleString('en-IN')}</Text>
                <Text style={styles.rentLabel}>/mo</Text>
                <Ionicons name="chevron-forward" size={16} color="#9CA3AF" style={{ marginTop: 4 }} />
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
    avatarWrap: {
        width: 46, height: 46, borderRadius: 23,
        backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center', marginRight: 12,
    },
    avatarText: { fontSize: 18, fontFamily: FontFamily.interBold, color: '#1601AA' },
    info: { flex: 1 },
    name: { fontSize: 15, fontFamily: FontFamily.interSemiBold, color: '#111827' },
    meta: { fontSize: 12, fontFamily: FontFamily.lato, color: '#6B7280', marginTop: 2 },
    tenantId: { fontSize: 11, fontFamily: FontFamily.latoSemiBold, color: '#9CA3AF', marginTop: 4 },
    right: { alignItems: 'flex-end' },
    rent: { fontSize: 14, fontFamily: FontFamily.interBold, color: '#111827' },
    rentLabel: { fontSize: 11, fontFamily: FontFamily.lato, color: '#6B7280' },
});
