import { FontFamily } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TenantCreateAccountScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [roomNumber, setRoomNumber] = useState('203, Sunrise Apartments');
  const [phoneNumber, setPhoneNumber] = useState('+91 98765 43210');
  const [addressLine, setAddressLine] = useState('');
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
        setAddressLine(`${addr.street || ''} ${addr.city || ''} ${addr.name || ''}`.trim());
        setPincode(addr.postalCode || '');
        setState(addr.region || '');
        setDistrict(addr.subregion || addr.city || '');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not fetch location');
    }
  };
  const handleUploadID = () => {
    // Handle ID upload
    console.log('Upload ID pressed');
  };

  const handleCreateAccount = () => {
    router.push('/add-payment-method');
  };

  const fillDemoDetails = () => {
    setFullName('John Doe');
    setEmail('john.doe@example.com');
    setEmergencyContact('+91 98765 00001');
    setRoomCode('ROOM-203');
    setRoomNumber('203, Sunrise Apartments');
    setPhoneNumber('+91 98765 43210');
    setAddressLine('12, MG Road, Indiranagar');
    setPincode('560038');
    setState('Karnataka');
    setDistrict('Bengaluru Urban');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#11181C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Account</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Demo Fill Banner */}
        <TouchableOpacity style={styles.demoBanner} onPress={fillDemoDetails} activeOpacity={0.8}>
          <Ionicons name="flash" size={16} color="#1601AA" />
          <Text style={styles.demoBannerText}>Use Demo Details to skip filling</Text>
          <Ionicons name="chevron-forward" size={14} color="#1601AA" />
        </TouchableOpacity>
        {/* Full Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor="#9BA1A6"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Email <Text style={styles.optionalText}>(Optional)</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email address"
            placeholderTextColor="#9BA1A6"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Government ID */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Government ID <Text style={styles.optionalText}>(Optional)</Text>
          </Text>
          <TouchableOpacity style={styles.uploadContainer} onPress={handleUploadID}>
            <View style={styles.uploadIconContainer}>
              <Ionicons name="cloud-upload-outline" size={28} color="#9BA1A6" />
            </View>
            <Text style={styles.uploadTitle}>Tap to upload your ID</Text>
            <Text style={styles.uploadSubtitle}>PNG, JPG, PDF up to 5MB</Text>
          </TouchableOpacity>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={18} color="#1E3A8A" />
            <Text style={styles.infoText}>
              Uploading an ID helps us ensure community safety. Your data is encrypted and secure.
            </Text>
          </View>
        </View>

        {/* Emergency Contact */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Emergency Contact</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter a phone number"
            placeholderTextColor="#9BA1A6"
            value={emergencyContact}
            onChangeText={setEmergencyContact}
            keyboardType="phone-pad"
          />
        </View>

        {/* Address Details */}
        <View style={styles.inputGroup}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text style={[styles.label, { marginBottom: 0 }]}>Address Details</Text>
            <TouchableOpacity onPress={fetchLiveLocation} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="location" size={16} color="#1E40AF" />
              <Text style={{ fontSize: 13, fontFamily: FontFamily.latoBold, color: '#1E40AF' }}>Use Live Location</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={[styles.input, { minHeight: 44, textAlignVertical: 'top' }]}
            placeholder="Address Line"
            placeholderTextColor="#9CA3AF"
            value={addressLine}
            onChangeText={setAddressLine}
            multiline
            numberOfLines={2}
          />

          <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
            <View style={{ flex: 1 }}>
              <TextInput
                style={styles.input}
                placeholder="Pincode"
                placeholderTextColor="#9CA3AF"
                value={pincode}
                onChangeText={setPincode}
                keyboardType="numeric"
              />
            </View>
            <View style={{ flex: 1 }}>
              <TextInput
                style={styles.input}
                placeholder="District"
                placeholderTextColor="#9CA3AF"
                value={district}
                onChangeText={setDistrict}
              />
            </View>
          </View>

          <View style={{ marginTop: 12 }}>
            <TextInput
              style={styles.input}
              placeholder="State"
              placeholderTextColor="#9CA3AF"
              value={state}
              onChangeText={setState}
            />
          </View>
        </View>

        {/* Room Code */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Room Code</Text>
          <TextInput
            style={styles.input}
            placeholder="Fill in the room code"
            placeholderTextColor="#9BA1A6"
            value={roomCode}
            onChangeText={setRoomCode}
          />
        </View>

        {/* Room Number */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Room Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Room number"
            placeholderTextColor="#9BA1A6"
            value={roomNumber}
            onChangeText={setRoomNumber}
          />
        </View>

        {/* Your Phone Number */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Your Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Phone number"
            placeholderTextColor="#9BA1A6"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
        </View>

        {/* Create Account Button */}
        <TouchableOpacity style={styles.createButton} onPress={handleCreateAccount}>
          <Text style={styles.createButtonText}>Create Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 4,
    borderRadius: 28,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: FontFamily.interBold,
    color: '#11181C',
  },
  headerSpacer: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: FontFamily.lato,
    color: '#11181C',
    marginBottom: 8,
  },
  optionalText: {
    fontSize: 14,
    fontFamily: FontFamily.lato,
    color: '#9BA1A6',
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    fontFamily: FontFamily.lato,
    color: '#11181C',
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  uploadContainer: {
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
  },
  uploadIconContainer: {
    marginBottom: 8,
  },
  uploadTitle: {
    fontSize: 14,
    fontFamily: FontFamily.lato,
    color: '#11181C',
    marginBottom: 4,
  },
  uploadSubtitle: {
    fontSize: 12,
    fontFamily: FontFamily.lato,
    color: '#9BA1A6',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E6F0FF',
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
    alignItems: 'flex-start',
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    fontFamily: FontFamily.lato,
    color: '#11181C',
    lineHeight: 18,
  },
  createButton: {
    backgroundColor: '#1601AA',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    minHeight: 52,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: FontFamily.interSemiBold,
    letterSpacing: 0.2,
  },
  demoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  demoBannerText: {
    flex: 1,
    fontSize: 13,
    fontFamily: FontFamily.latoBold,
    color: '#1601AA',
  },
});

