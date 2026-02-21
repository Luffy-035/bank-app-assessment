import { FontFamily } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const faqItems = [
  {
    id: '1',
    question: 'How do I reset my password?',
    answer: 'You can reset your password by going to',
  },
  {
    id: '2',
    question: 'How can I update my payment method?',
    answer: "Navigate to the 'Profile' section from the",
  },
  {
    id: '3',
    question: 'Where can I find my rental agreement?',
    answer: 'All your documents, including the rental',
  },
  {
    id: '4',
    question: 'How to resolve a dispute with your landlord?',
    answer: 'If you have a dispute with your landlord, first try to communicate directly and document all interactions. You can use our in-app messaging feature to keep a record. If unresolved, submit a formal complaint through the "Request Support" section, and our mediation team will assist you within 48 hours.',
  },
];

export default function HelpSupportScreen() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.heroIconContainer}>
            <Ionicons name="headset" size={32} color="#FFFFFF" />
          </View>
          <Text style={styles.heroTitle}>Need help?</Text>
          <Text style={styles.heroSubtitle}>Chat live or send us an email anytime!</Text>
        </View>

        {/* Contact Cards */}
        <View style={styles.contactSection}>
          <View style={styles.contactRow}>
            <TouchableOpacity style={styles.contactCard} activeOpacity={0.8} onPress={() => router.push('/request-support')}>
              <View style={styles.contactIconWrapper}>
                <Ionicons name="chatbubble-ellipses" size={22} color="#1E40AF" />
              </View>
              <Text style={styles.contactTitle}>Live Chat</Text>
              <Text style={styles.contactSubtitle}>Avg. wait: 2 mins</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactCard} activeOpacity={0.8} onPress={() => Linking.openURL('tel:+918001234567')}>
              <View style={styles.contactIconWrapper}>
                <Ionicons name="call" size={22} color="#1E40AF" />
              </View>
              <Text style={styles.contactTitle}>Call Us</Text>
              <Text style={styles.contactSubtitle}>+91 800-123-4567</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FAQ Section */}
        <View style={styles.faqSection}>
          <Text style={styles.faqTitle}>Frequently Asked Questions</Text>

          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={18} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for questions..."
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.faqList}>
            {faqItems.map((item) => {
              const expanded = expandedId === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.faqCard}
                  activeOpacity={0.8}
                  onPress={() => setExpandedId(expanded ? null : item.id)}
                >
                  <View style={styles.faqContent}>
                    <Text style={styles.faqQuestion}>{item.question}</Text>
                    {expanded && <Text style={styles.faqAnswer}>{item.answer}</Text>}
                  </View>
                  <Ionicons
                    name={expanded ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    padding: 2,
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: FontFamily.interSemiBold,
    color: '#111827',
  },
  scroll: {
    flex: 1,
  },
  hero: {
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  heroIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1E40AF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 18,
    fontFamily: FontFamily.interBold,
    color: '#1E40AF',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 13,
    fontFamily: FontFamily.lato,
    color: '#4B5563',
    textAlign: 'center',
  },
  contactSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: '#F8FAFC',
  },
  contactRow: {
    flexDirection: 'row',
    gap: 10,
  },
  contactCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  contactIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  contactTitle: {
    fontSize: 14,
    fontFamily: FontFamily.interSemiBold,
    color: '#111827',
    marginBottom: 2,
  },
  contactSubtitle: {
    fontSize: 12,
    fontFamily: FontFamily.lato,
    color: '#9CA3AF',
  },
  faqSection: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  faqTitle: {
    fontSize: 16,
    fontFamily: FontFamily.interBold,
    color: '#111827',
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    fontFamily: FontFamily.lato,
    color: '#111827',
  },
  faqList: {
    gap: 8,
  },
  faqCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 0,
  },
  faqContent: {
    flex: 1,
    marginRight: 8,
  },
  faqQuestion: {
    fontSize: 14,
    fontFamily: FontFamily.latoSemiBold,
    color: '#111827',
    marginBottom: 4,
  },
  faqAnswer: {
    fontSize: 13,
    fontFamily: FontFamily.lato,
    color: '#9CA3AF',
  },
});
