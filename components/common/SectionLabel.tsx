import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { FontFamily } from '@/constants/theme';

export default function SectionLabel({ label }: { label: string }) {
    return <Text style={styles.label}>{label}</Text>;
}

const styles = StyleSheet.create({
    label: {
        fontSize: 11,
        fontFamily: FontFamily.interSemiBold,
        color: '#9CA3AF',
        letterSpacing: 1,
        paddingHorizontal: 20,
        marginBottom: 8,
        marginTop: 4,
        textTransform: 'uppercase',
    },
});
