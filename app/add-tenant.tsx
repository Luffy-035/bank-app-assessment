import { FontFamily } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useEffect, useCallback } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { addTenant } from '@/services/tenant.service';
import { getProperties, getUnits } from '@/services/property.service';
import type { Property, Unit } from '@/types/property.types';

const genders = ['Male', 'Female', 'Other'];

export default function AddTenantScreen() {
    const [name, setName] = useState('');
    const [gender, setGender] = useState('Male');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');

    // Properties
    const [properties, setProperties] = useState<Property[]>([]);
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
    const [showPropertyDropdown, setShowPropertyDropdown] = useState(false);
    const [propertiesLoading, setPropertiesLoading] = useState(true);

    // Units
    const [units, setUnits] = useState<Unit[]>([]);
    const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
    const [showUnitDropdown, setShowUnitDropdown] = useState(false);
    const [unitsLoading, setUnitsLoading] = useState(false);

    // Financials
    const [rentAmount, setRentAmount] = useState('');
    const [securityAmount, setSecurityAmount] = useState('');
    const [rentCycle, setRentCycle] = useState('1');

    const [submitting, setSubmitting] = useState(false);
    const [successVisible, setSuccessVisible] = useState(false);
    const [createdTenant, setCreatedTenant] = useState<{ tenantId: string; name: string; phone: string } | null>(null);

    // Load properties on mount
    useEffect(() => {
        getProperties()
            .then(setProperties)
            .catch(() => Alert.alert('Error', 'Failed to load properties.'))
            .finally(() => setPropertiesLoading(false));
    }, []);

    // Load vacant units when property changes
    const handlePropertySelect = useCallback(async (prop: Property) => {
        setSelectedProperty(prop);
        setSelectedUnit(null);
        setShowPropertyDropdown(false);
        setUnits([]);
        setUnitsLoading(true);
        try {
            const allUnits = await getUnits(prop._id);
            setUnits(allUnits.filter((u) => u.status === 'vacant'));
        } catch {
            Alert.alert('Error', 'Failed to load units for this property.');
        } finally {
            setUnitsLoading(false);
        }
    }, []);

    const handleSubmit = async () => {
        if (!name.trim() || !phoneNumber.trim()) {
            Alert.alert('Missing Fields', 'Name and phone number are required.');
            return;
        }
        if (!selectedProperty) {
            Alert.alert('Missing Fields', 'Please select a property.');
            return;
        }
        if (!selectedUnit) {
            Alert.alert('Missing Fields', 'Please select a unit.');
            return;
        }
        if (!rentAmount || isNaN(Number(rentAmount))) {
            Alert.alert('Missing Fields', 'Please enter a valid rent amount.');
            return;
        }

        const today = new Date();
        const leaseEnd = new Date(today);
        leaseEnd.setFullYear(leaseEnd.getFullYear() + 1);

        setSubmitting(true);
        try {
            const result = await addTenant({
                name: name.trim(),
                phone: phoneNumber.trim(),
                email: email.trim() || undefined,
                unitId: selectedUnit._id,
                securityDeposit: Number(securityAmount) || 0,
                rentCycle: Number(rentCycle) || 1,
                rentAmount: Number(rentAmount),
                leaseStart: today.toISOString(),
                leaseEnd: leaseEnd.toISOString(),
            });
            setCreatedTenant({ tenantId: result.tenantId, name: name.trim(), phone: phoneNumber.trim() });
            setSuccessVisible(true);
        } catch (e: any) {
            Alert.alert('Error', e?.response?.data?.message ?? 'Failed to add tenant. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleShare = async () => {
        if (!createdTenant) return;
        await Share.share({
            message: `Hi ${createdTenant.name}, your Blew tenant account is ready!\n\nTenant ID: ${createdTenant.tenantId}\nPhone: ${createdTenant.phone}\n\nUse your Tenant ID + phone number to log in to the Blew app.`,
            title: 'Tenant Login Details',
        });
    };

    const handleDone = () => {
        setSuccessVisible(false);
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

                    <Text style={styles.label}>Full Name *</Text>
                    <TextInput style={styles.input} placeholder="e.g. Ramesh Kumar" placeholderTextColor="#9CA3AF" value={name} onChangeText={setName} />

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

                    <Text style={styles.label}>Phone Number *</Text>
                    <TextInput style={styles.input} placeholder="+91 98765 43210" placeholderTextColor="#9CA3AF" keyboardType="phone-pad" value={phoneNumber} onChangeText={setPhoneNumber} />

                    <Text style={styles.label}>Email (optional)</Text>
                    <TextInput style={styles.input} placeholder="tenant@email.com" placeholderTextColor="#9CA3AF" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
                </View>

                {/* Property Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Property Details</Text>

                    <Text style={styles.label}>Property *</Text>
                    {propertiesLoading ? (
                        <ActivityIndicator color="#1601AA" style={{ marginBottom: 12 }} />
                    ) : (
                        <>
                            <TouchableOpacity style={styles.dropdown} onPress={() => setShowPropertyDropdown(!showPropertyDropdown)} activeOpacity={0.7}>
                                <Text style={[styles.dropdownText, !selectedProperty && { color: '#9CA3AF' }]}>
                                    {selectedProperty?.name ?? 'Select Property'}
                                </Text>
                                <Ionicons name={showPropertyDropdown ? 'chevron-up' : 'chevron-down'} size={18} color="#6B7280" />
                            </TouchableOpacity>
                            {showPropertyDropdown && (
                                <View style={styles.dropdownList}>
                                    {properties.length === 0 ? (
                                        <Text style={styles.dropdownEmptyText}>No properties found. Add a property first.</Text>
                                    ) : properties.map((prop) => (
                                        <TouchableOpacity
                                            key={prop._id}
                                            style={[styles.dropdownItem, selectedProperty?._id === prop._id && styles.dropdownItemActive]}
                                            onPress={() => handlePropertySelect(prop)}
                                        >
                                            <Text style={[styles.dropdownItemText, selectedProperty?._id === prop._id && styles.dropdownItemTextActive]}>{prop.name}</Text>
                                            {selectedProperty?._id === prop._id && <Ionicons name="checkmark" size={16} color="#1601AA" />}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </>
                    )}

                    <Text style={styles.label}>Unit *</Text>
                    {!selectedProperty ? (
                        <View style={styles.disabledDropdown}>
                            <Text style={styles.disabledDropdownText}>Select a property first</Text>
                        </View>
                    ) : unitsLoading ? (
                        <ActivityIndicator color="#1601AA" style={{ marginBottom: 12 }} />
                    ) : (
                        <>
                            <TouchableOpacity style={styles.dropdown} onPress={() => setShowUnitDropdown(!showUnitDropdown)} activeOpacity={0.7}>
                                <Text style={[styles.dropdownText, !selectedUnit && { color: '#9CA3AF' }]}>
                                    {selectedUnit ? `Unit ${selectedUnit.unitNumber} (Floor ${selectedUnit.floorNumber})` : 'Select Vacant Unit'}
                                </Text>
                                <Ionicons name={showUnitDropdown ? 'chevron-up' : 'chevron-down'} size={18} color="#6B7280" />
                            </TouchableOpacity>
                            {showUnitDropdown && (
                                <View style={styles.dropdownList}>
                                    {units.length === 0 ? (
                                        <Text style={styles.dropdownEmptyText}>No vacant units in this property.</Text>
                                    ) : units.map((unit) => (
                                        <TouchableOpacity
                                            key={unit._id}
                                            style={[styles.dropdownItem, selectedUnit?._id === unit._id && styles.dropdownItemActive]}
                                            onPress={() => { setSelectedUnit(unit); setShowUnitDropdown(false); setRentAmount(String(unit.rentAmount || '')); }}
                                        >
                                            <Text style={[styles.dropdownItemText, selectedUnit?._id === unit._id && styles.dropdownItemTextActive]}>
                                                Unit {unit.unitNumber} · Floor {unit.floorNumber} · {unit.unitConfig}
                                            </Text>
                                            {selectedUnit?._id === unit._id && <Ionicons name="checkmark" size={16} color="#1601AA" />}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </>
                    )}
                </View>

                {/* Financials */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Financials</Text>

                    <Text style={styles.label}>Rent Amount *</Text>
                    <View style={styles.currencyInputContainer}>
                        <Text style={styles.currencyPrefix}>₹</Text>
                        <TextInput style={styles.currencyInput} placeholder="0" placeholderTextColor="#9CA3AF" keyboardType="numeric" value={rentAmount} onChangeText={setRentAmount} />
                    </View>

                    <Text style={styles.label}>Security Deposit</Text>
                    <View style={styles.currencyInputContainer}>
                        <Text style={styles.currencyPrefix}>₹</Text>
                        <TextInput style={styles.currencyInput} placeholder="0" placeholderTextColor="#9CA3AF" keyboardType="numeric" value={securityAmount} onChangeText={setSecurityAmount} />
                    </View>
                </View>

                {/* Rent Cycle */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Rent Cycle</Text>
                    <Text style={styles.subLabel}>Select Start Day of the Month</Text>
                    <View style={styles.calendarGrid}>
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                            <TouchableOpacity
                                key={day}
                                style={[styles.calendarDay, rentCycle === day.toString() && styles.calendarDayActive]}
                                onPress={() => setRentCycle(day.toString())}
                            >
                                <Text style={[styles.calendarDayText, rentCycle === day.toString() && styles.calendarDayTextActive]}>{day}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={[styles.submitBtn, submitting && { opacity: 0.7 }]} onPress={handleSubmit} disabled={submitting}>
                    {submitting
                        ? <ActivityIndicator color="#FFFFFF" />
                        : <Text style={styles.submitBtnText}>Add Tenant</Text>
                    }
                </TouchableOpacity>
            </View>

            {/* ── Success Modal ── */}
            <Modal visible={successVisible} transparent animationType="fade" onRequestClose={handleDone}>
                <View style={success.overlay}>
                    <View style={success.card}>
                        <View style={success.iconWrap}>
                            <Text style={success.iconText}>✓</Text>
                        </View>
                        <Text style={success.title}>Tenant Added!</Text>
                        <Text style={success.subtitle}>
                            {createdTenant?.name} has been successfully added to your property.
                        </Text>

                        <Text style={success.idLabel}>Tenant ID</Text>
                        <View style={success.idBox}>
                            <TextInput
                                style={success.idText}
                                value={createdTenant?.tenantId ?? ''}
                                editable
                                selectTextOnFocus
                                onChangeText={() => { /* controlled — prevents edits */ }}
                            />
                        </View>
                        <TouchableOpacity
                            onPress={() => Share.share({ message: createdTenant?.tenantId ?? '' })}
                            style={{ marginBottom: 12 }}
                        >
                            <Text style={{ fontSize: 13, color: '#1601AA', fontFamily: FontFamily.interBold, textAlign: 'center' }}>📋  Tap to Copy ID</Text>
                        </TouchableOpacity>

                        <Text style={success.loginInfo}>
                            Login: Tenant ID + phone number {createdTenant?.phone}
                        </Text>

                        <TouchableOpacity style={success.shareBtn} onPress={handleShare}>
                            <Text style={success.shareBtnText}>📤  Share Login Details</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={success.doneBtn} onPress={handleDone}>
                            <Text style={success.doneBtnText}>Done</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', paddingTop: 50, paddingHorizontal: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
    backBtn: { padding: 4 },
    headerTitle: { fontSize: 18, fontFamily: FontFamily.interBold, color: '#111827' },
    scroll: { flex: 1 },
    section: { paddingHorizontal: 16, marginTop: 24 },
    sectionTitle: { fontSize: 16, fontFamily: FontFamily.interBold, color: '#111827', marginBottom: 16 },
    label: { fontSize: 14, fontFamily: FontFamily.interSemiBold, color: '#4B5563', marginBottom: 8, marginTop: 4 },
    subLabel: { fontSize: 12, fontFamily: FontFamily.interSemiBold, color: '#6B7280', marginBottom: 8 },
    input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, fontFamily: FontFamily.lato, color: '#111827', marginBottom: 12 },
    genderContainer: { flexDirection: 'row', gap: 12, marginBottom: 12 },
    genderChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF' },
    genderChipActive: { backgroundColor: '#E8E6FA', borderColor: '#C7D2FE' },
    genderText: { fontSize: 13, fontFamily: FontFamily.interSemiBold, color: '#4B5563' },
    genderTextActive: { color: '#1601AA' },
    dropdown: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 12 },
    dropdownText: { flex: 1, fontSize: 14, fontFamily: FontFamily.lato, color: '#111827' },
    dropdownList: { marginTop: -8, marginBottom: 12, backgroundColor: '#FFFFFF', borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB', overflow: 'hidden' },
    dropdownItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    dropdownItemActive: { backgroundColor: '#F9FAFB' },
    dropdownItemText: { fontSize: 14, fontFamily: FontFamily.lato, color: '#374151' },
    dropdownItemTextActive: { color: '#1601AA', fontFamily: FontFamily.interSemiBold },
    dropdownEmptyText: { fontSize: 13, fontFamily: FontFamily.lato, color: '#9CA3AF', padding: 14, textAlign: 'center' },
    disabledDropdown: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 12 },
    disabledDropdownText: { fontSize: 14, fontFamily: FontFamily.lato, color: '#D1D5DB' },
    currencyInputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 14, marginBottom: 12 },
    currencyPrefix: { fontSize: 16, color: '#6B7280', marginRight: 8, fontFamily: FontFamily.interSemiBold },
    currencyInput: { flex: 1, paddingVertical: 12, fontSize: 14, color: '#111827', fontFamily: FontFamily.lato },
    calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
    calendarDay: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' },
    calendarDayActive: { backgroundColor: '#1601AA', borderColor: '#1601AA' },
    calendarDayText: { fontSize: 12, fontFamily: FontFamily.interSemiBold, color: '#374151' },
    calendarDayTextActive: { color: '#FFFFFF' },
    footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', padding: 16, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
    submitBtn: { backgroundColor: '#1601AA', borderRadius: 12, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', minHeight: 52 },
    submitBtnText: { fontSize: 16, fontFamily: FontFamily.interBold, color: '#FFFFFF' },
});

const success = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center', padding: 24 },
    card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 28, width: '100%', alignItems: 'center' },
    iconWrap: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#ECFDF5', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
    iconText: { fontSize: 28, color: '#16A34A' },
    title: { fontSize: 22, fontFamily: FontFamily.interBold, color: '#111827', marginBottom: 8 },
    subtitle: { fontSize: 14, fontFamily: FontFamily.lato, color: '#6B7280', textAlign: 'center', marginBottom: 24, lineHeight: 20 },
    idLabel: { fontSize: 12, fontFamily: FontFamily.interSemiBold, color: '#6B7280', alignSelf: 'flex-start', marginBottom: 6, letterSpacing: 0.5, textTransform: 'uppercase' },
    idBox: { width: '100%', backgroundColor: '#F3F4F6', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 4, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 6 },
    idText: { fontSize: 20, fontFamily: FontFamily.interBold, color: '#1601AA', textAlign: 'center', paddingVertical: 10, letterSpacing: 1 },
    idHint: { fontSize: 11, fontFamily: FontFamily.lato, color: '#9CA3AF', marginBottom: 12 },
    loginInfo: { fontSize: 12, fontFamily: FontFamily.lato, color: '#6B7280', textAlign: 'center', marginBottom: 24, lineHeight: 18 },
    shareBtn: { width: '100%', backgroundColor: '#EEF2FF', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 10 },
    shareBtnText: { fontSize: 15, fontFamily: FontFamily.interBold, color: '#1601AA' },
    doneBtn: { width: '100%', backgroundColor: '#1601AA', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
    doneBtnText: { fontSize: 15, fontFamily: FontFamily.interBold, color: '#FFFFFF' },
});
