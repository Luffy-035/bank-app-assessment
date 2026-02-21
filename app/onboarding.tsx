import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontFamily } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Dimensions,
    FlatList,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewToken,
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
    interpolate,
    Extrapolate,
    SharedValue,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

/* ─────────────────────────────────────────────────────────────
   Slide data – matches the four reference screenshots closely
───────────────────────────────────────────────────────────── */
const SLIDES = [
    {
        id: '1',
        type: 'logo', // white background logo slide (slide 1 in reference)
        headline: 'the all in one',
        headlineAccent: 'property management',
        headlineEnd: 'software',
        underlineWord: 'the all in one',
        badge: '🔒  100% safe & secure',
        bg: 'light' as const,
    },
    {
        id: '2',
        type: 'feature',
        label: 'DESKTOP MODE',
        headline: 'bigger screen',
        headlineAccent: 'better decisions',
        underlineWord: 'better decisions',
        bg: 'dark' as const,
        mockScreen: 'dashboard',
    },
    {
        id: '3',
        type: 'feature',
        headline: 'the all in one',
        headlineAccent: 'property management',
        headlineEnd: 'software',
        underlineWord: 'the all in one',
        subtext: 'Manage tenants, properties, payments, and documents - all from one dashboard.',
        bg: 'dark' as const,
        mockScreen: 'analytics',
    },
    {
        id: '4',
        type: 'feature',
        label: 'INVENTORY',
        headline: 'every unit tracked',
        headlineAccent: '& managed',
        underlineWord: '& managed',
        bg: 'dark' as const,
        mockScreen: 'inventory',
    },
];

/* ─────────────────────────────────────────────────────────────
   Mock phone screen components
───────────────────────────────────────────────────────────── */
function DashboardMock() {
    return (
        <View style={mock.screen}>
            <View style={mock.topBar}>
                <View style={mock.topBarDot} />
                <View style={[mock.topBarDot, { backgroundColor: '#4DA2FF', width: 40 }]} />
            </View>
            {/* Stats row */}
            <View style={mock.statsRow}>
                {['1,200', '800', '400'].map((v, i) => (
                    <View key={i} style={mock.statChip}>
                        <Text style={mock.statVal}>{v}</Text>
                        <Text style={mock.statLbl}>{['Total', 'Paid', 'Due'][i]}</Text>
                    </View>
                ))}
            </View>
            {/* Bar chart */}
            <View style={mock.chartArea}>
                {[50, 70, 40, 85, 60, 75, 55].map((h, i) => (
                    <View key={i} style={[mock.bar, { height: h * 0.55, backgroundColor: i === 3 ? '#F5C842' : i % 2 === 0 ? '#4DA2FF' : '#2EB67D' }]} />
                ))}
            </View>
            {/* Row list */}
            {[['Rahul Kumar', 'Paid'], ['Sneha Verma', 'Pending'], ['Amit Shah', 'Due']].map(([name, status], i) => (
                <View key={i} style={mock.listRow}>
                    <View style={mock.avatar}><Text style={mock.avatarText}>{name[0]}</Text></View>
                    <Text style={mock.listName}>{name}</Text>
                    <View style={[mock.badge, { backgroundColor: status === 'Paid' ? '#D1FAE5' : status === 'Pending' ? '#FEF3C7' : '#FEE2E2' }]}>
                        <Text style={[mock.badgeText, { color: status === 'Paid' ? '#065F46' : status === 'Pending' ? '#92400E' : '#991B1B' }]}>{status}</Text>
                    </View>
                </View>
            ))}
        </View>
    );
}

