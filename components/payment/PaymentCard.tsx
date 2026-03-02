import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontFamily } from '@/constants/theme';
import Badge from '@/components/common/Badge';
import type { Payment } from '@/types/payment.types';

interface Props {
    payment: Payment;
    onPress?: () => void;
}

const MODE_LABEL: Record<string, string> = {
    cash: 'Cash',
    upi: 'UPI',
    bank_transfer: 'Bank Transfer',
    cheque: 'Cheque',
    other: 'Other',
};

export default function PaymentCard({ payment, onPress }: Props) {
    const tenant = typeof payment.tenantId === 'object' ? payment.tenantId : null;
    const tenantName = (tenant as any)?.userId?.name ?? 'Tenant';

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={onPress}
            activeOpacity={onPress ? 0.8 : 1}
        >
            <View style={styles.iconWrap}>
                <Ionicons name="receipt" size={20} color="#1601AA" />
            </View>
            <View style={styles.info}>
                <Text style={styles.name}>{tenantName}</Text>
                <Text style={styles.meta}>
                    {payment.month} · {MODE_LABEL[payment.paymentMode] ?? payment.paymentMode}
                </Text>
            </View>
            <View style={styles.right}>
                <Text style={styles.amount}>₹{payment.amountPaid.toLocaleString('en-IN')}</Text>
                <Badge type={payment.status} />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#FFFFFF', borderRadius: 14,
        padding: 14, marginBottom: 10,
        borderWidth: 1, borderColor: '#F0F0F5',
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
    },
    iconWrap: {
        width: 42, height: 42, borderRadius: 12,
        backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center', marginRight: 12,
    },
    info: { flex: 1 },
    name: { fontSize: 14, fontFamily: FontFamily.interSemiBold, color: '#111827' },
    meta: { fontSize: 12, fontFamily: FontFamily.lato, color: '#6B7280', marginTop: 2 },
    right: { alignItems: 'flex-end', gap: 6 },
    amount: { fontSize: 15, fontFamily: FontFamily.interBold, color: '#111827' },
});
