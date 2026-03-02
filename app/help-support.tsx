import { FontFamily } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React from 'react';
import {
    Alert,
    Image,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SUPPORT_PHONE, SUPPORT_EMAIL } from '@/constants/contact';

export default function HelpSupportScreen() {
    const handleCall = () => Linking.openURL(`tel:${SUPPORT_PHONE}`);
    const handleMail = () => Linking.openURL(`mailto:${SUPPORT_EMAIL}`);
    const handleFAQ = () => Alert.alert('FAQs', 'Frequently asked questions will be available in a future update.');
    const handleFeedback = () => Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=Feedback&body=Hi Blew team, I have a suggestion: `);

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#111827" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Help & Support</Text>
                    <View style={{ width: 24 }} />
                </View>

                {/* Support Image */}
                <View style={styles.imageBackgroundWrapper}>
                    <Image
                        source={require('@/assets/images/customer-support-illustration.jpg')}
                        style={styles.supportImage}
                        resizeMode="contain"
                    />
                </View>

                {/* Title */}
                <Text style={styles.mainTitle}>We're here to help!</Text>
                <Text style={styles.subtitle}>
                    Have a question or need assistance? Our team is{'\n'}ready to support you.
                </Text>

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
                    <TouchableOpacity style={styles.contactRow} onPress={handleFAQ} activeOpacity={0.75}>
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

                {/* Feedback Section */}
                <View style={styles.feedbackCard}>
                    <Text style={styles.feedbackTitle}>Have a suggestion?</Text>
                    <Text style={styles.feedbackSubtitle}>
                        We're always looking to improve. Share your{'\n'}feedback with us!
                    </Text>
                    <TouchableOpacity style={styles.feedbackButton} onPress={handleFeedback}>
                        <Text style={styles.feedbackButtonText}>Give Feedback</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ height: 120 }} />
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
                <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/landlord-requests')}>
                    <Ionicons name="construct-outline" size={20} color="#9CA3AF" />
                    <Text style={styles.tabText}>Requests</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabItem}>
                    <Ionicons name="ellipsis-horizontal" size={20} color="#1601AA" />
                    <Text style={[styles.tabText, styles.tabActive]}>More</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    scroll: { flex: 1 },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    backButton: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 17, fontFamily: FontFamily.interSemiBold, color: '#111827' },

    imageBackgroundWrapper: { alignItems: 'center', marginTop: 8, marginBottom: 20 },
    supportImage: { width: '75%', height: 170 },

    mainTitle: {
        fontSize: 18, fontFamily: FontFamily.interBold, color: '#111827',
        textAlign: 'center', marginBottom: 8,
    },
    subtitle: {
        fontSize: 12, fontFamily: FontFamily.lato, color: '#6B7280',
        textAlign: 'center', lineHeight: 18, marginBottom: 28, paddingHorizontal: 32,
    },

    sectionCard: {
        marginHorizontal: 16, backgroundColor: '#FFFFFF', borderRadius: 16,
        borderWidth: 1, borderColor: '#F0F0F5', marginBottom: 20,
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
        alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
    },
    contactText: { flex: 1 },
    contactTitle: { fontSize: 15, fontFamily: FontFamily.interSemiBold, color: '#111827', marginBottom: 3 },
    contactSubtitle: { fontSize: 12, fontFamily: FontFamily.lato, color: '#6B7280', lineHeight: 17 },

    rowDivider: { height: 1, backgroundColor: '#F3F4F6', marginLeft: 76 },

    feedbackCard: {
        marginHorizontal: 16, backgroundColor: '#FFFFFF', borderRadius: 16,
        padding: 20, alignItems: 'center',
        borderWidth: 1, borderColor: '#E5E7EB',
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

    tabBar: {
        flexDirection: 'row', backgroundColor: '#FFFFFF',
        borderTopWidth: 1, borderTopColor: '#E5E7EB',
        paddingBottom: 22, paddingTop: 8,
    },
    tabItem: { flex: 1, alignItems: 'center' },
    tabText: { fontSize: 10, fontFamily: FontFamily.lato, color: '#9CA3AF', marginTop: 3 },
    tabActive: { color: '#1601AA', fontFamily: FontFamily.latoSemiBold },
});