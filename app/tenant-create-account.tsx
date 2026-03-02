import { FontFamily } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import api from '@/services/api';
import { ENDPOINTS } from '@/constants/api';
import { useAuth } from '@/context/AuthContext';
import type { AuthResponse } from '@/types/user.types';

export default function TenantCreateAccountScreen() {
    const { login } = useAuth();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!name.trim() || !phone.trim() || !password.trim()) {
            Alert.alert('Missing Fields', 'Please fill in all required fields.');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Password Mismatch', 'Passwords do not match.');
            return;
        }
        if (password.length < 6) {
            Alert.alert('Weak Password', 'Password must be at least 6 characters.');
            return;
        }
        setLoading(true);
        try {
            const { data } = await api.post<AuthResponse>(ENDPOINTS.AUTH.REGISTER, {
                name: name.trim(),
                phone: phone.trim(),
                password,
                role: 'tenant',
                address: { pincode: '', state: '', district: '', full: '' },
            });
            await login(data.token, data.user);
            router.replace('/account-success');
        } catch (e: any) {
            Alert.alert('Registration Failed', e?.response?.data?.message ?? 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={22} color="#111827" />
                </TouchableOpacity>

                <Text style={styles.heading}>Tenant Registration</Text>
                <Text style={styles.subheading}>Create your tenant account</Text>

                <View style={styles.infoBanner}>
                    <Ionicons name="information-circle-outline" size={16} color="#1601AA" />
                    <Text style={styles.infoBannerText}>
                        After registration, share your phone number with your landlord to be linked to a property and unit.
                    </Text>
                </View>

                <Text style={styles.label}>Full Name *</Text>
                <TextInput style={styles.input} placeholder="e.g. Anita Sharma" placeholderTextColor="#9CA3AF" value={name} onChangeText={setName} />

                <Text style={styles.label}>Phone Number *</Text>
                <TextInput style={styles.input} placeholder="+91 98765 43210" placeholderTextColor="#9CA3AF" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

                <Text style={styles.label}>Password *</Text>
                <View style={styles.passwordWrap}>
                    <TextInput style={styles.passwordInput} placeholder="Min. 6 characters" placeholderTextColor="#9CA3AF" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                        <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#6B7280" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>Confirm Password *</Text>
                <TextInput style={styles.input} placeholder="Re-enter password" placeholderTextColor="#9CA3AF" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />

                <TouchableOpacity style={[styles.submitBtn, loading && { opacity: 0.7 }]} onPress={handleRegister} disabled={loading}>
                    <Text style={styles.submitBtnText}>{loading ? 'Creating account…' : 'Create Account'}</Text>
                </TouchableOpacity>

                <View style={styles.loginRow}>
                    <Text style={styles.loginText}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => router.replace('/login')}>
                        <Text style={styles.loginLink}>Sign In</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    scroll: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 },
    backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
    heading: { fontSize: 26, fontFamily: FontFamily.interBold, color: '#111827', marginBottom: 6 },
    subheading: { fontSize: 14, fontFamily: FontFamily.lato, color: '#6B7280', marginBottom: 16 },
    infoBanner: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: '#EEF2FF', borderRadius: 10, padding: 12, marginBottom: 16 },
    infoBannerText: { flex: 1, fontSize: 12, fontFamily: FontFamily.lato, color: '#4338CA', lineHeight: 18 },
    label: { fontSize: 13, fontFamily: FontFamily.interSemiBold, color: '#374151', marginBottom: 6, marginTop: 14 },
    input: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, fontFamily: FontFamily.lato, color: '#111827' },
    passwordWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12 },
    passwordInput: { flex: 1, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, fontFamily: FontFamily.lato, color: '#111827' },
    eyeBtn: { padding: 14 },
    submitBtn: { backgroundColor: '#1601AA', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 28 },
    submitBtnText: { fontSize: 16, fontFamily: FontFamily.interBold, color: '#FFFFFF' },
    loginRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 24 },
    loginText: { fontSize: 14, fontFamily: FontFamily.lato, color: '#6B7280' },
    loginLink: { fontSize: 14, fontFamily: FontFamily.interSemiBold, color: '#1601AA' },
});
