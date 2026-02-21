import { FontFamily } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

const tabs = [
  { id: 'property', label: 'Property', icon: 'business' },
  { id: 'city', label: 'City', icon: 'location' },
  { id: 'unit', label: 'Unit Type', icon: 'home' },
];

const tabData = {
  property: {
    title: 'Property',
    inventory: { vacant: 4, occupied: 39, total: 43, percent: 9 },
    expenses: [
      { label: 'Maintenance', amount: 4200, color: '#1601AA', width: '100%' },
      { label: 'Utilities', amount: 2800, color: '#1601AA', width: '67%' },
      { label: 'Insurance', amount: 1500, color: '#1601AA', width: '36%' },
      { label: 'Staff', amount: 3200, color: '#9CA3AF', width: '76%' },
      { label: 'Other', amount: 800, color: '#1601AA', width: '19%' },
    ],
  },
  city: {
    title: 'City',
    inventory: { vacant: 120, occupied: 850, total: 970, percent: 12 },
    expenses: [
      { label: 'Taxes', amount: 15000, color: '#1601AA', width: '90%' },
      { label: 'Services', amount: 8400, color: '#1601AA', width: '50%' },
      { label: 'Permits', amount: 3200, color: '#1601AA', width: '20%' },
      { label: 'Marketing', amount: 5000, color: '#9CA3AF', width: '30%' },
    ],
  },
  unit: {
    title: 'Unit Type',
    inventory: { vacant: 2, occupied: 18, total: 20, percent: 10 },
    expenses: [
      { label: 'Renovation', amount: 2000, color: '#1601AA', width: '80%' },
      { label: 'Cleaning', amount: 800, color: '#1601AA', width: '32%' },
      { label: 'Appliances', amount: 1200, color: '#9CA3AF', width: '50%' },
    ],
  }
};

