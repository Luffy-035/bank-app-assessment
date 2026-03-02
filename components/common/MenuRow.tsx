import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { FontFamily } from '@/constants/theme';

interface Props {
    icon: ReactNode;
    iconBg: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    titleColor?: string;
}

export default function MenuRow({ icon, iconBg, title, subtitle, onPress, titleColor }: Props) {
    return (
        <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7} disabled={!onPress}>
            <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
                {icon}
            </View>
            <View style={styles.textWrap}>
                <Text style={[styles.title, titleColor ? { color: titleColor } : {}]}>{title}</Text>
                {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 14,
    },
    iconWrap: {
        width: 40, height: 40, borderRadius: 10,
        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    },
    textWrap: { flex: 1 },
    title: { fontSize: 15, fontFamily: FontFamily.interSemiBold, color: '#111827', marginBottom: 2 },
    subtitle: { fontSize: 12, fontFamily: FontFamily.lato, color: '#6B7280' },
});
