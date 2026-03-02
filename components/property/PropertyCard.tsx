import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontFamily } from '@/constants/theme';
import type { Property } from '@/types/property.types';

interface Props {
    property: Property;
    onPress: () => void;
}

const TYPE_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
    building: 'business',
    floor: 'layers',
    pg: 'home',
};

export default function PropertyCard({ property, onPress }: Props) {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
            <View style={styles.imageArea}>
                <View style={styles.badge}>
                    <Ionicons name={TYPE_ICON[property.type] ?? 'business'} size={12} color="#374151" />
                    <Text style={styles.badgeText}>{property.type.toUpperCase()}</Text>
                </View>
            </View>
            <View style={styles.metaRow}>
                <View style={styles.ratingWrap}>
                    <Ionicons name="star" size={11} color="#F59E0B" />
                    <Text style={styles.ratingText}>4.8</Text>
                </View>
            </View>
            <Text style={styles.name} numberOfLines={1}>{property.name}</Text>
            <Text style={styles.addr} numberOfLines={1}>{property.address}</Text>
            <View style={styles.footer}>
                <Text style={styles.unitCount}>
                    {property.unitCount ?? 0} units
                </Text>
                {property.occupiedCount !== undefined && (
                    <Text style={styles.occupiedCount}>
                        {property.occupiedCount} occupied
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        flex: 1,
    },
    imageArea: { height: 100, backgroundColor: '#F3F4F6', borderRadius: 10, marginBottom: 10, justifyContent: 'flex-end', padding: 8 },
    badge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F3F4F6', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, alignSelf: 'flex-start' },
    badgeText: { fontSize: 11, fontFamily: FontFamily.latoSemiBold, color: '#4B5563' },
    metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 8 },
    ratingWrap: { flexDirection: 'row', alignItems: 'center', gap: 3 },
    ratingText: { fontSize: 12, fontFamily: FontFamily.interSemiBold, color: '#111827' },
    name: { fontSize: 13, fontFamily: FontFamily.interSemiBold, color: '#111827' },
    addr: { fontSize: 12, fontFamily: FontFamily.lato, color: '#6B7280', marginTop: 3 },
    footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
    unitCount: { fontSize: 11, fontFamily: FontFamily.latoSemiBold, color: '#6B7280' },
    occupiedCount: { fontSize: 11, fontFamily: FontFamily.latoSemiBold, color: '#16A34A' },
});
