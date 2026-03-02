import { FontFamily } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useMaintenance } from '@/hooks/useMaintenance';
import type { MaintenanceCategory } from '@/types/maintenance.types';

export default function RequestMaintenanceScreen() {
  const { user } = useAuth();
  const { raiseRequest } = useMaintenance();
  const [category, setCategory] = useState<MaintenanceCategory>('plumbing');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const CATEGORIES: { label: string; value: MaintenanceCategory; icon: string }[] = [
    { label: 'Plumbing', value: 'plumbing', icon: 'water-outline' },
    { label: 'Electrical', value: 'electrical', icon: 'flash-outline' },
    { label: 'Appliance', value: 'appliance', icon: 'settings-outline' },
    { label: 'Structural', value: 'structural', icon: 'home-outline' },
    { label: 'Other', value: 'other', icon: 'ellipsis-horizontal-outline' },
  ];

  const handleSubmit = async () => {
    if (!title.trim()) { Alert.alert('Error', 'Please enter a title for the issue.'); return; }
    if (!description.trim()) { Alert.alert('Error', 'Please describe the issue.'); return; }
    setSubmitting(true);
    try {
      await raiseRequest({ title: title.trim(), description: description.trim(), category });
      Alert.alert('Submitted', 'Your maintenance request has been submitted successfully.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert('Error', 'Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Request Maintenance</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Info card */}
        <View style={styles.infoCard}>
          <Ionicons name="person-circle-outline" size={20} color="#1601AA" />
          <View style={{ flex: 1 }}>
            <Text style={styles.infoTitle}>Submitting as</Text>
            <Text style={styles.infoSub}>{user?.name ?? 'Tenant'}</Text>
          </View>
        </View>

        {/* Category */}
        <View style={styles.section}>
          <Text style={styles.label}>Issue Category *</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.value}
                style={[styles.categoryChip, category === cat.value && styles.categoryChipActive]}
                onPress={() => setCategory(cat.value)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={cat.icon as any}
                  size={16}
                  color={category === cat.value ? '#1601AA' : '#6B7280'}
                />
                <Text style={[styles.categoryLabel, category === cat.value && styles.categoryLabelActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.label}>Issue Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Leaking tap in bathroom"
            placeholderTextColor="#9CA3AF"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
          <Text style={styles.charCount}>{title.length}/100</Text>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>Describe the Issue *</Text>
          <TextInput
            style={styles.textarea}
            placeholder="Provide details: location in the unit, when it started, severity..."
            placeholderTextColor="#9CA3AF"
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
            maxLength={500}
          />
          <Text style={styles.charCount}>{description.length}/500</Text>
        </View>

        {/* Attachments placeholder */}
        <View style={styles.section}>
          <Text style={styles.label}>Attachments (coming soon)</Text>
          <View style={styles.attachRow}>
            <View style={styles.attachBox}>
              <Ionicons name="camera-outline" size={22} color="#9CA3AF" />
              <Text style={styles.attachLabel}>Photo</Text>
            </View>
            <View style={styles.attachBox}>
              <Ionicons name="videocam-outline" size={22} color="#9CA3AF" />
              <Text style={styles.attachLabel}>Video</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.addBtn, submitting && { opacity: 0.6 }]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.addBtnText}>Submit Request</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 54,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 17, fontFamily: FontFamily.interBold, color: '#1F2937' },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F0F4FF',
    margin: 16,
    borderRadius: 12,
    padding: 14,
  },
  infoTitle: { fontSize: 11, fontFamily: FontFamily.lato, color: '#6B7280', marginBottom: 2 },
  infoSub: { fontSize: 14, fontFamily: FontFamily.interSemiBold, color: '#111827' },
  section: { paddingHorizontal: 20, marginBottom: 20 },
  label: { fontSize: 13, fontFamily: FontFamily.interSemiBold, color: '#374151', marginBottom: 10 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  categoryChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderWidth: 1, borderColor: '#E5E7EB',
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  categoryChipActive: { borderColor: '#1601AA', backgroundColor: '#EEF2FF' },
  categoryLabel: { fontSize: 13, fontFamily: FontFamily.lato, color: '#6B7280' },
  categoryLabelActive: { color: '#1601AA', fontFamily: FontFamily.interSemiBold },
  input: {
    borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 14,
    fontSize: 14, fontFamily: FontFamily.lato, color: '#1F2937',
  },
  textarea: {
    borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10,
    paddingHorizontal: 14, paddingTop: 14, paddingBottom: 14,
    fontSize: 14, fontFamily: FontFamily.lato, color: '#1F2937',
    height: 130,
  },
  charCount: { fontSize: 11, fontFamily: FontFamily.lato, color: '#9CA3AF', marginTop: 4, textAlign: 'right' },
  attachRow: { flexDirection: 'row', gap: 12 },
  attachBox: {
    flex: 1, borderWidth: 1.5, borderColor: '#E5E7EB',
    borderStyle: 'dashed', borderRadius: 10,
    paddingVertical: 20, alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  attachLabel: { fontSize: 12, fontFamily: FontFamily.interSemiBold, color: '#9CA3AF' },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 34,
    borderTopWidth: 1, borderTopColor: '#F3F4F6',
  },
  addBtn: {
    backgroundColor: '#1601AA', borderRadius: 12,
    paddingVertical: 16, alignItems: 'center', justifyContent: 'center', minHeight: 52,
  },
  addBtnText: { fontSize: 15, fontFamily: FontFamily.interSemiBold, color: '#FFFFFF' },
});
