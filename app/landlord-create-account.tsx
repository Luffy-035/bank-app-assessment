import { FontFamily } from '@/constants/theme';
import { ENDPOINTS } from '@/constants/api';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
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
    ActivityIndicator,
} from 'react-native';
import api from '@/services/api';
import type { AuthResponse } from '@/types/user.types';

export default function LandlordCreateAccountScreen() {
    const { login } = useAuth();

    // Account credentials
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Profile
    const [fullName, setFullName] = useState('');

    // Address
    const [permanentAddress, setPermanentAddress] = useState('');
    const [pincode, setPincode] = useState('');
    const [state, setState] = useState('');
    const [district, setDistrict] = useState('');

    // Bank
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [ifscCode, setIfscCode] = useState('');

    // Signature
    const [signatureUri, setSignatureUri] = useState('');
    const [signatureFileName, setSignatureFileName] = useState('');

    const [loading, setLoading] = useState(false);

    // ── Live Location ────────────────────────────────────────────────────
    const fetchLiveLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Permission to access location was denied');
                return;
            }
            const location = await Location.getCurrentPositionAsync({});
            const reverseGeo = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
            if (reverseGeo && reverseGeo.length > 0) {
                const addr = reverseGeo[0];
                setPermanentAddress(`${addr.street || ''} ${addr.city || ''} ${addr.name || ''}`.trim());
                setPincode(addr.postalCode || '');
                setState(addr.region || '');
                setDistrict(addr.subregion || addr.city || '');
            }
        } catch {
            Alert.alert('Error', 'Could not fetch location. Please enter address manually.');
        }
    };

    // ── Signature Pick ────────────────────────────────────────────────────
    const handleSignaturePick = async () => {
        const permResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permResult.granted) {
            Alert.alert('Permission Denied', 'Photo library access is needed to upload your signature.');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 2] as [number, number],
            quality: 0.85,
        });
        if (result.canceled || !result.assets.length) return;
        const asset = result.assets[0];
        setSignatureUri(asset.uri);
        setSignatureFileName(asset.uri.split('/').pop() ?? 'signature.jpg');
    };

    // ── Submit ────────────────────────────────────────────────────────────
    const handleCreateAccount = async () => {
        if (!fullName.trim()) {
            Alert.alert('Missing Field', 'Please enter your full name.');
            return;
        }
        if (!email.trim() || !phone.trim() || !password.trim()) {
            Alert.alert('Missing Fields', 'Email, phone number, and password are required.');
            return;
        }
        if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
            Alert.alert('Invalid Email', 'Please enter a valid email address.');
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
            const payload: Record<string, any> = {
                name: fullName.trim(),
                email: email.trim().toLowerCase(),
                phone: phone.trim(),
                password,
                role: 'landlord',
                address: {
                    full: permanentAddress.trim(),
                    pincode: pincode.trim(),
                    state: state.trim(),
                    district: district.trim(),
                },
                bankDetails: {
                    bankName: bankName.trim(),
                    accountNumber: accountNumber.trim(),
                    ifsc: ifscCode.trim(),
                },
            };

            const { data } = await api.post<AuthResponse>(ENDPOINTS.AUTH.REGISTER, payload);
            await login(data.token, data.user);

            // Upload signature after login (non-fatal if it fails)
            if (signatureUri) {
                try {
                    const sigForm = new FormData();
                    sigForm.append('signature', {
                        uri: signatureUri,
                        name: signatureFileName || 'signature.jpg',
                        type: 'image/jpeg',
                    } as any);
                    await api.post(ENDPOINTS.AUTH.UPLOAD_SIGNATURE, sigForm, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    });
                } catch {
                    // Signature upload failed — account still created successfully
                }
            }

            router.replace('/account-success');
        } catch (e: any) {
            Alert.alert('Registration Failed', e?.response?.data?.message ?? 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Create Account</Text>
                <View style={{ width: 24 }} />
            </View>

            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* ── FULL NAME ─────────────────────────────────────────── */}
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Full Name</Text>
                        <View style={styles.inputRow}>
                            <Ionicons name="person-outline" size={20} color="#9CA3AF" />
                            <TextInput
                                style={styles.input}
                                placeholder="Lakshya Agarwal"
                                placeholderTextColor="#9CA3AF"
                                value={fullName}
                                onChangeText={setFullName}
                            />
                        </View>
                    </View>

                    {/* ── ACCOUNT CREDENTIALS ────────────────────────────────── */}
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Email Address</Text>
                        <View style={styles.inputRow}>
                            <Ionicons name="mail-outline" size={20} color="#9CA3AF" />
                            <TextInput
                                style={styles.input}
                                placeholder="your@email.com"
                                placeholderTextColor="#9CA3AF"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Phone Number</Text>
                        <View style={styles.inputRow}>
                            <Ionicons name="call-outline" size={20} color="#9CA3AF" />
                            <TextInput
                                style={styles.input}
                                placeholder="+91 98765 43210"
                                placeholderTextColor="#9CA3AF"
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>

                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Password</Text>
                        <View style={styles.inputRow}>
                            <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
                            <TextInput
                                style={styles.input}
                                placeholder="Min. 6 characters"
                                placeholderTextColor="#9CA3AF"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(v => !v)}>
                                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#9CA3AF" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Confirm Password</Text>
                        <View style={styles.inputRow}>
                            <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
                            <TextInput
                                style={styles.input}
                                placeholder="Re-enter password"
                                placeholderTextColor="#9CA3AF"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showConfirmPassword}
                            />
                            <TouchableOpacity onPress={() => setShowConfirmPassword(v => !v)}>
                                <Ionicons name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#9CA3AF" />
                            </TouchableOpacity>
                        </View>
                    </View>



                    {/* ── ADDRESS DETAILS ────────────────────────────────────── */}
                    <View style={styles.fieldGroup}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <Text style={[styles.label, { marginBottom: 0 }]}>Address Details</Text>
                            <TouchableOpacity onPress={fetchLiveLocation} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                <Ionicons name="location" size={16} color="#1E40AF" />
                                <Text style={{ fontSize: 13, fontFamily: FontFamily.latoBold, color: '#1E40AF' }}>Use Live Location</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.inputRow, styles.inputRowMultiline]}>
                            <Ionicons name="location-outline" size={20} color="#9CA3AF" />
                            <TextInput
                                style={[styles.input, styles.inputMultiline]}
                                placeholder="Address Line"
                                placeholderTextColor="#9CA3AF"
                                value={permanentAddress}
                                onChangeText={setPermanentAddress}
                                multiline
                                numberOfLines={2}
                                textAlignVertical="top"
                            />
                        </View>

                        <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
                            <View style={[styles.inputRow, { flex: 1 }]}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Pincode"
                                    placeholderTextColor="#9CA3AF"
                                    value={pincode}
                                    onChangeText={setPincode}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={[styles.inputRow, { flex: 1 }]}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="District"
                                    placeholderTextColor="#9CA3AF"
                                    value={district}
                                    onChangeText={setDistrict}
                                />
                            </View>
                        </View>

                        <View style={[styles.inputRow, { marginTop: 12 }]}>
                            <TextInput
                                style={styles.input}
                                placeholder="State"
                                placeholderTextColor="#9CA3AF"
                                value={state}
                                onChangeText={setState}
                            />
                        </View>
                    </View>

                    {/* ── BANK DETAILS ───────────────────────────────────────── */}
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Bank Details</Text>
                        <View style={styles.inputRow}>
                            <Ionicons name="business-outline" size={20} color="#9CA3AF" />
                            <TextInput
                                style={styles.input}
                                placeholder="Bank Name"
                                placeholderTextColor="#9CA3AF"
                                value={bankName}
                                onChangeText={setBankName}
                            />
                        </View>
                        <View style={[styles.inputRow, { marginTop: 12 }]}>
                            <Text style={styles.hashIcon}>#</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Account Number"
                                placeholderTextColor="#9CA3AF"
                                value={accountNumber}
                                onChangeText={setAccountNumber}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={[styles.inputRow, { marginTop: 12 }]}>
                            <Ionicons name="business-outline" size={20} color="#9CA3AF" />
                            <TextInput
                                style={styles.input}
                                placeholder="IFSC Code"
                                placeholderTextColor="#9CA3AF"
                                value={ifscCode}
                                onChangeText={(t) => setIfscCode(t.toUpperCase())}
                                autoCapitalize="characters"
                            />
                        </View>
                        <Text style={styles.helperText}>Your bank details are encrypted and stored securely.</Text>
                    </View>

                    {/* ── UPI ID ─────────────────────────────────────────────── */}
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>UPI ID</Text>
                        <View style={styles.upiRow}>
                            <TextInput
                                style={styles.upiInput}
                                placeholder="yourname@bank"
                                placeholderTextColor="#9CA3AF"
                                autoCapitalize="none"
                            />
                            <TouchableOpacity
                                style={styles.verifyBtn}
                                onPress={() =>
                                    Alert.alert('Coming Soon 🚀', 'UPI verification is not yet available.', [{ text: 'OK' }])
                                }
                            >
                                <Text style={styles.verifyBtnText}>Verify</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* ── DIGITAL SIGNATURE ──────────────────────────────────── */}
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Digital Signature</Text>
                        <Text style={styles.legalDisclaimer}>
                            You hereby attest that this is your legal signature and authorise its use in rental agreements, notices, and other tenant - landlord documents.
                        </Text>
                        <TouchableOpacity style={styles.uploadBtn} onPress={handleSignaturePick}>
                            <Ionicons
                                name={signatureUri ? 'checkmark-circle' : 'cloud-upload-outline'}
                                size={20}
                                color={signatureUri ? '#16A34A' : '#1E40AF'}
                            />
                            <Text style={[styles.uploadBtnText, signatureUri ? { color: '#16A34A' } : null]}>
                                {signatureUri ? `Selected: ${signatureFileName}` : 'Upload Signature'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* ── CREATE ACCOUNT ─────────────────────────────────────── */}
                    <TouchableOpacity
                        style={[styles.createBtn, loading && { opacity: 0.7 }]}
                        onPress={handleCreateAccount}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.createBtnText}>Create Account</Text>
                        )}
                    </TouchableOpacity>

                    <View style={{ height: 40 }} />
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 52,
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: FontFamily.interBold,
        color: '#111827',
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
    },
    fieldGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontFamily: FontFamily.lato,
        color: '#111827',
        marginBottom: 8,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 14,
        gap: 10,
    },
    inputRowMultiline: {
        alignItems: 'flex-start',
        paddingVertical: 14,
    },
    input: {
        flex: 1,
        fontSize: 15,
        fontFamily: FontFamily.lato,
        color: '#111827',
    },
    inputMultiline: {
        minHeight: 44,
        textAlignVertical: 'top',
    },
    hashIcon: {
        fontSize: 18,
        color: '#9CA3AF',
    },
    helperText: {
        fontSize: 12,
        fontFamily: FontFamily.lato,
        color: '#9CA3AF',
        marginTop: 8,
    },
    upiRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 10,
        paddingLeft: 14,
        paddingRight: 6,
        paddingVertical: 6,
    },
    upiInput: {
        flex: 1,
        fontSize: 15,
        fontFamily: FontFamily.lato,
        color: '#111827',
        paddingVertical: 8,
    },
    verifyBtn: {
        backgroundColor: '#1E40AF',
        borderRadius: 8,
        paddingHorizontal: 18,
        paddingVertical: 10,
    },
    verifyBtnText: {
        fontSize: 14,
        fontFamily: FontFamily.interSemiBold,
        color: '#FFFFFF',
    },
    uploadBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: '#1E40AF',
        borderRadius: 12,
        paddingVertical: 14,
        gap: 8,
        marginBottom: 14,
    },
    uploadBtnText: {
        fontSize: 15,
        fontFamily: FontFamily.interSemiBold,
        color: '#1E40AF',
    },
    createBtn: {
        backgroundColor: '#1E40AF',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },
    createBtnText: {
        fontSize: 15,
        fontFamily: FontFamily.interSemiBold,
        color: '#FFFFFF',
    },
    legalDisclaimer: {
        fontSize: 11,
        fontFamily: FontFamily.lato,
        color: '#6B7280',
        marginBottom: 8,
        lineHeight: 16,
    },
});
