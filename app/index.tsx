import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
    const [isReady, setIsReady] = useState(false);
    const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

    useEffect(() => {
        async function checkState() {
            try {
                const value = await AsyncStorage.getItem('@has_seen_onboarding');
                setHasSeenOnboarding(value === 'true');
            } catch (e) {
                // Error reading value
            } finally {
                setIsReady(true);
            }
        }
        checkState();
    }, []);

    if (!isReady) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (!hasSeenOnboarding) {
        return <Redirect href="/onboarding" />;
    }

    return <Redirect href="/login" />;
}
