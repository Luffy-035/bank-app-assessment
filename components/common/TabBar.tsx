import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FontFamily } from '@/constants/theme';

type Tab = 'dashboard' | 'properties' | 'requests' | 'more';

interface Props {
    activeTab: Tab;
}

const tabs: { id: Tab; label: string; icon: keyof typeof Ionicons.glyphMap; activeIcon: keyof typeof Ionicons.glyphMap; route: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'grid-outline', activeIcon: 'grid', route: '/landlord-dashboard' },
    { id: 'properties', label: 'Properties', icon: 'business-outline', activeIcon: 'business', route: '/properties' },
    { id: 'requests', label: 'Requests', icon: 'construct-outline', activeIcon: 'construct', route: '/landlord-requests' },
    { id: 'more', label: 'More', icon: 'ellipsis-horizontal', activeIcon: 'ellipsis-horizontal', route: '/help-support' },
];

export default function TabBar({ activeTab }: Props) {
    return (
        <View style={styles.tabBar}>
            {tabs.map((tab) => {
                const isActive = tab.id === activeTab;
                return (
                    <TouchableOpacity
                        key={tab.id}
                        style={styles.tabItem}
                        onPress={() => !isActive && router.push(tab.route as any)}
                    >
                        <Ionicons
                            name={isActive ? tab.activeIcon : tab.icon}
                            size={22}
                            color={isActive ? '#1601AA' : '#9CA3AF'}
                        />
                        <Text style={[styles.tabText, isActive && styles.tabActive]}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingBottom: 24,
        paddingTop: 10,
        zIndex: 20,
        elevation: 10,
    },
    tabItem: { flex: 1, alignItems: 'center' },
    tabText: { fontSize: 10, fontFamily: FontFamily.lato, color: '#9CA3AF', marginTop: 3 },
    tabActive: { color: '#1601AA', fontFamily: FontFamily.latoSemiBold },
});
