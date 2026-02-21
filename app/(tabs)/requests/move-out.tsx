import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface ChecklistItem {
  id: string;
  title: string;
  subtitle: string;
  completed: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
}

const checklistItems: ChecklistItem[] = [
  {
    id: '1',
    title: 'Submit Move-Out Notice',
    subtitle: 'Submitted on Oct 15, 2025',
    completed: true,
    icon: 'create',
    iconBg: '#D1FAE5',
    iconColor: '#10B981',
  },
  {
    id: '2',
    title: 'Clean the Apartment',
    subtitle: 'Refer to cleaning guidelines',
    completed: false,
    icon: 'sparkles',
    iconBg: '#DBEAFE',
    iconColor: '#3B82F6',
  },
  {
    id: '3',
    title: 'Final Inspection',
    subtitle: 'Schedule with management',
    completed: false,
    icon: 'clipboard',
    iconBg: '#F3F4F6',
    iconColor: '#9CA3AF',
  },
  {
    id: '4',
    title: 'Return Keys',
    subtitle: 'Drop off at the main office',
    completed: false,
    icon: 'key',
    iconBg: '#F3F4F6',
    iconColor: '#9CA3AF',
  },
];

export default function MoveOutScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Move Out</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Security Deposit Card */}
        <View style={styles.depositCard}>
          <View style={styles.depositIconContainer}>
            <Ionicons name="shield-checkmark" size={22} color="#FFFFFF" />
          </View>
          <View style={styles.depositInfo}>
            <Text style={styles.depositTitle}>Security Deposit: $1,200.00</Text>
            <Text style={styles.depositSubtitle}>Refund Pending Inspection</Text>
          </View>
        </View>

        {/* Unit Info Card */}
        <View style={styles.unitCard}>
          <Text style={styles.unitNumber}>Unit A-302</Text>
          <View style={styles.unitRow}>
            <Text style={styles.unitAddress}>123 Harmony Lane, Apt{'\n'}302, Serenity City</Text>
            <View style={styles.leaseEndContainer}>
              <Text style={styles.leaseEndLabel}>Lease Ends</Text>
              <Text style={styles.leaseEndDate}>Dec 31, 2025</Text>
            </View>
          </View>

          <View style={styles.noticeRow}>
            <Ionicons name="notifications" size={16} color="#1601AA" />
            <Text style={styles.noticeTextBold}>
              30 - day notice is required before lease end.
            </Text>
          </View>
        </View>

        {/* Move-Out Progress */}
        <Text style={styles.sectionTitle}>Move-Out Progress</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
          <View style={styles.progressLabels}>
            <Text style={styles.progressLabelActive}>Notice Sent</Text>
            <Text style={styles.progressLabel}>Cleaning</Text>
            <Text style={styles.progressLabel}>Inspection</Text>
            <Text style={styles.progressLabel}>Keys Returned</Text>
          </View>
        </View>

        {/* Checklist */}
        <Text style={styles.sectionTitle}>Checklist</Text>

        <View style={styles.checklistContainer}>
          {checklistItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.checklistCard}
            >
              <View style={[styles.checklistIcon, { backgroundColor: item.iconBg }]}>
                <Ionicons name={item.icon} size={20} color={item.iconColor} />
              </View>
              <View style={styles.checklistInfo}>
                <Text style={styles.checklistItemTitle}>{item.title}</Text>
                <Text style={styles.checklistItemSubtitle}>{item.subtitle}</Text>
              </View>
              {item.completed ? (
                <View style={styles.completedBadge}>
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                </View>
              ) : (
                <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 14,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 17,
    color: '#1F2937',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  depositCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 14,
    gap: 12,
    marginBottom: 12,
  },
  depositIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  depositInfo: {
    flex: 1,
  },
  depositTitle: {
    fontSize: 15,
    color: '#1F2937',
    marginBottom: 2,
  },
  depositSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  unitCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  unitNumber: {
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 8,
  },
  unitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  unitAddress: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    flex: 1,
  },
  leaseEndContainer: {
    alignItems: 'flex-end',
  },
  leaseEndLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  leaseEndDate: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E40AF',
  },
  noticeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  noticeTextBold: {
    fontSize: 13,
    color: '#1F2937',
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 15,
    color: '#1F2937',
    marginBottom: 12,
  },
  progressContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressFill: {
    width: '35%',
    height: '100%',
    backgroundColor: '#34D399', // Green color
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabelActive: {
    fontSize: 10,
    color: '#9CA3AF', // In the image, 'Notice Sent' is greyish too, but maybe 'Cleaning' is next. Assuming simple labels.
    // Actually the image shows 'Notice Sent' is completed/active? It looks like simple text labels.
    // Let's stick to a uniform look or highlight the active one.
    // The image has all labels looking similar, or maybe slight difference.
    // I will make them all grey and aligned.
    fontWeight: '500',
  },
  progressLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  checklistContainer: {
    gap: 10,
  },
  checklistCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    gap: 12,
  },
  checklistIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checklistInfo: {
    flex: 1,
  },
  checklistItemTitle: {
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 2,
  },
  checklistItemSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  completedBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

