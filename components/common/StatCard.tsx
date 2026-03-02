import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { ReactNode } from 'react';
import { FontFamily } from '@/constants/theme';

interface Props {
    iconName?: ReactNode;
    iconBg?: string;
    label: string;
    value: string | number;
    onPress?: () => void;
}

export default function StatCard({ iconName, iconBg, label, value, onPress }: Props) {
    const Card = onPress ? TouchableOpacity : View;
    return (
        <Card style={styles.card} onPress={onPress as any} activeOpacity={0.75}>
            <View style={styles.top}>
                {iconName && (
                    <View style={[styles.iconWrap, iconBg ? { backgroundColor: iconBg } : {}]}>
                        {iconName}
                    </View>
                )}
                <View style={styles.titleBlock}>
                    <Text style={styles.label}>{label}</Text>
                    <View style={styles.titleLine} />
                </View>
            </View>
            <Text style={styles.value}>{value}</Text>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        backgroundColor: '#1601AA',
        borderRadius: 16,
        padding: 14,
        minHeight: 120,
        justifyContent: 'space-between',
    },
    top: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    iconWrap: {
        width: 36, height: 36, borderRadius: 10,
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    titleBlock: { flex: 1 },
    label: { fontSize: 13, fontFamily: FontFamily.interSemiBold, color: 'rgba(255,255,255,0.85)' },
    titleLine: { height: 2, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 1, marginTop: 4, width: '60%' },
    value: { fontSize: 26, fontFamily: FontFamily.interBold, color: '#FFFFFF', marginTop: 8 },
});
