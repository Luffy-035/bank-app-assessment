import { FontFamily } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function RecordPaymentScreen() {
    const [description, setDescription] = useState('');

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Record Payments</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                <View style={styles.formContainer}>
                    {/* Payment Summary Card */}
                    <View style={styles.summaryCard}>
                        {/* Total Amount Row */}
                        <View style={styles.billRow}>
                            <Text style={styles.billLabel}>Total Amount</Text>
                            <Text style={styles.billAmount}>₹8,500</Text>
                        </View>

                        {/* Amount Paid Row with minus indicator */}
                        <View style={styles.billRow}>
                            <View style={styles.deductionRow}>
                                <View style={styles.minusCircle}>
                                    <Text style={styles.minusText}>−</Text>
                                </View>
                                <Text style={styles.billLabel}>Amount Paid</Text>
                            </View>
                            <Text style={styles.billAmountPaid}>₹8,000</Text>
                        </View>

                        {/* Dashed Divider */}
                        <View style={styles.dashedDivider} />

                        {/* Due Amount Row with equals indicator */}
                        <View style={styles.billRow}>
                            <View style={styles.deductionRow}>
                                <View style={styles.equalsCircle}>
                                    <Text style={styles.equalsText}>=</Text>
                                </View>
                                <Text style={styles.dueLabel}>Due</Text>
                            </View>
                            <Text style={styles.dueAmount}>₹500</Text>
                        </View>

                        {/* Info Boxes Row */}
                        <View style={styles.infoBoxesRow}>
                            <View style={styles.infoBox}>
                                <Text style={styles.infoBoxLabel}>Units Consumed</Text>
                                <Text style={styles.infoBoxValue}>125 kWh</Text>
                            </View>
                            <View style={styles.infoBox}>
                                <Text style={styles.infoBoxLabel}>Payment Method</Text>
                                <Text style={styles.infoBoxValue}>UPI</Text>
                            </View>
                        </View>

                        {/* View Receipt Button */}
                        <TouchableOpacity style={styles.viewReceiptBtn}>
                            <Text style={styles.viewReceiptText}>View Receipt</Text>
                            <Ionicons name="arrow-forward" size={16} color="#1601AA" />
                        </TouchableOpacity>
                    </View>

                    {/* Tenant Search */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Search by tenant name, number or ID</Text>
                        <TextInput
                            style={styles.input}
                            placeholder=""
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

                    {/* Amount Paid */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Amount paid</Text>
                        <TextInput
                            style={styles.input}
                            placeholder=""
                            keyboardType="numeric"
                        />
                    </View>

                    {/* Payment Date */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Payment date</Text>
                        <View style={styles.dateInputRow}>
                            <Text style={styles.dateText}>Dec 21, 2025</Text>
                            <Ionicons name="calendar-outline" size={20} color="#6B7280" />
                        </View>
                        <View style={styles.underline} />
                    </View>

                    {/* Payment Mode */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Payment mode</Text>
                        <View style={styles.dropdownRow}>
                            <Text style={styles.dropdownPlaceholder}></Text>
                            <Ionicons name="chevron-down" size={20} color="#6B7280" />
                        </View>
                        <View style={styles.underline} />
                    </View>

                    {/* Received By */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Received by</Text>
                        <TextInput
                            style={styles.input}
                            value="Ronak"
                            editable={false}
                        />
                    </View>

                    {/* Description */}
                    <View style={styles.textAreaGroup}>
                        <TextInput
                            style={styles.textArea}
                            placeholder="Description (optional)"
                            placeholderTextColor="#9CA3AF"
                            multiline
                            textAlignVertical="top"
                            maxLength={200}
                            onChangeText={setDescription}
                            value={description}
                        />
                        <Text style={styles.charCount}>{description.length}/200</Text>
                    </View>

                    {/* Attach Proof */}
                    <Text style={styles.sectionLabel}>Attach proof</Text>
                    <TouchableOpacity style={styles.attachBtn}>
                        <Ionicons name="image" size={18} color="#4B5563" />
                        <Text style={styles.attachBtnText}>Image</Text>
                    </TouchableOpacity>

                    <View style={{ height: 100 }} />
                </View>
            </ScrollView>

            {/* Footer Save Button */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.saveBtn} onPress={() => router.back()}>
                    <Text style={styles.saveBtnText}>Save</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backButton: {
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 17,
        fontFamily: FontFamily.interSemiBold,
        color: '#111827',
    },
    scroll: {
        flex: 1,
    },
    formContainer: {
        padding: 20,
    },
    // Payment Summary Card Styles
    summaryCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 28,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    billRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    deductionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    minusCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#FEE2E2',
        alignItems: 'center',
        justifyContent: 'center',
    },
    minusText: {
        fontSize: 16,
        fontFamily: FontFamily.interBold,
        color: '#EF4444',
        marginTop: -2,
    },
    equalsCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#DBEAFE',
        alignItems: 'center',
        justifyContent: 'center',
    },
    equalsText: {
        fontSize: 14,
        fontFamily: FontFamily.interBold,
        color: '#2563EB',
        marginTop: -1,
    },
    dashedDivider: {
        height: 1,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        marginVertical: 8,
    },
    billLabel: {
        fontSize: 15,
        fontFamily: FontFamily.lato,
        color: '#6B7280',
    },
    billAmount: {
        fontSize: 24,
        fontFamily: FontFamily.interBold,
        color: '#1F2937',
    },
    billAmountPaid: {
        fontSize: 18,
        fontFamily: FontFamily.interSemiBold,
        color: '#22C55E',
    },
    billDivider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 2,
    },
    dueLabel: {
        fontSize: 16,
        fontFamily: FontFamily.interBold,
        color: '#1F2937',
    },
    dueAmount: {
        fontSize: 22,
        fontFamily: FontFamily.interBold,
        color: '#EF4444',
    },
    infoBoxesRow: {
        flexDirection: 'row',
        gap: 14,
        marginTop: 20,
        marginBottom: 18,
    },
    infoBox: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        borderRadius: 14,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    infoBoxLabel: {
        fontSize: 12,
        fontFamily: FontFamily.lato,
        color: '#64748B',
        marginBottom: 6,
    },
    infoBoxValue: {
        fontSize: 16,
        fontFamily: FontFamily.interBold,
        color: '#1E293B',
    },
    viewReceiptBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 16,
        marginTop: 4,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    viewReceiptText: {
        fontSize: 15,
        fontFamily: FontFamily.interSemiBold,
        color: '#1601AA',
    },
    // Form Styles
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 13,
        fontFamily: FontFamily.lato,
        color: '#9CA3AF',
        marginBottom: 8,
    },
    input: {
        fontSize: 15,
        fontFamily: FontFamily.interMedium,
        color: '#111827',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingVertical: 8,
    },
    underline: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginTop: 8,
    },
    dateInputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dateText: {
        fontSize: 15,
        fontFamily: FontFamily.interMedium,
        color: '#111827',
    },
    dropdownRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
    },
    dropdownPlaceholder: {
        fontSize: 15,
        fontFamily: FontFamily.interMedium,
        color: '#111827',
    },
    textAreaGroup: {
        marginBottom: 24,
    },
    textArea: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 4,
        padding: 12,
        height: 100,
        fontSize: 13,
        fontFamily: FontFamily.lato,
        color: '#111827',
        backgroundColor: '#F9FAFB',
    },
    charCount: {
        alignSelf: 'flex-end',
        fontSize: 11,
        fontFamily: FontFamily.lato,
        color: '#9CA3AF',
        marginTop: 4,
    },
    sectionLabel: {
        fontSize: 14,
        fontFamily: FontFamily.interMedium,
        color: '#111827',
        marginBottom: 12,
    },
    attachBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E5E7EB',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 6,
        alignSelf: 'flex-start',
        gap: 8,
    },
    attachBtnText: {
        fontSize: 13,
        fontFamily: FontFamily.interMedium,
        color: '#374151',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 34,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    saveBtn: {
        backgroundColor: '#E0E7FF',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
    },
    saveBtnText: {
        fontSize: 15,
        fontFamily: FontFamily.interBold,
        color: '#FFFFFF',
    },
});
