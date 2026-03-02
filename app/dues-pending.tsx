import { FontFamily } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Linking,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { usePayments } from '@/hooks/usePayments';

export default function DuesPendingScreen() {
    const { dues, loading } = usePayments();
    const [remindedIds, setRemindedIds] = useState<string[]>([]);

    const sendReminder = (tenantId: string, tenantName: string, unit: string, amount: string, phone?: string) => {
        if (remindedIds.includes(tenantId)) {
            Alert.alert('Already Noted', `You have already noted a reminder for ${tenantName}.`);
            return;
        }
        const actions: any[] = [
            { text: 'Dismiss', style: 'cancel' },
            {
                text: 'Mark Reminded',
                onPress: () => setRemindedIds((prev) => [...prev, tenantId]),
            },
        ];
        if (phone) {
            actions.unshift({
                text: `Call ${tenantName}`,
                onPress: () => Linking.openURL(`tel:${phone}`),
            });
        }
        Alert.alert(
            'Send Reminder',
            `Remind ${tenantName} (${unit}) about their pending payment of ${amount}.\n\nNote: In-app push notifications are coming soon. You can call the tenant directly now.`,
            actions
        );
    };

    const sendAllReminders = () => {
        const unreminded = dues.filter((d) => !remindedIds.includes(d.tenant._id));
        if (unreminded.length === 0) {
            Alert.alert('All Done', 'You have already noted reminders for all tenants.');
            return;
        }
        Alert.alert(
            'Note All Reminders',
            `Mark all ${unreminded.length} tenants as reminded? Push notifications are coming soon — use individual Call buttons to contact tenants directly.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Mark All',
                    onPress: () => {
                        setRemindedIds(dues.map((d) => d.tenant._id));
                    },
                },
            ]
        );
    };

    const totalPending = dues.reduce((sum, d) => sum + d.balance, 0);
    const totalDue = `₹${totalPending.toLocaleString('en-IN')}`;

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={22} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Dues Pending</Text>
                {/* Bell icon — send all reminders */}
                <TouchableOpacity onPress={sendAllReminders} style={styles.bellBtn}>
                    <Ionicons name="notifications" size={22} color="#1601AA" />
                </TouchableOpacity>
            </View>

            {/* Summary Banner */}
            <View style={styles.summaryBanner}>
                <View>
                    <Text style={styles.summaryLabel}>{dues.length} Tenants with Dues</Text>
                    <Text style={styles.summaryAmount}>{totalDue} Total Pending</Text>
                </View>
                <View style={styles.summaryIcon}>
                    <Ionicons name="warning" size={28} color="#F59E0B" />
                </View>
            </View>

            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {loading ? (
                    <ActivityIndicator size="large" color="#1601AA" style={{ marginTop: 40 }} />
                ) : dues.length === 0 ? (
                    <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                        <Ionicons name="checkmark-circle-outline" size={48} color="#D1D5DB" />
                        <Text style={{ color: '#9CA3AF', marginTop: 12, fontFamily: FontFamily.lato }}>
                            No pending dues.
                        </Text>
                    </View>
                ) : dues.map((d) => {
                    const tenantId = d.tenant._id;
                    const reminded = remindedIds.includes(tenantId);
                    const nameStr = (d.tenant as any)?.userId?.name ?? 'Tenant';
                    const unitStr = (d.unit as any)?.unitNumber ?? 'Unit';
                    const amountStr = `₹${d.balance.toLocaleString('en-IN')}`;
                    return (
                        <View key={tenantId} style={styles.tenantCard}>
                            {/* Left: Avatar + Info */}
                            <View style={styles.cardLeft}>
                                <View style={styles.avatar}>
                                    <Text style={styles.avatarText}>{nameStr[0]?.toUpperCase() ?? '?'}</Text>
                                </View>
                                <View style={styles.info}>
                                    <Text style={styles.tenantName}>{nameStr}</Text>
                                    <View style={styles.roomRow}>
                                        <Ionicons name="bed-outline" size={13} color="#6B7280" />
                                        <Text style={styles.roomText}>{unitStr}</Text>
                                    </View>
                                    <View style={styles.overdueRow}>
                                        <Ionicons name="time-outline" size={12} color="#EF4444" />
                                        <Text style={styles.overdueText}>₹{d.amountPaid.toLocaleString('en-IN')} paid of ₹{d.rentDue.toLocaleString('en-IN')}</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Right: Amount + Remind Button */}
                            <View style={styles.cardRight}>
                                <Text style={styles.amount}>{amountStr}</Text>
                                <TouchableOpacity
                                    style={[styles.remindBtn, reminded && styles.remindBtnSent]}
                                    onPress={() => sendReminder(tenantId, nameStr, unitStr, amountStr, (d.tenant as any)?.userId?.phone)}
                                    activeOpacity={0.75}
                                >
                                    <Ionicons
                                        name={reminded ? 'checkmark-circle' : 'notifications-outline'}
                                        size={14}
                                        color={reminded ? '#16A34A' : '#1601AA'}
                                    />
                                    <Text style={[styles.remindBtnText, reminded && styles.remindBtnTextSent]}>
                                        {reminded ? 'Sent' : 'Remind'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    );
                })}

                {/* Info note */}
                <View style={styles.infoBox}>
                    <Ionicons name="information-circle-outline" size={16} color="#6B7280" />
                    <Text style={styles.infoText}>
                        Tap <Text style={{ fontFamily: FontFamily.latoBold }}>Remind</Text> to call or note a reminder for the tenant. Tap the 🔔 icon at the top to mark all as reminded. Push notifications will be available in a future update.
                    </Text>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 14,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    backBtn: {
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: '#F3F4F6',
        alignItems: 'center', justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 17,
        fontFamily: FontFamily.interSemiBold,
        color: '#111827',
    },
    bellBtn: {
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: '#EEF2FF',
        alignItems: 'center', justifyContent: 'center',
    },
    summaryBanner: {
        margin: 16,
        backgroundColor: '#1601AA',
        borderRadius: 14,
        padding: 18,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    summaryLabel: {
        fontSize: 13,
        fontFamily: FontFamily.lato,
        color: 'rgba(255,255,255,0.75)',
        marginBottom: 4,
    },
    summaryAmount: {
        fontSize: 22,
        fontFamily: FontFamily.interBold,
        color: '#FFFFFF',
    },
    summaryIcon: {
        width: 52, height: 52, borderRadius: 26,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center', justifyContent: 'center',
    },
    scroll: { flex: 1 },
    scrollContent: { paddingHorizontal: 16, paddingTop: 4 },
    tenantCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 1,
    },
    cardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 },
    avatar: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: '#EDE9FE',
        alignItems: 'center', justifyContent: 'center',
    },
    avatarText: {
        fontSize: 18,
        fontFamily: FontFamily.interBold,
        color: '#1601AA',
    },
    info: { flex: 1 },
    tenantName: {
        fontSize: 14,
        fontFamily: FontFamily.interSemiBold,
        color: '#111827',
        marginBottom: 3,
    },
    roomRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 },
    roomText: { fontSize: 12, fontFamily: FontFamily.lato, color: '#6B7280' },
    overdueRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    overdueText: { fontSize: 11, fontFamily: FontFamily.lato, color: '#EF4444' },
    cardRight: { alignItems: 'flex-end', gap: 8 },
    amount: {
        fontSize: 16,
        fontFamily: FontFamily.interBold,
        color: '#111827',
    },
    remindBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#EEF2FF',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderWidth: 1,
        borderColor: '#C7D2FE',
    },
    remindBtnSent: {
        backgroundColor: '#F0FDF4',
        borderColor: '#BBF7D0',
    },
    remindBtnText: {
        fontSize: 11,
        fontFamily: FontFamily.latoBold,
        color: '#1601AA',
    },
    remindBtnTextSent: {
        color: '#16A34A',
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        backgroundColor: '#F3F4F6',
        borderRadius: 10,
        padding: 12,
        marginTop: 4,
    },
    infoText: {
        flex: 1,
        fontSize: 12,
        fontFamily: FontFamily.lato,
        color: '#6B7280',
        lineHeight: 18,
    },
});
