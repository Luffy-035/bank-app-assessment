import { FontFamily } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getMyTenantProfile, moveTenantOut } from '@/services/tenant.service';
import type { Tenant } from '@/types/tenant.types';

interface ChecklistItem {
  id: string;
  title: string;
  subtitle: string;
  completed: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
}

const DEFAULT_CHECKLIST: ChecklistItem[] = [
  {
    id: '1',
    title: 'Submit Move-Out Notice',
    subtitle: 'Inform your landlord at least 30 days in advance',
    completed: false,
    icon: 'create',
    iconBg: '#D1FAE5',
    iconColor: '#10B981',
  },
  {
    id: '2',
    title: 'Clean the Unit',
    subtitle: 'Leave the unit in the same condition as when you moved in',
    completed: false,
    icon: 'sparkles',
    iconBg: '#DBEAFE',
    iconColor: '#3B82F6',
  },
  {
    id: '3',
    title: 'Final Inspection',
    subtitle: 'Schedule a final walkthrough with your landlord',
    completed: false,
    icon: 'clipboard',
    iconBg: '#F3F4F6',
    iconColor: '#9CA3AF',
  },
  {
    id: '4',
    title: 'Return All Keys',
    subtitle: 'Return all keys, access cards, and remotes',
    completed: false,
    icon: 'key',
    iconBg: '#FEF3C7',
    iconColor: '#D97706',
  },
  {
    id: '5',
    title: 'Settle Outstanding Dues',
    subtitle: 'Clear any pending rent or utility bills',
    completed: false,
    icon: 'cash',
    iconBg: '#FCE7F3',
    iconColor: '#DB2777',
  },
  {
    id: '6',
    title: 'Collect Security Deposit',
    subtitle: 'After inspection, request refund of your security deposit',
    completed: false,
    icon: 'shield-checkmark',
    iconBg: '#EEF2FF',
    iconColor: '#6366F1',
  },
];