function AnalyticsMock() {
    return (
        <View style={mock.screen}>
            <View style={mock.topBar}><View style={mock.topBarDot} /><View style={[mock.topBarDot, { backgroundColor: '#A78BFA', width: 36 }]} /></View>
            <Text style={mock.mockTitle}>ABC Property Manager</Text>
            {/* Horizontal bar-like collection */}
            <View style={mock.collectionRow}>
                <View style={[mock.collBar, { width: '70%', backgroundColor: '#4DA2FF' }]} />
                <Text style={mock.collLabel}>₹ 1,20,000</Text>
            </View>
            <View style={mock.collectionRow}>
                <View style={[mock.collBar, { width: '40%', backgroundColor: '#F59E0B' }]} />
                <Text style={mock.collLabel}>₹ 68,000</Text>
            </View>
            <View style={mock.collectionRow}>
                <View style={[mock.collBar, { width: '20%', backgroundColor: '#EF4444' }]} />
                <Text style={mock.collLabel}>₹ 32,000</Text>
            </View>
            {/* Pie placeholder */}
            <View style={mock.piePlaceholder}>
                <View style={[mock.pieSlice, { backgroundColor: '#4DA2FF' }]} />
                <View style={mock.pieLegend}>
                    {[['Received', '#4DA2FF'], ['Pending', '#F59E0B'], ['Due', '#EF4444']].map(([l, c]) => (
                        <View key={l} style={mock.pieLegendRow}>
                            <View style={[mock.pieDot, { backgroundColor: c }]} />
                            <Text style={mock.pieLegendText}>{l}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
}

function InventoryMock() {
    const units = ['101', '102', '103', '201', '202', '203', '301', '302', '303'];
    const colors = ['#D1FAE5', '#FEE2E2', '#D1FAE5', '#FEF3C7', '#D1FAE5', '#FEE2E2', '#D1FAE5', '#D1FAE5', '#FEF3C7'];
    return (
        <View style={mock.screen}>
            <View style={mock.topBar}><View style={mock.topBarDot} /><View style={[mock.topBarDot, { backgroundColor: '#34D399', width: 32 }]} /></View>
            <Text style={mock.mockTitle}>ABC Property Manager</Text>
            <View style={mock.gridWrap}>
                {units.map((u, i) => (
                    <View key={u} style={[mock.unitCell, { backgroundColor: colors[i] }]}>
                        <Text style={mock.unitText}>{u}</Text>
                    </View>
                ))}
            </View>
            {/* Bottom legend */}
            {[['Occupied', '#D1FAE5'], ['Vacant', '#FEE2E2'], ['Maintenance', '#FEF3C7']].map(([l, c]) => (
                <View key={l} style={mock.pieLegendRow}>
                    <View style={[mock.pieDot, { backgroundColor: c, borderWidth: 1, borderColor: '#ccc' }]} />
                    <Text style={mock.pieLegendText}>{l}</Text>
                </View>
            ))}
        </View>
    );
}

const MOCK_COMPONENTS: Record<string, React.ReactNode> = {
    dashboard: <DashboardMock />,
    analytics: <AnalyticsMock />,
    inventory: <InventoryMock />,
};

/* ─────────────────────────────────────────────────────────────
   Phone Mockup Shell
───────────────────────────────────────────────────────────── */
function PhoneMockup({ screenKey }: { screenKey: string }) {
    return (
        <View style={phone.frame}>
            <View style={phone.notch} />
            <View style={phone.screen}>
                {MOCK_COMPONENTS[screenKey]}
            </View>
            <View style={phone.homeBar} />
        </View>
    );
}

/* ─────────────────────────────────────────────────────────────
   Underline text component
───────────────────────────────────────────────────────────── */
function UnderlinedText({ text, color = '#F5C842', textStyle }: { text: string; color?: string; textStyle?: object }) {
    return (
        <View style={{ position: 'relative' }}>
            <Text style={textStyle}>{text}</Text>
            <View style={{ height: 3, backgroundColor: color, borderRadius: 2, marginTop: 3, width: '85%' }} />
        </View>
    );
}

/* ─────────────────────────────────────────────────────────────
   Individual Slide
───────────────────────────────────────────────────────────── */
function Slide({ item, index, scrollX }: { item: typeof SLIDES[0]; index: number; scrollX: SharedValue<number> }) {
    const animStyle = useAnimatedStyle(() => {
        const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
        const opacity = interpolate(scrollX.value, inputRange, [0.4, 1, 0.4], Extrapolate.CLAMP);
        const translateX = interpolate(scrollX.value, inputRange, [30, 0, -30], Extrapolate.CLAMP);
        return { opacity, transform: [{ translateX }] };
    });

    if (item.bg === 'light') {
        // Slide 1 — white background, logo, buildings image at bottom
        return (
            <View style={[slides.slide, { width, backgroundColor: '#F8F9FF' }]}>
                <Animated.View style={[slides.lightContent, animStyle]}>
                    <View style={slides.logoBox}>
                        <Text style={slides.logoText}>P</Text>
                    </View>
                    <View style={{ marginTop: 24, alignItems: 'center' }}>
                        <Text style={slides.lightTagline}>the all in one</Text>
                        <UnderlinedText text="property management" color="#F5A623" textStyle={slides.lightTaglineBold} />
                        <Text style={slides.lightTagline}>software</Text>
                    </View>
                </Animated.View>
                {/* Building image placeholder — bottom */}
                <View style={slides.buildingArea}>
                    <LinearGradient colors={['transparent', '#E8EBF5']} style={StyleSheet.absoluteFill} />
                    <View style={slides.buildingRow}>
                        {[120, 160, 140, 180, 150, 130].map((h, i) => (
                            <View key={i} style={[slides.buildingBlock, { height: h, backgroundColor: i % 2 === 0 ? '#C7A882' : '#D4B896' }]}>
                                {[...Array(Math.floor(h / 20))].map((_, j) => (
                                    <View key={j} style={slides.buildingWindow} />
                                ))}
                            </View>
                        ))}
                    </View>
                </View>
                <View style={slides.lightBadge}>
                    <Text style={slides.lightBadgeText}>🔒  100% safe & secure</Text>
                </View>
            </View>
        );
    }

    // Dark slides (2, 3, 4)
    return (
        <LinearGradient colors={['#0B0D2A', '#12164A', '#0B0D2A']} style={[slides.slide, { width }]} start={{ x: 0.2, y: 0 }} end={{ x: 1, y: 1 }}>
            <Animated.View style={[slides.darkContent, animStyle]}>
                {item.label && <Text style={slides.darkLabel}>{item.label}</Text>}

                {/* Main headline text block */}
                <View style={{ marginBottom: 8 }}>
                    <Text style={slides.darkHeadline}>{item.headline}</Text>
                    <UnderlinedText
                        text={item.headlineAccent ?? ''}
                        color="#F5C842"
                        textStyle={slides.darkHeadline}
                    />
                    {item.headlineEnd && <Text style={slides.darkHeadline}>{item.headlineEnd}</Text>}
                </View>

                {item.subtext && <Text style={slides.darkSubtext}>{item.subtext}</Text>}
            </Animated.View>

            {/* Phone mockup */}
            {item.mockScreen && (
                <Animated.View style={[slides.phoneWrapper, animStyle]}>
                    <PhoneMockup screenKey={item.mockScreen} />
                </Animated.View>
            )}
        </LinearGradient>
    );
}

/* ─────────────────────────────────────────────────────────────
   Main Onboarding Screen
───────────────────────────────────────────────────────────── */
export default function OnboardingScreen() {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);
    const scrollX = useSharedValue(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (currentIndex < SLIDES.length - 1) {
                flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
            }
        }, 3500);
        return () => clearTimeout(timer);
    }, [currentIndex]);

    const handleFinish = async () => {
        await AsyncStorage.setItem('@has_seen_onboarding', 'true');
        router.replace('/login');
    };

    const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems[0]?.index != null) {
            setCurrentIndex(viewableItems[0].index);
        }
    }, []);

    const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    return (
        <SafeAreaView style={root.container} edges={['top', 'bottom']}>
            <StatusBar style="auto" />

            {/* Header Skip */}
            <View style={root.header}>
                {SLIDES[currentIndex].bg === 'dark' && (
                    <TouchableOpacity onPress={handleFinish} style={root.skipBtn}>
                        <Text style={root.skipText}>Done</Text>
                    </TouchableOpacity>
                )}
            </View>

            <FlatList
                ref={flatListRef}
                data={SLIDES}
                renderItem={({ item, index }) => <Slide item={item} index={index} scrollX={scrollX} />}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                onScroll={(e) => { scrollX.value = e.nativeEvent.contentOffset.x; }}
                scrollEventThrottle={16}
                bounces={false}
            />

            {/* Bottom bar */}
            <View style={[root.bottomBar, SLIDES[currentIndex].bg === 'light' && { backgroundColor: '#F8F9FF' }]}>
                <View style={root.dotsRow}>
                    {SLIDES.map((s, i) => (
                        <Animated.View
                            key={i}
                            style={[
                                root.dot,
                                i === currentIndex
                                    ? [root.dotActive, { backgroundColor: SLIDES[currentIndex].bg === 'light' ? '#1E3A8A' : '#F5C842' }]
                                    : root.dotInactive,
                            ]}
                        />
                    ))}
                </View>

                {currentIndex === SLIDES.length - 1 ? (
                    <TouchableOpacity style={root.cta} onPress={handleFinish} activeOpacity={0.85}>
                        <LinearGradient colors={['#1E3A8A', '#1601AA']} style={root.ctaGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                            <Text style={root.ctaText}>Get Started</Text>
                            <Ionicons name="arrow-forward" size={16} color="#FFF" />
                        </LinearGradient>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={[root.nextBtn, SLIDES[currentIndex].bg === 'light' && { backgroundColor: '#1E3A8A' }]}
                        onPress={() => flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true })}
                        activeOpacity={0.85}
                    >
                        <Ionicons name="arrow-forward" size={20} color="#FFF" />
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
}

/* ─────────────────────────────────────────────────────────────
   StyleSheet
───────────────────────────────────────────────────────────── */
const root = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0B0D2A' },
    header: {
        alignItems: 'flex-end',
        paddingHorizontal: 20,
        paddingVertical: 10,
        position: 'absolute',
        top: Platform.OS === 'android' ? 40 : 54,
        right: 0,
        zIndex: 10,
    },
    skipBtn: { paddingVertical: 6, paddingHorizontal: 14, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 14 },
    skipText: { color: '#CCCCEE', fontFamily: FontFamily.lato, fontSize: 14 },
    bottomBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingBottom: Platform.OS === 'android' ? 20 : 10,
        paddingTop: 14,
        backgroundColor: '#0B0D2A',
    },
    dotsRow: { flexDirection: 'row', gap: 6, alignItems: 'center' },
    dot: { height: 8, borderRadius: 4 },
    dotActive: { width: 26 },
    dotInactive: { width: 8, backgroundColor: '#2D3A6B' },
    nextBtn: {
        width: 50, height: 50, borderRadius: 25,
        backgroundColor: '#1E3A8A',
        alignItems: 'center', justifyContent: 'center',
    },
    cta: { borderRadius: 14, overflow: 'hidden' },
    ctaGradient: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 14, paddingHorizontal: 24 },
    ctaText: { color: '#FFF', fontFamily: FontFamily.interSemiBold, fontSize: 15 },
});

