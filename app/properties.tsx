import { FontFamily } from '@/constants/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

const properties = [
  { name: 'Brookvale Villa', location: 'Jakarta, Indonesia', units: 20, rating: 5.0, color: '#F3F0FF' },
  { name: 'The Overdale Apartment', location: 'Jakarta, Indonesia', units: 15, rating: 4.8, color: '#E8E6FA' },
  { name: 'Brookvale Villa', location: 'Jakarta, Indonesia', units: 20, rating: 5.0, color: '#F3F0FF' },
  { name: 'The Overdale Apartment', location: 'Jakarta, Indonesia', units: 15, rating: 4.8, color: '#E8E6FA' },
];

const PROPERTY_TYPES = [
  { id: 'building', label: 'Building', icon: 'business-outline' as const, description: 'Multi-floor building with multiple units' },
  { id: 'floor', label: 'Floor', icon: 'layers-outline' as const, description: 'Single floor with individual rooms' },
  { id: 'pg', label: 'PG', icon: 'people-outline' as const, description: 'Paying Guest accommodation' },
];

const RENT_CYCLE_DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const UNIT_OPTIONS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '12', '15', '20'];
const APARTMENT_CONFIGS = ['1RK', '1BHK', '2BHK', '3BHK', '4BHK', '5BHK+', 'Penthouse'];

