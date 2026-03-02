import { FontFamily } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ROLES = [
    {
        id: 'landlord',
        title: 'Landlord',
        subtitle: 'Manage your properties, tenants, and rent collection',
        icon: 'business-outline' as const,
        color: '#1601AA',
        bg: '#EEF2FF',
        route: '/landlord-create-account' as const,
    },
    {
        id: 'tenant',
        title: 'Tenant',
        subtitle: 'View your rent, raise requests, and manage your stay',
        icon: 'people-outline' as const,
        color: '#16A34A',
        bg: '#F0FDF4',
        route: '/tenant-create-account' as const,
    },
];

export default function RoleSelectionScreen() {
    return (
        <View style={styles.container}>
            {/* Header */}
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                <Ionicons name="arrow-back" size={22} color="#111827" />
            </TouchableOpacity>

            <Text style={styles.heading}>Create Account</Text>
            <Text style={styles.subheading}>Choose your role to get started</Text>

            <View style={styles.cards}>
                {ROLES.map((role) => (
                    <TouchableOpacity
                        key={role.id}
                        style={styles.card}
                        onPress={() => router.push(role.route)}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.iconWrap, { backgroundColor: role.bg }]}>
                            <Ionicons name={role.icon} size={30} color={role.color} />
                        </View>
                        <View style={styles.cardContent}>
                            <Text style={styles.cardTitle}>{role.title}</Text>
                            <Text style={styles.cardSubtitle}>{role.subtitle}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.loginRow}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => router.replace('/login')}>
                    <Text style={styles.loginLink}>Sign In</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 24, paddingTop: 60 },
    backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
    heading: { fontSize: 28, fontFamily: FontFamily.interBold, color: '#111827', marginBottom: 6 },
    subheading: { fontSize: 15, fontFamily: FontFamily.lato, color: '#6B7280', marginBottom: 36 },
    cards: { gap: 16 },
    card: {
        flexDirection: 'row', alignItems: 'center', gap: 16,
        backgroundColor: '#FFFFFF', borderRadius: 16, padding: 18,
        borderWidth: 1, borderColor: '#E5E7EB',
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
    },
    iconWrap: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    cardContent: { flex: 1 },
    cardTitle: { fontSize: 17, fontFamily: FontFamily.interBold, color: '#111827', marginBottom: 4 },
    cardSubtitle: { fontSize: 13, fontFamily: FontFamily.lato, color: '#6B7280', lineHeight: 18 },
    loginRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 40 },
    loginText: { fontSize: 14, fontFamily: FontFamily.lato, color: '#6B7280' },
    loginLink: { fontSize: 14, fontFamily: FontFamily.interSemiBold, color: '#1601AA' },
});
