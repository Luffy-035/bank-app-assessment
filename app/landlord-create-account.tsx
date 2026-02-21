import { FontFamily } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';


export default function LandlordCreateAccountScreen() {
  const [fullName, setFullName] = useState('');
  const [permanentAddress, setPermanentAddress] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [upiId, setUpiId] = useState('');
  const [pincode, setPincode] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');

  const fetchLiveLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      let reverseGeo = await Location.reverseGeocodeAsync({
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
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not fetch location');
    }
  };

  const handleCreateAccount = () => {
    router.push('/landlord-dashboard');
  };

  const fillDemoDetails = () => {
    setFullName('Jane Smith');
    setPermanentAddress('45, Park Avenue, Koramangala');
    setBankName('State Bank of India');
    setAccountNumber('123456789012');
    setIfscCode('SBIN0001234');
    setUpiId('jane.smith@sbi');
    setPincode('560034');
    setState('Karnataka');
    setDistrict('Bengaluru Urban');
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

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Demo Fill Banner */}
        <TouchableOpacity style={styles.demoBanner} onPress={fillDemoDetails} activeOpacity={0.8}>
          <Ionicons name="flash" size={16} color="#1E40AF" />
          <Text style={styles.demoBannerText}>Use Demo Details to skip filling</Text>
          <Ionicons name="chevron-forward" size={14} color="#1E40AF" />
        </TouchableOpacity>
        {/* Full Name */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputRow}>
            <Ionicons name="person-outline" size={20} color="#9CA3AF" />
            <TextInput
              style={styles.input}
              placeholder="John Doe"
              placeholderTextColor="#9CA3AF"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>
        </View>

        {/* Address Details */}
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

        {/* Bank Details */}
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
              onChangeText={setIfscCode}
              autoCapitalize="characters"
            />
          </View>
          <Text style={styles.helperText}>Bank info will be auto-fetched.</Text>
        </View>

        {/* UPI ID */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>UPI ID</Text>
          <View style={styles.upiRow}>
            <TextInput
              style={styles.upiInput}
              placeholder="yourname@bank"
              placeholderTextColor="#9CA3AF"
              value={upiId}
              onChangeText={setUpiId}
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.verifyBtn}>
              <Text style={styles.verifyBtnText}>Verify</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Signature Upload */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Digital Signature</Text>
          <Text style={styles.legalDisclaimer}>
            You hereby attest that this is your legal signature and authorise its use in rental agreements, notices, and other tenant - landlord documents.
          </Text>
          <TouchableOpacity style={styles.uploadBtn}>
            <Ionicons name="cloud-upload-outline" size={20} color="#1E40AF" />
            <Text style={styles.uploadBtnText}>Upload Signature</Text>
          </TouchableOpacity>
        </View>

        {/* Create Account */}
        <TouchableOpacity style={styles.createBtn} onPress={handleCreateAccount}>
          <Text style={styles.createBtnText}>Create Account</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
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
    alignItems: 'center',
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
  signatureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clearBtnText: {
    fontSize: 14,
    fontFamily: FontFamily.lato,
    color: '#1E40AF',
  },
  signatureBox: {
    height: 140,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    borderRadius: 10,
    overflow: 'hidden',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 14,
    fontSize: 13,
    fontFamily: FontFamily.lato,
    color: '#9CA3AF',
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
  demoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  demoBannerText: {
    flex: 1,
    fontSize: 13,
    fontFamily: FontFamily.latoBold,
    color: '#1E40AF',
  },
});
