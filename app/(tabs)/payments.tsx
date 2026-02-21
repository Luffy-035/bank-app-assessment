import { FontFamily } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type FilterType = 'All' | 'Paid' | 'Due' | 'Over Due';
type PaymentStatus = 'Paid' | 'Due' | 'Over Due';

interface Payment {
  id: string;
  month: string;
  year: string;
  paidOn?: string;
  status: PaymentStatus;
  amountPaid?: string;
  amountDue?: string;
  totalBill: string;
  lateFee?: string;
  unitsConsumed: string;
  paymentMethod?: string;
  statusText?: string;
}

const payments: Payment[] = [
  {
    id: '1',
    month: 'October',
    year: '2025',
    paidOn: '05 Oct 2025',
    status: 'Paid',
    amountPaid: '₹8,500.00',
    totalBill: '₹8,500.00',
    unitsConsumed: '125 kWh',
    paymentMethod: 'UPI',
  },
  {
    id: '2',
    month: 'September',
    year: '2025',
    paidOn: '12 Sep 2025',
    status: 'Due',
    amountPaid: '₹8,750.00',
    totalBill: '₹8,600.00',
    lateFee: '+₹150 late fee',
    unitsConsumed: '142 kWh',
    paymentMethod: 'Credit Card',
  },
  {
    id: '3',
    month: 'August',
    year: '2025',
    status: 'Over Due',
    amountDue: '₹8,420.00',
    totalBill: '₹8,420.00',
    unitsConsumed: '118 kWh',
    statusText: 'Outstanding Balance',
  },
  {
    id: '4',
    month: 'July',
    year: '2025',
    paidOn: '03 Jul 2025',
    status: 'Paid',
    amountPaid: '₹8,350.00',
    totalBill: '₹8,350.00',
    unitsConsumed: '110 kWh',
    paymentMethod: 'Wallet',
  },
];

