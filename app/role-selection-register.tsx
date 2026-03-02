import { FontFamily } from '@/constants/theme';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RoleSelectionRegisterScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {/* Title */}
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Welcome!</Text>
                    <Text style={styles.subtitle}>
                        First, let's get you set up. Choose{'\n'}your role to continue.
                    </Text>
                </View>

                {/* Role Selection Buttons */}
                <View style={styles.buttonsContainer}>
                    {/* Landlord Button */}
                    <TouchableOpacity
                        style={[styles.roleButton, styles.roleButtonLandlord]}
                        onPress={() => router.push('/landlord-create-account')}
                    >
                        <View style={styles.iconContainerLandlord}>
                            <MaterialIcons name="home" size={28} color="#FFFFFF" />
                        </View>
                        <View style={styles.roleTextContainer}>
                            <Text style={styles.roleTitle}>I am a Landlord</Text>
                            <Text style={styles.roleDescription}>Manage properties &{'\n'}tenants.</Text>
                        </View>
                    </TouchableOpacity>

                    {/* Tenant Button */}
                    <TouchableOpacity
                        style={[styles.roleButton, styles.roleButtonTenant]}
                        onPress={() =>
                            Alert.alert(
                                'Coming Soon 🚀',
                                'Tenant accounts are created by your landlord. Ask them for your Tenant ID and password to log in.',
                                [{ text: 'Got it' }]
                            )
                        }
                    >
                        <View style={styles.iconContainerTenant}>
                            <Ionicons name="person" size={26} color="#6B7280" />
                        </View>
                        <View style={styles.roleTextContainer}>
                            <Text style={styles.roleTitle}>I am a Tenant</Text>
                            <Text style={styles.roleDescription}>Pay rent &amp; submit{'\n'}requests.</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 80,
        justifyContent: 'flex-start',
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 48,
    },
    title: {
        fontSize: 32,
        fontFamily: FontFamily.latoBold,
        color: '#1F2937',
        marginBottom: 12,
        lineHeight: 40,
    },
    subtitle: {
        fontSize: 15,
        fontFamily: FontFamily.lato,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 22,
    },
    buttonsContainer: {
        gap: 16,
    },
    roleButton: {
        flexDirection: 'row',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
    },
    roleButtonLandlord: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    roleButtonTenant: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    iconContainerLandlord: {
        width: 52,
        height: 52,
        borderRadius: 12,
        backgroundColor: '#312E81',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    iconContainerTenant: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    roleTextContainer: {
        flex: 1,
    },
    roleTitle: {
        fontSize: 18,
        fontFamily: FontFamily.latoBold,
        color: '#1F2937',
        marginBottom: 4,
        lineHeight: 24,
    },
    roleDescription: {
        fontSize: 14,
        fontFamily: FontFamily.lato,
        color: '#6B7280',
        lineHeight: 20,
    },
});
