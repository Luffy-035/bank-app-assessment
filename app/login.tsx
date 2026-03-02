import { FontFamily } from '@/constants/theme';
import { ENDPOINTS } from '@/constants/api';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '@/services/api';
import type { AuthResponse } from '@/types/user.types';

interface Country {
    name: string;
    code: string;
    dialCode: string;
    flag: string;
}

const COUNTRIES: Country[] = [
    { name: 'India', code: 'IN', dialCode: '+91', flag: '🇮🇳' },
    { name: 'United States', code: 'US', dialCode: '+1', flag: '🇺🇸' },
    { name: 'United Kingdom', code: 'GB', dialCode: '+44', flag: '🇬🇧' },
    { name: 'Canada', code: 'CA', dialCode: '+1', flag: '🇨🇦' },
    { name: 'Australia', code: 'AU', dialCode: '+61', flag: '🇦🇺' },
    { name: 'Germany', code: 'DE', dialCode: '+49', flag: '🇩🇪' },
    { name: 'France', code: 'FR', dialCode: '+33', flag: '🇫🇷' },
    { name: 'Japan', code: 'JP', dialCode: '+81', flag: '🇯🇵' },
    { name: 'Singapore', code: 'SG', dialCode: '+65', flag: '🇸🇬' },
    { name: 'UAE', code: 'AE', dialCode: '+971', flag: '🇦🇪' },
    { name: 'Saudi Arabia', code: 'SA', dialCode: '+966', flag: '🇸🇦' },
];

