import { FontFamily } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type FilterType = 'All' | 'Pending' | 'In Progress' | 'Resolved';
type RequestStatus = 'Pending' | 'In Progress' | 'Resolved';

interface MaintenanceRequest {
  id: string;
  title: string;
  status: RequestStatus;
  location: string;
  tenant: string;
  technician?: string;
  eta?: string;
  completedOn?: string;
}

const requests: MaintenanceRequest[] = [
  {
    id: '1',
    title: 'Leaky Faucet in Kitchen',
    status: 'Pending',
    location: 'Unit 101, 123 Main St',
    tenant: 'Jane Doe',
    technician: 'Awaiting technician assignment',
    eta: 'ETA: Not yet scheduled',
  },
  {
    id: '2',
    title: 'Broken AC Unit',
    status: 'In Progress',
    location: 'Unit 204, 456 Oak Ave',
    tenant: 'John Smith',
    technician: "Mike's HVAC Services",
    eta: 'ETA: Today, 2:00 PM',
  },
  {
    id: '3',
    title: 'Clogged Bathroom Drain',
    status: 'Resolved',
    location: 'Unit 10B, 789 Pine Ln',
    tenant: 'Emily White',
    technician: 'ProPlumbers Inc.',
    completedOn: 'Completed on Nov 14',
  },
];

export default function RequestsScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');

  const filters: FilterType[] = ['All', 'Pending', 'In Progress', 'Resolved'];

  const filteredRequests = requests.filter((request) => {
    if (activeFilter === 'All') return true;
    return request.status === activeFilter;
  });

  const getStatusColors = (status: RequestStatus) => {
    switch (status) {
      case 'Pending':
        return { bg: '#FEE2E2', color: '#EF4444', strip: '#EF4444', badgeBg: '#EF4444', badgeText: '#FFFFFF' };
      case 'In Progress':
        return { bg: '#FEF3C7', color: '#F59E0B', strip: '#F59E0B', badgeBg: '#F59E0B', badgeText: '#FFFFFF' };
      case 'Resolved':
        return { bg: '#DCFCE7', color: '#22C55E', strip: '#22C55E', badgeBg: '#22C55E', badgeText: '#FFFFFF' };
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#11181C" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Maintenance request</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.newRequestBtn}
            onPress={() => router.push('/request-maintenance')}
          >
            <Ionicons name="add" size={18} color="#FFFFFF" />
            <Text style={styles.newRequestLabel}>New Request</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.moveOutBtn} onPress={() => router.push('/(tabs)/requests/move-out')}>
            <Ionicons name="log-out" size={18} color="#EF4444" />
            <Text style={styles.moveOutLabel}>Move Out</Text>
          </TouchableOpacity>
        </View>

        {/* Requests Cards */}
        <View style={styles.cardsList}>
          {filteredRequests.map((request) => {
            const statusColors = getStatusColors(request.status);
            const isResolved = request.status === 'Resolved';
            const isPending = request.status === 'Pending';

            return (
              <TouchableOpacity
                key={request.id}
                style={styles.card}
                activeOpacity={0.7}
                onPress={() => router.push('/request-support')}
              >
                {/* Header Row: Title + Status Badge */}
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle} numberOfLines={1}>{request.title}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
                    <Text style={[styles.statusText, { color: statusColors.color }]}>{request.status}</Text>
                  </View>
                </View>

                {/* Location & Tenant */}
                <Text style={styles.locationText}>
                  {request.location} - {request.tenant}
                </Text>

                {/* Technician Assignment */}
                <View style={styles.techRow}>
                  <Ionicons
                    name={isPending ? "people-outline" : "person-circle-outline"}
                    size={18}
                    color={isPending ? "#6B7280" : "#1601AA"}
                  />
                  <Text style={[
                    styles.techText,
                    !isPending && { color: '#1F2937', fontWeight: '500' }
                  ]}>
                    {request.technician}
                  </Text>
                </View>

                {/* ETA & View History */}
                <View style={styles.cardFooter}>
                  <View style={styles.etaRow}>
                    <Ionicons
                      name={isResolved ? "checkmark-circle-outline" : "time-outline"}
                      size={16}
                      color={isResolved ? "#22C55E" : "#6B7280"}
                    />
                    <Text style={[
                      styles.etaText,
                      isResolved && { color: '#22C55E' }
                    ]}>
                      {request.eta || request.completedOn}
                    </Text>
                  </View>
                  <TouchableOpacity>
                    <Text style={styles.viewHistoryLink}>View History</Text>
                  </TouchableOpacity>
                </View>
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
});
