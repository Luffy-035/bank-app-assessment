import { FontFamily } from '@/constants/theme';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { usePayments } from '@/hooks/usePayments';
import { useProperties } from '@/hooks/useProperties';
import {
  Alert,
  Animated,
  Dimensions,
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

const PROPERTY_TYPES = [
  { id: 'building', label: 'Building', icon: 'business-outline' as const, description: 'Multi-floor building with multiple units' },
  { id: 'floor', label: 'Floor', icon: 'layers-outline' as const, description: 'Single floor with individual rooms' },
  { id: 'pg', label: 'PG', icon: 'people-outline' as const, description: 'Paying Guest accommodation' },
];
const RENT_CYCLE_DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const UNIT_OPTIONS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '12', '15', '20'];

export default function LandlordDashboardScreen() {
  const { user } = useAuth();
  const { stats, loading: statsLoading } = useDashboardStats();
  const { dues, recordPayment, refetch: refetchPayments } = usePayments();
  const { properties, addProperty, refetch: refetchProperties } = useProperties();

  // Derived real data
  const overdueDues = dues.filter((d) => d.balance > 0);
  const overdueDuesCount = overdueDues.length;
  const initials = (user?.name ?? 'L').trim().split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
  // FAB scroll animation
  const fabAnim = React.useRef(new Animated.Value(0)).current;
  const lastOffsetY = React.useRef(0);

  // Modal states
  const [showActionPicker, setShowActionPicker] = useState(false);
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);

  // Add Property form state
  const [selectedType, setSelectedType] = useState('building');
  const [propertyName, setPropertyName] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [totalFloors, setTotalFloors] = useState('');
  const [activeFloor, setActiveFloor] = useState(1);
  const [floorUnits, setFloorUnits] = useState<Record<number, string>>({});
  const [rentCycle, setRentCycle] = useState('1');
  const [showFloorUnitDropdown, setShowFloorUnitDropdown] = useState(false);
  const [propSubmitting, setPropSubmitting] = useState(false);

  // Add Payment form state
  const [paymentTenant, setPaymentTenant] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDescription, setPaymentDescription] = useState('');
  const [paySubmitting, setPaySubmitting] = useState(false);

  const getCurrentFloorUnits = () => floorUnits[activeFloor] || '4';

  const resetPropertyForm = () => {
    setSelectedType('building');
    setPropertyName('');
    setPropertyAddress('');
    setTotalFloors('');
    setActiveFloor(1);
    setFloorUnits({});
    setRentCycle('1');
    setShowFloorUnitDropdown(false);
  };

  const resetPaymentForm = () => {
    setPaymentTenant('');
    setPaymentAmount('');
    setPaymentDescription('');
  };

  const handleAddProperty = async () => {
    if (!propertyName.trim()) { Alert.alert('Missing Field', 'Please enter a property name.'); return; }
    if (!propertyAddress.trim()) { Alert.alert('Missing Field', 'Please enter an address.'); return; }
    setPropSubmitting(true);
    try {
      await addProperty({
        name: propertyName.trim(),
        address: propertyAddress.trim(),
        type: selectedType as 'building' | 'floor' | 'pg',
        totalFloors: parseInt(totalFloors || '1', 10),
        rentCycle: parseInt(rentCycle, 10),
      });
      await refetchProperties();
      setShowAddProperty(false);
      resetPropertyForm();
      Alert.alert('Success', 'Property added successfully.');
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message ?? 'Failed to add property. Please try again.');
    } finally {
      setPropSubmitting(false);
    }
  };

  const handleAddPayment = async () => {
    const amountNum = Number(paymentAmount);
    if (!paymentTenant.trim()) { Alert.alert('Missing Field', 'Please enter a tenant name or ID.'); return; }
    if (!amountNum || amountNum <= 0) { Alert.alert('Validation', 'Please enter a valid amount.'); return; }
    // Find matching due by tenant name or display ID
    const matchedDue = dues.find((d: any) =>
      (d.tenant?.userId?.name?.toLowerCase().includes(paymentTenant.toLowerCase())) ||
      (d.tenant?.tenantId?.toLowerCase().includes(paymentTenant.toLowerCase()))
    );
    if (!matchedDue) { Alert.alert('Not Found', 'No tenant found matching that name or ID. Use the tenant directory to record payments.'); return; }
    setPaySubmitting(true);
    try {
      const now = new Date();
      await recordPayment({
        tenantId: matchedDue.tenant._id,
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        rentDue: matchedDue.rentDue,
        amountPaid: amountNum,
        paymentMode: 'cash',
        paymentDate: now.toISOString(),
        notes: paymentDescription.trim() || undefined,
      });
      await refetchPayments();
      setShowAddPayment(false);
      resetPaymentForm();
      Alert.alert('Success', `Payment of ₹${amountNum.toLocaleString('en-IN')} recorded.`);
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message ?? 'Failed to record payment. Please try again.');
    } finally {
      setPaySubmitting(false);
    }
  };

  const ordinalSuffix = (n: number) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const handleScroll = (event: any) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const direction = currentOffset > lastOffsetY.current ? 'down' : 'up';

    // Only animate if significant scroll and valid direction
    if (Math.abs(currentOffset - lastOffsetY.current) > 20) {
      if (direction === 'down' && currentOffset > 50) {
        Animated.timing(fabAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else if (direction === 'up') {
        Animated.timing(fabAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
      lastOffsetY.current = currentOffset;
    }
  };

  const fabTranslateY = fabAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100],
  });

  // ── Real stats from API
  const collectionReceived = stats?.collection?.totalCollected ?? 0;
  const collectionTotal = stats?.collection?.totalDue ?? 1;
  const collectionPct = stats?.collectionPct ?? 0;
  const totalTenants = stats?.occupiedUnits ?? 0;
  const occupiedUnits = stats?.occupiedUnits ?? 0;
  const occupancyPct = stats?.occupancyPct ?? 0;
  const totalUnits = stats?.totalUnits ?? 0;
  const maintenanceOpen = stats?.openMaintenance ?? 0;
  const totalProperties = stats?.totalProperties ?? 0;

  // Today's date string for payment modal
  const todayStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => router.push('/profile')} style={styles.avatar}>
              <Text style={styles.avatarInitials}>{initials}</Text>
            </TouchableOpacity>
            <View>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.userName}>{user?.name ?? 'Landlord'}</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="notifications-outline" size={24} color="#111827" />
            </TouchableOpacity>
          </View>
        </View>



        {/* Overview */}
        <Text style={styles.sectionTitle}>Overview</Text>

        <View style={styles.overviewCardAnalytics}>
          <Text style={styles.analyticsLabel}>Total Properties</Text>
          {statsLoading ? (
            <ActivityIndicator size="small" color="#1601AA" style={{ marginTop: 4 }} />
          ) : (
            <Text style={styles.analyticsBigVal}>{totalProperties}</Text>
          )}
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {/* Rent & Income */}
          <TouchableOpacity style={styles.statCard} onPress={() => router.push('/rent-income')}>
            <View style={styles.statCardTop}>
              <View style={styles.statIconWrap}>
                <FontAwesome5 name="money-bill-wave" size={16} color="#FFFFFF" />
              </View>
              <View style={styles.statTitleBlock}>
                <Text style={styles.statLabel}>Rent</Text>
                <View style={styles.statTitleLine} />
              </View>
            </View>
            <Text style={styles.statValue}>{collectionPct}%</Text>
          </TouchableOpacity>

          {/* Tenant Hub */}
          <TouchableOpacity style={styles.statCard} onPress={() => router.push('/tenant-directory')}>
            <View style={styles.statCardTop}>
              <View style={styles.statIconWrap}>
                <FontAwesome5 name="house-user" size={14} color="#FFFFFF" />
              </View>
              <View style={styles.statTitleBlock}>
                <Text style={styles.statLabel}>Tenant</Text>
                <View style={styles.statTitleLine} />
              </View>
            </View>
            <Text style={styles.statValue}>{occupancyPct}%</Text>
          </TouchableOpacity>

          {/* Units */}
          <TouchableOpacity style={styles.statCard} onPress={() => router.push('/occupancy')}>
            <View style={styles.statCardTop}>
              <View style={styles.statIconWrap}>
                <Ionicons name="business-outline" size={18} color="#FFFFFF" />
              </View>
              <View style={styles.statTitleBlock}>
                <Text style={styles.statLabel}>Units</Text>
                <View style={styles.statTitleLine} />
              </View>
            </View>
            <Text style={styles.statValue}>{totalUnits}</Text>
          </TouchableOpacity>

          {/* Maintenance */}
          <TouchableOpacity style={styles.statCard} onPress={() => router.push('/landlord-requests')}>
            <View style={styles.statCardTop}>
              <View style={styles.statIconWrap}>
                <MaterialCommunityIcons name="tools" size={16} color="#FFFFFF" />
              </View>
              <View style={styles.statTitleBlock}>
                <Text style={styles.statLabel}>Maintenance</Text>
                <View style={styles.statTitleLine} />
              </View>
            </View>
            <Text style={styles.statValue}>{String(maintenanceOpen).padStart(2, '0')}</Text>
          </TouchableOpacity>
        </View>



        {/* Collection */}
        <View style={styles.collectionBox}>
          <Text style={styles.collectionTitle}>Collection</Text>
          <View style={styles.collectionBarRow}>
            <View style={styles.barReceived} />
            <View style={styles.barPending} />
          </View>

          <View style={styles.collectionRow}>
            <View style={styles.dotWrap}><View style={[styles.dot, { backgroundColor: '#22C55E' }]} /></View>
            <Text style={styles.collectionLabel}>Received</Text>
            <View style={{ flex: 1 }} />
            <Text style={[styles.collectionVal, { color: '#22C55E' }]}>₹{collectionReceived.toLocaleString('en-IN')}</Text>
          </View>

          <View style={styles.collectionRow}>
            <View style={styles.dotWrap}><View style={[styles.dot, { backgroundColor: '#EF4444' }]} /></View>
            <Text style={styles.collectionLabel}>Pending</Text>
            <View style={{ flex: 1 }} />
            <Text style={[styles.collectionVal, { color: '#EF4444' }]}>₹{(collectionTotal - collectionReceived).toLocaleString('en-IN')}</Text>
          </View>

          <View style={styles.horizontalDottedLine} />

          <View style={styles.collectionRow}>
            <View style={styles.dotWrap} />
            <Text style={styles.collectionLabel}>Total</Text>
            <View style={{ flex: 1 }} />
            <Text style={styles.collectionValMain}>₹{collectionTotal.toLocaleString('en-IN')}</Text>
          </View>
        </View>

        {/* Action Required */}
        <Text style={styles.sectionTitle}>Action Required</Text>

        {overdueDues.map((due) => (
          <TouchableOpacity
            key={due.tenant._id}
            style={styles.actionCard}
            onPress={() => router.push('/dues-pending')}
          >
            <View style={[styles.actionIconWrap, { backgroundColor: '#FEE2E2' }]}>
              <Ionicons name="alert-circle" size={16} color="#DC2626" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>
                {due.unit ? `Unit ${due.unit.unitNumber}: ` : ''}Rent Overdue
              </Text>
              <Text style={styles.actionSub}>
                {due.tenant.userId?.name ?? 'Tenant'} — ₹{due.balance.toLocaleString('en-IN')} pending
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
          </TouchableOpacity>
        ))}

        {/* Dues Pending Banner — only show when there are actually overdue dues */}
        {overdueDuesCount > 0 && (
          <TouchableOpacity style={styles.duesBanner} onPress={() => router.push('/dues-pending')}>
            <Ionicons name="warning" size={20} color="#F59E0B" />
            <Text style={styles.duesText}>Dues pending from{' '}<Text style={{ fontFamily: FontFamily.interBold, color: '#1F2937' }}>{overdueDuesCount} tenant{overdueDuesCount !== 1 ? 's' : ''}</Text></Text>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        )}

        {/* Properties Overview */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle2}>Properties Overview</Text>
          <TouchableOpacity onPress={() => router.push('/properties')}><Text style={styles.viewAll}>View All</Text></TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.propScrollContent}>
          {properties.length === 0 ? (
            <View style={[styles.propCard, { justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={{ fontSize: 13, fontFamily: FontFamily.lato, color: '#9CA3AF' }}>No properties yet — tap + to add one</Text>
            </View>
          ) : (
            properties.map((prop) => {
              const isOccupied = (prop.occupiedCount ?? 0) > 0;
              return (
                <TouchableOpacity
                  key={prop._id}
                  onPress={() => router.push({ pathname: '/property-details', params: { id: prop._id } })}
                  style={[styles.propCard, !isOccupied && styles.propCardVacant]}
                >
                  <View style={[styles.propImg, !isOccupied && { backgroundColor: '#E8E6FA' }]} />
                  <View style={[styles.propBadge, !isOccupied && { backgroundColor: '#FEF3C7' }]}>
                    <Text style={[styles.propBadgeText, !isOccupied && { color: '#D97706' }]}>
                      {isOccupied ? 'Occupied' : 'Vacant'}
                    </Text>
                  </View>
                  <Text style={styles.propName}>{prop.name}</Text>
                  <Text style={styles.propAddr}>{prop.address}</Text>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>





        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB */}
      <Animated.View style={[styles.fab, { transform: [{ translateY: fabTranslateY }] }]}>
        <TouchableOpacity style={styles.fabBtn} onPress={() => setShowActionPicker(true)}>
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="grid" size={20} color="#1601AA" />
          <Text style={[styles.tabText, styles.tabActive]}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/properties')}>
          <Ionicons name="business-outline" size={20} color="#9CA3AF" />
          <Text style={styles.tabText}>Properties</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/landlord-requests')}>
          <Ionicons name="construct-outline" size={20} color="#9CA3AF" />
          <Text style={styles.tabText}>Requests</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/help-support')}>
          <Ionicons name="ellipsis-horizontal" size={20} color="#9CA3AF" />
          <Text style={styles.tabText}>More</Text>
        </TouchableOpacity>
      </View>

      {/* ── Action Picker Modal ── */}
      <Modal visible={showActionPicker} animationType="slide" transparent onRequestClose={() => setShowActionPicker(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalDismiss} onPress={() => setShowActionPicker(false)} />
          <View style={styles.pickerSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.pickerTitle}>What would you like to add?</Text>
            <TouchableOpacity
              style={styles.pickerOption}
              onPress={() => { setShowActionPicker(false); resetPropertyForm(); setShowAddProperty(true); }}
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

      {/* ── Add Property Modal ── */}
      <Modal visible={showAddProperty} animationType="slide" transparent onRequestClose={() => setShowAddProperty(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalDismiss} onPress={() => setShowAddProperty(false)} />
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Property</Text>
              <TouchableOpacity onPress={() => setShowAddProperty(false)} style={styles.modalClose}>
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
                      <Ionicons name={type.icon} size={22} color={selectedType === type.id ? '#1601AA' : '#6B7280'} />
                    </View>
                    <Text style={[styles.typeLabel, selectedType === type.id && styles.typeLabelActive]}>{type.label}</Text>
                    <Text style={styles.typeDesc}>{type.description}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Property Name */}
              <Text style={styles.fieldLabel}>Property Name</Text>
              <TextInput
                style={styles.formInput}
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
                  style={[styles.formInput, { flex: 1, marginBottom: 0, borderWidth: 0 }]}
                  placeholder="Start typing your address..."
                  placeholderTextColor="#9CA3AF"
                  value={propertyAddress}
                  onChangeText={setPropertyAddress}
                />
              </View>

              {/* Total Floors */}
              <Text style={styles.fieldLabel}>Total Floors</Text>
              <TextInput
                style={styles.formInput}
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
                        <Text style={[styles.floorTabText, activeFloor === floor && styles.floorTabTextActive]}>Floor {floor}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <Text style={styles.subLabel}>Units on Floor {activeFloor}</Text>
                  <TouchableOpacity style={styles.dropdown} onPress={() => setShowFloorUnitDropdown(!showFloorUnitDropdown)}>
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
                    <Text style={[styles.calendarDayText, rentCycle === day.toString() && styles.calendarDayTextActive]}>{day}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={14} color="#6B7280" />
                <Text style={styles.infoText}>Rent due on {ordinalSuffix(parseInt(rentCycle))} of every month</Text>
              </View>

              <TouchableOpacity
                style={[styles.submitBtn, propSubmitting && { opacity: 0.7 }]}
                onPress={handleAddProperty}
                disabled={propSubmitting}
              >
                <Text style={styles.submitText}>{propSubmitting ? 'Adding…' : 'Add Property'}</Text>
              </TouchableOpacity>
              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ── Add Payment Modal ── */}
      <Modal visible={showAddPayment} animationType="slide" transparent onRequestClose={() => setShowAddPayment(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalDismiss} onPress={() => setShowAddPayment(false)} />
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Record Payment</Text>
              <TouchableOpacity onPress={() => setShowAddPayment(false)} style={styles.modalClose}>
                <Ionicons name="close" size={22} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScroll}>
              {/* Payment Summary Card */}
              <View style={styles.pmSummaryCard}>
                <View style={styles.pmBillRow}>
                  <Text style={styles.pmBillLabel}>Total Amount</Text>
                  <Text style={styles.pmBillAmount}>₹{paymentAmount ? Number(paymentAmount).toLocaleString('en-IN') : '0'}</Text>
                </View>
                <View style={styles.pmBillRow}>
                  <View style={styles.pmDeductionRow}>
                    <View style={styles.pmMinusCircle}><Text style={styles.pmMinusText}>−</Text></View>
                    <Text style={styles.pmBillLabel}>Amount Paid</Text>
                  </View>
                  <Text style={styles.pmBillAmountPaid}>₹{paymentAmount ? Number(paymentAmount).toLocaleString('en-IN') : '0'}</Text>
                </View>
                <View style={styles.pmDashedDivider} />
                <View style={styles.pmBillRow}>
                  <View style={styles.pmDeductionRow}>
                    <View style={styles.pmEqualsCircle}><Text style={styles.pmEqualsText}>=</Text></View>
                    <Text style={styles.pmDueLabel}>Due</Text>
                  </View>
                  <Text style={styles.pmDueAmount}>₹0</Text>
                </View>
              </View>

              {/* Tenant */}
              <Text style={styles.fieldLabel}>Search by tenant name, number or ID</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., Rahul Kumar"
                placeholderTextColor="#9CA3AF"
                value={paymentTenant}
                onChangeText={setPaymentTenant}
              />

              {/* Amount */}
              <Text style={styles.fieldLabel}>Amount paid</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., 8500"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={paymentAmount}
                onChangeText={setPaymentAmount}
              />

              {/* Payment Date */}
              <Text style={styles.fieldLabel}>Payment date</Text>
              <View style={styles.pmDateRow}>
                <Text style={styles.pmDateText}>{todayStr}</Text>
                <Ionicons name="calendar-outline" size={20} color="#6B7280" />
              </View>
              <View style={styles.pmUnderline} />

              {/* Payment Mode */}
              <Text style={styles.fieldLabel}>Payment mode</Text>
              <View style={styles.pmDateRow}>
                <Text style={[styles.pmDateText, { color: '#9CA3AF' }]}></Text>
                <Ionicons name="chevron-down" size={20} color="#6B7280" />
              </View>
              <View style={styles.pmUnderline} />

              {/* Description */}
              <Text style={styles.fieldLabel}>Description (optional)</Text>
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

              <TouchableOpacity
                style={[styles.submitBtn, paySubmitting && { opacity: 0.7 }]}
                onPress={handleAddPayment}
                disabled={paySubmitting}
              >
                <Text style={styles.submitText}>{paySubmitting ? 'Saving…' : 'Save Payment'}</Text>
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
  scroll: { flex: 1 },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#1601AA',
  },
  avatarInitials: {
    fontSize: 18,
    fontFamily: FontFamily.interBold,
    color: '#1601AA',
  },
  welcomeText: {
    fontSize: 14,
    fontFamily: FontFamily.lato,
    color: '#6B7280',
  },
  userName: {
    fontSize: 18,
    fontFamily: FontFamily.interBold,
    color: '#111827',
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: FontFamily.interSemiBold,
    color: '#111827',
    marginLeft: 16,
    marginBottom: 10,
    marginTop: 16,
  },
  overviewCardAnalytics: {
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF', // Clean White
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0', // Subtle Grey
    padding: 20,
    marginBottom: 16,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  analyticsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  analyticsLabel: {
    fontSize: 14,
    fontFamily: FontFamily.lato,
    color: '#64748B', // Slate 500
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  analyticsBigVal: {
    fontSize: 48,
    fontFamily: FontFamily.interBold,
    color: '#0F172A', // Dark Slate 900
    lineHeight: 56,
  },
  analyticsTrendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5', // Emerald 50
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D1FAE5', // Emerald 100
  },
  analyticsTrendText: {
    fontSize: 12,
    fontFamily: FontFamily.interSemiBold,
    color: '#10B981', // Emerald 500
    marginLeft: 4,
  },
  analyticsDivider: {
    height: 1,
    backgroundColor: '#E2E8F0', // Slate 200
    marginBottom: 20,
  },
  analyticsGrid: {
    flexDirection: 'row',
  },
  analyticsCol: {
    flex: 1,
    paddingRight: 16,
  },
  analyticsSubLabel: {
    fontSize: 12,
    fontFamily: FontFamily.lato,
    color: '#64748B', // Slate 500
    marginBottom: 6,
  },
  analyticsRowAlign: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  analyticsSubVal: {
    fontSize: 20,
    fontFamily: FontFamily.interBold,
    color: '#0F172A', // Dark Slate 900
    marginRight: 8,
  },
  analyticsSubUnit: {
    fontSize: 12,
    fontFamily: FontFamily.lato,
    color: '#64748B', // Slate 500
  },
  analyticsProgressBar: {
    height: 6,
    backgroundColor: '#E2E8F0', // Slate 200
    borderRadius: 3,
    marginTop: 4,
  },
  analyticsProgressFill: {
    height: 6,
    borderRadius: 3,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444', // Red 500
    marginTop: 2,
  },
  badgeRow: {
    alignItems: 'center',
    marginBottom: 18,
  },
  countBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8E6FA',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  countText: {
    fontSize: 13,
    fontFamily: FontFamily.interSemiBold,
    color: '#1601AA',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    marginBottom: 18,
  },
  statCard: {
    width: (width - 40) / 2,
    backgroundColor: '#EDE9FE', // Light Purple Bg
    borderRadius: 16,
    padding: 16,
    margin: 4,
    minHeight: 110,
    // Flex behavior
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',

    // Shadow removal for flat look in image, or keep subtle? Image looks flat-ish.
    shadowColor: 'transparent',
    borderWidth: 0,
  },
  statIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#1601AA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statTitleBlock: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    paddingLeft: 8,
    paddingTop: 2,
  },
  statTitleLine: {
    width: '90%',
    height: 1.5,
    backgroundColor: '#E5E7EB',
    marginTop: 6,
    borderRadius: 1,
  },
  statValue: {
    fontSize: 24,
    fontFamily: FontFamily.interBold,
    color: '#1601AA',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: FontFamily.interSemiBold,
    color: '#111827',
    textAlign: 'right',
  },
  tenantCard: {
    marginHorizontal: 16,
    backgroundColor: '#1601AA',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  tenantLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  tenantIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tenantLabel: { fontSize: 11, fontFamily: FontFamily.lato, color: '#FFFFFF', opacity: 0.8 },
  tenantCount: { fontSize: 18, fontFamily: FontFamily.interBold, color: '#FFFFFF' },
  actionCard: {
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  actionContent: { flex: 1 },
  actionTitle: { fontSize: 13, fontFamily: FontFamily.interSemiBold, color: '#111827' },
  actionSub: { fontSize: 11, fontFamily: FontFamily.lato, color: '#6B7280', marginTop: 2 },
  collectionBox: {
    marginHorizontal: 16,
    marginTop: 18,
    marginBottom: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  collectionTitle: { fontSize: 16, fontFamily: FontFamily.interSemiBold, color: '#111827', marginBottom: 16 },
  collectionBarRow: {
    flexDirection: 'row',
    height: 16,
    marginBottom: 20,
    gap: 6,
  },
  barReceived: { flex: 0.9, backgroundColor: '#22C55E', borderRadius: 4 },
  barPending: { flex: 0.1, backgroundColor: '#EF4444', borderRadius: 4 },
  collectionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  dotWrap: { width: 24, alignItems: 'flex-start' }, // Increased width for better spacing
  dot: { width: 8, height: 8, borderRadius: 4 },
  collectionLabel: { fontSize: 13, fontFamily: FontFamily.lato, color: '#4B5563' },
  horizontalDottedLine: {
    height: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    borderStyle: 'dashed',
    marginBottom: 12,
    marginTop: 4,
    marginLeft: 32, // Indent to align with text if desired, or 0 for full width
  },
  collectionVal: { fontSize: 13, fontFamily: FontFamily.interSemiBold },
  collectionValMain: { fontSize: 13, fontFamily: FontFamily.interBold, color: '#111827' },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 6,
    marginBottom: 12,
  },
  sectionTitle2: { fontSize: 14, fontFamily: FontFamily.interSemiBold, color: '#111827' },
  viewAll: { fontSize: 12, fontFamily: FontFamily.latoSemiBold, color: '#1601AA' },
  propScrollContent: { paddingLeft: 16, paddingRight: 16 },
  propCard: {
    width: 180,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginRight: 12,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  propCardVacant: {
    backgroundColor: '#EDE9FE',
    borderColor: '#E8E6FA',
  },
  propImg: {
    height: 100,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    marginBottom: 10,
  },
  propBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#D1FAE5',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 8,
  },
  propBadgeText: { fontSize: 11, fontFamily: FontFamily.latoSemiBold, color: '#22C55E' },
  propName: { fontSize: 13, fontFamily: FontFamily.interSemiBold, color: '#111827' },
  propAddr: { fontSize: 12, fontFamily: FontFamily.lato, color: '#6B7280', marginTop: 3 },
  incomeCard: {
    marginHorizontal: 16,
    backgroundColor: '#1601AA',
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
    marginTop: 2,
  },
  incomeLabel: { fontSize: 13, fontFamily: FontFamily.lato, color: '#FFFFFF', opacity: 0.85 },
  incomeAmount: { fontSize: 28, fontFamily: FontFamily.interBold, color: '#FFFFFF', marginTop: 6 },
  rentalCard: {
    marginHorizontal: 16,
    backgroundColor: '#1601AA',
    borderRadius: 24,
    padding: 20,
    borderWidth: 3,
    borderColor: '#C7D2FE',
  },
  rentalTitle: { fontSize: 16, fontFamily: FontFamily.interSemiBold, color: '#FFFFFF', marginBottom: 16, textAlign: 'center' },
  chartWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
    marginBottom: 4,
  },
  dotsContainer: {
    width: 120,
    height: 120,
    position: 'relative',
  },
  chartDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  chartIconWrap: {
    position: 'absolute',
    top: 45,
    left: '50%',
    marginLeft: -18,
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#0D1B4D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartLabel: { fontSize: 12, fontFamily: FontFamily.lato, color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginBottom: 4 },
  chartValue: { fontSize: 32, fontFamily: FontFamily.interBold, color: '#FFFFFF', textAlign: 'center', marginBottom: 18 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, paddingHorizontal: 10 },
  summaryCol: { alignItems: 'flex-start' },
  summaryColHeader: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 },
  summaryColLabel: { fontSize: 11, fontFamily: FontFamily.lato, color: 'rgba(255,255,255,0.6)' },
  summaryColVal: { fontSize: 20, fontFamily: FontFamily.interBold, color: '#FFFFFF' },
  summaryColSub: { fontSize: 10, fontFamily: FontFamily.lato, color: 'rgba(255,255,255,0.5)', marginTop: 4 },
  locList: {
    paddingTop: 4,
  },
  locRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  locName: { fontSize: 15, fontFamily: FontFamily.lato, color: '#FFFFFF' },
  locVal: { fontSize: 15, fontFamily: FontFamily.latoSemiBold, color: '#FFFFFF' },
  fab: {
    position: 'absolute',
    bottom: 90,
    alignSelf: 'center',
    zIndex: 5,
  },
  fabBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#1601AA',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1601AA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingBottom: 22,
    paddingTop: 8,
    zIndex: 20,
    elevation: 10, // Ensure it sits above FAB on Android
  },
  tabItem: { flex: 1, alignItems: 'center' },
  tabText: { fontSize: 10, fontFamily: FontFamily.lato, color: '#9CA3AF', marginTop: 3 },
  tabActive: { color: '#1601AA', fontFamily: FontFamily.latoSemiBold },
  warningBanner: {
    marginHorizontal: 16,
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 6,
  },
  warningContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  warningIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningText: {
    fontSize: 12,
    fontFamily: FontFamily.lato,
    color: '#FEF3C7',
    flex: 1,
  },
  linkButton: {
    backgroundColor: '#F59E0B',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  linkButtonText: {
    fontSize: 12,
    fontFamily: FontFamily.interSemiBold,
    color: '#1F2937',
  },
  duesBanner: {
    marginHorizontal: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: -8,
  },
  duesText: {
    flex: 1,
    fontSize: 13,
    fontFamily: FontFamily.lato,
    color: '#4B5563',
    marginLeft: 10,
  },

  // ── Modal shared
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modalDismiss: { flex: 1 },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#D1D5DB', alignSelf: 'center', marginBottom: 12 },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  modalTitle: { fontSize: 18, fontFamily: FontFamily.interBold, color: '#111827' },
  modalClose: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  modalSheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 12, maxHeight: '92%' },
  modalScroll: { paddingHorizontal: 20 },

  // ── Action Picker
  pickerSheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 12, paddingHorizontal: 20 },
  pickerTitle: { fontSize: 16, fontFamily: FontFamily.interBold, color: '#111827', marginBottom: 20, textAlign: 'center' },
  pickerOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, gap: 14 },
  pickerIconWrap: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  pickerTextWrap: { flex: 1 },
  pickerOptionTitle: { fontSize: 15, fontFamily: FontFamily.interSemiBold, color: '#111827' },
  pickerOptionSub: { fontSize: 12, fontFamily: FontFamily.lato, color: '#6B7280', marginTop: 2 },
  pickerDivider: { height: 1, backgroundColor: '#F3F4F6' },

  // ── Add Property form
  fieldLabel: { fontSize: 14, fontFamily: FontFamily.interSemiBold, color: '#111827', marginTop: 20, marginBottom: 10 },
  typeGrid: { gap: 10 },
  typeBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#F9FAFB', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#E5E7EB' },
  typeBtnActive: { borderColor: '#1601AA', backgroundColor: '#EEF2FF' },
  typeIconWrap: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  typeIconWrapActive: { backgroundColor: '#DBEAFE' },
  typeLabel: { fontSize: 15, fontFamily: FontFamily.interSemiBold, color: '#374151', flex: 1 },
  typeLabelActive: { color: '#1601AA' },
  typeDesc: { fontSize: 11, fontFamily: FontFamily.lato, color: '#9CA3AF', position: 'absolute', right: 14, bottom: 10, maxWidth: 120, textAlign: 'right' },
  formInput: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, fontFamily: FontFamily.lato, color: '#111827' },
  addressRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, paddingHorizontal: 14, backgroundColor: '#FFFFFF' },
  floorConfigBox: { backgroundColor: '#F8FAFC', borderRadius: 12, padding: 14, marginTop: 4 },
  subLabel: { fontSize: 12, fontFamily: FontFamily.interSemiBold, color: '#4B5563', marginBottom: 8 },
  floorTab: { paddingHorizontal: 14, paddingVertical: 7, backgroundColor: '#FFFFFF', borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB' },
  floorTabActive: { backgroundColor: '#1601AA', borderColor: '#1601AA' },
  floorTabText: { fontSize: 12, fontFamily: FontFamily.interSemiBold, color: '#64748B' },
  floorTabTextActive: { color: '#FFFFFF' },
  dropdown: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 10 },
  dropdownText: { flex: 1, fontSize: 14, fontFamily: FontFamily.lato, color: '#111827' },
  dropdownList: { marginTop: 6, backgroundColor: '#FFFFFF', borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB', overflow: 'hidden' },
  dropdownItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  dropdownItemActive: { backgroundColor: '#F9FAFB' },
  dropdownItemText: { fontSize: 14, fontFamily: FontFamily.lato, color: '#374151' },
  dropdownItemTextActive: { color: '#1601AA', fontFamily: FontFamily.interSemiBold },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  calendarDay: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' },
  calendarDayActive: { backgroundColor: '#1601AA', borderColor: '#1601AA' },
  calendarDayText: { fontSize: 12, fontFamily: FontFamily.interSemiBold, color: '#374151' },
  calendarDayTextActive: { color: '#FFFFFF' },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  infoText: { fontSize: 12, fontFamily: FontFamily.lato, color: '#6B7280' },
  submitBtn: { backgroundColor: '#1601AA', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 24 },
  submitText: { fontSize: 16, fontFamily: FontFamily.interBold, color: '#FFFFFF' },

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
  pmDateRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  pmDateText: { fontSize: 14, fontFamily: FontFamily.lato, color: '#111827' },
  pmUnderline: { height: 1, backgroundColor: '#E5E7EB', marginBottom: 4 },
  pmTextArea: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, padding: 12, height: 100, fontSize: 13, fontFamily: FontFamily.lato, color: '#111827', backgroundColor: '#F9FAFB' },
  pmCharCount: { alignSelf: 'flex-end', fontSize: 11, fontFamily: FontFamily.lato, color: '#9CA3AF', marginTop: 4 },
});