export default function OccupancyScreen() {
  const [activeTab, setActiveTab] = useState<'property' | 'city' | 'unit'>('property');
  const currentData = tabData[activeTab];

  const getArcPath = (percentage: number) => {
    const radius = 60;
    const cx = 80;
    const cy = 80;
    const p = Math.min(Math.max(percentage, 0), 100);
    // Start at 180 deg (PI), moves clockwise to 0 deg.
    // Actually in standard Trig, it moves counter-clockwise effectively if we decrease angle from PI to 0.
    // angle = PI - (p/100)*PI
    const angleRad = Math.PI - (p / 100) * Math.PI;

    const x = cx + radius * Math.cos(angleRad);
    const y = cy - radius * Math.sin(angleRad); // Y axis is down, so 'up' is negative relative to center

    return `M 20 80 A 60 60 0 0 1 ${x} ${y}`;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Occupancy</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Tabs */}
        <View style={styles.tabsRow}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.tabActive]}
              onPress={() => setActiveTab(tab.id as 'property' | 'city' | 'unit')}
            >
              <Ionicons
                name={tab.icon as any}
                size={16}
                color={activeTab === tab.id ? '#FFFFFF' : '#6B7280'}
              />
              <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Analytics Overview */}
        <Text style={styles.sectionTitle}>Analytics Overview</Text>

        <View style={styles.snapshotGrid}>
          <View style={styles.snapshotItem}>
            <View style={styles.snapshotIconWrap}>
              <Ionicons name="bar-chart-outline" size={18} color="#1601AA" />
            </View>
            <View style={styles.snapshotContent}>
              <Text style={styles.snapshotValue}>{100 - currentData.inventory.percent}%</Text>
              <Text style={styles.snapshotLabel}>Occupancy Rate</Text>
            </View>
          </View>
          <View style={styles.snapshotItem}>
            <View style={styles.snapshotIconWrap}>
              <Ionicons name="people-outline" size={18} color="#1601AA" />
            </View>
            <View style={styles.snapshotContent}>
              <Text style={styles.snapshotValue}>{currentData.inventory.vacant} rooms</Text>
              <Text style={styles.snapshotLabel}>Vacancy Forecast</Text>
            </View>
          </View>
        </View>

        {/* Inventory Section */}
        <View style={styles.chartCard}>
          <View style={styles.inventoryHeader}>
            <View>
              <Text style={styles.chartTitle}>Inventory</Text>
              <Text style={styles.inventorySubtitle}>{currentData.inventory.total} Bed</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.viewLink}>View &gt;</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inventoryContent}>
            {/* Stats - Vertical Stack */}
            <View style={styles.inventoryStats}>
              {/* Vacant */}
              <View style={styles.statGroup}>
                <View style={[styles.statDot, { backgroundColor: '#D1D5DB' }]} />
                <Text style={styles.statLabel}>Vacant</Text>
                <Text style={styles.statValue}>{currentData.inventory.vacant}</Text>
              </View>

              {/* Occupied */}
              <View style={styles.statGroup}>
                <View style={[styles.statDot, { backgroundColor: '#22C55E' }]} />
                <Text style={styles.statLabel}>Occupied</Text>
                <Text style={styles.statValue}>{currentData.inventory.occupied}</Text>
              </View>
            </View>

            {/* Semi Circle Chart */}
            <View style={styles.semiCircleWrapper}>
              <Svg width={160} height={90} viewBox="0 0 160 90">
                {/* Track - semi circle */}
                <Path
                  d="M 20 80 A 60 60 0 0 1 140 80"
                  stroke="#F3F4F6"
                  strokeWidth="16"
                  fill="none"
                  strokeLinecap="round"
                />
                {/* Progress Segment */}
                <Path
                  d={getArcPath(currentData.inventory.percent)}
                  stroke="#22C55E"
                  strokeWidth="16"
                  fill="none"
                  strokeLinecap="round"
                />
              </Svg>
              <View style={styles.gaugeTextContainer}>
                <Text style={styles.gaugePercent}>{currentData.inventory.percent}%</Text>
                <Text style={styles.gaugeLabel}>occupancy</Text>
              </View>
            </View>
          </View>
        </View>





        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },

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

  // Tabs
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F5F5F7',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  tabActive: { backgroundColor: '#4D3CFF', borderColor: '#4D3CFF' },
  tabText: { fontSize: 13, color: '#6B7280' },
  tabTextActive: { color: '#FFFFFF' },

  // Section Title
  sectionTitle: {
    fontSize: 15,
    fontFamily: FontFamily.interBold,
    color: '#1F2937',
    paddingHorizontal: 16,
    marginBottom: 10,
    marginTop: 6,
  },

  // Snapshot Grid
  snapshotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  snapshotItem: {
    width: (width - 40) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    margin: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
  },
  snapshotIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  snapshotContent: { flex: 1 },
  snapshotValue: { fontSize: 16, fontFamily: FontFamily.interBold, color: '#111827' },
  snapshotLabel: { fontSize: 11, fontFamily: FontFamily.lato, color: '#6B7280', marginTop: 3 },

  // Chart Card
  chartCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chartTitle: { fontSize: 18, fontFamily: FontFamily.interBold, color: '#111827' },
  inventoryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  inventorySubtitle: { fontSize: 13, fontFamily: FontFamily.lato, color: '#6B7280', marginTop: 4 },
  viewLink: { fontSize: 13, fontFamily: FontFamily.lato, color: '#6B7280' },
  inventoryContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 4 },
  inventoryStats: { gap: 32, justifyContent: 'center' },
  statGroup: { gap: 6 },
  statDot: { width: 14, height: 14, borderRadius: 5, marginBottom: 2 },
  statLabel: { fontSize: 14, fontFamily: FontFamily.lato, color: '#6B7280' },
  statValue: { fontSize: 24, fontFamily: FontFamily.interBold, color: '#111827' },
  semiCircleWrapper: { position: 'relative', alignItems: 'center', justifyContent: 'center', paddingRight: 20 },
  gaugeTextContainer: { position: 'absolute', top: 35, alignItems: 'center' },
  gaugePercent: { fontSize: 24, fontFamily: FontFamily.interBold, color: '#111827' },
  gaugeLabel: { fontSize: 12, fontFamily: FontFamily.lato, color: '#6B7280', marginTop: -2 },

  trendChartContainer: { flexDirection: 'row', justifyContent: 'center' },
  chartAreaOccupancy: { overflow: 'hidden', width: 260, alignSelf: 'center' },

  // Expense Card
  expenseCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  expenseTitle: { fontSize: 14, fontFamily: FontFamily.interBold, color: '#111827' },
  expenseTotal: { fontSize: 12, fontFamily: FontFamily.lato, color: '#6B7280', marginTop: 2, marginBottom: 14 },
  expenseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  expenseLabel: { width: 90, fontSize: 12, color: '#9CA3AF', textAlign: 'right', marginRight: 12 },
  expenseBarContainer: { flex: 1 },
  expenseBar: {
    height: 28,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  expenseAmount: { fontSize: 12, color: '#FFFFFF' },


});

