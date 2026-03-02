import { FontFamily } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuth } from '@/context/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ width: 24 }} />
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity>
            <Ionicons name="settings-outline" size={22} color="#1F2937" onPress={() => Alert.alert('Coming Soon', 'Settings will be available soon.')} />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <TouchableOpacity style={styles.avatarWrapper}>
            <Ionicons name="person-circle" size={88} color="#D1D5DB" />
            <View style={styles.editBadge}>
              <Ionicons name="pencil" size={10} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          <Text style={styles.profileName}>{user?.name ?? 'Tenant'}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="mail-outline" size={14} color="#6B7280" />
            <Text style={styles.locationText}>{user?.email ?? ''}</Text>
          </View>
        </View>

        {/* ── ACCOUNT ── */}
        <Text style={styles.sectionLabel}>ACCOUNT</Text>
        <View style={styles.menuGroup}>
          <TouchableOpacity style={styles.menuRow} onPress={() => Alert.alert('Coming Soon', 'Profile editing will be available soon.')}>
            <View style={[styles.menuIcon, { backgroundColor: '#EEF2FF' }]}>
              <Ionicons name="person" size={18} color="#4F46E5" />
            </View>
            <View style={styles.menuTextWrap}>
              <Text style={styles.menuTitle}>Profile</Text>
              <Text style={styles.menuSub}>View and update your personal details.</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* ── SUPPORT ── */}
        <Text style={styles.sectionLabel}>SUPPORT</Text>
        <View style={styles.menuGroup}>
          <TouchableOpacity style={styles.menuRow} onPress={() => router.push('/help-support')}>
            <View style={[styles.menuIcon, { backgroundColor: '#ECFDF5' }]}>
              <Ionicons name="headset" size={18} color="#059669" />
            </View>
            <View style={styles.menuTextWrap}>
              <Text style={styles.menuTitle}>Help & Support</Text>
              <Text style={styles.menuSub}>Get assistance with any issues or questions.</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* ── LEGAL ── */}
        <Text style={styles.sectionLabel}>LEGAL</Text>
        <View style={styles.menuGroup}>
          <TouchableOpacity style={styles.menuRow} onPress={() => Alert.alert('Coming Soon', 'Privacy Policy will be available soon.')}>
            <View style={[styles.menuIcon, { backgroundColor: '#FFF7ED' }]}>
              <Ionicons name="shield-checkmark" size={18} color="#EA580C" />
            </View>
            <View style={styles.menuTextWrap}>
              <Text style={styles.menuTitle}>Privacy Policy</Text>
              <Text style={styles.menuSub}>Learn how we collect, use, and protect your data.</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>
          <View style={styles.rowDivider} />
          <TouchableOpacity style={styles.menuRow} onPress={() => Alert.alert('Coming Soon', 'Terms & Conditions will be available soon.')}>
            <View style={[styles.menuIcon, { backgroundColor: '#F0FDF4' }]}>
              <Ionicons name="document-text" size={18} color="#16A34A" />
            </View>
            <View style={styles.menuTextWrap}>
              <Text style={styles.menuTitle}>Terms & Conditions</Text>
              <Text style={styles.menuSub}>Read the rules and conditions for using our services.</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* ── OTHER ── */}
        <Text style={styles.sectionLabel}>OTHER</Text>
        <View style={styles.menuGroup}>
          <TouchableOpacity style={styles.menuRow} onPress={handleLogout}>
            <View style={[styles.menuIcon, { backgroundColor: '#FEF2F2' }]}>
              <Ionicons name="log-out" size={18} color="#EF4444" />
            </View>
            <View style={styles.menuTextWrap}>
              <Text style={[styles.menuTitle, { color: '#EF4444' }]}>Logout</Text>
              <Text style={styles.menuSub}>Sign out of your account securely.</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scroll: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 14,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: { fontSize: 18, fontFamily: FontFamily.interBold, color: '#1F2937' },

  profileSection: {
    alignItems: 'center',
    paddingVertical: 28,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  avatarWrapper: { position: 'relative', marginBottom: 10 },
  editBadge: {
    position: 'absolute', right: 2, bottom: 4,
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: '#1601AA', alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#FFFFFF',
  },
  profileName: { fontSize: 20, fontFamily: FontFamily.interBold, color: '#111827', marginBottom: 6 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationText: { fontSize: 13, fontFamily: FontFamily.lato, color: '#6B7280' },

  sectionLabel: {
    fontSize: 11, fontFamily: FontFamily.interSemiBold, color: '#9CA3AF',
    letterSpacing: 1, paddingHorizontal: 20, marginBottom: 8, marginTop: 4,
    textTransform: 'uppercase',
  },
  menuGroup: {
    backgroundColor: '#FFFFFF', borderRadius: 14,
    marginHorizontal: 16, marginBottom: 16,
    borderWidth: 1, borderColor: '#F0F0F5',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 2, overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14, gap: 14,
  },
  menuIcon: {
    width: 40, height: 40, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  menuTextWrap: { flex: 1 },
  menuTitle: { fontSize: 15, fontFamily: FontFamily.interSemiBold, color: '#111827', marginBottom: 2 },
  menuSub: { fontSize: 12, fontFamily: FontFamily.lato, color: '#6B7280' },
  rowDivider: { height: 1, backgroundColor: '#F3F4F6', marginLeft: 70 },
});
