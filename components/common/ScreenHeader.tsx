import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontFamily } from '@/constants/theme';

interface Props {
    title: string;
    onBack?: () => void;
    rightSlot?: React.ReactNode;
}

export default function ScreenHeader({ title, onBack, rightSlot }: Props) {
    return (
        <View style={styles.header}>
            {onBack ? (
                <TouchableOpacity onPress={onBack} style={styles.iconBtn}>
                    <Ionicons name="arrow-back" size={24} color="#111827" />
                </TouchableOpacity>
            ) : (
                <View style={styles.placeholder} />
            )}
            <Text style={styles.title}>{title}</Text>
            <View style={styles.right}>
                {rightSlot ?? <View style={styles.placeholder} />}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 56,
        paddingBottom: 14,
        paddingHorizontal: 20,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    iconBtn: { padding: 2 },
    placeholder: { width: 28 },
    title: { fontSize: 17, fontFamily: FontFamily.interSemiBold, color: '#111827' },
    right: { width: 28, alignItems: 'flex-end' },
});