export default function PaymentsScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');

  const filters: FilterType[] = ['All', "Over Due", 'Due', 'Paid',];

  const filteredPayments = payments.filter((payment) => {
    if (activeFilter === 'All') return true;
    return payment.status === activeFilter;
  });

  const getStatusColors = (status: PaymentStatus) => {
    switch (status) {
      case 'Paid':
        return { bg: '#DCFCE7', color: '#22C55E', icon: 'checkmark-circle' as const };
      case 'Due':
        return { bg: '#FEF3C7', color: '#F59E0B', icon: 'time' as const };
      case 'Over Due':
        return { bg: '#FEE2E2', color: '#EF4444', icon: 'close-circle' as const };
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Gradient Header */}
        <LinearGradient
          colors={['#1601AA', '#2D1B69']}
          style={styles.gradientHeader}
        >
          {/* Header Row */}
          <View style={styles.headerRow}>
            <TouchableOpacity>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Payments</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* White Security Card */}
          <View style={styles.securityCard}>
            <View style={styles.securityTop}>
              {/* Shield Icon */}
              <View style={styles.shieldCircle}>
                <Ionicons name="shield-checkmark" size={28} color="#FFFFFF" />
              </View>

              {/* Text Content */}
              <View style={styles.securityTextArea}>
                <Text style={styles.securityMainText}>Bank-Level Security</Text>
                <View style={styles.securitySubRow}>
                  <Text style={styles.securitySubText}>
                    Your data is encrypted & secure
                  </Text>
                  <Text style={styles.verifiedLabel}>Verified</Text>
                </View>
              </View>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Badges Row */}
            <View style={styles.badgesContainer}>
              <View style={styles.singleBadge}>
                <Ionicons name="lock-closed" size={16} color="#D97706" />
                <Text style={styles.badgeLabel}>256-bit SSL</Text>
              </View>
              <View style={styles.singleBadge}>
                <Ionicons name="checkmark-circle" size={16} color="#1601AA" />
                <Text style={styles.badgeLabel}>PCI Compliant</Text>
              </View>
              <View style={styles.singleBadge}>
                <Ionicons name="eye-off" size={16} color="#9CA3AF" />
                <Text style={styles.badgeLabel}>Zero Storage</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Filter Pills */}
        <View style={styles.filtersContainer}>
          {filters.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <TouchableOpacity
                key={filter}
                style={[styles.filterPill, isActive && styles.filterPillActive]}
                onPress={() => setActiveFilter(filter)}
              >
                <Text style={[styles.filterLabel, isActive && styles.filterLabelActive]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Payment Cards List */}
        <View style={styles.cardsContainer}>
          {filteredPayments.map((payment) => {
            const statusColors = getStatusColors(payment.status);
            const isPaid = payment.status === 'Paid';
            const isOverDue = payment.status === 'Over Due';

            return (
              <View key={payment.id} style={styles.paymentCard}>
                {/* Card Inner Content */}
                <View style={styles.cardInner}>
                  {/* Top: Month/Year + Status */}
                  <View style={styles.cardTopRow}>
                    <View>
                      <Text style={styles.monthYearText}>
                        {payment.month} {payment.year}
                      </Text>
                      <Text style={styles.paidOnLabel}>
                        {isOverDue ? 'Payment missed' : `Paid on: ${payment.paidOn}`}
                      </Text>
                    </View>

                    {/* Status Badge */}
                    <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
                      <Ionicons name={statusColors.icon} size={12} color={statusColors.color} />
                      <Text style={[styles.statusText, { color: statusColors.color }]}>
                        {payment.status}
                      </Text>
                    </View>
                  </View>

                  {/* Bill Breakdown Section */}
                  <View style={styles.billBreakdown}>
                    {/* Total Rent */}
                    <View style={styles.billLine}>
                      <View style={styles.billLabelRow}>
                        <View style={[styles.billIcon, { backgroundColor: '#E0E7FF' }]}>
                          <Ionicons name="home-outline" size={14} color="#1601AA" />
                        </View>
                        <Text style={styles.billLineLabel}>Total Rent</Text>
                      </View>
                      <Text style={styles.billLineAmount}>{payment.totalBill}</Text>
                    </View>

                    {/* Rent Paid with minus indicator after */}
                    <View style={styles.billLine}>
                      <View style={styles.billLabelRow}>
                        <View style={[styles.billIcon, { backgroundColor: '#DCFCE7' }]}>
                          <Ionicons name="checkmark-outline" size={14} color="#22C55E" />
                        </View>
                        <Text style={styles.billLineLabel}>Rent Paid</Text>
                        <Text style={styles.minusSign}>−</Text>
                      </View>
                      <Text style={styles.billLineAmount}>{payment.amountPaid || '₹0'}</Text>
                    </View>

                    {/* Dashed Divider */}
                    <View style={styles.dashedLine} />

                    {/* Balance */}
                    <View style={styles.balanceRow}>
                      <Text style={styles.balanceLabel}>Balance:</Text>
                      <Text style={[
                        styles.balanceAmount,
                        isOverDue && { color: '#EF4444' }
                      ]}>
                        {isOverDue ? payment.amountDue : '₹0'}
                      </Text>
                    </View>
                  </View>

                  {/* Info Boxes Row */}
                  <View style={styles.infoBoxRow}>
                    <View style={styles.infoBoxItem}>
                      <Ionicons name="flash-outline" size={16} color="#F59E0B" />
                      <View style={styles.infoBoxText}>
                        <Text style={styles.infoBoxLabel}>Units Consumed</Text>
                        <Text style={styles.infoBoxValue}>{payment.unitsConsumed}</Text>
                      </View>
                    </View>
                    <View style={styles.infoBoxItem}>
                      <Ionicons name="card-outline" size={16} color="#1601AA" />
                      <View style={styles.infoBoxText}>
                        <Text style={styles.infoBoxLabel}>Payment Method</Text>
                        <Text style={styles.infoBoxValue}>
                          {payment.statusText || payment.paymentMethod}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Action Button */}
                  <TouchableOpacity style={[
                    styles.actionButton,
                    isPaid ? styles.actionButtonOutline : styles.actionButtonFilled
                  ]}>
                    <Text style={[
                      styles.actionText,
                      !isPaid && { color: '#FFFFFF' }
                    ]}>
                      {isPaid ? 'View Receipt' : 'Pay Now'}
                    </Text>
                    <Ionicons
                      name={isPaid ? "document-text-outline" : "arrow-forward"}
                      size={16}
                      color={isPaid ? "#1601AA" : "#FFFFFF"}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  gradientHeader: {
    paddingTop: 44,
    paddingBottom: 18,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: FontFamily.interBold,
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: FontFamily.lato,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 14,
  },
  securityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
  },
  securityTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  shieldCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  securityTextArea: {
    flex: 1,
    paddingTop: 6,
  },
  securityMainText: {
    fontSize: 18,
    fontFamily: FontFamily.interBold,
    color: '#1F2937',
    marginBottom: 6,
  },
  securitySubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  securitySubText: {
    fontSize: 14,
    fontFamily: FontFamily.lato,
    color: '#6B7280',
    marginRight: 10,
  },
  verifiedLabel: {
    fontSize: 14,
    fontFamily: FontFamily.latoSemiBold,
    color: '#22C55E',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
  badgesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  singleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badgeLabel: {
    fontSize: 13,
    fontFamily: FontFamily.latoSemiBold,
    color: '#6B7280',
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterPillActive: {
    backgroundColor: '#1601AA',
    borderColor: '#1601AA',
  },
  filterLabel: {
    fontSize: 12,
    fontFamily: FontFamily.lato,
    color: '#6B7280',
  },
  filterLabelActive: {
    color: '#FFFFFF',
  },
  cardsContainer: {
    paddingHorizontal: 16,
  },
  paymentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statusStrip: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  cardInner: {
    flex: 1,
    padding: 12,
    paddingLeft: 16,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  monthYearText: {
    fontSize: 15,
    fontFamily: FontFamily.interBold,
    color: '#1F2937',
    marginBottom: 2,
  },
  paidOnLabel: {
    fontSize: 11,
    fontFamily: FontFamily.lato,
    color: '#9CA3AF',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    gap: 4,
  },
  statusText: {
    fontSize: 10,
    fontFamily: FontFamily.interSemiBold,
  },
  // Bill Breakdown Styles
  billBreakdown: {
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  billLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  billLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  billIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  billLineLabel: {
    fontSize: 13,
    fontFamily: FontFamily.lato,
    color: '#6B7280',
  },
  billLineAmount: {
    fontSize: 13,
    fontFamily: FontFamily.interSemiBold,
    color: '#374151',
  },
  minusSign: {
    fontSize: 13,
    fontFamily: FontFamily.lato,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  dashedLine: {
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginVertical: 4,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  balanceLabel: {
    fontSize: 13,
    fontFamily: FontFamily.interBold,
    color: '#1F2937',
  },
  balanceAmount: {
    fontSize: 14,
    fontFamily: FontFamily.interBold,
    color: '#1F2937',
  },
  // Info Box Styles
  infoBoxRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  infoBoxItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 8,
    gap: 8,
  },
  infoBoxText: {
    flex: 1,
  },
  infoBoxLabel: {
    fontSize: 9,
    fontFamily: FontFamily.lato,
    color: '#9CA3AF',
    marginBottom: 1,
  },
  infoBoxValue: {
    fontSize: 12,
    fontFamily: FontFamily.interSemiBold,
    color: '#1F2937',
  },
  // Action Button Styles
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 5,
  },
  actionButtonOutline: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#1601AA',
  },
  actionButtonFilled: {
    backgroundColor: '#1601AA',
  },
  actionText: {
    fontSize: 13,
    fontFamily: FontFamily.interSemiBold,
    color: '#1601AA',
  },
});
