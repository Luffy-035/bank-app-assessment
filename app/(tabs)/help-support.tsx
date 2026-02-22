import { FontFamily } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function HelpSupportScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroIconContainer}>
            <Ionicons name="headset" size={32} color="#FFFFFF" />
          </View>
          <Text style={styles.heroTitle}>We're here to help!</Text>
          <Text style={styles.heroSubtitle}>
            Have a question or need assistance?{'\n'}Our team is ready to support you.
          </Text>
        </View>

        {/* Get in Touch */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardHeaderTitle}>Get in Touch</Text>

          <TouchableOpacity
            style={[styles.contactRow, styles.contactRowLiveChat]}
            activeOpacity={0.8}
            onPress={() => router.push('/request-support')}
          >
            <View style={styles.contactLeft}>
              <View style={styles.contactIconWrapChat}>
                <Ionicons name="chatbubbles" size={22} color="#1601AA" />
              </View>
              <View>
                <Text style={styles.contactTitle}>Live Chat</Text>
                <Text style={styles.contactSubtitle}>Fastest way to get help</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <View style={{ height: 12 }} />

          <TouchableOpacity
            style={[styles.contactRow, styles.contactRowEmail]}
            activeOpacity={0.8}
            onPress={() => Linking.openURL('mailto:support@blew.in')}
          >
            <View style={styles.contactLeft}>
              <View style={styles.contactIconWrapEmail}>
                <Ionicons name="mail" size={20} color="#374151" />
              </View>
              <View>
                <Text style={styles.contactTitle}>Email Us</Text>
                <Text style={styles.contactSubtitle}>We'll reply within 24 hours</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Find Answers Yourself */}
        <View style={styles.sectionCard2}>
          <Text style={styles.cardHeaderTitle}>Find Answers Yourself</Text>
          <View style={styles.listContainer}>
            <TouchableOpacity style={styles.listItem}>
              <View style={styles.listIconWrap}>
                <Ionicons name="book" size={20} color="#6B7280" />
              </View>
              <Text style={styles.listText}>Knowledge Base</Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
            <View style={styles.listDivider} />
            <TouchableOpacity style={styles.listItem}>
              <View style={styles.listIconWrap}>
                <Ionicons name="help-circle" size={22} color="#6B7280" />
              </View>
              <Text style={styles.listText}>Frequently Asked Questions</Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Feedback */}
        <View style={styles.feedbackCard}>
          <Text style={styles.feedbackTitle}>Have a suggestion?</Text>
          <Text style={styles.feedbackSubtitle}>
            We're always looking to improve. Share your{'\n'}feedback with us!
          </Text>
          <TouchableOpacity style={styles.feedbackButton}>
            <Text style={styles.feedbackButtonText}>Give Feedback</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
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
  headerTitle: {
    fontSize: 17,
    fontFamily: FontFamily.interSemiBold,
    color: '#111827',
  },
  scroll: { flex: 1 },

  // Hero
  hero: {
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    paddingTop: 28,
    paddingBottom: 28,
    paddingHorizontal: 20,
  },
  heroIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1E40AF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  heroTitle: {
    fontSize: 18,
    fontFamily: FontFamily.interBold,
    color: '#1E40AF',
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 13,
    fontFamily: FontFamily.lato,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 20,
  },

  // Get in Touch card
  sectionCard: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionCard2: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  cardHeaderTitle: {
    fontSize: 14,
    fontFamily: FontFamily.interSemiBold,
    color: '#111827',
    marginBottom: 14,
    marginLeft: 2,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
  },
  contactRowLiveChat: { backgroundColor: '#E8E6FA' },
  contactRowEmail: { backgroundColor: '#F9FAFB' },
  contactLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  contactIconWrapChat: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(22, 1, 170, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactIconWrapEmail: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactTitle: {
    fontSize: 14,
    fontFamily: FontFamily.interSemiBold,
    color: '#111827',
    marginBottom: 2,
  },
  contactSubtitle: {
    fontSize: 11,
    fontFamily: FontFamily.lato,
    color: '#6B7280',
  },

  // Find answers
  listContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  listDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 56,
  },
  listIconWrap: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  listText: {
    flex: 1,
    fontSize: 14,
    fontFamily: FontFamily.interSemiBold,
    color: '#374151',
  },

  // Feedback
  feedbackCard: {
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 8,
  },
  feedbackTitle: {
    fontSize: 16,
    fontFamily: FontFamily.interBold,
    color: '#111827',
    marginBottom: 8,
  },
  feedbackSubtitle: {
    fontSize: 13,
    fontFamily: FontFamily.lato,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  feedbackButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#1601AA',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  feedbackButtonText: {
    fontSize: 14,
    fontFamily: FontFamily.interSemiBold,
    color: '#1601AA',
  },
});
