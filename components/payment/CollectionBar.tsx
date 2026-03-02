import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontFamily } from '@/constants/theme';

interface Props {
    received: number;
    pending: number;
    total: number;
}

export default function CollectionBar({ received, pending, total }: Props) {
    const receivedPct = total > 0 ? (received / total) * 100 : 0;
    const pendingPct = total > 0 ? (pending / total) * 100 : 0;

    return (
        <View>
            <View style={styles.barRow}>
                <View style={[styles.barReceived, { flex: receivedPct }]} />
                <View style={[styles.barPending, { flex: pendingPct }]} />
            </View>

            <View style={styles.row}>
                <View style={styles.dotWrap}><View style={[styles.dot, { backgroundColor: '#22C55E' }]} /></View>
                <Text style={styles.label}>Received</Text>
                <View style={{ flex: 1 }} />
                <Text style={[styles.val, { color: '#22C55E' }]}>₹{received.toLocaleString('en-IN')}</Text>
            </View>

            <View style={styles.row}>
                <View style={styles.dotWrap}><View style={[styles.dot, { backgroundColor: '#EF4444' }]} /></View>
                <Text style={styles.label}>Pending</Text>
                <View style={{ flex: 1 }} />
                <Text style={[styles.val, { color: '#EF4444' }]}>₹{pending.toLocaleString('en-IN')}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
                <View style={styles.dotWrap} />
                <Text style={styles.label}>Total</Text>
                <View style={{ flex: 1 }} />
                <Text style={styles.totalVal}>₹{total.toLocaleString('en-IN')}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    barRow: { flexDirection: 'row', height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 16 },
    barReceived: { backgroundColor: '#22C55E' },
    barPending: { backgroundColor: '#EF4444' },
    row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    dotWrap: { width: 20, alignItems: 'center' },
    dot: { width: 8, height: 8, borderRadius: 4 },
    label: { fontSize: 14, fontFamily: FontFamily.lato, color: '#374151', marginLeft: 8 },
    val: { fontSize: 14, fontFamily: FontFamily.interSemiBold },
    divider: { height: 1, borderStyle: 'dashed', borderWidth: 1, borderColor: '#D1D5DB', marginVertical: 8 },
    totalVal: { fontSize: 15, fontFamily: FontFamily.interBold, color: '#111827' },
});