export default function MoveOutScreen() {
  const [profile, setProfile] = useState<Tenant | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [checklist, setChecklist] = useState<ChecklistItem[]>(DEFAULT_CHECKLIST);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getMyTenantProfile()
      .then(setProfile)
      .catch(() => { }) // Not a blocking error — checklist still functional
      .finally(() => setProfileLoading(false));
  }, []);

  const toggleItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => item.id === id ? { ...item, completed: !item.completed } : item)
    );
  };

  const allChecked = checklist.every((item) => item.completed);
  const completedCount = checklist.filter((item) => item.completed).length;

  const handleRequestMoveOut = () => {
    if (!profile) {
      Alert.alert('Not Found', 'Could not find your tenant profile. Contact your landlord.');
      return;
    }
    if (!allChecked) {
      Alert.alert(
        'Checklist Incomplete',
        `Please complete all ${checklist.length} checklist items before requesting move-out.\n\n${checklist.length - completedCount} item(s) remaining.`
      );
      return;
    }
    Alert.alert(
      'Confirm Move-Out',
      'Are you sure you want to request move-out? This action cannot be undone and your tenancy will be marked as ended.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm Move-Out',
          style: 'destructive',
          onPress: async () => {
            setSubmitting(true);
            try {
              await moveTenantOut(profile._id);
              Alert.alert(
                'Move-Out Requested',
                'Your move-out request has been submitted. Your landlord will contact you to finalise the process.',
                [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
              );
            } catch (e: any) {
              Alert.alert('Error', e?.response?.data?.message ?? 'Failed to submit move-out request. Please try again.');
            } finally {
              setSubmitting(false);
            }
          },
        },
      ]
    );
  };

  // Tenant profile block
  const unitNumber = profile && typeof profile.unitId === 'object' ? profile.unitId.unitNumber : '—';
  const propertyName = profile && typeof profile.propertyId === 'object' ? profile.propertyId.name : '—';
  const leaseEnd = profile ? new Date(profile.leaseEnd).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : '—';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Move-Out Request</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Tenant Card */}
        {profileLoading ? (
          <View style={styles.profileLoading}>
            <ActivityIndicator color="#1601AA" />
          </View>
        ) : profile ? (
          <View style={styles.tenantCard}>
            <View style={styles.tenantCardLeft}>
              <Ionicons name="home-outline" size={20} color="#1601AA" />
              <View>
                <Text style={styles.tenantCardPropName}>{propertyName}</Text>
                <Text style={styles.tenantCardSub}>Unit {unitNumber} · Lease ends {leaseEnd}</Text>
              </View>
            </View>
            <View style={[styles.depositBadge]}>
              <Text style={styles.depositBadgeText}>₹{profile.securityDeposit.toLocaleString('en-IN')}</Text>
              <Text style={styles.depositBadgeLabel}>Deposit</Text>
            </View>
          </View>
        ) : (
          <View style={styles.noPropBanner}>
            <Ionicons name="alert-circle-outline" size={16} color="#D97706" />
            <Text style={styles.noPropText}>Tenant profile not linked. Contact your landlord.</Text>
          </View>
        )}

        {/* Checklist progress */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Move-Out Checklist</Text>
            <Text style={styles.progressCount}>{completedCount}/{checklist.length} done</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${(completedCount / checklist.length) * 100}%` as any }]} />
          </View>
        </View>

        {/* Checklist */}
        <View style={styles.checklistContainer}>
          {checklist.map((item) => (
            <TouchableOpacity key={item.id} style={styles.checklistItem} onPress={() => toggleItem(item.id)} activeOpacity={0.7}>
              <View style={[styles.checklistIconWrap, { backgroundColor: item.iconBg }]}>
                <Ionicons name={item.icon} size={20} color={item.iconColor} />
              </View>
              <View style={styles.checklistContent}>
                <Text style={[styles.checklistTitle, item.completed && styles.checklistTitleDone]}>{item.title}</Text>
                <Text style={styles.checklistSubtitle}>{item.subtitle}</Text>
              </View>
              <View style={[styles.checkbox, item.completed && styles.checkboxChecked]}>
                {item.completed && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Important Note */}
        <View style={styles.noteCard}>
          <Ionicons name="information-circle-outline" size={20} color="#D97706" />
          <Text style={styles.noteText}>
            Once you submit the move-out request, your landlord will be notified and will contact you to finalise the inspection and deposit refund.
          </Text>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Footer Action */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.moveOutBtn, (!allChecked || submitting) && styles.moveOutBtnDisabled]}
          onPress={handleRequestMoveOut}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
              <Text style={styles.moveOutBtnText}>
                {allChecked ? 'Request Move-Out' : `Complete Checklist (${completedCount}/${checklist.length})`}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#FFFFFF', paddingTop: 56, paddingBottom: 14, paddingHorizontal: 20,
    borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontFamily: FontFamily.interBold, color: '#111827' },
  scroll: { flex: 1 },
  profileLoading: { height: 80, alignItems: 'center', justifyContent: 'center' },
  tenantCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', margin: 16, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#F3F4F6' },
  tenantCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  tenantCardPropName: { fontSize: 14, fontFamily: FontFamily.interSemiBold, color: '#111827', marginBottom: 2 },
  tenantCardSub: { fontSize: 12, fontFamily: FontFamily.lato, color: '#9CA3AF' },
  depositBadge: { alignItems: 'center' },
  depositBadgeText: { fontSize: 14, fontFamily: FontFamily.interBold, color: '#1601AA' },
  depositBadgeLabel: { fontSize: 10, fontFamily: FontFamily.lato, color: '#9CA3AF', marginTop: 2 },
  noPropBanner: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: '#FEF3C7', margin: 16, borderRadius: 12, padding: 12 },
  noPropText: { flex: 1, fontSize: 13, fontFamily: FontFamily.lato, color: '#92400E', lineHeight: 18 },
  progressCard: { backgroundColor: '#FFFFFF', marginHorizontal: 16, marginBottom: 12, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#F3F4F6' },
  progressHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  progressTitle: { fontSize: 14, fontFamily: FontFamily.interSemiBold, color: '#111827' },
  progressCount: { fontSize: 13, fontFamily: FontFamily.interBold, color: '#1601AA' },
  progressBarBg: { height: 8, backgroundColor: '#F3F4F6', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#1601AA', borderRadius: 4 },
  checklistContainer: { paddingHorizontal: 16, gap: 10 },
  checklistItem: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#F3F4F6' },
  checklistIconWrap: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  checklistContent: { flex: 1 },
  checklistTitle: { fontSize: 14, fontFamily: FontFamily.interSemiBold, color: '#111827', marginBottom: 2 },
  checklistTitleDone: { textDecorationLine: 'line-through', color: '#9CA3AF' },
  checklistSubtitle: { fontSize: 12, fontFamily: FontFamily.lato, color: '#9CA3AF' },
  checkbox: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#D1D5DB', alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { backgroundColor: '#1601AA', borderColor: '#1601AA' },
  noteCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: '#FEF3C7', margin: 16, borderRadius: 12, padding: 14, marginTop: 16 },
  noteText: { flex: 1, fontSize: 12, fontFamily: FontFamily.lato, color: '#92400E', lineHeight: 18 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', padding: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  moveOutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#EF4444', borderRadius: 14, paddingVertical: 16, minHeight: 52 },
  moveOutBtnDisabled: { backgroundColor: '#D1D5DB' },
  moveOutBtnText: { fontSize: 15, fontFamily: FontFamily.interBold, color: '#FFFFFF' },
});