export default function LoginScreen() {
    const { login } = useAuth();
    const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
    const [showCountryModal, setShowCountryModal] = useState(false);

    // Email & password fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Animated segmented control
    const slideAnim = useRef(new Animated.Value(0)).current;
    const [segmentWidth, setSegmentWidth] = useState(0);

    useEffect(() => {
        if (segmentWidth > 0) {
            Animated.spring(slideAnim, {
                toValue: loginMethod === 'phone' ? 0 : segmentWidth + 6,
                useNativeDriver: true,
                tension: 68,
                friction: 8,
            }).start();
        }
    }, [loginMethod, segmentWidth]);

    const handleEmailLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Missing Fields', 'Please enter your email / Tenant ID and password.');
            return;
        }
        setLoading(true);
        try {
            // Detect if input looks like a Tenant ID (e.g. T-2026-001)
            const isTenantId = /^T-\d{4}-\d+$/i.test(email.trim());
            let payload: Record<string, string>;
            if (isTenantId) {
                payload = { tenantId: email.trim(), phone: password.trim() };
            } else {
                payload = { email: email.trim().toLowerCase(), password: password.trim() };
            }
            const { data } = await api.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, payload);
            await login(data.token, data.user);
            // Route based on role
            if (data.user.role === 'landlord') {
                router.replace('/landlord-dashboard');
            } else {
                router.replace('/(tabs)');
            }
        } catch (e: any) {
            Alert.alert('Login Failed', e?.response?.data?.message ?? 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.scroll}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* City Illustration */}
                    <View style={styles.illustrationContainer}>
                        <Image
                            source={require('@/assets/images/undraw_city_life_gnpr 1.png')}
                            style={styles.illustration}
                            contentFit="contain"
                        />
                    </View>

                    {/* Title */}
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>
                            Let's <Text style={styles.titleBold}>Sign In</Text>
                        </Text>
                        <Text style={styles.subtitle}>your smart dashboard is one step away</Text>
                    </View>

                    {/* Segmented Control */}
                    <View style={styles.segmentedContainer}>
                        <View style={styles.segmentedWrapper}>
                            {segmentWidth > 0 && (
                                <Animated.View
                                    style={[
                                        styles.slidingIndicator,
                                        { transform: [{ translateX: slideAnim }], width: segmentWidth },
                                    ]}
                                />
                            )}
                            <TouchableOpacity
                                style={styles.segmentedOption}
                                onPress={() => setLoginMethod('phone')}
                                onLayout={(e) => {
                                    const { width } = e.nativeEvent.layout;
                                    if (segmentWidth === 0) setSegmentWidth(width);
                                }}
                                activeOpacity={0.8}
                            >
                                <Text style={[styles.segmentedText, loginMethod === 'phone' && styles.segmentedTextActive]}>
                                    Phone OTP
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.segmentedOption}
                                onPress={() => setLoginMethod('email')}
                                activeOpacity={0.8}
                            >
                                <Text style={[styles.segmentedText, loginMethod === 'email' && styles.segmentedTextActive]}>
                                    Email & Password
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Phone OTP Tab */}
                    {loginMethod === 'phone' && (
                        <View style={styles.inputContainer}>
                            <View style={styles.phoneInputWrapper}>
                                <TouchableOpacity
                                    style={styles.countryCodeContainer}
                                    onPress={() => setShowCountryModal(true)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.flag}>{selectedCountry.flag}</Text>
                                    <Text style={styles.countryCode}>{selectedCountry.dialCode}</Text>
                                    <Ionicons name="chevron-down" size={16} color="#687076" />
                                </TouchableOpacity>
                                <TextInput
                                    style={styles.phoneInput}
                                    placeholder="Enter your phone number"
                                    placeholderTextColor="#9BA1A6"
                                    value={phoneNumber}
                                    onChangeText={(text) => {
                                        const cleaned = text.replace(/\D/g, '');
                                        if (cleaned.length <= 10) setPhoneNumber(cleaned);
                                    }}
                                    keyboardType="phone-pad"
                                />
                            </View>
                        </View>
                    )}

                    {/* Email & Password Tab */}
                    {loginMethod === 'email' && (
                        <View style={styles.inputContainer}>
                            {/* Tenant hint note */}
                            <View style={styles.hintCard}>
                                <Ionicons name="information-circle-outline" size={16} color="#1601AA" />
                                <Text style={styles.hintText}>
                                    <Text style={styles.hintBold}>Tenants:</Text> Enter your Tenant ID as email and your phone number as password.
                                </Text>
                            </View>

                            <TextInput
                                style={styles.emailInput}
                                placeholder="Email or Tenant ID"
                                placeholderTextColor="#9BA1A6"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                            />
                            <View style={styles.passwordRow}>
                                <TextInput
                                    style={styles.passwordInput}
                                    placeholder="Password or Phone Number"
                                    placeholderTextColor="#9BA1A6"
                                    secureTextEntry={!showPassword}
                                    value={password}
                                    onChangeText={setPassword}
                                />
                                <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword(v => !v)}>
                                    <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#6B7280" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    {/* Login Button */}
                    <TouchableOpacity
                        style={[styles.loginButton, loading && { opacity: 0.7 }]}
                        disabled={loading}
                        onPress={() => {
                            if (loginMethod === 'phone') {
                                Alert.alert(
                                    'Coming Soon 🚀',
                                    'Phone OTP login is not yet available. Please use Email & Password to sign in.',
                                    [{ text: 'OK' }]
                                );
                            } else {
                                handleEmailLogin();
                            }
                        }}
                    >
                        <Text style={styles.loginButtonText}>{loading ? 'Signing in…' : 'Login'}</Text>
                    </TouchableOpacity>

                    {/* OR Divider */}
                    <View style={styles.dividerContainer}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>OR</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    {/* Google only */}
                    <View style={styles.socialContainer}>
                        <TouchableOpacity
                            style={styles.socialButton}
                            onPress={() =>
                                Alert.alert('Coming Soon 🚀', 'Google Sign-In is not yet available.', [{ text: 'OK' }])
                            }
                        >
                            <Image
                                source={require('@/assets/images/Google - normal.png')}
                                style={styles.socialLogo}
                                contentFit="contain"
                            />
                            <Text style={styles.socialText}>Continue with Google</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Create Account Link */}
                    <View style={styles.signupRow}>
                        <Text style={styles.signupText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/role-selection-register')}>
                            <Text style={styles.signupLink}>Create account</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Country Selection Modal */}
            <Modal
                visible={showCountryModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowCountryModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Country</Text>
                            <TouchableOpacity onPress={() => setShowCountryModal(false)} style={styles.modalCloseBtn}>
                                <Ionicons name="close" size={24} color="#11181C" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.countryList}>
                            {COUNTRIES.map((country) => (
                                <TouchableOpacity
                                    key={country.code}
                                    style={[
                                        styles.countryItem,
                                        selectedCountry.code === country.code && styles.countryItemSelected,
                                    ]}
                                    onPress={() => {
                                        setSelectedCountry(country);
                                        setShowCountryModal(false);
                                    }}
                                >
                                    <Text style={styles.countryFlag}>{country.flag}</Text>
                                    <View style={styles.countryInfo}>
                                        <Text style={styles.countryName}>{country.name}</Text>
                                        <Text style={styles.countryDialCode}>{country.dialCode}</Text>
                                    </View>
                                    {selectedCountry.code === country.code && (
                                        <Ionicons name="checkmark" size={20} color="#1601AA" />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    scroll: { paddingBottom: 40 },

    illustrationContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 20,
        paddingHorizontal: 20,
        height: 150,
    },
    illustration: { width: '100%', height: '100%', maxWidth: 350 },

    titleContainer: { paddingHorizontal: 20, marginBottom: 24 },
    title: { fontSize: 28, fontFamily: FontFamily.inter, color: '#1601AA', marginBottom: 6, lineHeight: 36 },
    titleBold: { fontFamily: FontFamily.interBold, color: '#1601AA' },
    subtitle: { fontSize: 13, fontFamily: FontFamily.lato, color: '#9BA1A6', lineHeight: 18 },

    // Segmented control
    segmentedContainer: { paddingHorizontal: 20, marginBottom: 20 },
    segmentedWrapper: {
        flexDirection: 'row',
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
        padding: 3,
        position: 'relative',
    },
    slidingIndicator: {
        position: 'absolute',
        top: 3,
        bottom: 3,
        left: 3,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    segmentedOption: {
        flex: 1,
        paddingVertical: 11,
        paddingHorizontal: 14,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    segmentedText: { fontSize: 13, fontFamily: FontFamily.lato, color: '#9BA1A6' },
    segmentedTextActive: { color: '#1601AA', fontFamily: FontFamily.latoSemiBold },

    // Input areas
    inputContainer: { paddingHorizontal: 20, marginBottom: 20 },

    // Hint card
    hintCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        backgroundColor: '#EEF2FF',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 10,
        marginBottom: 16,
    },
    hintText: { flex: 1, fontSize: 12, fontFamily: FontFamily.lato, color: '#374151', lineHeight: 18 },
    hintBold: { fontFamily: FontFamily.interSemiBold, color: '#1601AA' },

    // Phone input
    phoneInputWrapper: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        paddingVertical: 14,
        paddingHorizontal: 14,
        alignItems: 'center',
        minHeight: 56,
    },
    countryCodeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
        gap: 5,
        paddingRight: 10,
        borderRightWidth: 1,
        borderRightColor: '#E5E5E5',
        paddingVertical: 4,
    },
    flag: { fontSize: 22 },
    countryCode: { fontSize: 15, color: '#11181C', fontFamily: FontFamily.latoSemiBold },
    phoneInput: { flex: 1, fontSize: 15, fontFamily: FontFamily.lato, color: '#11181C', marginLeft: 8 },

    // Email + password
    emailInput: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        paddingVertical: 16,
        paddingHorizontal: 16,
        fontSize: 16,
        fontFamily: FontFamily.lato,
        color: '#11181C',
        marginBottom: 14,
    },
    passwordRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    passwordInput: {
        flex: 1,
        paddingVertical: 16,
        paddingHorizontal: 16,
        fontSize: 16,
        fontFamily: FontFamily.lato,
        color: '#11181C',
    },
    eyeBtn: { padding: 14 },

    // Login button
    loginButton: {
        backgroundColor: '#1601AA',
        borderRadius: 14,
        paddingVertical: 15,
        marginHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        minHeight: 52,
    },
    loginButtonText: { color: '#FFFFFF', fontSize: 15, fontFamily: FontFamily.interSemiBold, letterSpacing: 0.2 },

    // Divider
    dividerContainer: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginBottom: 20 },
    dividerLine: { flex: 1, height: 1, backgroundColor: '#E5E5E5' },
    dividerText: { marginHorizontal: 14, fontSize: 12, fontFamily: FontFamily.lato, color: '#9BA1A6' },

    // Social
    socialContainer: { paddingHorizontal: 20, marginBottom: 28 },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        paddingVertical: 15,
        minHeight: 52,
    },
    socialLogo: { width: 22, height: 22 },
    socialText: { fontSize: 14, fontFamily: FontFamily.interSemiBold, color: '#374151' },

    // Sign up row
    signupRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    signupText: { fontSize: 14, fontFamily: FontFamily.lato, color: '#6B7280' },
    signupLink: { fontSize: 14, fontFamily: FontFamily.interSemiBold, color: '#1601AA' },

    // Country modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '70%',
        paddingBottom: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    modalTitle: { fontSize: 18, fontFamily: FontFamily.interBold, color: '#11181C' },
    modalCloseBtn: { padding: 4 },
    countryList: { maxHeight: 400 },
    countryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    countryItemSelected: { backgroundColor: '#F9F9F9' },
    countryFlag: { fontSize: 24, marginRight: 12 },
    countryInfo: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    countryName: { fontSize: 15, fontFamily: FontFamily.lato, color: '#11181C' },
    countryDialCode: { fontSize: 15, fontFamily: FontFamily.lato, color: '#9BA1A6' },
});
