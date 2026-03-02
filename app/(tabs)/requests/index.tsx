import { FontFamily } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useMaintenance } from '@/hooks/useMaintenance';
import type { MaintenanceRequest as APIRequest } from '@/types/maintenance.types';

type FilterType = 'All' | 'Pending' | 'In Progress' | 'Resolved';
type DisplayStatus = 'Pending' | 'In Progress' | 'Resolved';

const toDisplayStatus = (s: string): DisplayStatus => {
  if (s === 'in_progress') return 'In Progress';
  if (s === 'resolved' || s === 'closed') return 'Resolved';
  return 'Pending';
};

export default function RequestsScreen() {
  const { requests: raw, loading, refetch } = useMaintenance();
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');

  // Re-fetch every time the screen comes into focus so newly submitted requests appear immediately
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const filters: FilterType[] = ['All', 'Pending', 'In Progress', 'Resolved'];

  const requests: { id: string; title: string; status: DisplayStatus; location: string; description: string }[] = raw.map((r: APIRequest) => {
    const displayStatus = toDisplayStatus(r.status);
    const unit = (r.unitId as any)?.unitNumber ?? '';
    const property = (r.propertyId as any)?.name ?? '';
    const location = [property, unit ? `Unit ${unit}` : ''].filter(Boolean).join(' · ');
    return { id: r._id, title: r.title, status: displayStatus, location: location || 'Unknown location', description: r.description };
  });

  const filteredRequests = requests.filter((r: { status: DisplayStatus }) =>
    activeFilter === 'All' || r.status === activeFilter
  );

  const getStatusColors = (status: DisplayStatus) => {
    switch (status) {
      case 'Pending': return { bg: '#FEE2E2', color: '#EF4444' };
      case 'In Progress': return { bg: '#FEF3C7', color: '#F59E0B' };
      case 'Resolved': return { bg: '#DCFCE7', color: '#22C55E' };
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#11181C" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Maintenance Requests</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.newRequestBtn} onPress={() => router.push('/request-maintenance')}>
            <Ionicons name="add" size={18} color="#FFFFFF" />
            <Text style={styles.newRequestLabel}>New Request</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.moveOutBtn} onPress={() => router.push('/(tabs)/requests/move-out')}>
            <Ionicons name="log-out" size={18} color="#EF4444" />
            <Text style={styles.moveOutLabel}>Move Out</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 16, marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {filters.map((f) => (
              <TouchableOpacity
                key={f}
                onPress={() => setActiveFilter(f)}
                style={[styles.filterChip, activeFilter === f && { backgroundColor: '#1601AA', borderColor: '#1601AA' }]}
              >
                <Text style={[styles.filterChipText, activeFilter === f && { color: '#FFFFFF' }]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Request Cards */}
        <View style={styles.cardsList}>
          {loading ? (
            <ActivityIndicator size="large" color="#1601AA" style={{ marginTop: 32 }} />
          ) : filteredRequests.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 40 }}>
              <Ionicons name="construct-outline" size={40} color="#D1D5DB" />
              <Text style={{ color: '#9CA3AF', marginTop: 10, fontFamily: FontFamily.lato }}>No requests found.</Text>
            </View>
          ) : filteredRequests.map((request) => {
            const statusColors = getStatusColors(request.status);
            const isResolved = request.status === 'Resolved';
            const isPending = request.status === 'Pending';
            return (
              <TouchableOpacity key={request.id} style={styles.card} activeOpacity={0.7}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle} numberOfLines={1}>{request.title}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
                    <Text style={[styles.statusText, { color: statusColors.color }]}>{request.status}</Text>
                  </View>
                </View>
                <Text style={styles.locationText}>{request.location}</Text>
                <View style={styles.techRow}>
                  <Ionicons name={isPending ? 'time-outline' : isResolved ? 'checkmark-circle-outline' : 'construct-outline'} size={16} color={isResolved ? '#22C55E' : '#6B7280'} />
                  <Text style={[styles.techText, isResolved && { color: '#22C55E' }]}>
                    {isPending ? 'Awaiting attention' : isResolved ? 'Completed' : 'In progress'}
                  </Text>
                </View>
                {request.description ? (
                  <Text style={[styles.techText, { marginTop: 4 }]} numberOfLines={2}>{request.description}</Text>
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={{ height: 20 }} />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 44,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: FontFamily.interSemiBold,
    color: '#11181C',
  },
  actionsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 14,
  },
  newRequestBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1601AA',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 6,
    elevation: 3,
    shadowColor: '#1601AA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  newRequestLabel: {
    fontSize: 13,
    fontFamily: FontFamily.interMedium,
    color: '#FFFFFF',
  },
  moveOutBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 6,
  },
  moveOutLabel: {
    fontSize: 13,
    fontFamily: FontFamily.interMedium,
    color: '#EF4444',
  },
  // Mini Stepper Styles (inside cards)
  miniStepperContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  miniStepItem: {
    alignItems: 'center',
    width: 42,
  },
  miniStepCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },
  miniStepDone: {
    backgroundColor: '#1601AA',
  },
  miniStepPending: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  miniConnector: {
    flex: 1,
    height: 2,
    backgroundColor: '#E2E8F0',
    marginTop: 8,
    marginHorizontal: 0,
  },
  miniConnectorDone: {
    backgroundColor: '#1601AA',
  },
  miniStepLabel: {
    fontSize: 7,
    fontFamily: FontFamily.interMedium,
    color: '#94A3B8',
    textAlign: 'center',
  },
  miniStepLabelDone: {
    color: '#1601AA',
    fontFamily: FontFamily.interSemiBold,
  },
  cardsList: {
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: FontFamily.interBold,
    color: '#1F2937',
    flex: 1,
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontFamily: FontFamily.interSemiBold,
  },
  locationText: {
    fontSize: 13,
    fontFamily: FontFamily.lato,
    color: '#6B7280',
    marginBottom: 14,
  },
  techRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  techText: {
    fontSize: 13,
    fontFamily: FontFamily.lato,
    color: '#6B7280',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  etaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  etaText: {
    fontSize: 13,
    fontFamily: FontFamily.lato,
    color: '#6B7280',
  },
  viewHistoryLink: {
    fontSize: 13,
    fontFamily: FontFamily.interSemiBold,
    color: '#1601AA',
    textDecorationLine: 'underline',
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  filterChipText: {
    fontSize: 13,
    fontFamily: FontFamily.interMedium,
    color: '#6B7280',
  },
});
