import { FontFamily } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function ProfileScreen() {
  const [autopayEnabled, setAutopayEnabled] = useState(false);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ width: 24 }} />
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity>
            <Ionicons name="settings-outline" size={22} color="#1F2937" />
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <TouchableOpacity style={styles.avatarWrapper}>
            <Ionicons name="person-circle" size={80} color="#D1D5DB" />
            <View style={styles.editBadge}>
              <Ionicons name="pencil" size={10} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          <Text style={styles.profileName}>Sarah Jones</Text>

          <View style={styles.locationContainer}>
            <View style={styles.locationIconCircle}>
              <Ionicons name="location-outline" size={18} color="#6B7280" />
            </View>
          </View>
          <Text style={styles.locationText}>
            St. Cikoko Timur, Kec. Pancoran, Jakarta{'\n'}Selatan, Indonesia 12770
          </Text>
        </View>

        {/* Landlord Details Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Landlord Details</Text>
          <View style={styles.cardDivider} />

          <View style={styles.landlordHeader}>
            <View style={styles.landlordAvatar}>
              <Ionicons name="person" size={24} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.landlordName}>John Appleseed</Text>
              <Text style={styles.landlordRole}>Property Owner</Text>
            </View>
          </View>

          <View style={styles.landlordInfoContainer}>
            <View style={styles.landlordInfoRow}>
              <Ionicons name="location-outline" size={16} color="#6B7280" />
              <Text style={styles.landlordInfoText}>987 Realty Road, Suite 500{'\n'}Business District, NY 10001</Text>
            </View>
            <View style={styles.landlordInfoRow}>
              <Ionicons name="call-outline" size={16} color="#6B7280" />
              <Text style={styles.landlordInfoText}>+1 (555) 012-3456</Text>
            </View>
            <View style={styles.landlordInfoRow}>
              <Ionicons name="mail-outline" size={16} color="#6B7280" />
              <Text style={styles.landlordInfoText}>john.appleseed@properties.com</Text>
            </View>
          </View>

          <View style={styles.landlordActions}>
            <TouchableOpacity style={styles.landlordBtnPrimary}>
              <Ionicons name="call" size={18} color="#FFFFFF" />
              <Text style={styles.landlordBtnTextPrimary}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.landlordBtnSecondary}>
              <Ionicons name="mail" size={18} color="#1601AA" />
              <Text style={styles.landlordBtnTextSecondary}>Email</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Contact Information Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contact Information</Text>
          <View style={styles.cardDivider} />

          <View style={styles.contactRow}>
            <View>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactName}>mathew@email.com</Text>
            </View>
            <TouchableOpacity style={styles.actionBtn}>
              <Ionicons name="mail" size={16} color="#1601AA" />
            </TouchableOpacity>
          </View>



          <View style={styles.contactRow}>
            <View>
              <Text style={styles.contactLabel}>Emergency Contact</Text>
              <Text style={styles.contactName}>Michael Wallace (Brother)</Text>
            </View>
            <Ionicons name="shield-half" size={22} color="#EF4444" />
          </View>

          <View style={styles.contactRowLast}>
            <View>
              <Text style={styles.contactLabel}>Alternate Contact</Text>
              <Text style={styles.notSpecified}>Not specified</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.addLink}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Payment Settings Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment Settings</Text>
          <View style={styles.cardDivider} />

          <View style={styles.paymentRow}>
            <View>
              <Text style={styles.paymentLabel}>Preferred Payment Method</Text>
              <View style={styles.visaRow}>
                <View style={styles.visaBadge}>
                  <Text style={styles.visaText}>VISA</Text>
                </View>
                <Text style={styles.cardText}>Visa - last digits 4242</Text>
              </View>
            </View>
            <TouchableOpacity>
              <Text style={styles.changeLink}>Change</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cardDivider} />

          <View style={styles.autopayRow}>
            <View style={styles.autopayTextContainer}>
              <Text style={styles.autopayTitle}>Enable Autopay</Text>
              <Text style={styles.autopaySubtitle}>
                Automatically pay rent on the 1st of each month.
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setAutopayEnabled(!autopayEnabled)}
            >
              <View style={[styles.customSwitch, autopayEnabled && styles.customSwitchActive]}>
                <View style={[styles.customSwitchThumb, autopayEnabled && styles.customSwitchThumbActive]} />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.cardDivider} />

          <Text style={styles.currencyLabel}>Change Currency</Text>
          <TouchableOpacity style={styles.currencyDropdown}>
            <Text style={styles.currencyText}>Dollars</Text>
            <Ionicons name="chevron-down" size={20} color="#1F2937" />
          </TouchableOpacity>
        </View>

        {/* My Documents Card */}
        <TouchableOpacity style={styles.documentsCard} onPress={() => router.push('/documents')}>
          <View style={styles.documentsIcon}>
            <Ionicons name="folder-open" size={24} color="#1601AA" />
          </View>
          <View style={styles.documentsText}>
            <Text style={styles.documentsTitle}>My Documents</Text>
            <Text style={styles.documentsSubtitle}>Lease, Receipts & More</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 14,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: FontFamily.interBold,
    color: '#1F2937',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 24,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 14,
  },
  editBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1601AA',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileName: {
    fontSize: 20,
    fontFamily: FontFamily.interBold,
    color: '#1F2937',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 13,
    fontFamily: FontFamily.lato,
    color: '#6B7280',
    marginBottom: 16,
  },
  locationContainer: {
    marginTop: 16,
    marginBottom: 8,
  },
  locationIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationText: {
    fontSize: 12,
    fontFamily: FontFamily.lato,
    color: '#6B7280',
    lineHeight: 18,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: FontFamily.interSemiBold,
    color: '#1F2937',
    marginBottom: 14,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 14,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  contactRowLast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactLabel: {
    fontSize: 11,
    fontFamily: FontFamily.lato,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  contactName: {
    fontSize: 14,
    fontFamily: FontFamily.lato,
    color: '#1F2937',
  },
  contactActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0E7FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notSpecified: {
    fontSize: 14,
    fontFamily: FontFamily.lato,
    fontStyle: 'italic',
    color: '#9CA3AF',
  },
  addLink: {
    fontSize: 13,
    fontFamily: FontFamily.interSemiBold,
    color: '#1601AA',
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  paymentLabel: {
    fontSize: 11,
    fontFamily: FontFamily.lato,
    color: '#9CA3AF',
    marginBottom: 6,
  },
  visaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  visaBadge: {
    backgroundColor: '#1E3A8A',
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  visaText: {
    fontSize: 8,
    fontFamily: FontFamily.interBold,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  cardText: {
    fontSize: 13,
    fontFamily: FontFamily.lato,
    color: '#1F2937',
  },
  changeLink: {
    fontSize: 13,
    fontFamily: FontFamily.interSemiBold,
    color: '#1601AA',
  },
  autopayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  autopayTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  autopayTitle: {
    fontSize: 14,
    fontFamily: FontFamily.latoSemiBold,
    color: '#1F2937',
    marginBottom: 4,
  },
  autopaySubtitle: {
    fontSize: 11,
    fontFamily: FontFamily.lato,
    color: '#9CA3AF',
    lineHeight: 16,
  },
  currencyLabel: {
    fontSize: 14,
    fontFamily: FontFamily.latoSemiBold,
    color: '#1F2937',
    marginBottom: 10,
  },
  currencyDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  currencyText: {
    fontSize: 14,
    fontFamily: FontFamily.lato,
    color: '#1F2937',
  },
  documentsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  documentsIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#E0E7FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  documentsText: {
    flex: 1,
  },
  documentsTitle: {
    fontSize: 14,
    fontFamily: FontFamily.interSemiBold,
    color: '#1F2937',
    marginBottom: 2,
  },
  documentsSubtitle: {
    fontSize: 12,
    fontFamily: FontFamily.lato,
    color: '#6B7280',
  },
  customSwitch: {
    width: 42,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#D1D5DB',
    padding: 2,
    justifyContent: 'center',
  },
  customSwitchActive: {
    backgroundColor: '#1601AA',
  },
  customSwitchThumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2,
  },
  customSwitchThumbActive: {
    alignSelf: 'flex-end',
    borderColor: 'transparent',
  },
  landlordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  landlordAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1601AA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  landlordName: {
    fontSize: 15,
    fontFamily: FontFamily.interSemiBold,
    color: '#1F2937',
    marginBottom: 2,
  },
  landlordRole: {
    fontSize: 12,
    fontFamily: FontFamily.lato,
    color: '#6B7280',
  },
  landlordInfoContainer: {
    gap: 10,
    marginBottom: 18,
  },
  landlordInfoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  landlordInfoText: {
    fontSize: 13,
    fontFamily: FontFamily.lato,
    color: '#4B5563',
    lineHeight: 18,
    flex: 1,
  },
  landlordActions: {
    flexDirection: 'row',
    gap: 12,
  },
  landlordBtnPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1601AA',
    borderRadius: 10,
    paddingVertical: 10,
    gap: 6,
  },
  landlordBtnTextPrimary: {
    fontSize: 13,
    fontFamily: FontFamily.interSemiBold,
    color: '#FFFFFF',
  },
  landlordBtnSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 10,
    paddingVertical: 10,
    gap: 6,
  },
  landlordBtnTextSecondary: {
    fontSize: 13,
    fontFamily: FontFamily.interSemiBold,
    color: '#1601AA',
  },
});
