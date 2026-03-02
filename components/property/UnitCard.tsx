import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontFamily } from '@/constants/theme';
import Badge from '@/components/common/Badge';
import type { Unit } from '@/types/property.types';

interface Props {
    unit: Unit;
    onPress: () => void;
}

export default function UnitCard({ unit, onPress }: Props) {
    const tenantName =
        typeof unit.currentTenantId === 'object' && unit.currentTenantId
            ? unit.currentTenantId.userId?.name
            : null;

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
            <View style={styles.left}>
                <Text style={styles.unitNum}>Unit {unit.unitNumber}</Text>
                <Text style={styles.floor}>Floor {unit.floorNumber} · {unit.unitConfig}</Text>
                {tenantName ? (
                    <Text style={styles.tenant}>{tenantName}</Text>
                ) : (
                    <Text style={styles.vacant}>Available</Text>
                )}
            </View>
            <View style={styles.right}>
                <Badge type={unit.status} />
                <Text style={styles.rent}>₹{unit.rentAmount.toLocaleString('en-IN')}</Text>
                <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        borderRadius: 14, padding: 14,
        marginBottom: 10, borderWidth: 1, borderColor: '#F0F0F5',
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
    },
    left: { flex: 1 },
    unitNum: { fontSize: 15, fontFamily: FontFamily.interSemiBold, color: '#111827' },
    floor: { fontSize: 12, fontFamily: FontFamily.lato, color: '#6B7280', marginTop: 2 },
    tenant: { fontSize: 13, fontFamily: FontFamily.interSemiBold, color: '#1601AA', marginTop: 4 },
    vacant: { fontSize: 12, fontFamily: FontFamily.lato, color: '#D97706', marginTop: 4 },
    right: { alignItems: 'flex-end', gap: 6 },
    rent: { fontSize: 13, fontFamily: FontFamily.interSemiBold, color: '#111827' },
});
