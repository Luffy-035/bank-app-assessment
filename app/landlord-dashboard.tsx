import { FontFamily } from '@/constants/theme';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function LandlordDashboardScreen() {
  const fabAnim = React.useRef(new Animated.Value(0)).current;
  const lastOffsetY = React.useRef(0);

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
    outputRange: [0, 100], // Slide down 100px
  });

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
            <TouchableOpacity onPress={() => router.push('/profile')}>
              <Image
                source={{ uri: 'https://i.pravatar.cc/100?img=12' }}
                style={styles.avatar}
              />
            </TouchableOpacity>
            <View>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.userName}>Alex Thompson</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="notifications-outline" size={24} color="#111827" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Warning Banner */}
        <View style={styles.warningBanner}>
          <View style={styles.warningContent}>
            <View style={styles.warningIconWrap}>
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#374151' }}>!</Text>
            </View>
            <Text style={styles.warningText}>Bank account not linked for 1 properties</Text>
          </View>
          <TouchableOpacity style={styles.linkButton}>
            <Text style={styles.linkButtonText}>Link</Text>
          </TouchableOpacity>
        </View>

        {/* Overview */}
        <Text style={styles.sectionTitle}>Overview</Text>

        <View style={styles.overviewCardAnalytics}>
          <Text style={styles.analyticsLabel}>Total Properties</Text>
          <Text style={styles.analyticsBigVal}>20</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {/* Rent & Income */}
          <TouchableOpacity style={styles.statCard} onPress={() => router.push('/rent-income')}>
            <View style={styles.statIconWrap}>
              <FontAwesome5 name="money-bill-wave" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.statLabel}>Rent</Text>
            <Text style={styles.statValue}>85%</Text>
          </TouchableOpacity>

          {/* Tenant Hub */}
          <TouchableOpacity style={styles.statCard} onPress={() => router.push('/tenant-directory')}>
            <View style={styles.statIconWrap}>
              <FontAwesome5 name="house-user" size={18} color="#FFFFFF" />
            </View>
            <Text style={styles.statLabel}>Tenant</Text>
            <Text style={styles.statValue}>85%</Text>
          </TouchableOpacity>

          {/* Units */}
          <TouchableOpacity style={styles.statCard} onPress={() => router.push('/occupancy')}>
            <View style={styles.statIconWrap}>
              <Ionicons name="document-text" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.statLabel}>Units</Text>
            <Text style={styles.statValue}>92</Text>
          </TouchableOpacity>

          {/* Maintenance Request */}
          <TouchableOpacity style={styles.statCard} onPress={() => router.push('/landlord-requests')}>
            <View style={styles.statIconWrap}>
              <MaterialCommunityIcons name="tools" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.statLabel}>Maintenance{`\n`}Request</Text>
            <Text style={styles.statValue}>05</Text>
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
            <Text style={[styles.collectionVal, { color: '#22C55E' }]}>₹18,000</Text>
          </View>

          <View style={styles.collectionRow}>
            <View style={styles.dotWrap}><View style={[styles.dot, { backgroundColor: '#EF4444' }]} /></View>
            <Text style={styles.collectionLabel}>Pending</Text>
            <View style={{ flex: 1 }} />
            <Text style={[styles.collectionVal, { color: '#EF4444' }]}>₹2,000</Text>
          </View>

          <View style={styles.horizontalDottedLine} />

          <View style={styles.collectionRow}>
            <View style={styles.dotWrap} />
            <Text style={styles.collectionLabel}>Total</Text>
            <View style={{ flex: 1 }} />
            <Text style={styles.collectionValMain}>₹20,000</Text>
          </View>
        </View>

        {/* Action Required */}
        <Text style={styles.sectionTitle}>Action Required</Text>

        <TouchableOpacity style={styles.actionCard}>
          <View style={[styles.actionIconWrap, { backgroundColor: '#FEE2E2' }]}>
            <Ionicons name="alert-circle" size={16} color="#DC2626" />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Unit 5B: Rent Overdue</Text>
            <Text style={styles.actionSub}>John Smith is 5 days late.</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <View style={[styles.actionIconWrap, { backgroundColor: '#FEF3C7' }]}>
            <Ionicons name="time-outline" size={16} color="#D97706" />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Lease Ending Soon</Text>
            <Text style={styles.actionSub}>Unit 12A lease expires in 30 days.</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
        </TouchableOpacity>

        {/* Dues Pending Banner */}
        <TouchableOpacity style={styles.duesBanner} onPress={() => router.push('/dues-pending')}>
          <Ionicons name="warning" size={20} color="#F59E0B" />
          <Text style={styles.duesText}>Dues pending from <Text style={{ fontFamily: FontFamily.interBold, color: '#1F2937' }}>1 tenants</Text></Text>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </TouchableOpacity>

        {/* Properties Overview */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle2}>Properties Overview</Text>
          <TouchableOpacity onPress={() => router.push('/properties')}><Text style={styles.viewAll}>View All</Text></TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.propScrollContent}>
          <TouchableOpacity onPress={() => router.push('/properties')} style={styles.propCard}>
            <View style={styles.propImg} />
            <View style={styles.propBadge}>
              <Text style={styles.propBadgeText}>Occupied</Text>
            </View>
            <Text style={styles.propName}>Sunset Apartments</Text>
            <Text style={styles.propAddr}>123 Ocean Drive, Miami</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/properties')} style={[styles.propCard, styles.propCardVacant]}>
            <View style={[styles.propImg, { backgroundColor: '#E8E6FA' }]} />
            <View style={[styles.propBadge, { backgroundColor: '#FEF3C7' }]}>
              <Text style={[styles.propBadgeText, { color: '#D97706' }]}>Vacant</Text>
            </View>
            <Text style={styles.propName}>The Grand</Text>
            <Text style={styles.propAddr}>456 Park Ave</Text>
          </TouchableOpacity>
        </ScrollView>





        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB */}
      <Animated.View style={[styles.fab, { transform: [{ translateY: fabTranslateY }] }]}>
        <TouchableOpacity style={styles.fabBtn} onPress={() => router.push('/add-property')}>
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
    </View >
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
    borderWidth: 2,
    borderColor: '#1601AA',
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
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#1601AA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 22,
    fontFamily: FontFamily.interBold,
    color: '#1601AA',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 13,
    fontFamily: FontFamily.latoSemiBold,
    color: '#111827',
    marginTop: 8,
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
});