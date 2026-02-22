import { FontFamily } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function TenantDashboard() {
  const [activeDocTab, setActiveDocTab] = useState<'Personal' | 'Property' | 'Legal'>('Personal');

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <LinearGradient
          colors={['#4285F4', '#281499']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.userName}>Sarah Johnson</Text>
            </View>
            <View style={styles.avatarPlaceholder}>
              <View style={styles.avatarRing} />
            </View>
          </View>

          {/* Current Rent Card */}
          <View style={styles.rentCard}>
            <View style={styles.rentHeader}>
              <Text style={styles.rentLabel}>Current Rent</Text>
              <View style={styles.paidBadge}>
                <Text style={styles.paidText}>Paid</Text>
              </View>
            </View>
            <Text style={styles.rentAmount}>₹18,500</Text>
            <Text style={styles.rentDue}>Due: 1st of every month</Text>
            <View style={styles.nextPaymentRow}>
              <View style={styles.calendarIconContainer}>
                <Ionicons name="calendar" size={12} color="#FFFFFF" />
              </View>
              <Text style={styles.nextPaymentText}>Next payment: Jan 1, 2025</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Quick Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Links</Text>
          <View style={styles.quickLinksRow}>
            <TouchableOpacity style={styles.quickLinkCard}>
              <View style={[styles.quickLinkIconWrapper, { backgroundColor: '#DBEAFE' }]}>
                <Ionicons name="card" size={24} color="#1E3A8A" />
              </View>
              <Text style={styles.quickLinkText} numberOfLines={1} adjustsFontSizeToFit>Pay Now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickLinkCard}>
              <View style={[styles.quickLinkIconWrapper, { backgroundColor: '#FED7AA' }]}>
                <Ionicons name="construct" size={24} color="#EA580C" />
              </View>
              <Text style={styles.quickLinkText} numberOfLines={1} adjustsFontSizeToFit>Maintenance</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickLinkCard}>
              <View style={[styles.quickLinkIconWrapper, { backgroundColor: '#BBF7D0' }]}>
                <Ionicons name="document-text" size={24} color="#166534" />
              </View>
              <Text style={styles.quickLinkText} numberOfLines={1} adjustsFontSizeToFit>Documents</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickLinkCard}>
              <View style={[styles.quickLinkIconWrapper, { backgroundColor: '#DDD6FE' }]}>
                <Ionicons name="log-out" size={24} color="#6D28D9" />
              </View>
              <Text style={styles.quickLinkText} numberOfLines={1} adjustsFontSizeToFit>Move Out</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.activityCard}>
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: '#DCFCE7' }]}>
                <Ionicons name="checkmark-circle" size={20} color="#22C55E" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Rent Payment Successful</Text>
                <Text style={styles.activitySubtitle}>Dec 1, 2024 • ₹18,500</Text>
              </View>
            </View>

            <View style={styles.activityDivider} />

            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="construct" size={20} color="#F59E0B" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Maintenance Completed</Text>
                <Text style={styles.activitySubtitle}>Nov 26, 2024 • AC Repair</Text>
              </View>
            </View>

            <View style={styles.activityDivider} />

            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: '#DBEAFE' }]}>
                <Ionicons name="document-text" size={20} color="#3B82F6" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Document Uploaded</Text>
                <Text style={styles.activitySubtitle}>Nov 15, 2024 • Aadhaar Card</Text>
              </View>
            </View>
          </View>
        </View>


        {/* Electricity Usage */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Electricity Usage</Text>
          <View style={styles.electricityCard}>
            {/* Header with icon */}
            <View style={styles.electricityHeader}>
              <View style={styles.electricityIconContainer}>
                <Ionicons name="flash" size={20} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.electricityLabel}>Last 30 Days Consumption</Text>
                <Text style={styles.electricityValue}>245 <Text style={styles.electricityUnit}>kWh</Text></Text>
              </View>
            </View>

            {/* Stats Row */}
            <View style={styles.electricityStats}>
              <View style={styles.electricityStat}>
                <Text style={styles.statLabel}>Daily Average</Text>
                <Text style={styles.statValue}>8.2 kWh</Text>
              </View>
              <View style={styles.electricityStat}>
                <Text style={styles.statLabel}>Est. Cost</Text>
                <Text style={styles.statValue}>₹1470</Text>
              </View>
            </View>

            {/* Trend Banner */}
            <View style={styles.electricityTrend}>
              <Text style={styles.trendIcon}>↘</Text>
              <Text style={styles.trendTextGreen}>12% less</Text>
              <Text style={styles.trendTextNormal}> than last month</Text>
            </View>

            {/* Footer */}
            <View style={styles.electricityFooter}>
              <Ionicons name="calendar-outline" size={14} color="#9BA1A6" />
              <Text style={styles.electricityFooterText}>Nov 10 - Dec 10, 2024  •  ₹6/unit</Text>
            </View>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Payment Methods</Text>
            <TouchableOpacity>
              <Text style={styles.manageText}>Manage</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.paymentMethodCard}>
            <View style={styles.paymentMethodRow}>
              <View style={styles.cardIconContainer}>
                <Text style={styles.cardBrand}>VISA</Text>
              </View>
              <View style={styles.cardDetails}>
                <Text style={styles.cardNumber}>•••• 4242</Text>
                <Text style={styles.cardPrimary}>Primary</Text>
              </View>
              <View style={styles.secureBadge}>
                <Ionicons name="shield-checkmark" size={14} color="#22C55E" />
                <Text style={styles.secureText}>Secure</Text>
              </View>
            </View>
            <View style={styles.encryptionRow}>
              <Ionicons name="lock-closed" size={12} color="#22C55E" />
              <Text style={styles.encryptionText}>256-bit encryption • PCI DSS compliant</Text>
            </View>
          </View>
        </View>

        {/* Active Maintenance */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Maintenance</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.maintenanceCard}>
            <View style={styles.maintenanceHeader}>
              <Text style={styles.maintenanceTitle}>AC Not Cooling</Text>
              <View style={styles.inProgressBadge}>
                <Text style={styles.inProgressText}>In Progress</Text>
              </View>
            </View>
            <Text style={styles.ticketNumber}>Ticket #MT-2024-1156</Text>

            <View style={styles.maintenanceDetail}>
              <Ionicons name="person-outline" size={14} color="#9BA1A6" />
              <Text style={styles.maintenanceDetailText}>Rajesh Kumar</Text>
            </View>
            <View style={styles.maintenanceDetail}>
              <Ionicons name="time-outline" size={14} color="#9BA1A6" />
              <Text style={styles.maintenanceDetailText}>ETA: 2:30 PM Today</Text>
            </View>
            <View style={styles.maintenanceDetail}>
              <Ionicons name="pricetag-outline" size={14} color="#9BA1A6" />
              <Text style={styles.maintenanceDetailText}>Cost: ₹800 - ₹1,200</Text>
            </View>

            <View style={styles.messageBubble}>
              <View style={styles.messageIcon}>
                <Ionicons name="chatbubble-ellipses" size={14} color="#1601AA" />
              </View>
              <View style={styles.messageContent}>
                <Text style={styles.messageTitle}>AC making strange noise</Text>
                <Text style={styles.messageTime}>You • 10:30 AM</Text>
              </View>
            </View>

            <View style={styles.technicianUpdate}>
              <View style={styles.technicianContent}>
                <Text style={styles.technicianTitle}>Technician on the way</Text>
                <Text style={styles.technicianTime}>Support • 2:15 PM</Text>
              </View>
              <View style={styles.technicianAvatar}>
                <Ionicons name="person" size={14} color="#FFFFFF" />
              </View>
            </View>

            <TouchableOpacity style={styles.markResolvedButton}>
              <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
              <Text style={styles.markResolvedText}>Mark as Resolved</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* My Documents */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Documents</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.docTabs}>
            {(['Personal', 'Property', 'Legal'] as const).map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.docTab, activeDocTab === tab && styles.docTabActive]}
                onPress={() => setActiveDocTab(tab)}
              >
                <Text style={[styles.docTabText, activeDocTab === tab && styles.docTabTextActive]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.documentItem}>
            <View style={styles.docIconContainer}>
              <Ionicons name="id-card" size={16} color="#1601AA" />
            </View>
            <View style={styles.docContent}>
              <Text style={styles.docTitle}>Aadhaar Card</Text>
              <View style={styles.docStatusRow}>
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
                <Text style={styles.docDate}>Nov 15, 2024</Text>
              </View>
            </View>
          </View>

          <View style={styles.documentItem}>
            <View style={styles.docIconContainer}>
              <Ionicons name="card" size={16} color="#EF4444" />
            </View>
            <View style={styles.docContent}>
              <Text style={styles.docTitle}>PAN Card</Text>
              <View style={styles.docStatusRow}>
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
                <Text style={styles.docDate}>Nov 15, 2024</Text>
              </View>
            </View>
          </View>

          <View style={styles.documentItem}>
            <View style={styles.docIconContainer}>
              <Ionicons name="business" size={16} color="#F59E0B" />
            </View>
            <View style={styles.docContent}>
              <Text style={styles.docTitle}>Company ID</Text>
              <View style={styles.docStatusRow}>
                <View style={styles.renewalBadge}>
                  <Text style={styles.renewalText}>Renewal Due</Text>
                </View>
                <Text style={styles.docDate}>Sep 10, 2024</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.uploadDocButton} onPress={() => router.push('/documents')}>
            <Ionicons name="cloud-upload-outline" size={18} color="#1601AA" />
            <Text style={styles.uploadDocText}>Upload New Document</Text>
          </TouchableOpacity>
        </View>

        {/* Move-Out Info */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Move-Out Info</Text>
            <TouchableOpacity>
              <Text style={styles.viewDetailsText}>View Details</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.moveOutCard}>
            <View style={styles.moveOutRow}>
              <View style={styles.moveOutIcon}>
                <Ionicons name="calendar" size={16} color="#1601AA" />
              </View>
              <View>
                <Text style={styles.moveOutLabel}>Lease End Date</Text>
                <Text style={styles.moveOutValue}>March 31, 2025</Text>
              </View>
            </View>

            <View style={styles.securityDepositRow}>
              <Text style={styles.securityDepositLabel}>Security Deposit</Text>
              <View style={styles.pendingBadge}>
                <Text style={styles.pendingText}>Pending</Text>
              </View>
            </View>
            <Text style={styles.securityDepositAmount}>₹37,000</Text>
            <Text style={styles.refundText}>Refund: 7-14 days after inspection</Text>

            <View style={styles.moveOutButtons}>
              <TouchableOpacity style={styles.moveOutNoticeButton}>
                <Text style={styles.moveOutNoticeText}>Move Out</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.renewButton}>
                <Text style={styles.renewText}>Renew Agreement</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  header: {
    paddingTop: 44,
    paddingHorizontal: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  headerTextContainer: {},
  welcomeText: {
    fontSize: 13,
    fontFamily: FontFamily.lato,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 2,
  },
  userName: {
    fontSize: 20,
    fontFamily: FontFamily.interBold,
    color: '#FFFFFF',
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarRing: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  rentCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 14,
    padding: 14,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  rentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  rentLabel: {
    fontSize: 13,
    fontFamily: FontFamily.lato,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  paidBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  paidText: {
    fontSize: 11,
    fontFamily: FontFamily.latoSemiBold,
    color: '#6B7280',
  },
  rentAmount: {
    fontSize: 32,
    fontFamily: FontFamily.latoBold,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  rentDue: {
    fontSize: 13,
    fontFamily: FontFamily.lato,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
  },
  nextPaymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  calendarIconContainer: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextPaymentText: {
    fontSize: 13,
    fontFamily: FontFamily.lato,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: FontFamily.interSemiBold,
    color: '#1F3A5F',
    marginBottom: 10,
  },
  viewAllText: {
    fontSize: 13,
    fontFamily: FontFamily.latoSemiBold,
    color: '#1601AA',
  },
  manageText: {
    fontSize: 13,
    fontFamily: FontFamily.latoSemiBold,
    color: '#1601AA',
  },
  viewDetailsText: {
    fontSize: 13,
    fontFamily: FontFamily.latoSemiBold,
    color: '#1601AA',
  },
  quickLinksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  quickLinkCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 90,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  quickLinkIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  quickLinkText: {
    fontSize: 11,
    fontFamily: FontFamily.lato,
    color: '#11181C',
    textAlign: 'center',
    width: '100%',
    paddingHorizontal: 2,
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  activityDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 2,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontFamily: FontFamily.lato,
    color: '#11181C',
    marginBottom: 2,
  },
  activitySubtitle: {
    fontSize: 12,
    fontFamily: FontFamily.lato,
    color: '#6B7280',
  },
  electricityCard: {
    backgroundColor: '#FEF7ED',
    borderRadius: 16,
    padding: 16,
  },
  electricityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  electricityIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
  },
  electricityLabel: {
    fontSize: 14,
    fontFamily: FontFamily.lato,
    color: '#1F2937',
    marginBottom: 2,
  },
  electricityValue: {
    fontSize: 24,
    fontFamily: FontFamily.interBold,
    color: '#1F2937',
  },
  electricityUnit: {
    fontSize: 16,
    fontFamily: FontFamily.lato,
    color: '#6B7280',
  },
  electricityStats: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  electricityStat: {
    flex: 1,
    backgroundColor: '#FFFBF5',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FDE8D0',
  },
  statLabel: {
    fontSize: 13,
    fontFamily: FontFamily.lato,
    color: '#6B7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontFamily: FontFamily.interBold,
    color: '#1F2937',
  },
  electricityTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  trendIcon: {
    fontSize: 14,
    color: '#22C55E',
    marginRight: 6,
  },
  trendTextGreen: {
    fontSize: 14,
    fontFamily: FontFamily.interSemiBold,
    color: '#22C55E',
  },
  trendTextNormal: {
    fontSize: 14,
    fontFamily: FontFamily.lato,
    color: '#1F2937',
  },
  electricityFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  electricityFooterText: {
    fontSize: 13,
    fontFamily: FontFamily.lato,
    color: '#6B7280',
  },
  paymentMethodCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  paymentMethodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardIconContainer: {
    width: 40,
    height: 26,
    backgroundColor: '#1E3A8A',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardBrand: {
    fontSize: 8,
    fontFamily: FontFamily.interBold,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  cardDetails: {
    flex: 1,
  },
  cardNumber: {
    fontSize: 14,
    fontFamily: FontFamily.latoSemiBold,
    color: '#11181C',
  },
  cardPrimary: {
    fontSize: 11,
    fontFamily: FontFamily.lato,
    color: '#9BA1A6',
  },
  secureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  secureText: {
    fontSize: 11,
    fontFamily: FontFamily.latoSemiBold,
    color: '#22C55E',
  },
  encryptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  encryptionText: {
    fontSize: 11,
    fontFamily: FontFamily.lato,
    color: '#9BA1A6',
  },
  maintenanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  maintenanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  maintenanceTitle: {
    fontSize: 14,
    fontFamily: FontFamily.latoSemiBold,
    color: '#11181C',
  },
  inProgressBadge: {
    backgroundColor: '#1601AA',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  inProgressText: {
    fontSize: 9,
    fontFamily: FontFamily.latoSemiBold,
    color: '#FFFFFF',
  },
  ticketNumber: {
    fontSize: 11,
    fontFamily: FontFamily.lato,
    color: '#9BA1A6',
    marginBottom: 8,
  },
  maintenanceDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  maintenanceDetailText: {
    fontSize: 12,
    fontFamily: FontFamily.lato,
    color: '#6B7280',
  },
  messageBubble: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
    gap: 8,
  },
  messageIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageContent: {
    flex: 1,
  },
  messageTitle: {
    fontSize: 12,
    fontFamily: FontFamily.lato,
    color: '#11181C',
    marginBottom: 1,
  },
  messageTime: {
    fontSize: 10,
    fontFamily: FontFamily.lato,
    color: '#9BA1A6',
  },
  technicianUpdate: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    padding: 10,
    marginTop: 6,
  },
  technicianContent: {},
  technicianTitle: {
    fontSize: 12,
    fontFamily: FontFamily.lato,
    color: '#11181C',
    marginBottom: 1,
  },
  technicianTime: {
    fontSize: 10,
    fontFamily: FontFamily.lato,
    color: '#9BA1A6',
  },
  technicianAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markResolvedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1601AA',
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 10,
    gap: 6,
  },
  markResolvedText: {
    fontSize: 12,
    fontFamily: FontFamily.interSemiBold,
    color: '#FFFFFF',
  },
  docTabs: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 6,
  },
  docTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  docTabActive: {
    backgroundColor: '#1601AA',
  },
  docTabText: {
    fontSize: 12,
    fontFamily: FontFamily.latoSemiBold,
    color: '#6B7280',
  },
  docTabTextActive: {
    color: '#FFFFFF',
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  docIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  docContent: {
    flex: 1,
  },
  docTitle: {
    fontSize: 13,
    fontFamily: FontFamily.latoSemiBold,
    color: '#11181C',
    marginBottom: 2,
  },
  docStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  verifiedBadge: {
    backgroundColor: '#DCFCE7',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  verifiedText: {
    fontSize: 9,
    fontFamily: FontFamily.latoSemiBold,
    color: '#22C55E',
  },
  renewalBadge: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  renewalText: {
    fontSize: 9,
    fontFamily: FontFamily.latoSemiBold,
    color: '#F59E0B',
  },
  docDate: {
    fontSize: 10,
    fontFamily: FontFamily.lato,
    color: '#9BA1A6',
  },
  uploadDocButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 8,
    gap: 6,
  },
  uploadDocText: {
    fontSize: 12,
    fontFamily: FontFamily.interSemiBold,
    color: '#281499',
  },
  moveOutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  moveOutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  moveOutIcon: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moveOutLabel: {
    fontSize: 11,
    fontFamily: FontFamily.lato,
    color: '#9BA1A6',
    marginBottom: 1,
  },
  moveOutValue: {
    fontSize: 14,
    fontFamily: FontFamily.interSemiBold,
    color: '#11181C',
  },
  securityDepositRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  securityDepositLabel: {
    fontSize: 11,
    fontFamily: FontFamily.lato,
    color: '#9BA1A6',
  },
  pendingBadge: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  pendingText: {
    fontSize: 9,
    fontFamily: FontFamily.latoSemiBold,
    color: '#F59E0B',
  },
  securityDepositAmount: {
    fontSize: 20,
    fontFamily: FontFamily.interBold,
    color: '#1601AA',
    marginBottom: 2,
  },
  refundText: {
    fontSize: 11,
    fontFamily: FontFamily.lato,
    color: '#9BA1A6',
    marginBottom: 10,
  },
  moveOutButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  moveOutNoticeButton: {
    flex: 1,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  moveOutNoticeText: {
    fontSize: 11,
    fontFamily: FontFamily.interSemiBold,
    color: '#EF4444',
  },
  renewButton: {
    flex: 1,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  renewText: {
    fontSize: 11,
    fontFamily: FontFamily.interSemiBold,
    color: '#EF4444',
  },
});