const slides = StyleSheet.create({
    slide: { flex: 1 },
    // --- Light slide ---
    lightContent: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
    logoBox: {
        width: 90, height: 90, borderRadius: 22,
        backgroundColor: '#2D1A7A',
        alignItems: 'center', justifyContent: 'center',
        shadowColor: '#2D1A7A', shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4, shadowRadius: 16, elevation: 12,
    },
    logoText: { color: '#FFF', fontSize: 42, fontFamily: FontFamily.interBlack },
    lightTagline: { fontSize: 20, fontFamily: FontFamily.inter, color: '#1F2937', textAlign: 'center', lineHeight: 28 },
    lightTaglineBold: { fontSize: 20, fontFamily: FontFamily.interBold, color: '#1F2937', textAlign: 'center', lineHeight: 28 },
    buildingArea: { position: 'absolute', bottom: 40, left: 0, right: 0, height: height * 0.22, overflow: 'hidden' },
    buildingRow: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 8, height: '100%' },
    buildingBlock: { flex: 1, marginHorizontal: 2, borderTopLeftRadius: 4, borderTopRightRadius: 4, flexDirection: 'column', justifyContent: 'flex-start', paddingTop: 6, gap: 4, paddingHorizontal: 4 },
    buildingWindow: { height: 8, backgroundColor: 'rgba(255,200,100,0.5)', borderRadius: 1 },
    lightBadge: { position: 'absolute', bottom: 16, alignSelf: 'center' },
    lightBadgeText: { fontSize: 13, fontFamily: FontFamily.latoSemiBold, color: '#16A34A' },
    // --- Dark slides ---
    darkContent: { paddingTop: Platform.OS === 'android' ? 80 : 70, paddingHorizontal: 28 },
    darkLabel: { color: '#8C92AC', fontSize: 12, fontFamily: FontFamily.interSemiBold, letterSpacing: 1.4, marginBottom: 18 },
    darkHeadline: { color: '#FFFFFF', fontSize: 36, fontFamily: FontFamily.interBlack, lineHeight: 44 },
    darkSubtext: { color: '#8C92AC', fontSize: 14, fontFamily: FontFamily.lato, lineHeight: 22, marginTop: 12, maxWidth: '90%' },
    phoneWrapper: {
        position: 'absolute',
        right: -20,
        bottom: 54,
        transform: [{ rotate: '-6deg' }],
    },
});

