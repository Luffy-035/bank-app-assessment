import { FontFamily } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function HelpSupportScreen() {
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
                    <View style={styles.imageBackground}>
                        <Image
                            source={require('@/assets/images/customer-support-illustration.jpg')}
                            style={styles.supportImage}
                            resizeMode="contain"
                        />
                    </View>
                </View>

                {/* Title */}
                <Text style={styles.mainTitle}>We're here to help!</Text>
                <Text style={styles.subtitle}>
                    Have a question or need assistance? Our team is{'\n'}ready to support you.
                </Text>

                {/* Get in Touch Section */}
                <View style={styles.sectionCard}>
                    <Text style={styles.cardHeaderTitle}>Get in Touch</Text>
                    <TouchableOpacity style={[styles.contactRow, styles.contactRowLiveChat]}>
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

                    <TouchableOpacity style={[styles.contactRow, styles.contactRowEmail]}>
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

                {/* Find Answers Yourself Section */}
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

                {/* Feedback Section */}
                <View style={styles.feedbackCard}>
                    <Text style={styles.feedbackTitle}>Have a suggestion?</Text>
                    <Text style={styles.feedbackSubtitle}>
                        We're always looking to improve. Share your{'\n'}feedback with us!
                    </Text>
                    <TouchableOpacity style={styles.feedbackButton}>
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

            {/* FAB */}
            <TouchableOpacity style={styles.fab} onPress={() => router.push('/add-property')}>
                <Ionicons name="add" size={28} color="#FFFFFF" />
            </TouchableOpacity>
        </View>
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
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    backButton: {
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 17,
        fontFamily: FontFamily.interSemiBold,
        color: '#111827',
    },
    imageBackgroundWrapper: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 24,
    },
    imageBackground: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    supportImage: {
        width: '80%',
        height: 180,
    },
    mainTitle: {
        fontSize: 18,
        fontFamily: FontFamily.interBold,
        color: '#111827',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 12,
        fontFamily: FontFamily.lato,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 18,
        marginBottom: 24,
        paddingHorizontal: 32,
    },
    sectionCard: {
        marginHorizontal: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        marginBottom: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    sectionCard2: {
        marginHorizontal: 16,
        marginBottom: 24,
    },
    cardHeaderTitle: {
        fontSize: 14,
        fontFamily: FontFamily.interSemiBold,
        color: '#111827',
        marginBottom: 16,
        marginLeft: 4,
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 12,
    },
    contactRowLiveChat: {
        backgroundColor: '#E8E6FA',
    },
    contactRowEmail: {
        backgroundColor: '#F9FAFB',
    },
    contactLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    contactIconWrapChat: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(22, 1, 170, 0.1)', // Light blue tint
        alignItems: 'center',
        justifyContent: 'center',
    },
    contactIconWrapEmail: {
        width: 36,
        height: 36,
        borderRadius: 18,
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
    listContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        shadowColor: "#000",
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
        marginLeft: 56, // Indent divider
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
    feedbackCard: {
        marginHorizontal: 16,
        marginTop: 28,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
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
});