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
  const handleCall = () => Linking.openURL('tel:+918000000000');
  const handleMail = () => Linking.openURL('mailto:support@blew.in');

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

        {/* Contact Options */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardHeaderTitle}>Get in Touch</Text>

          {/* Call Us */}
          <TouchableOpacity style={styles.contactRow} onPress={handleCall} activeOpacity={0.75}>
            <View style={[styles.contactIconWrap, { backgroundColor: '#EEF2FF' }]}>
              <Ionicons name="call" size={20} color="#1601AA" />
            </View>
            <View style={styles.contactText}>
              <Text style={styles.contactTitle}>Call Us</Text>
              <Text style={styles.contactSubtitle}>Need assistance? Contact our support team directly by phone.</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>

          <View style={styles.rowDivider} />

          {/* Mail Us */}
          <TouchableOpacity style={styles.contactRow} onPress={handleMail} activeOpacity={0.75}>
            <View style={[styles.contactIconWrap, { backgroundColor: '#ECFDF5' }]}>
              <Ionicons name="mail" size={20} color="#059669" />
            </View>
            <View style={styles.contactText}>
              <Text style={styles.contactTitle}>Mail Us</Text>
              <Text style={styles.contactSubtitle}>Send us an email and we will get back to you as soon as possible.</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>

          <View style={styles.rowDivider} />

          {/* FAQs */}
          <TouchableOpacity style={styles.contactRow} activeOpacity={0.75}>
            <View style={[styles.contactIconWrap, { backgroundColor: '#FFF7ED' }]}>
              <Ionicons name="help-circle" size={20} color="#EA580C" />
            </View>
            <View style={styles.contactText}>
              <Text style={styles.contactTitle}>FAQs</Text>
              <Text style={styles.contactSubtitle}>Find answers to the most commonly asked questions.</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>
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
  headerTitle: { fontSize: 17, fontFamily: FontFamily.interSemiBold, color: '#111827' },
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
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: '#1E40AF',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 14,
  },
  heroTitle: { fontSize: 18, fontFamily: FontFamily.interBold, color: '#1E40AF', marginBottom: 6 },
  heroSubtitle: {
    fontSize: 13, fontFamily: FontFamily.lato, color: '#4B5563',
    textAlign: 'center', lineHeight: 20,
  },

  // Contact card
  sectionCard: {
    marginHorizontal: 16, marginTop: 20,
    backgroundColor: '#FFFFFF', borderRadius: 16,
    borderWidth: 1, borderColor: '#F0F0F5',
    marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 3,
    overflow: 'hidden',
  },
  cardHeaderTitle: {
    fontSize: 13, fontFamily: FontFamily.interSemiBold, color: '#6B7280',
    letterSpacing: 0.5, paddingHorizontal: 18, paddingTop: 16, paddingBottom: 8,
    textTransform: 'uppercase',
  },
  contactRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 18, paddingVertical: 16, gap: 14,
  },
  contactIconWrap: {
    width: 44, height: 44, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  contactText: { flex: 1 },
  contactTitle: { fontSize: 15, fontFamily: FontFamily.interSemiBold, color: '#111827', marginBottom: 3 },
  contactSubtitle: { fontSize: 12, fontFamily: FontFamily.lato, color: '#6B7280', lineHeight: 17 },
  rowDivider: { height: 1, backgroundColor: '#F3F4F6', marginLeft: 76 },

  // Feedback
  feedbackCard: {
    marginHorizontal: 16, backgroundColor: '#FFFFFF', borderRadius: 16,
    padding: 20, alignItems: 'center',
    borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 8,
  },
  feedbackTitle: { fontSize: 16, fontFamily: FontFamily.interBold, color: '#111827', marginBottom: 8 },
  feedbackSubtitle: {
    fontSize: 13, fontFamily: FontFamily.lato, color: '#6B7280',
    textAlign: 'center', lineHeight: 20, marginBottom: 16,
  },
  feedbackButton: {
    backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: '#1601AA',
    borderRadius: 12, paddingVertical: 12, paddingHorizontal: 32,
  },
  feedbackButtonText: { fontSize: 14, fontFamily: FontFamily.interSemiBold, color: '#1601AA' },
});