const phone = StyleSheet.create({
    frame: {
        width: 180,
        height: 340,
        backgroundColor: '#1A1A2E',
        borderRadius: 28,
        borderWidth: 3,
        borderColor: '#2D2D4A',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: -4, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 20,
    },
    notch: {
        width: 60, height: 14,
        backgroundColor: '#1A1A2E',
        borderRadius: 8,
        alignSelf: 'center',
        marginTop: 6,
        zIndex: 2,
    },
    screen: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        margin: 4,
        borderRadius: 20,
        overflow: 'hidden',
    },
    homeBar: {
        width: 50, height: 4,
        backgroundColor: '#3D3D5C',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 8,
    },
});

// Mock screen internal styles
const mock = StyleSheet.create({
    screen: { flex: 1, padding: 8, backgroundColor: '#FAFAFA' },
    topBar: { flexDirection: 'row', gap: 4, marginBottom: 8, alignItems: 'center' },
    topBarDot: { width: 18, height: 6, borderRadius: 3, backgroundColor: '#E5E7EB' },
    mockTitle: { fontSize: 8, fontFamily: FontFamily.interBold, color: '#1F2937', marginBottom: 6 },
    statsRow: { flexDirection: 'row', gap: 4, marginBottom: 8 },
    statChip: { flex: 1, backgroundColor: '#F3F4F6', borderRadius: 6, padding: 4, alignItems: 'center' },
    statVal: { fontSize: 9, fontFamily: FontFamily.interBold, color: '#111827' },
    statLbl: { fontSize: 6, color: '#6B7280', fontFamily: FontFamily.lato },
    chartArea: { flexDirection: 'row', alignItems: 'flex-end', gap: 3, height: 40, marginBottom: 8 },
    bar: { flex: 1, borderRadius: 2 },
    listRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 5 },
    avatar: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#1E3A8A', alignItems: 'center', justifyContent: 'center' },
    avatarText: { color: '#FFF', fontSize: 7, fontFamily: FontFamily.interBold },
    listName: { flex: 1, fontSize: 7, fontFamily: FontFamily.lato, color: '#374151' },
    badge: { paddingHorizontal: 4, paddingVertical: 1, borderRadius: 4 },
    badgeText: { fontSize: 6, fontFamily: FontFamily.latoBold },
    collectionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 4 },
    collBar: { height: 8, borderRadius: 4 },
    collLabel: { fontSize: 6, fontFamily: FontFamily.lato, color: '#6B7280' },
    piePlaceholder: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 8 },
    pieSlice: { width: 44, height: 44, borderRadius: 22 },
    pieLegend: { gap: 4 },
    pieLegendRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 3 },
    pieDot: { width: 8, height: 8, borderRadius: 4 },
    pieLegendText: { fontSize: 6, fontFamily: FontFamily.lato, color: '#4B5563' },
    gridWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 8, marginTop: 4 },
    unitCell: { width: '30%', height: 26, borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
    unitText: { fontSize: 7, fontFamily: FontFamily.interBold, color: '#1F2937' },
});
