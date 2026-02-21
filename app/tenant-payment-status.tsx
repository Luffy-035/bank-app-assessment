import { FontFamily } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

const tenants = [
    {
        name: 'Sarah Johnson',
        unit: 'Unit 204',
        status: 'Received',
        statusColor: '#22C55E',
        statusBg: '#DCFCE7',
        amount: '$850',
    },
    {
        name: 'Michael Chen',
        unit: 'Unit 305',
        status: 'Due', // Simplified from 'Partially Paid'
        statusColor: '#F59E0B',
        statusBg: '#FEF3C7', // Due color
        amount: '$400',
    },
    {
        name: 'David Martinez',
        unit: 'Unit 102',
        status: 'Due',
        statusColor: '#1601AA',
        statusBg: '#DBEAFE',
        amount: '$750',
    },
    {
        name: 'Lisa Anderson',
        unit: 'Unit 201',
        status: 'Overdue', // Simplified from 'Overdue 45 Days'
        statusColor: '#EF4444',
        statusBg: '#FEE2E2',
        amount: '$250',
    },
    {
        name: 'Emma Thompson',
        unit: 'Unit 503',
        status: 'Received',
        statusColor: '#22C55E',
        statusBg: '#DCFCE7',
        amount: '$680',
    },
];

export default function TenantPaymentStatusScreen() {
    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Tenant Payment Status</Text>
                <View style={{ width: 30 }} />
            </View>

            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                <View style={styles.gridContainer}>
                    {tenants.map((tenant, index) => (
                        <View key={index} style={styles.card}>
                            <View style={styles.cardHeader}>
                                <View style={[styles.statusBadge, { backgroundColor: tenant.statusBg }]}>
                                    <Text style={[styles.statusText, { color: tenant.statusColor }]}>{tenant.status}</Text>
                                </View>
                                <Text style={styles.amountText}>{tenant.amount}</Text>
                            </View>

                            <View style={styles.cardContent}>
                                <View style={styles.avatarPlaceholder}>
                                    <Text style={styles.avatarText}>{tenant.name.charAt(0)}</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.tenantName} numberOfLines={1} adjustsFontSizeToFit>{tenant.name}</Text>
                                    <Text style={styles.tenantUnit}>{tenant.unit}</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 50,
        paddingHorizontal: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backBtn: { padding: 4 },
    headerTitle: { fontSize: 18, fontFamily: FontFamily.interBold, color: '#111827' },
    scroll: { flex: 1 },

    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 16,
        gap: 16,
    },
    card: {
        width: cardWidth,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 10,
        fontFamily: FontFamily.interSemiBold,
    },
    amountText: {
        fontSize: 14,
        fontFamily: FontFamily.interBold,
        color: '#111827',
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    avatarPlaceholder: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: 14,
        fontFamily: FontFamily.interSemiBold,
        color: '#6B7280',
    },
    tenantName: {
        fontSize: 13,
        fontFamily: FontFamily.interSemiBold,
        color: '#111827',
    },
    tenantUnit: {
        fontSize: 11,
        fontFamily: FontFamily.lato,
        color: '#6B7280',
        marginTop: 2,
    },
});
