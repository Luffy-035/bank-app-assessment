import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontFamily } from '@/constants/theme';

type BadgeType = 'occupied' | 'vacant' | 'paid' | 'partial' | 'pending' | 'open' | 'in_progress' | 'resolved' | 'closed' | 'active' | 'moved_out';

interface Props {
    type: BadgeType;
    label?: string; // optional override label
}

const CONFIG: Record<BadgeType, { bg: string; text: string; defaultLabel: string }> = {
    occupied: { bg: '#DCFCE7', text: '#16A34A', defaultLabel: 'Occupied' },
    vacant: { bg: '#FEF3C7', text: '#D97706', defaultLabel: 'Vacant' },
    paid: { bg: '#DCFCE7', text: '#16A34A', defaultLabel: 'Paid' },
    partial: { bg: '#FEF3C7', text: '#D97706', defaultLabel: 'Partial' },
    pending: { bg: '#FEE2E2', text: '#DC2626', defaultLabel: 'Pending' },
    open: { bg: '#FEE2E2', text: '#DC2626', defaultLabel: 'Open' },
    in_progress: { bg: '#DBEAFE', text: '#2563EB', defaultLabel: 'In Progress' },
    resolved: { bg: '#DCFCE7', text: '#16A34A', defaultLabel: 'Resolved' },
    closed: { bg: '#F3F4F6', text: '#6B7280', defaultLabel: 'Closed' },
    active: { bg: '#DCFCE7', text: '#16A34A', defaultLabel: 'Active' },
    moved_out: { bg: '#F3F4F6', text: '#6B7280', defaultLabel: 'Moved Out' },
};

export default function Badge({ type, label }: Props) {
    const cfg = CONFIG[type] ?? CONFIG.closed;
    return (
        <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
            <Text style={[styles.text, { color: cfg.text }]}>
                {label ?? cfg.defaultLabel}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    text: {
        fontSize: 11,
        fontFamily: FontFamily.interSemiBold,
    },
});
