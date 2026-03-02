import { FontFamily } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { addProperty, addUnit } from '@/services/property.service';

const transactionTypes = ['Rent', 'Lease', 'Sale'];
const propertyTypes = [
  { id: 'apartment', label: 'Apartment', icon: 'business-outline' },
  { id: 'house', label: 'House', icon: 'home-outline' },
  { id: 'commercial', label: 'Commercial', icon: 'storefront-outline' },
];

const UNIT_OPTIONS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '12', '15', '20'];

export default function AddPropertyScreen() {
  const [selectedTransaction, setSelectedTransaction] = useState('Rent');
  const [selectedPropertyType, setSelectedPropertyType] = useState('apartment');
  const [propertyName, setPropertyName] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [unitConfig, setUnitConfig] = useState('2BHK');
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Rent Cycle (Day of month)
  const [rentCycle, setRentCycle] = useState('1');

  // Floor & Unit Logic
  const [totalFloors, setTotalFloors] = useState('');
  const [activeFloor, setActiveFloor] = useState(1);
  const [floorUnits, setFloorUnits] = useState<Record<number, string>>({});
  const [showFloorUnitDropdown, setShowFloorUnitDropdown] = useState(false);

  // Helper to get units for current floor (default '4')
  const getCurrentFloorUnits = () => floorUnits[activeFloor] || '4';

  const handleTotalFloorsChange = (text: string) => {
    setTotalFloors(text);
    const num = parseInt(text, 10);
    if (!isNaN(num) && num > 0) {
      if (activeFloor > num) setActiveFloor(1);
    }
  };

  const handleSubmit = async () => {
    if (!propertyName.trim()) { Alert.alert('Missing Fields', 'Property name is required.'); return; }
    if (!propertyAddress.trim()) { Alert.alert('Missing Fields', 'Property address is required.'); return; }
    const numFloors = parseInt(totalFloors || '1', 10);
    if (isNaN(numFloors) || numFloors < 1) { Alert.alert('Missing Fields', 'Enter a valid number of floors.'); return; }
    setSubmitting(true);
    try {
      // Map type to backend expected values
      const typeMap: Record<string, 'building' | 'floor' | 'pg'> = {
        apartment: 'building', house: 'floor', commercial: 'pg',
      };
      const property = await addProperty({
        name: propertyName.trim(),
        address: propertyAddress.trim(),
        type: typeMap[selectedPropertyType] ?? 'building',
        totalFloors: numFloors,
        rentCycle: parseInt(rentCycle, 10) || 1,
      });
      // Create units for each floor
      const unitPromises: Promise<any>[] = [];
      for (let f = 1; f <= numFloors; f++) {
        const unitCount = parseInt(floorUnits[f] || '4', 10);
        for (let u = 1; u <= unitCount; u++) {
          unitPromises.push(addUnit(property._id, {
            floorNumber: f,
            unitNumber: String(u),
            unitConfig,
            rentAmount: 0,
          }));
        }
      }
      await Promise.all(unitPromises);
      Alert.alert('Success', `${propertyName} has been added with ${numFloors} floor(s).`, [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message ?? 'Failed to add property. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const apartmentConfigurations = ['1RK', '1BHK', '2BHK', '3BHK', '4BHK', '5BHK+', 'Penthouse'];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Property</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Transaction Type */}
        <View style={styles.section}>
          <View style={styles.segmentedControl}>
            {transactionTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.segment,
                  selectedTransaction === type && styles.segmentActive,
                ]}
                onPress={() => setSelectedTransaction(type)}
              >
                <Text
                  style={[
                    styles.segmentText,
                    selectedTransaction === type && styles.segmentTextActive,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Property Name */}
        <View style={styles.section}>
          <Text style={styles.label}>Property Name*</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Sunset Apartments"
            placeholderTextColor="#9CA3AF"
            value={propertyName}
            onChangeText={setPropertyName}
          />
        </View>


        {/* Property Type */}
        <View style={styles.section}>
          <Text style={styles.label}>Property Type</Text>
          <View style={styles.propertyTypeGrid}>
            {propertyTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.propertyTypeBtn,
                  selectedPropertyType === type.id && styles.propertyTypeBtnActive,
                ]}
                onPress={() => setSelectedPropertyType(type.id)}
              >
                <Ionicons
                  name={type.icon as any}
                  size={20}
                  color={selectedPropertyType === type.id ? '#1601AA' : '#6B7280'}
                />
                <Text
                  style={[
                    styles.propertyTypeText,
                    selectedPropertyType === type.id && styles.propertyTypeTextActive,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Apartment Configuration (Dropdown) */}
        {selectedPropertyType === 'apartment' && (
          <View style={styles.section}>
            <Text style={styles.label}>Unit Configuration</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowUnitDropdown(!showUnitDropdown)}
              activeOpacity={0.7}
            >
              <Text style={styles.dropdownText}>{unitConfig || 'Select Configuration'}</Text>
              <Ionicons name={showUnitDropdown ? "chevron-up" : "chevron-down"} size={18} color="#6B7280" />
            </TouchableOpacity>

            {showUnitDropdown && (
              <View style={styles.dropdownList}>
                {apartmentConfigurations.map((config) => (
                  <TouchableOpacity
                    key={config}
                    style={[
                      styles.dropdownItem,
                      unitConfig === config && styles.dropdownItemActive
                    ]}
                    onPress={() => {
                      setUnitConfig(config);
                      setShowUnitDropdown(false);
                    }}
                  >
                    <Text style={[
                      styles.dropdownItemText,
                      unitConfig === config && styles.dropdownItemTextActive
                    ]}>
                      {config}
                    </Text>
                    {unitConfig === config && (
                      <Ionicons name="checkmark" size={16} color="#1601AA" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Address */}
        <View style={styles.section}>
          <Text style={styles.label}>Address</Text>
          <View style={styles.addressInputContainer}>
            <Ionicons name="location-outline" size={18} color="#6B7280" style={styles.addressIcon} />
            <TextInput
              style={styles.addressInput}
              placeholder="Full property address"
              placeholderTextColor="#9CA3AF"
              value={propertyAddress}
              onChangeText={setPropertyAddress}
            />
          </View>
          <Text style={styles.helperText}>Address will be autocompleted.</Text>
        </View>

        {/* Property Layout (Floors & Units) */}
        <View style={styles.section}>
          <Text style={styles.label}>Property Layout</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.subLabel}>Total Floors</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 5"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={totalFloors}
              onChangeText={handleTotalFloorsChange}
            />
          </View>

          {parseInt(totalFloors || '0', 10) > 0 && (
            <View style={styles.floorConfigContainer}>
              <Text style={styles.subLabel}>Select Layer (Floor) to Configure</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.floorTabsContainer}>
                {Array.from({ length: parseInt(totalFloors, 10) }, (_, i) => i + 1).map((floor) => (
                  <TouchableOpacity
                    key={floor}
                    style={[styles.floorTab, activeFloor === floor && styles.floorTabActive]}
                    onPress={() => {
                      setActiveFloor(floor);
                      setShowFloorUnitDropdown(false);
                    }}
                  >
                    <Text style={[styles.floorTabText, activeFloor === floor && styles.floorTabTextActive]}>
                      {floor === 0 ? 'G' : `Floor ${floor}`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={styles.floorDetailCard}>
                <Text style={styles.floorDetailLabel}>Units on Floor {activeFloor}</Text>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => setShowFloorUnitDropdown(!showFloorUnitDropdown)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.dropdownText}>{getCurrentFloorUnits()}</Text>
                  <Ionicons name={showFloorUnitDropdown ? "chevron-up" : "chevron-down"} size={18} color="#6B7280" />
                </TouchableOpacity>

                {showFloorUnitDropdown && (
                  <View style={[styles.dropdownList, { zIndex: 20 }]}>
                    <ScrollView nestedScrollEnabled style={{ maxHeight: 200 }}>
                      {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '12', '15', '20'].map((num) => (
                        <TouchableOpacity
                          key={num}
                          style={[
                            styles.dropdownItem,
                            getCurrentFloorUnits() === num && styles.dropdownItemActive
                          ]}
                          onPress={() => {
                            setFloorUnits(prev => ({ ...prev, [activeFloor]: num }));
                            setShowFloorUnitDropdown(false);
                          }}
                        >
                          <Text style={[
                            styles.dropdownItemText,
                            getCurrentFloorUnits() === num && styles.dropdownItemTextActive
                          ]}>
                            {num}
                          </Text>
                          {getCurrentFloorUnits() === num && (
                            <Ionicons name="checkmark" size={16} color="#1601AA" />
                          )}
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>

        {/* Rent Cycle (Calendar Day Picker) */}
        <View style={styles.section}>
          <Text style={styles.label}>Rent Cycle</Text>
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

      {/* Submit Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitBtn, submitting && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting
            ? <ActivityIndicator color="#FFFFFF" />
            : <Text style={styles.submitBtnText}>Add Property</Text>
          }
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
    marginTop: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: FontFamily.interSemiBold,
    color: '#111827',
    marginBottom: 10,
  },

  // Segmented Control
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 4,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  segmentActive: {
    backgroundColor: '#DBEAFE',
  },
  segmentText: {
    fontSize: 14,
    color: '#6B7280',
  },
  segmentTextActive: {
    color: '#1601AA',
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
  },

  // Property Type Grid
  propertyTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  propertyTypeBtn: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 14,
    gap: 8,
  },
  propertyTypeBtnActive: {
    borderColor: '#1601AA',
    backgroundColor: '#F8FAFC',
  },
  propertyTypeText: {
    fontSize: 14,
    color: '#6B7280',
  },
  propertyTypeTextActive: {
    color: '#1601AA',
  },

  // Address Input
  addressInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 14,
  },
  addressIcon: {
    marginRight: 10,
  },
  addressInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111827',
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 6,
  },

  // Rent Cycle (Old but kept for reference if needed, styling replaced below)
  rentCycleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
  },
  dropdownText: {
    fontSize: 14,
    color: '#111827',
    flex: 1,
  },
  dropdownList: {
    marginTop: 8,
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

  // Footer Submit
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', padding: 16, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  submitBtn: { backgroundColor: '#1601AA', borderRadius: 12, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', minHeight: 52 },
  submitBtnText: { fontSize: 16, fontFamily: FontFamily.interBold, color: '#FFFFFF' },

  // New Styles
  inputContainer: { marginBottom: 16 },
  subLabel: {
    fontSize: 12,
    fontFamily: FontFamily.interSemiBold,
    color: '#4B5563',
    marginBottom: 6,
  },
  floorConfigContainer: {
    marginTop: 8,
    backgroundColor: '#F1F5F9', // Light gray bg for config area
    borderRadius: 12,
    padding: 12,
  },
  floorTabsContainer: {
    gap: 8,
    marginBottom: 16,
    paddingRight: 20,
  },
  floorTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  floorTabActive: {
    backgroundColor: '#1601AA',
    borderColor: '#1601AA',
  },
  floorTabText: {
    fontSize: 12,
    fontFamily: FontFamily.interSemiBold,
    color: '#64748B',
  },
  floorTabTextActive: {
    color: '#FFFFFF',
  },
  floorDetailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  floorDetailLabel: {
    fontSize: 13,
    fontFamily: FontFamily.interSemiBold,
    color: '#334155',
    marginBottom: 8,
  },
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
});
