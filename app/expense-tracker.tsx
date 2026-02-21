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

const expenses = [
    { id: '1', label: 'Maintenance', amount: 4200, color: '#1601AA', width: '100%', incurredBy: 'John (Manager)', date: 'Oct 12' },
    { id: '2', label: 'Utilities', amount: 2800, color: '#1601AA', width: '67%', incurredBy: 'Auto-Pay', date: 'Oct 01' },
    { id: '3', label: 'Insurance', amount: 1500, color: '#1601AA', width: '36%', incurredBy: 'Admin', date: 'Oct 05' },
    { id: '4', label: 'Staff', amount: 3200, color: '#9CA3AF', width: '76%', incurredBy: 'HR Dept', date: 'Oct 15' },
    { id: '5', label: 'Other', amount: 800, color: '#1601AA', width: '19%', incurredBy: 'Petty Cash', date: 'Oct 20' },
];

export default function ExpenseTrackerScreen() {
    const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Expense Tracker</Text>
                <View style={{ width: 30 }} />
            </View>

            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

                {/* Total Expenses Card */}
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryLabel}>Total Expenses (This Month)</Text>
                    <Text style={styles.summaryValue}>${totalExpenses.toLocaleString()}</Text>
                </View>

                {/* Expense Graph (Visual Representation) */}
                <View style={styles.chartCard}>
                    <Text style={styles.chartTitle}>Expense Breakdown</Text>
                    {expenses.map((expense, index) => (
                        <View key={index} style={styles.expenseRow}>
                            <View style={styles.expenseLabelRow}>
                                <Text style={styles.expenseLabel}>{expense.label}</Text>
                                <Text style={styles.expenseAmount}>${expense.amount.toLocaleString()}</Text>
                            </View>
                            <View style={styles.expenseBarContainer}>
                                <View style={[styles.expenseBar, { width: expense.width as any, backgroundColor: expense.color }]} />
                            </View>
                        </View>
                    ))}
                </View>

                {/* Detailed Expense List */}
                <Text style={styles.sectionTitle}>Detailed Transactions</Text>
                <View style={styles.detailsList}>
                    {expenses.map((expense) => (
                        <View key={expense.id} style={styles.detailCard}>
                            <View style={styles.detailIconWrap}>
                                <Ionicons name="receipt-outline" size={20} color="#1601AA" />
                            </View>
                            <View style={styles.detailContent}>
                                <Text style={styles.detailTitle}>{expense.label}</Text>
                                <Text style={styles.detailIncurred}>Incurred by: <Text style={styles.detailIncurredName}>{expense.incurredBy}</Text></Text>
                            </View>
                            <View style={styles.detailRight}>
                                <Text style={styles.detailAmount}>-${expense.amount.toLocaleString()}</Text>
                                <Text style={styles.detailDate}>{expense.date}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                <View style={{ height: 40 }} />
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

    summaryCard: {
        backgroundColor: '#1601AA',
        marginHorizontal: 16,
        borderRadius: 16,
        padding: 20,
        marginTop: 20,
        marginBottom: 20,
        alignItems: 'center',
    },
    summaryLabel: { fontSize: 13, fontFamily: FontFamily.lato, color: '#E0E7FF', marginBottom: 6 },
    summaryValue: { fontSize: 32, fontFamily: FontFamily.interBold, color: '#FFFFFF' },

    chartCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    chartTitle: { fontSize: 16, fontFamily: FontFamily.interBold, color: '#111827', marginBottom: 16 },
    expenseRow: { marginBottom: 16 },
    expenseLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    expenseLabel: { fontSize: 13, fontFamily: FontFamily.interSemiBold, color: '#374151' },
    expenseAmount: { fontSize: 13, fontFamily: FontFamily.interBold, color: '#111827' },
    expenseBarContainer: { height: 8, backgroundColor: '#F3F4F6', borderRadius: 4, overflow: 'hidden' },
    expenseBar: { height: '100%', borderRadius: 4 },

    sectionTitle: { fontSize: 16, fontFamily: FontFamily.interBold, color: '#111827', marginHorizontal: 16, marginBottom: 12 },
    detailsList: { paddingHorizontal: 16, gap: 12 },
    detailCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    detailIconWrap: {
        width: 40, height: 40, borderRadius: 20, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center', marginRight: 12,
    },
    detailContent: { flex: 1 },
    detailTitle: { fontSize: 14, fontFamily: FontFamily.interSemiBold, color: '#111827' },
    detailIncurred: { fontSize: 11, fontFamily: FontFamily.lato, color: '#6B7280', marginTop: 2 },
    detailIncurredName: { fontFamily: FontFamily.latoSemiBold, color: '#4B5563' },
    detailRight: { alignItems: 'flex-end' },
    detailAmount: { fontSize: 14, fontFamily: FontFamily.interBold, color: '#EF4444' },
    detailDate: { fontSize: 11, fontFamily: FontFamily.lato, color: '#9CA3AF', marginTop: 2 },

});