export default function PropertiesScreen() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showActionPicker, setShowActionPicker] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);

  // Add Property form state
  const [selectedType, setSelectedType] = useState('building');
  const [propertyName, setPropertyName] = useState('');
  const [address, setAddress] = useState('');
  const [totalFloors, setTotalFloors] = useState('');
  const [activeFloor, setActiveFloor] = useState(1);
  const [floorUnits, setFloorUnits] = useState<Record<number, string>>({});
  const [unitConfig, setUnitConfig] = useState('2BHK');
  const [rentCycle, setRentCycle] = useState('1');
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);
  const [showFloorUnitDropdown, setShowFloorUnitDropdown] = useState(false);

  // Add Payment form state
  const [paymentTenant, setPaymentTenant] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDescription, setPaymentDescription] = useState('');

  const getCurrentFloorUnits = () => floorUnits[activeFloor] || '4';

  const fabAnim = React.useRef(new Animated.Value(0)).current;
  const lastOffsetY = React.useRef(0);

  const handleScroll = (event: any) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const direction = currentOffset > lastOffsetY.current ? 'down' : 'up';
    if (Math.abs(currentOffset - lastOffsetY.current) > 20) {
      Animated.timing(fabAnim, {
        toValue: direction === 'down' && currentOffset > 50 ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      lastOffsetY.current = currentOffset;
    }
  };

  const fabTranslateY = fabAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 100] });

  const resetForm = () => {
    setSelectedType('building');
    setPropertyName('');
    setAddress('');
    setTotalFloors('');
    setActiveFloor(1);
    setFloorUnits({});
    setUnitConfig('2BHK');
    setRentCycle('1');
    setShowUnitDropdown(false);
    setShowFloorUnitDropdown(false);
  };

  const resetPaymentForm = () => {
    setPaymentTenant('');
    setPaymentAmount('');
    setPaymentDescription('');
  };

  const ordinalSuffix = (n: number) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Properties</Text>
        <View style={{ width: 30 }} />
      </View>

      {/* Subheader */}
      <View style={styles.subheader}>
        <Text style={styles.listingCount}>
          <Text style={styles.listingNumber}>140</Text> listings
        </Text>
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[styles.toggleBtn, viewMode === 'grid' && styles.toggleBtnActive]}
            onPress={() => setViewMode('grid')}
          >
            <Ionicons name="grid" size={16} color={viewMode === 'grid' ? '#1601AA' : '#9CA3AF'} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, viewMode === 'list' && styles.toggleBtnActive]}
            onPress={() => setViewMode('list')}
          >
            <Ionicons name="menu" size={16} color={viewMode === 'list' ? '#1601AA' : '#9CA3AF'} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.propertiesGrid}>
          {properties.map((property, index) => (
            <TouchableOpacity
              key={index}
              style={styles.propertyCard}
              onPress={() => router.push({ pathname: '/property-details', params: { name: property.name } })}
            >
              <View style={styles.propImg} />
              <View style={styles.propMetaRow}>
                <View style={styles.propBadge}>
                  <Text style={styles.propBadgeText}>{property.units} Units</Text>
                </View>
                <View style={styles.ratingWrap}>
                  <Ionicons name="star" size={14} color="#F59E0B" />
                  <Text style={styles.ratingText}>{property.rating}</Text>
                </View>
              </View>
              <Text style={styles.propName}>{property.name}</Text>
              <Text style={styles.propAddr}>{property.location}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* FAB → opens action picker */}
      <Animated.View style={[styles.fab, { transform: [{ translateY: fabTranslateY }] }]}>
        <TouchableOpacity style={styles.fabBtn} onPress={() => setShowActionPicker(true)}>
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/landlord-dashboard')}>
          <Ionicons name="grid-outline" size={22} color="#9CA3AF" />
          <Text style={styles.tabText}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="business" size={22} color="#1601AA" />
          <Text style={[styles.tabText, styles.tabActive]}>Properties</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/landlord-requests')}>
          <Ionicons name="construct-outline" size={22} color="#9CA3AF" />
          <Text style={styles.tabText}>Requests</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/help-support')}>
          <Ionicons name="ellipsis-horizontal" size={22} color="#9CA3AF" />
          <Text style={styles.tabText}>More</Text>
        </TouchableOpacity>
      </View>

      {/* Add Property Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalDismiss} onPress={() => setShowAddModal(false)} />
          <View style={styles.modalSheet}>
            {/* Handle */}
            <View style={styles.modalHandle} />

            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Property</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)} style={styles.modalClose}>
                <Ionicons name="close" size={22} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScroll}>
              {/* Property Type */}
              <Text style={styles.fieldLabel}>Property Type</Text>
              <View style={styles.typeGrid}>
                {PROPERTY_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[styles.typeBtn, selectedType === type.id && styles.typeBtnActive]}
                    onPress={() => setSelectedType(type.id)}
                  >
                    <View style={[styles.typeIconWrap, selectedType === type.id && styles.typeIconWrapActive]}>
                      <Ionicons
                        name={type.icon}
                        size={22}
                        color={selectedType === type.id ? '#1601AA' : '#6B7280'}
                      />
                    </View>
                    <Text style={[styles.typeLabel, selectedType === type.id && styles.typeLabelActive]}>
                      {type.label}
                    </Text>
                    <Text style={styles.typeDesc}>{type.description}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Property Name */}
              <Text style={styles.fieldLabel}>Property Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Sunset Apartments"
                placeholderTextColor="#9CA3AF"
                value={propertyName}
                onChangeText={setPropertyName}
              />

              {/* Address */}
              <Text style={styles.fieldLabel}>Address</Text>
              <View style={styles.addressRow}>
                <Ionicons name="location-outline" size={18} color="#6B7280" style={{ marginRight: 8 }} />
                <TextInput
                  style={[styles.input, { flex: 1, marginBottom: 0 }]}
                  placeholder="Start typing your address..."
                  placeholderTextColor="#9CA3AF"
                  value={address}
                  onChangeText={setAddress}
                />
              </View>

              {/* Total Floors */}
              <Text style={styles.fieldLabel}>Total Floors</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 5"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={totalFloors}
                onChangeText={(t) => {
                  setTotalFloors(t);
                  const n = parseInt(t, 10);
                  if (!isNaN(n) && n > 0 && activeFloor > n) setActiveFloor(1);
                }}
              />

              {/* Floor Tabs */}
              {parseInt(totalFloors || '0', 10) > 0 && (
                <View style={styles.floorConfigBox}>
                  <Text style={styles.subLabel}>Configure Floors</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 12 }}>
                    {Array.from({ length: parseInt(totalFloors, 10) }, (_, i) => i + 1).map((floor) => (
                      <TouchableOpacity
                        key={floor}
                        style={[styles.floorTab, activeFloor === floor && styles.floorTabActive]}
                        onPress={() => { setActiveFloor(floor); setShowFloorUnitDropdown(false); }}
                      >
                        <Text style={[styles.floorTabText, activeFloor === floor && styles.floorTabTextActive]}>
                          Floor {floor}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  <Text style={styles.subLabel}>Units on Floor {activeFloor}</Text>
                  <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() => setShowFloorUnitDropdown(!showFloorUnitDropdown)}
                  >
                    <Text style={styles.dropdownText}>{getCurrentFloorUnits()} units</Text>
                    <Ionicons name={showFloorUnitDropdown ? 'chevron-up' : 'chevron-down'} size={18} color="#6B7280" />
                  </TouchableOpacity>
                  {showFloorUnitDropdown && (
                    <View style={styles.dropdownList}>
                      {UNIT_OPTIONS.map((num) => (
                        <TouchableOpacity
                          key={num}
                          style={[styles.dropdownItem, getCurrentFloorUnits() === num && styles.dropdownItemActive]}
                          onPress={() => { setFloorUnits(prev => ({ ...prev, [activeFloor]: num })); setShowFloorUnitDropdown(false); }}
                        >
                          <Text style={[styles.dropdownItemText, getCurrentFloorUnits() === num && styles.dropdownItemTextActive]}>{num}</Text>
                          {getCurrentFloorUnits() === num && <Ionicons name="checkmark" size={16} color="#1601AA" />}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              )}

              {/* Rent Cycle */}
              <Text style={styles.fieldLabel}>Rent Cycle — Due Day</Text>
              <View style={styles.calendarGrid}>
                {RENT_CYCLE_DAYS.map((day) => (
                  <TouchableOpacity
                    key={day}
                    style={[styles.calendarDay, rentCycle === day.toString() && styles.calendarDayActive]}
                    onPress={() => setRentCycle(day.toString())}
                  >
                    <Text style={[styles.calendarDayText, rentCycle === day.toString() && styles.calendarDayTextActive]}>
                      {day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={14} color="#6B7280" />
                <Text style={styles.infoText}>
                  Rent due on {ordinalSuffix(parseInt(rentCycle))} of every month
                </Text>
              </View>

              {/* Submit */}
              <TouchableOpacity
                style={styles.submitBtn}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.submitText}>Add Property</Text>
              </TouchableOpacity>

              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ── Action Picker Modal ── */}
      <Modal visible={showActionPicker} animationType="slide" transparent onRequestClose={() => setShowActionPicker(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalDismiss} onPress={() => setShowActionPicker(false)} />
          <View style={styles.pickerSheet}>
            <View style={styles.pickerHandle} />
            <Text style={styles.pickerTitle}>What would you like to add?</Text>
            <TouchableOpacity
              style={styles.pickerOption}
              onPress={() => { setShowActionPicker(false); resetForm(); setShowAddModal(true); }}
            >
              <View style={[styles.pickerIconWrap, { backgroundColor: '#EEF2FF' }]}>
                <Ionicons name="business-outline" size={24} color="#1601AA" />
              </View>
              <View style={styles.pickerTextWrap}>
                <Text style={styles.pickerOptionTitle}>Add Property</Text>
                <Text style={styles.pickerOptionSub}>Register a new property to manage</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
            <View style={styles.pickerDivider} />
            <TouchableOpacity
              style={styles.pickerOption}
              onPress={() => { setShowActionPicker(false); resetPaymentForm(); setShowAddPayment(true); }}
            >
              <View style={[styles.pickerIconWrap, { backgroundColor: '#ECFDF5' }]}>
                <Ionicons name="cash-outline" size={24} color="#059669" />
              </View>
              <View style={styles.pickerTextWrap}>
                <Text style={styles.pickerOptionTitle}>Add Payment</Text>
                <Text style={styles.pickerOptionSub}>Record a rent or other payment</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
            <View style={{ height: 28 }} />
          </View>
        </View>
      </Modal>

      {/* ── Add Payment Modal ── */}
      <Modal visible={showAddPayment} animationType="slide" transparent onRequestClose={() => setShowAddPayment(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalDismiss} onPress={() => setShowAddPayment(false)} />
          <View style={styles.modalSheet}>
            <View style={styles.pickerHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Record Payment</Text>
              <TouchableOpacity onPress={() => setShowAddPayment(false)} style={styles.modalClose}>
                <Ionicons name="close" size={22} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScroll}>
              {/* Summary Card */}
              <View style={styles.pmSummaryCard}>
                <View style={styles.pmBillRow}>
                  <Text style={styles.pmBillLabel}>Total Amount</Text>
                  <Text style={styles.pmBillAmount}>₹8,500</Text>
                </View>
                <View style={styles.pmBillRow}>
                  <View style={styles.pmDeductionRow}>
                    <View style={styles.pmMinusCircle}><Text style={styles.pmMinusText}>−</Text></View>
                    <Text style={styles.pmBillLabel}>Amount Paid</Text>
                  </View>
                  <Text style={styles.pmBillAmountPaid}>₹8,000</Text>
                </View>
                <View style={styles.pmDashedDivider} />
                <View style={styles.pmBillRow}>
                  <View style={styles.pmDeductionRow}>
                    <View style={styles.pmEqualsCircle}><Text style={styles.pmEqualsText}>=</Text></View>
                    <Text style={styles.pmDueLabel}>Due</Text>
                  </View>
                  <Text style={styles.pmDueAmount}>₹500</Text>
                </View>
              </View>

              <Text style={styles.pmFieldLabel}>Search by tenant name, number or ID</Text>
              <TextInput
                style={styles.pmInput}
                placeholder="e.g., Rahul Kumar"
                placeholderTextColor="#9CA3AF"
                value={paymentTenant}
                onChangeText={setPaymentTenant}
              />

              <Text style={styles.pmFieldLabel}>Amount paid</Text>
              <TextInput
                style={styles.pmInput}
                placeholder="e.g., 8500"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={paymentAmount}
                onChangeText={setPaymentAmount}
              />

              <Text style={styles.pmFieldLabel}>Payment date</Text>
              <View style={styles.pmDateRow}>
                <Text style={styles.pmDateText}>Dec 21, 2025</Text>
                <Ionicons name="calendar-outline" size={20} color="#6B7280" />
              </View>
              <View style={styles.pmUnderline} />

              <Text style={styles.pmFieldLabel}>Payment mode</Text>
              <View style={styles.pmDateRow}>
                <Text style={[styles.pmDateText, { color: '#9CA3AF' }]}></Text>
                <Ionicons name="chevron-down" size={20} color="#6B7280" />
              </View>
              <View style={styles.pmUnderline} />

              <Text style={styles.pmFieldLabel}>Description (optional)</Text>
              <TextInput
                style={styles.pmTextArea}
                placeholder="Add a note..."
                placeholderTextColor="#9CA3AF"
                multiline
                textAlignVertical="top"
                maxLength={200}
                value={paymentDescription}
                onChangeText={setPaymentDescription}
              />
              <Text style={styles.pmCharCount}>{paymentDescription.length}/200</Text>

              <TouchableOpacity style={styles.pmSubmitBtn} onPress={() => setShowAddPayment(false)}>
                <Text style={styles.pmSubmitText}>Save Payment</Text>
              </TouchableOpacity>
              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 50, paddingHorizontal: 16, paddingBottom: 12,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 20, fontFamily: FontFamily.interBold, color: '#111827' },

  subheader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingBottom: 16,
  },
  listingCount: { fontSize: 16, fontFamily: FontFamily.lato, color: '#6B7280' },
  listingNumber: { fontFamily: FontFamily.interBold, color: '#111827' },
  viewToggle: { flexDirection: 'row', backgroundColor: '#F3F4F6', borderRadius: 8, padding: 4 },
  toggleBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  toggleBtnActive: { backgroundColor: '#FFFFFF' },

  scroll: { flex: 1 },

  propertiesGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 16 },
  propertyCard: {
    width: cardWidth, backgroundColor: '#FFFFFF', borderRadius: 14,
    padding: 12, borderWidth: 1, borderColor: '#E5E7EB',
  },
  propImg: { height: 100, backgroundColor: '#F3F4F6', borderRadius: 10, marginBottom: 10 },
  propBadge: { backgroundColor: '#F3F4F6', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  propBadgeText: { fontSize: 11, fontFamily: FontFamily.latoSemiBold, color: '#4B5563' },
  propMetaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  ratingWrap: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 12, fontFamily: FontFamily.interSemiBold, color: '#111827' },
  propName: { fontSize: 13, fontFamily: FontFamily.interSemiBold, color: '#111827' },
  propAddr: { fontSize: 12, fontFamily: FontFamily.lato, color: '#6B7280', marginTop: 3 },

  fab: { position: 'absolute', bottom: 90, alignSelf: 'center', zIndex: 5 },
  fabBtn: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: '#1601AA',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#1601AA', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 8,
  },

  tabBar: {
    flexDirection: 'row', backgroundColor: '#FFFFFF',
    borderTopWidth: 1, borderTopColor: '#E5E7EB',
    paddingBottom: 24, paddingTop: 10, zIndex: 20, elevation: 10,
  },
  tabItem: { flex: 1, alignItems: 'center' },
  tabText: { fontSize: 11, fontFamily: FontFamily.lato, color: '#9CA3AF', marginTop: 4 },
  tabActive: { color: '#1601AA', fontFamily: FontFamily.latoSemiBold },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modalDismiss: { flex: 1 },
  modalSheet: {
    backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingTop: 12, maxHeight: '92%',
  },
  modalHandle: {
    width: 40, height: 4, borderRadius: 2, backgroundColor: '#D1D5DB',
    alignSelf: 'center', marginBottom: 12,
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  modalTitle: { fontSize: 18, fontFamily: FontFamily.interBold, color: '#111827' },
  modalClose: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center',
  },
  modalScroll: { paddingHorizontal: 20 },

  // Form
  fieldLabel: {
    fontSize: 14, fontFamily: FontFamily.interSemiBold, color: '#111827',
    marginTop: 20, marginBottom: 10,
  },
  typeGrid: { gap: 10 },
  typeBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#F9FAFB', borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: '#E5E7EB',
  },
  typeBtnActive: { borderColor: '#1601AA', backgroundColor: '#EEF2FF' },
  typeIconWrap: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center',
  },
  typeIconWrapActive: { backgroundColor: '#DBEAFE' },
  typeLabel: { fontSize: 15, fontFamily: FontFamily.interSemiBold, color: '#374151', flex: 1 },
  typeLabelActive: { color: '#1601AA' },
  typeDesc: { fontSize: 11, fontFamily: FontFamily.lato, color: '#9CA3AF', position: 'absolute', right: 14, bottom: 10, maxWidth: 120, textAlign: 'right' },
  input: {
    backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB',
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 14, fontFamily: FontFamily.lato, color: '#111827', marginBottom: 0,
  },
  addressRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, paddingHorizontal: 14, backgroundColor: '#FFFFFF' },
  floorConfigBox: { backgroundColor: '#F8FAFC', borderRadius: 12, padding: 14, marginTop: 4 },
  subLabel: { fontSize: 12, fontFamily: FontFamily.interSemiBold, color: '#4B5563', marginBottom: 8 },
  floorTab: {
    paddingHorizontal: 14, paddingVertical: 7,
    backgroundColor: '#FFFFFF', borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB',
  },
  floorTabActive: { backgroundColor: '#1601AA', borderColor: '#1601AA' },
  floorTabText: { fontSize: 12, fontFamily: FontFamily.interSemiBold, color: '#64748B' },
  floorTabTextActive: { color: '#FFFFFF' },
  dropdown: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 10,
  },
  dropdownText: { flex: 1, fontSize: 14, fontFamily: FontFamily.lato, color: '#111827' },
  dropdownList: { marginTop: 6, backgroundColor: '#FFFFFF', borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB', overflow: 'hidden' },
  dropdownItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  dropdownItemActive: { backgroundColor: '#F9FAFB' },
  dropdownItemText: { fontSize: 14, fontFamily: FontFamily.lato, color: '#374151' },
  dropdownItemTextActive: { color: '#1601AA', fontFamily: FontFamily.interSemiBold },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  calendarDay: {
    width: 36, height: 36, borderRadius: 8, backgroundColor: '#FFFFFF',
    borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center',
  },
  calendarDayActive: { backgroundColor: '#1601AA', borderColor: '#1601AA' },
  calendarDayText: { fontSize: 12, fontFamily: FontFamily.interSemiBold, color: '#374151' },
  calendarDayTextActive: { color: '#FFFFFF' },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  infoText: { fontSize: 12, fontFamily: FontFamily.lato, color: '#6B7280' },
  submitBtn: {
    backgroundColor: '#1601AA', borderRadius: 12, paddingVertical: 16,
    alignItems: 'center', marginTop: 24,
  },
  submitText: { fontSize: 16, fontFamily: FontFamily.interBold, color: '#FFFFFF' },

  // ── Action Picker
  pickerSheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 12, paddingHorizontal: 20 },
  pickerHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#D1D5DB', alignSelf: 'center', marginBottom: 12 },
  pickerTitle: { fontSize: 16, fontFamily: FontFamily.interBold, color: '#111827', marginBottom: 20, textAlign: 'center' },
  pickerOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, gap: 14 },
  pickerIconWrap: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  pickerTextWrap: { flex: 1 },
  pickerOptionTitle: { fontSize: 15, fontFamily: FontFamily.interSemiBold, color: '#111827' },
  pickerOptionSub: { fontSize: 12, fontFamily: FontFamily.lato, color: '#6B7280', marginTop: 2 },
  pickerDivider: { height: 1, backgroundColor: '#F3F4F6' },

  // ── Add Payment form
  pmSummaryCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 18, marginTop: 16, marginBottom: 8, borderWidth: 1, borderColor: '#E5E7EB', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 3 },
  pmBillRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  pmBillLabel: { fontSize: 14, fontFamily: FontFamily.lato, color: '#6B7280' },
  pmBillAmount: { fontSize: 20, fontFamily: FontFamily.interBold, color: '#1F2937' },
  pmBillAmountPaid: { fontSize: 16, fontFamily: FontFamily.interSemiBold, color: '#22C55E' },
  pmDeductionRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  pmMinusCircle: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#FEE2E2', alignItems: 'center', justifyContent: 'center' },
  pmMinusText: { fontSize: 14, fontFamily: FontFamily.interBold, color: '#EF4444', marginTop: -2 },
  pmEqualsCircle: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#DBEAFE', alignItems: 'center', justifyContent: 'center' },
  pmEqualsText: { fontSize: 12, fontFamily: FontFamily.interBold, color: '#2563EB' },
  pmDueLabel: { fontSize: 15, fontFamily: FontFamily.interBold, color: '#1F2937' },
  pmDueAmount: { fontSize: 20, fontFamily: FontFamily.interBold, color: '#EF4444' },
  pmDashedDivider: { height: 1, borderStyle: 'dashed', borderWidth: 1, borderColor: '#D1D5DB', marginVertical: 6 },
  pmFieldLabel: { fontSize: 14, fontFamily: FontFamily.interSemiBold, color: '#111827', marginTop: 20, marginBottom: 10 },
  pmInput: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, fontFamily: FontFamily.lato, color: '#111827' },
  pmDateRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  pmDateText: { fontSize: 14, fontFamily: FontFamily.lato, color: '#111827' },
  pmUnderline: { height: 1, backgroundColor: '#E5E7EB', marginBottom: 4 },
  pmTextArea: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, padding: 12, height: 100, fontSize: 13, fontFamily: FontFamily.lato, color: '#111827', backgroundColor: '#F9FAFB' },
  pmCharCount: { alignSelf: 'flex-end', fontSize: 11, fontFamily: FontFamily.lato, color: '#9CA3AF', marginTop: 4 },
  pmSubmitBtn: { backgroundColor: '#1601AA', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 24 },
  pmSubmitText: { fontSize: 16, fontFamily: FontFamily.interBold, color: '#FFFFFF' },
});

