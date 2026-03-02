import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontFamily } from '@/constants/theme';

interface Props {
    message: string;
}

export default function ErrorBanner({ message }: Props) {
    return (
        <View style={styles.banner}>
            <Ionicons name="alert-circle" size={18} color="#DC2626" />
            <Text style={styles.text}>{message}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    banner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: '#FEF2F2',
        borderRadius: 10,
        padding: 12,
        marginHorizontal: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#FCA5A5',
    },
    text: { flex: 1, fontSize: 13, fontFamily: FontFamily.lato, color: '#DC2626' },
});
