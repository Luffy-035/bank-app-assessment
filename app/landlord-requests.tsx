import { FontFamily } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

type FilterType = 'All' | 'Resolved' | 'In Progress' | 'Pending';

export default function LandlordRequestsScreen() {
    const [activeFilter, setActiveFilter] = useState<FilterType>('All');

    const requests = [
        {
            id: '1',
            title: 'Broken Window Lock',
            reportedOn: 'Oct 15, 2025',
            requestId: '#REQ-20251015-01',
            status: 'Resolved' as const,
        },
        {
            id: '2',
            title: 'AC Not Cooling',
            reportedOn: 'Oct 22, 2025',
            requestId: '#REQ-20251022-03',
            status: 'In Progress' as const,
        },
        {
            id: '3',
            title: 'Leaky Faucet in Kitchen',
            reportedOn: 'Oct 25, 2025',
            requestId: '#REQ-20251025-02',
            status: 'Pending' as const,
        },
    ];

    const maintenanceIssues = [
        { icon: 'water-outline', title: 'Plumbing', count: '12 issues this month' },
        { icon: 'flash-outline', title: 'Electrical', count: '8 issues this month' },
        { icon: 'snow-outline', title: 'HVAC', count: '5 issues this month' },
        { icon: 'build-outline', title: 'General Repairs', count: '15 issues this month' },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Resolved':
                return '#22C55E';
            case 'In Progress':
                return '#3B82F6';
            case 'Pending':
                return '#F59E0B';
            default:
                return '#6B7280';
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Requests</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* Section Title */}
                <Text style={styles.sectionTitle}>Requests Received</Text>

                {/* Filter Tabs */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterContainer}
                >
                    {(['All', 'Resolved', 'In Progress', 'Pending'] as FilterType[]).map((filter) => (
                        <TouchableOpacity
                            key={filter}
                            style={[
                                styles.filterTab,
                                activeFilter === filter && styles.filterTabActive,
                            ]}
                            onPress={() => setActiveFilter(filter)}
                        >
                            <Text
                                style={[
                                    styles.filterText,
                                    activeFilter === filter && styles.filterTextActive,
                                ]}
                            >
                                {filter}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Request Cards */}
                <View style={styles.requestsList}>
                    {requests
                        .filter((r) => activeFilter === 'All' || r.status === activeFilter)
                        .map((request) => (
                            <View key={request.id} style={styles.requestCard}>
                                <View style={styles.requestHeader}>
                                    <Text style={styles.requestTitle}>{request.title}</Text>
                                    <Text style={[styles.statusBadge, { color: getStatusColor(request.status) }]}>
                                        {request.status}
                                    </Text>
                                </View>
                                <Text style={styles.reportedOn}>Reported on: {request.reportedOn}</Text>
                                <Text style={styles.requestId}>{request.requestId}</Text>

                                {/* Action Button */}
                                {request.status === 'In Progress' && (
                                    <TouchableOpacity style={styles.actionButton}>
                                        <Text style={styles.actionButtonText}>Re-Assign</Text>
                                    </TouchableOpacity>
                                )}
                                {request.status === 'Pending' && (
                                    <TouchableOpacity style={styles.actionButton}>
                                        <Text style={styles.actionButtonText}>Assign</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))}
                </View>

                {/* Frequent Maintenance Issues */}
                <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Frequent Maintenance Issues</Text>

                <View style={styles.requestsList}>
                    {maintenanceIssues.map((issue, index) => (
                        <View key={index} style={styles.issueCard}>
                            <View style={styles.issueIconWrap}>
                                <Ionicons name={issue.icon as any} size={20} color="#1601AA" />
                            </View>
                            <View style={styles.issueContent}>
                                <Text style={styles.issueTitle}>{issue.title}</Text>
                                <Text style={styles.issueCount}>{issue.count}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Tab Bar */}
            <View style={styles.tabBar}>
                <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/landlord-dashboard')}>
                    <Ionicons name="grid-outline" size={20} color="#9CA3AF" />
                    <Text style={styles.tabText}>Dashboard</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/properties')}>
                    <Ionicons name="business-outline" size={20} color="#9CA3AF" />
                    <Text style={styles.tabText}>Properties</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabItem}>
                    <Ionicons name="construct" size={20} color="#1601AA" />
                    <Text style={[styles.tabText, styles.tabActive]}>Requests</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/help-support')}>
                    <Ionicons name="ellipsis-horizontal-outline" size={20} color="#9CA3AF" />
                    <Text style={styles.tabText}>More</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scroll: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: STATUSBAR_HEIGHT + 8,
        paddingBottom: 4,
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF',
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: FontFamily.interBold,
        color: '#111827',
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: FontFamily.interBold,
        color: '#111827',
        marginLeft: 16,
        marginTop: 0,
        marginBottom: 8,
    },
    filterContainer: {
        paddingHorizontal: 16,
        marginBottom: 12,
        gap: 8,
    },
    filterTab: {
        paddingHorizontal: 18,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        marginRight: 8,
    },
    filterTabActive: {
        backgroundColor: '#1601AA',
    },
    filterText: {
        fontSize: 13,
        fontFamily: FontFamily.lato,
        color: '#6B7280',
    },
    filterTextActive: {
        color: '#FFFFFF',
        fontFamily: FontFamily.latoSemiBold,
    },
    requestsList: {
        paddingHorizontal: 16,
    },
    requestCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    requestHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    requestTitle: {
        fontSize: 15,
        fontFamily: FontFamily.interSemiBold,
        color: '#111827',
        flex: 1,
        marginRight: 12,
    },
    statusBadge: {
        fontSize: 12,
        fontFamily: FontFamily.latoSemiBold,
    },
    reportedOn: {
        fontSize: 13,
        fontFamily: FontFamily.lato,
        color: '#6B7280',
        marginBottom: 4,
    },
    requestId: {
        fontSize: 12,
        fontFamily: FontFamily.lato,
        color: '#9CA3AF',
        marginBottom: 8,
    },
    actionButton: {
        borderWidth: 1,
        borderColor: '#1601AA',
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
    },
    actionButtonText: {
        fontSize: 14,
        fontFamily: FontFamily.interSemiBold,
        color: '#1601AA',
    },
    fab: {
        position: 'absolute',
        bottom: 88,
        alignSelf: 'center',
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
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
    },
    tabText: {
        fontSize: 10,
        fontFamily: FontFamily.lato,
        color: '#9CA3AF',
        marginTop: 3,
    },
    tabActive: {
        color: '#1601AA',
        fontFamily: FontFamily.latoSemiBold,
    },

    // Issue Card (Copied from Occupancy)
    issueCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    issueIconWrap: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#EEF2FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    issueContent: { flex: 1 },
    issueTitle: { fontSize: 14, fontFamily: FontFamily.interSemiBold, color: '#111827' },
    issueCount: { fontSize: 12, fontFamily: FontFamily.lato, color: '#6B7280', marginTop: 2 },
});
