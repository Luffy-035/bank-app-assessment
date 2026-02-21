import { FontFamily } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type PaymentMethod = 'paypal' | 'mastercard' | 'visa';

export default function CardDetailsScreen() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('mastercard');
  const [cardholderName, setCardholderName] = useState('Jonathan Anderson');
  const [cardNumber, setCardNumber] = useState('1222 3443 9881 1222');
  const [expiryDate, setExpiryDate] = useState('11/05/2023');
  const [cvv, setCvv] = useState('');

  const handleNext = () => {
    router.push('/account-success');
  };

  const handleSkip = () => {
    console.log('Skip pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#11181C" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleLight}>Add your</Text>
          <Text style={styles.titleBold}>payment method</Text>
          <Text style={styles.subtitle}>you can change this anytime in the settings</Text>
        </View>

        {/* Credit Card */}
        <View style={styles.cardContainer}>
          <LinearGradient
            colors={['#4285F4', '#281499']}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.card}
          >
            {/* Card Header */}
            <View style={styles.cardHeader}>
              {/* Chip */}
              <View style={styles.chip}>
                <View style={styles.chipInner}>
                  <View style={styles.chipRow}>
                    <View style={styles.chipCell} />
                    <View style={styles.chipCell} />
                  </View>
                  <View style={styles.chipRow}>
                    <View style={styles.chipCell} />
                    <View style={styles.chipCell} />
                  </View>
                  <View style={styles.chipRow}>
                    <View style={styles.chipCell} />
                    <View style={styles.chipCell} />
                  </View>
                </View>
              </View>

              {/* Payment Icons */}
              <View style={styles.cardIcons}>
                <View style={styles.nfcIcon}>
                  <Ionicons name="headset-outline" size={18} color="#FFFFFF" />
                </View>
                <View style={styles.contactlessIcon}>
                  <Ionicons name="wifi-outline" size={18} color="#FFFFFF" style={{ transform: [{ rotate: '90deg' }] }} />
                </View>
                <View style={styles.applePayBadge}>
                  <Text style={styles.appleIcon}></Text>
                  <Text style={styles.payText}>Pay</Text>
                </View>
                <View style={styles.gPayBadge}>
                  <Text style={styles.gPayG}>G</Text>
                  <Text style={styles.gPayPay}>Pay</Text>
                </View>
              </View>
            </View>

            {/* Card Number */}
            <View style={styles.cardNumberContainer}>
              <Text style={styles.cardNumberText}>****  ****  ****  1234</Text>
            </View>

            {/* Card Footer */}
            <View style={styles.cardFooter}>
              <View style={styles.cardDetails}>
                <View style={styles.validThruRow}>
                  <Text style={styles.validLabel}>VALID{'\n'}THRU</Text>
                  <Text style={styles.validDate}>01/22</Text>
                </View>
                <Text style={styles.cardholderNameText}>Abuzer Firdousi</Text>
              </View>

              <View style={styles.mastercardLogo}>
                <View style={styles.mastercardCircle1} />
                <View style={styles.mastercardCircle2} />
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Payment Method Options */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.paymentMethodsScroll}
          contentContainerStyle={styles.paymentMethodsContainer}
        >
          <TouchableOpacity
            style={[styles.paymentMethodButton, selectedMethod === 'paypal' && styles.paymentMethodSelected]}
            onPress={() => setSelectedMethod('paypal')}
          >
            <Image
              source={require('@/assets/images/paypal.png')}
              style={styles.paymentLogo}
              contentFit="contain"
            />
            <Text style={[styles.paymentMethodText, selectedMethod === 'paypal' && styles.paymentMethodTextSelected]}>Paypal</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.paymentMethodButton, selectedMethod === 'mastercard' && styles.paymentMethodSelected]}
            onPress={() => setSelectedMethod('mastercard')}
          >
            <Image
              source={require('@/assets/images/mastercard.png')}
              style={styles.paymentLogo}
              contentFit="contain"
            />
            <Text style={[styles.paymentMethodText, selectedMethod === 'mastercard' && styles.paymentMethodTextSelected]}>Mastercard</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.paymentMethodButton, selectedMethod === 'visa' && styles.paymentMethodSelected]}
            onPress={() => setSelectedMethod('visa')}
          >
            <Image
              source={require('@/assets/images/Visa.png')}
              style={styles.paymentLogo}
              contentFit="contain"
            />
            <Text style={[styles.paymentMethodText, selectedMethod === 'visa' && styles.paymentMethodTextSelected]}>Visa</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Card Details Form */}
        <View style={styles.formContainer}>
          {/* Cardholder Name */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Cardholder Name"
              placeholderTextColor="#9BA1A6"
              value={cardholderName}
              onChangeText={setCardholderName}
            />
            <Ionicons name="person-outline" size={20} color="#9BA1A6" style={styles.inputIcon} />
          </View>

          {/* Card Number */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Card Number"
              placeholderTextColor="#9BA1A6"
              value={cardNumber}
              onChangeText={setCardNumber}
              keyboardType="numeric"
            />
            <Ionicons name="card-outline" size={20} color="#1601AA" style={styles.inputIcon} />
          </View>

          {/* Expiry Date and CVV */}
          <View style={styles.rowInputs}>
            <View style={[styles.inputContainer, styles.halfInput]}>
              <TextInput
                style={styles.input}
                placeholder="MM/YY"
                placeholderTextColor="#9BA1A6"
                value={expiryDate}
                onChangeText={setExpiryDate}
              />
              <Ionicons name="calendar-outline" size={20} color="#1601AA" style={styles.inputIcon} />
            </View>

            <View style={[styles.inputContainer, styles.halfInput]}>
              <View style={styles.cvvInputWrapper}>
                <Ionicons name="card-outline" size={20} color="#9BA1A6" style={styles.cvvIcon} />
                <TextInput
                  style={styles.cvvInput}
                  placeholder="CVV"
                  placeholderTextColor="#9BA1A6"
                  value={cvv}
                  onChangeText={setCvv}
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Next Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
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
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  skipButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 13,
    fontFamily: FontFamily.lato,
    color: '#6B7280',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  titleContainer: {
    marginBottom: 20,
  },
  titleLight: {
    fontSize: 28,
    fontFamily: FontFamily.inter,
    color: '#1F3A5F',
    lineHeight: 34,
  },
  titleBold: {
    fontSize: 28,
    fontFamily: FontFamily.interBold,
    color: '#1F3A5F',
    lineHeight: 34,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: FontFamily.lato,
    color: '#9CA3AF',
    lineHeight: 16,
  },
  cardContainer: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#281499',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    paddingBottom: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  chip: {
    width: 50,
    height: 38,
    backgroundColor: '#D4A017',
    borderRadius: 6,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
  },
  chipRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  chipCell: {
    flex: 1,
    margin: 1,
    backgroundColor: '#C4941A',
    borderRadius: 1,
  },
  cardIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  nfcIcon: {
    opacity: 0.9,
  },
  contactlessIcon: {
    opacity: 0.9,
  },
  contactlessText: {
    fontSize: 14,
    color: '#FFFFFF',
    letterSpacing: -2,
  },
  applePayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    gap: 2,
  },
  appleIcon: {
    fontSize: 12,
    color: '#000000',
  },
  payText: {
    fontSize: 10,
    color: '#000000',
  },
  gPayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    gap: 1,
  },
  gPayG: {
    fontSize: 11,
    color: '#4285F4',
  },
  gPayPay: {
    fontSize: 10,
    color: '#5F6368',
  },
  cardNumberContainer: {
    marginBottom: 24,
  },
  cardNumberText: {
    fontSize: 24,
    color: '#FFFFFF',
    letterSpacing: 1,
    fontFamily: 'monospace',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardDetails: {
    flex: 1,
  },
  validThruRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  validLabel: {
    fontSize: 6,
    color: '#FFFFFF',
    opacity: 0.7,
    lineHeight: 7,
  },
  validDate: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'monospace',
  },
  cardholderNameText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  mastercardLogo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mastercardCircle1: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  mastercardCircle2: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginLeft: -14,
  },
  paymentMethodsScroll: {
    flexGrow: 0,
    marginBottom: 20,
  },
  paymentMethodsContainer: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 4,
  },
  paymentMethodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  paymentMethodSelected: {
    borderColor: '#1601AA',
    backgroundColor: '#1601AA',
  },
  paymentLogo: {
    width: 22,
    height: 22,
  },
  paymentMethodText: {
    fontSize: 12,
    fontFamily: FontFamily.lato,
    color: '#374151',
  },
  paymentMethodTextSelected: {
    color: '#FFFFFF',
  },
  formContainer: {
    gap: 14,
  },
  inputContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    minHeight: 56,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: FontFamily.lato,
    color: '#11181C',
    paddingVertical: 16,
  },
  inputIcon: {
    marginLeft: 8,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  cvvInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cvvIcon: {
    marginRight: 8,
  },
  cvvInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: FontFamily.lato,
    color: '#11181C',
    paddingVertical: 16,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
  },
  nextButton: {
    backgroundColor: '#1601AA',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: FontFamily.interSemiBold,
    letterSpacing: 0.3,
  },
});

