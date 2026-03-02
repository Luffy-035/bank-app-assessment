import { FontFamily } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '@/context/AuthContext';

const MENU_ITEMS = [
    {
        group: 'Account',
        items: [
            { icon: 'person-outline' as const, label: 'Edit Profile', onPress: () => Alert.alert('Coming Soon', 'Profile editing will be available soon.') },
            { icon: 'notifications-outline' as const, label: 'Notifications', onPress: () => Alert.alert('Coming Soon', 'Notification settings will be available soon.') },
            { icon: 'shield-outline' as const, label: 'Privacy & Security', onPress: () => Alert.alert('Coming Soon', 'Privacy settings will be available soon.') },
        ],
    },
    {
        group: 'App',
        items: [
            { icon: 'help-circle-outline' as const, label: 'Help & Support', onPress: (router: any) => router.push('/help-support') },
            { icon: 'document-text-outline' as const, label: 'Terms of Service', onPress: () => Alert.alert('Coming Soon', 'Terms of Service will be available soon.') },
        ],
    },
];

export default function LandlordProfileScreen() {
    const { user, logout } = useAuth();

    const initials = (user?.name ?? 'L').trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

    const handleLogout = async () => {
        Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Sign Out',
                style: 'destructive',
                onPress: async () => {
                    await logout();
                    router.replace('/login');
                },
            },
        ]);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={22} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
                <View style={{ width: 36 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Avatar Section */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatarCircle}>
                        <Text style={styles.avatarText}>{initials}</Text>
                    </View>
                    <Text style={styles.userName}>{user?.name ?? 'Landlord'}</Text>
                    <Text style={styles.userEmail}>{user?.email ?? user?.phone ?? ''}</Text>
                    <View style={styles.roleBadge}>
                        <Ionicons name="business-outline" size={12} color="#1601AA" />
                        <Text style={styles.roleBadgeText}>Landlord</Text>
                    </View>
                </View>

                {/* Info Cards */}
                <View style={styles.infoCard}>
                    {[
                        { icon: 'mail-outline' as const, label: 'Email', value: user?.email || '—' },
                        { icon: 'call-outline' as const, label: 'Phone', value: user?.phone || '—' },
                    ].map((info, i, arr) => (
                        <View key={info.label}>
                            <View style={styles.infoRow}>
                                <View style={styles.infoIconWrap}>
                                    <Ionicons name={info.icon} size={16} color="#1601AA" />
                                </View>
                                <View>
                                    <Text style={styles.infoLabel}>{info.label}</Text>
                                    <Text style={styles.infoValue}>{info.value}</Text>
                                </View>
                            </View>
                            {i < arr.length - 1 && <View style={styles.divider} />}
                        </View>
                    ))}
                </View>

                {/* Menu Groups */}
                {MENU_ITEMS.map((group) => (
                    <View key={group.group} style={styles.menuGroup}>
                        <Text style={styles.menuGroupTitle}>{group.group.toUpperCase()}</Text>
                        <View style={styles.menuCard}>
                            {group.items.map((item, i, arr) => (
                                <View key={item.label}>
                                    <TouchableOpacity style={styles.menuItem} onPress={() => item.onPress(router)}>
                                        <View style={styles.menuIconWrap}>
                                            <Ionicons name={item.icon} size={18} color="#6B7280" />
                                        </View>
                                        <Text style={styles.menuItemText}>{item.label}</Text>
                                        <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
                                    </TouchableOpacity>
                                    {i < arr.length - 1 && <View style={styles.divider} />}
                                </View>
                            ))}
                        </View>
                    </View>
                ))}

                {/* Sign Out */}
                <TouchableOpacity style={styles.signOutBtn} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={18} color="#EF4444" />
                    <Text style={styles.signOutText}>Sign Out</Text>
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>
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
    headerTitle: { fontSize: 18, fontFamily: FontFamily.interBold, color: '#111827' },
    avatarSection: { alignItems: 'center', paddingVertical: 28, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    avatarCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    avatarText: { fontSize: 30, fontFamily: FontFamily.interBold, color: '#1601AA' },
    userName: { fontSize: 20, fontFamily: FontFamily.interBold, color: '#111827', marginBottom: 4 },
    userEmail: { fontSize: 14, fontFamily: FontFamily.lato, color: '#6B7280', marginBottom: 10 },
    roleBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#EEF2FF', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 4 },
    roleBadgeText: { fontSize: 12, fontFamily: FontFamily.interSemiBold, color: '#1601AA' },
    infoCard: { backgroundColor: '#FFFFFF', marginHorizontal: 16, marginTop: 16, borderRadius: 14, padding: 4, borderWidth: 1, borderColor: '#F3F4F6' },
    infoRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 14 },
    infoIconWrap: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center' },
    infoLabel: { fontSize: 11, fontFamily: FontFamily.lato, color: '#9CA3AF', marginBottom: 2 },
    infoValue: { fontSize: 14, fontFamily: FontFamily.interSemiBold, color: '#111827' },
    divider: { height: 1, backgroundColor: '#F3F4F6', marginHorizontal: 14 },
    menuGroup: { marginHorizontal: 16, marginTop: 20 },
    menuGroupTitle: { fontSize: 11, fontFamily: FontFamily.interSemiBold, color: '#9CA3AF', marginBottom: 10, letterSpacing: 0.5 },
    menuCard: { backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, borderColor: '#F3F4F6', padding: 4 },
    menuItem: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
    menuIconWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center' },
    menuItemText: { flex: 1, fontSize: 15, fontFamily: FontFamily.interSemiBold, color: '#374151' },
    signOutBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, margin: 16, marginTop: 24, backgroundColor: '#FEF2F2', borderRadius: 12, padding: 16 },
    signOutText: { fontSize: 15, fontFamily: FontFamily.interSemiBold, color: '#EF4444' },
});
