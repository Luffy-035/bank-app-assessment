import { FontFamily } from '@/constants/theme';
import { Ionicons, MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const transactions = [
    {
        id: '1',
        name: 'Wings Tower',
        date: 'November 21, 2021',
        type: 'Rent',
        liked: true,
    },
    {
        id: '2',
        name: 'Bridgeland Modern House',
        date: 'December 17, 2021',
        type: 'Rent',
        liked: true,
    },
];

export default function ProfileScreen() {
    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color="#111827" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Profile</Text>
                    <View style={{ width: 24 }} />
                </View>

                {/* Avatar Section */}
                <View style={styles.profileSection}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: 'https://i.pravatar.cc/100?img=12' }}
                            style={styles.avatarImage}
                        />
                        <TouchableOpacity style={styles.editBtn}>
                            <Ionicons name="pencil" size={14} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.userName}>Alex Thompson</Text>
                    <Text style={styles.userEmail}>mathew@email.com</Text>
                </View>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>30</Text>
                        <Text style={styles.statLabel}>Units</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>28</Text>
                        <Text style={styles.statLabel}>Reviews</Text>
                    </View>
                </View>

                {/* Tabs */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity style={[styles.tab, styles.tabActive]}>
                        <Text style={[styles.tabText, styles.tabTextActive]}>Transaction</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tab}>
                        <Text style={styles.tabText}>Vacant Units</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tab}>
                        <Text style={styles.tabText}>Tenants</Text>
                    </TouchableOpacity>
                </View>

                {/* Transactions Header */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>2 transactions</Text>
                    <TouchableOpacity style={styles.gridBtn}>
                        <Ionicons name="grid" size={16} color="#4B5563" />
                    </TouchableOpacity>
                </View>

                {/* Transactions List */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.transList}>
                    {transactions.map((item) => (
                        <View key={item.id} style={styles.transCard}>
                            <View style={styles.transImgPlaceholder}>
                                <TouchableOpacity style={styles.likeBtn}>
                                    <Ionicons name={item.liked ? "heart" : "heart-outline"} size={14} color={item.liked ? "#6B7280" : "#6B7280"} />
                                </TouchableOpacity>
                                <View style={styles.rentBadge}>
                                    <Text style={styles.rentBadgeText}>{item.type}</Text>
                                </View>
                            </View>
                            <View style={styles.transInfo}>
                                <Text style={styles.transName}>{item.name}</Text>
                                <View style={styles.transDateRow}>
                                    <View style={styles.dot} />
                                    <Text style={styles.transDate}>{item.date}</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </ScrollView>

                {/* Account Settings */}
                <Text style={styles.groupTitle}>Account</Text>
                <View style={styles.settingsGroup}>
                    <TouchableOpacity style={styles.settingItem}>
                        <View style={[styles.settingIcon, { backgroundColor: '#EEF2FF' }]}>
                            <Ionicons name="person" size={18} color="#4F46E5" />
                        </View>
                        <Text style={styles.settingLabel}>Account Details</Text>
                        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                    <View style={styles.divider} />
                    <TouchableOpacity style={styles.settingItem}>
                        <View style={[styles.settingIcon, { backgroundColor: '#ECFDF5' }]}>
                            <Ionicons name="card" size={18} color="#10B981" />
                        </View>
                        <Text style={styles.settingLabel}>Payment Methods</Text>
                        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                    <View style={styles.divider} />
                    <TouchableOpacity style={styles.settingItem}>
                        <View style={[styles.settingIcon, { backgroundColor: '#FEF2F2' }]}>
                            <SimpleLineIcons name="shield" size={18} color="#EF4444" />
                        </View>
                        <Text style={styles.settingLabel}>Security</Text>
                        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>

                {/* Preferences */}
                <Text style={styles.groupTitle}>Preferences</Text>
                <View style={styles.settingsGroup}>

                    <TouchableOpacity style={styles.settingItem}>
                        <View style={[styles.settingIcon, { backgroundColor: '#FFFBEB' }]}>
                            <Ionicons name="notifications" size={18} color="#F59E0B" />
                        </View>
                        <Text style={styles.settingLabel}>Notification Preferences</Text>
                        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                    <View style={styles.divider} />
                    <TouchableOpacity style={styles.settingItem}>
                        <View style={[styles.settingIcon, { backgroundColor: '#EFF6FF' }]}>
                            <MaterialCommunityIcons name="translate" size={18} color="#3B82F6" />
                        </View>
                        <Text style={styles.settingLabel}>Language</Text>
                        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                    <View style={styles.divider} />
                    <TouchableOpacity style={styles.settingItem}>
                        <View style={[styles.settingIcon, { backgroundColor: '#F3F4F6' }]}>
                            <Ionicons name="help-circle" size={18} color="#4B5563" />
                        </View>
                        <Text style={styles.settingLabel}>Help & Support</Text>
                        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>

                {/* Logout */}
                <TouchableOpacity style={styles.logoutBtn}>
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                <View style={{ height: 100 }} />

            </ScrollView>

            {/* Tab Bar */}
            <View style={styles.bottomTabBar}>
                <TouchableOpacity style={styles.bottomTabItem} onPress={() => router.push('/landlord-dashboard')}>
                    <Ionicons name="grid-outline" size={20} color="#9CA3AF" />
                    <Text style={styles.bottomTabText}>Dashboard</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bottomTabItem} onPress={() => router.push('/properties')}>
                    <Ionicons name="business-outline" size={20} color="#9CA3AF" />
                    <Text style={styles.bottomTabText}>Properties</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bottomTabItem} onPress={() => router.push('/landlord-requests')}>
                    <Ionicons name="construct-outline" size={20} color="#9CA3AF" />
                    <Text style={styles.bottomTabText}>Requests</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bottomTabItem}>
                    <Ionicons name="ellipsis-horizontal" size={20} color="#1601AA" />
                    <Text style={[styles.bottomTabText, styles.bottomTabActive]}>More</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    scrollContent: { paddingBottom: 100 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    backBtn: {},
    headerTitle: { fontSize: 18, fontFamily: FontFamily.interBold, color: '#111827' },

    profileSection: {
        alignItems: 'center',
        marginBottom: 24,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 12,
        width: 60,
        height: 60,
    },
    avatarImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    editBtn: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#1601AA',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    userName: { fontSize: 16, fontFamily: FontFamily.interBold, color: '#1601AA', marginBottom: 2 },
    userEmail: { fontSize: 12, fontFamily: FontFamily.lato, color: '#6B7280' },


    statsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 24,
        paddingHorizontal: 20,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#F3F4F6',
        borderRadius: 16,
        paddingVertical: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.02,
        shadowRadius: 10,
        elevation: 2,
    },
    statValue: { fontSize: 18, fontFamily: FontFamily.interBold, color: '#111827', marginBottom: 4 },
    statLabel: { fontSize: 11, fontFamily: FontFamily.lato, color: '#6B7280' },

    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#F3F4F6',
        marginHorizontal: 20,
        borderRadius: 24,
        padding: 4,
        marginBottom: 24,
        height: 48,
    },
    tab: { flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 20 },
    tabActive: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
    tabText: { fontSize: 12, fontFamily: FontFamily.lato, color: '#9CA3AF' },
    tabTextActive: { fontFamily: FontFamily.interSemiBold, color: '#111827' },

    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    sectionTitle: { fontSize: 18, fontFamily: FontFamily.interSemiBold, color: '#1601AA' },
    gridBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },

    transList: { paddingHorizontal: 20, gap: 16, paddingBottom: 24 },
    transCard: { width: 180, backgroundColor: '#F8FAFC', borderRadius: 20, padding: 12, paddingBottom: 16 },
    transImgPlaceholder: {
        height: 140, backgroundColor: '#EDE9FE', borderRadius: 16, marginBottom: 12, position: 'relative'
    },
    likeBtn: {
        position: 'absolute', top: 10, right: 10, width: 24, height: 24, borderRadius: 12, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center'
    },
    rentBadge: {
        position: 'absolute', bottom: 10, right: 10, backgroundColor: '#64748B', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8
    },
    rentBadgeText: { fontSize: 11, fontFamily: FontFamily.lato, color: '#FFFFFF' },
    transInfo: { paddingHorizontal: 4 },
    transName: { fontSize: 14, fontFamily: FontFamily.interBold, color: '#1601AA', marginBottom: 4 },
    transDateRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#22C55E' },
    transDate: { fontSize: 10, fontFamily: FontFamily.lato, color: '#64748B' },

    groupTitle: {
        fontSize: 14, fontFamily: FontFamily.interBold, color: '#9CA3AF', marginLeft: 20, marginBottom: 12, marginTop: 8
    },
    settingsGroup: {
        backgroundColor: '#FFFFFF', marginHorizontal: 20, borderRadius: 16, borderWidth: 1, borderColor: '#F3F4F6', paddingVertical: 4, marginBottom: 16
    },
    settingItem: {
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14
    },
    settingIcon: {
        width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 16
    },
    settingLabel: { flex: 1, fontSize: 15, fontFamily: FontFamily.interSemiBold, color: '#374151' },
    divider: { height: 1, backgroundColor: '#F3F4F6', marginLeft: 68 },


    logoutBtn: {
        marginHorizontal: 20, backgroundColor: '#FEF2F2', paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 8
    },
    logoutText: { fontSize: 16, fontFamily: FontFamily.interBold, color: '#EF4444' },

    bottomTabBar: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        width: '100%',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingBottom: 22,
        paddingTop: 8,
    },
    bottomTabItem: { flex: 1, alignItems: 'center' },
    bottomTabText: { fontSize: 10, fontFamily: FontFamily.lato, color: '#9CA3AF', marginTop: 3 },
    bottomTabActive: { color: '#1601AA', fontFamily: FontFamily.latoSemiBold },
});
