import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontFamily } from '@/constants/theme';

interface Props {
    icon?: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle?: string;
}

export default function EmptyState({ icon = 'folder-open-outline', title, subtitle }: Props) {
    return (
        <View style={styles.container}>
            <View style={styles.iconWrap}>
                <Ionicons name={icon} size={40} color="#D1D5DB" />
            </View>
            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { alignItems: 'center', paddingVertical: 48, paddingHorizontal: 32 },
    iconWrap: {
        width: 72, height: 72, borderRadius: 36,
        backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
    },
    title: { fontSize: 16, fontFamily: FontFamily.interSemiBold, color: '#374151', textAlign: 'center', marginBottom: 6 },
    subtitle: { fontSize: 13, fontFamily: FontFamily.lato, color: '#9CA3AF', textAlign: 'center', lineHeight: 20 },
});
