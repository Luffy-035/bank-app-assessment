import { FontFamily } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const genders = ['Male', 'Female', 'Other'];
const mockProperties = ['Sunset Apartments', 'Riverstone Place', 'Maple Creek Apts'];
const roomTypes = ['1RK', '1HK', '1BHK', '2BHK', '3BHK'];

export default function AddTenantScreen() {
    const [name, setName] = useState('');
    const [gender, setGender] = useState('Male');
    const [phoneNumber, setPhoneNumber] = useState('');

    const [selectedProperty, setSelectedProperty] = useState('');
    const [showPropertyDropdown, setShowPropertyDropdown] = useState(false);

    const [selectedRoomType, setSelectedRoomType] = useState('1BHK');
    const [roomNumber, setRoomNumber] = useState('');

    const [rentAmount, setRentAmount] = useState('');
    const [securityAmount, setSecurityAmount] = useState('');

    // Rent Cycle (Day of month)
    const [rentCycle, setRentCycle] = useState('1');

    const handleSubmit = () => {
        // Logic to save tenant would go here
        console.log({
            name, gender, phoneNumber, selectedProperty, selectedRoomType, roomNumber, rentAmount, securityAmount, rentCycle
        });
        router.back();
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={22} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add New Tenant</Text>
                <View style={{ width: 30 }} />
            </View>

            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

                {/* Personal Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Personal Details</Text>

                    <Text style={styles.label}>Full Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Search or add tenant name"
                        placeholderTextColor="#9CA3AF"
                        value={name}
                        onChangeText={setName}
                    />

                    <Text style={styles.label}>Gender</Text>
                    <View style={styles.genderContainer}>
                        {genders.map((g) => (
                            <TouchableOpacity
                                key={g}
                                style={[styles.genderChip, gender === g && styles.genderChipActive]}
                                onPress={() => setGender(g)}
                            >
                                <Text style={[styles.genderText, gender === g && styles.genderTextActive]}>{g}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.label}>Phone Number</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="+91 98765 43210"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="phone-pad"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                    />
                </View>

                {/* Property Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Property Details</Text>

                    <Text style={styles.label}>Property</Text>
                    <TouchableOpacity
                        style={styles.dropdown}
                        onPress={() => setShowPropertyDropdown(!showPropertyDropdown)}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.dropdownText}>{selectedProperty || 'Select Property'}</Text>
                        <Ionicons name={showPropertyDropdown ? "chevron-up" : "chevron-down"} size={18} color="#6B7280" />
                    </TouchableOpacity>

                    {showPropertyDropdown && (
                        <View style={styles.dropdownList}>
                            {mockProperties.map((prop) => (
                                <TouchableOpacity
                                    key={prop}
                                    style={[
                                        styles.dropdownItem,
                                        selectedProperty === prop && styles.dropdownItemActive
                                    ]}
                                    onPress={() => {
                                        setSelectedProperty(prop);
                                        setShowPropertyDropdown(false);
                                    }}
                                >
                                    <Text style={[
                                        styles.dropdownItemText,
                                        selectedProperty === prop && styles.dropdownItemTextActive
                                    ]}>
                                        {prop}
                                    </Text>
                                    {selectedProperty === prop && (
                                        <Ionicons name="checkmark" size={16} color="#1601AA" />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    <Text style={styles.label}>Room Type</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.roomTypeScroll}>
                        {roomTypes.map((type) => (
                            <TouchableOpacity
                                key={type}
                                style={[styles.roomTypeChip, selectedRoomType === type && styles.roomTypeChipActive]}
                                onPress={() => setSelectedRoomType(type)}
                            >
                                <Text style={[styles.roomTypeText, selectedRoomType === type && styles.roomTypeTextActive]}>{type}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <Text style={styles.label}>Room Number</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. 101"
                        placeholderTextColor="#9CA3AF"
                        value={roomNumber}
                        onChangeText={setRoomNumber}
                    />
                </View>

                {/* Financials */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Financials</Text>

                    <Text style={styles.label}>Rent Amount</Text>
                    <View style={styles.currencyInputContainer}>
                        <Text style={styles.currencyPrefix}>₹</Text>
                        <TextInput
                            style={styles.currencyInput}
                            placeholder="0"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="numeric"
                            value={rentAmount}
                            onChangeText={setRentAmount}
                        />
                    </View>

                    <Text style={styles.label}>Security Deposit</Text>
                    <View style={styles.currencyInputContainer}>
                        <Text style={styles.currencyPrefix}>₹</Text>
                        <TextInput
                            style={styles.currencyInput}
                            placeholder="0"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="numeric"
                            value={securityAmount}
                            onChangeText={setSecurityAmount}
                        />
                    </View>
                </View>

                {/* Rent Cycle (Calendar Day Picker) */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Rent Cycle</Text>
                    <Text style={styles.subLabel}>Select Start Day of the Month</Text>

                    <View style={styles.calendarGrid}>
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                            <TouchableOpacity
                                key={day}
                                style={[
                                    styles.calendarDay,
                                    rentCycle === day.toString() && styles.calendarDayActive
                                ]}
                                onPress={() => setRentCycle(day.toString())}
                            >
                                <Text style={[
                                    styles.calendarDayText,
                                    rentCycle === day.toString() && styles.calendarDayTextActive
                                ]}>{day}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                        <Text style={styles.infoText}>
                            Rent cycle will be 30 days starting from {rentCycle && !isNaN(parseInt(rentCycle)) ? `${rentCycle}${['st', 'nd', 'rd'][((parseInt(rentCycle) + 90) % 100 - 10) % 10 - 1] || 'th'}` : '...'} of every month.
                        </Text>
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Floating Action Button for Submit - or just a bottom button */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                    <Text style={styles.submitBtnText}>Add Tenant</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        paddingTop: 50,
        paddingHorizontal: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    backBtn: { padding: 4 },
    headerTitle: { fontSize: 18, fontFamily: FontFamily.interBold, color: '#111827' },

    scroll: { flex: 1 },

    // Section
    section: {
        paddingHorizontal: 16,
        marginTop: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: FontFamily.interBold,
        color: '#111827',
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontFamily: FontFamily.interSemiBold,
        color: '#4B5563',
        marginBottom: 8,
        marginTop: 4,
    },
    subLabel: {
        fontSize: 12,
        fontFamily: FontFamily.interSemiBold,
        color: '#6B7280',
        marginBottom: 8,
    },

    // Input
    input: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 14,
        fontFamily: FontFamily.lato,
        color: '#111827',
        marginBottom: 12,
    },

    // Gender
    genderContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    genderChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: '#FFFFFF',
    },
    genderChipActive: {
        backgroundColor: '#E8E6FA',
        borderColor: '#C7D2FE',
    },
    genderText: {
        fontSize: 13,
        fontFamily: FontFamily.interSemiBold,
        color: '#4B5563',
    },
    genderTextActive: {
        color: '#1601AA',
    },

    // Dropdown
    dropdown: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 12,
        gap: 8,
        marginBottom: 12,
    },
    dropdownText: {
        fontSize: 14,
        color: '#111827',
        flex: 1,
    },
    dropdownList: {
        marginTop: -8,
        marginBottom: 12,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        overflow: 'hidden',
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    dropdownItemActive: {
        backgroundColor: '#F9FAFB',
    },
    dropdownItemText: {
        fontSize: 14,
        color: '#374151',
        fontFamily: FontFamily.lato,
    },
    dropdownItemTextActive: {
        color: '#1601AA',
        fontFamily: FontFamily.interSemiBold,
    },

    // Room Type
    roomTypeScroll: {
        gap: 8,
        marginBottom: 12,
    },
    roomTypeChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: '#FFFFFF',
    },
    roomTypeChipActive: {
        backgroundColor: '#1601AA',
        borderColor: '#1601AA',
    },
    roomTypeText: {
        fontSize: 13,
        fontFamily: FontFamily.interSemiBold,
        color: '#4B5563',
    },
    roomTypeTextActive: {
        color: '#FFFFFF',
    },

    // Currency Input
    currencyInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        paddingHorizontal: 14,
        marginBottom: 12,
    },
    currencyPrefix: {
        fontSize: 16,
        color: '#6B7280',
        marginRight: 8,
        fontFamily: FontFamily.interSemiBold,
    },
    currencyInput: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 14,
        color: '#111827',
        fontFamily: FontFamily.lato,
    },

    // Calendar
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 8,
    },
    calendarDay: {
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    calendarDayActive: {
        backgroundColor: '#1601AA',
        borderColor: '#1601AA',
    },
    calendarDayText: {
        fontSize: 12,
        fontFamily: FontFamily.interSemiBold,
        color: '#374151',
    },
    calendarDayTextActive: {
        color: '#FFFFFF',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        marginTop: 8,
    },
    infoText: {
        flex: 1,
        fontSize: 12,
        color: '#6B7280',
        lineHeight: 18,
    },

    // Footer
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    submitBtn: {
        backgroundColor: '#1601AA',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },
    submitBtnText: {
        fontSize: 16,
        fontFamily: FontFamily.interBold,
        color: '#FFFFFF',
    },
});
