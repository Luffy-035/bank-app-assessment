import React from 'react';
import {
    Modal, View, Text, TouchableOpacity, StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { FontFamily } from '@/constants/theme';

export interface PickerOption {
    icon: ReactNode;
    iconBg: string;
    title: string;
    subtitle: string;
    onPress: () => void;
}

interface Props {
    visible: boolean;
    onClose: () => void;
    title?: string;
    options: PickerOption[];
}

export default function ActionPickerModal({ visible, onClose, title = 'What would you like to do?', options }: Props) {
    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <TouchableOpacity style={styles.dismiss} onPress={onClose} />
                <View style={styles.sheet}>
                    <View style={styles.handle} />
                    <Text style={styles.title}>{title}</Text>

                    {options.map((opt, i) => (
                        <React.Fragment key={i}>
                            {i > 0 && <View style={styles.divider} />}
                            <TouchableOpacity
                                style={styles.option}
                                onPress={() => { onClose(); setTimeout(opt.onPress, 250); }}
                                activeOpacity={0.75}
                            >
                                <View style={[styles.iconWrap, { backgroundColor: opt.iconBg }]}>
                                    {opt.icon}
                                </View>
                                <View style={styles.textWrap}>
                                    <Text style={styles.optTitle}>{opt.title}</Text>
                                    <Text style={styles.optSub}>{opt.subtitle}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                            </TouchableOpacity>
                        </React.Fragment>
                    ))}
                    <View style={{ height: 28 }} />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
    dismiss: { flex: 1 },
    sheet: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        paddingTop: 12, paddingHorizontal: 20,
    },
    handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#D1D5DB', alignSelf: 'center', marginBottom: 16 },
    title: { fontSize: 16, fontFamily: FontFamily.interBold, color: '#111827', marginBottom: 20, textAlign: 'center' },
    option: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, gap: 14 },
    iconWrap: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    textWrap: { flex: 1 },
    optTitle: { fontSize: 15, fontFamily: FontFamily.interSemiBold, color: '#111827' },
    optSub: { fontSize: 12, fontFamily: FontFamily.lato, color: '#6B7280', marginTop: 2 },
    divider: { height: 1, backgroundColor: '#F3F4F6' },
});
