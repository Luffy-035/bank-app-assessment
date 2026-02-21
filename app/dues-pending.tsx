import { FontFamily } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const DUES_DATA = [
    {
        id: '1',
        room: 'Unit 5B',
        tenantName: 'John Smith',
        amountDue: '₹2,000',
        daysOverdue: 5,
        phone: '+91 98765 43210',
    },
    {
        id: '2',
        room: 'Unit 3A',
        tenantName: 'Priya Sharma',
        amountDue: '₹3,500',
        daysOverdue: 12,
        phone: '+91 91234 56789',
    },
    {
        id: '3',
        room: 'Unit 8C',
        tenantName: 'Ravi Mehta',
        amountDue: '₹1,200',
        daysOverdue: 2,
        phone: '+91 99988 77665',
    },
];

export default function DuesPendingScreen() {
    const [remindedIds, setRemindedIds] = useState<string[]>([]);

    const sendReminder = (tenant: typeof DUES_DATA[0]) => {
        if (remindedIds.includes(tenant.id)) {
            Alert.alert('Already Sent', `A reminder has already been sent to ${tenant.tenantName}.`);
            return;
        }
        Alert.alert(
            'Reminder Sent',
            `A payment reminder has been sent to ${tenant.tenantName} (${tenant.room}).\n\nMessage: "Your landlord has requested you to complete your pending payment of ${tenant.amountDue}."`,
            [{ text: 'OK' }]
        );
        setRemindedIds((prev) => [...prev, tenant.id]);
    };

    const sendAllReminders = () => {
        const unreminded = DUES_DATA.filter((t) => !remindedIds.includes(t.id));
        if (unreminded.length === 0) {
            Alert.alert('All Done', 'Reminders have already been sent to all tenants.');
            return;
        }
        Alert.alert(
            'Send All Reminders',
            `Send payment reminders to all ${unreminded.length} tenants with pending dues?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Send All',
                    onPress: () => {
                        setRemindedIds(DUES_DATA.map((t) => t.id));
                        Alert.alert('Done', 'Reminders sent to all tenants with pending dues.');
                    },
                },
            ]
        );
    };

    const totalDue = '₹6,700';

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
                    <Text style={styles.summaryLabel}>{DUES_DATA.length} Tenants with Dues</Text>
                    <Text style={styles.summaryAmount}>{totalDue} Total Pending</Text>
                </View>
                <View style={styles.summaryIcon}>
                    <Ionicons name="warning" size={28} color="#F59E0B" />
                </View>
            </View>

            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {DUES_DATA.map((tenant) => {
                    const reminded = remindedIds.includes(tenant.id);
                    return (
                        <View key={tenant.id} style={styles.tenantCard}>
                            {/* Left: Avatar + Info */}
                            <View style={styles.cardLeft}>
                                <View style={styles.avatar}>
                                    <Text style={styles.avatarText}>{tenant.tenantName[0]}</Text>
                                </View>
                                <View style={styles.info}>
                                    <Text style={styles.tenantName}>{tenant.tenantName}</Text>
                                    <View style={styles.roomRow}>
                                        <Ionicons name="bed-outline" size={13} color="#6B7280" />
                                        <Text style={styles.roomText}>{tenant.room}</Text>
                                    </View>
                                    <View style={styles.overdueRow}>
                                        <Ionicons name="time-outline" size={12} color="#EF4444" />
                                        <Text style={styles.overdueText}>{tenant.daysOverdue} days overdue</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Right: Amount + Remind Button */}
                            <View style={styles.cardRight}>
                                <Text style={styles.amount}>{tenant.amountDue}</Text>
                                <TouchableOpacity
                                    style={[styles.remindBtn, reminded && styles.remindBtnSent]}
                                    onPress={() => sendReminder(tenant)}
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
                        Tapping <Text style={{ fontFamily: FontFamily.latoBold }}>Remind</Text> sends a payment request message to the tenant. Tap the 🔔 bell icon at the top to remind all tenants at once.
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
