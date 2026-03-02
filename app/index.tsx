import { useAuth } from '@/context/AuthContext';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

/**
 * Root entry point.
 * - While auth is loading → show a spinner
 * - Authenticated landlord → landlord-dashboard
 * - Authenticated tenant → (tabs) home
 * - Unauthenticated → onboarding
 */
export default function IndexScreen() {
    const { isLoading, isAuthenticated, user } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
                <ActivityIndicator size="large" color="#1601AA" />
            </View>
        );
    }

    if (isAuthenticated && user) {
        if (user.role === 'landlord') {
            return <Redirect href="/landlord-dashboard" />;
        }
        return <Redirect href="/(tabs)" />;
    }

    return <Redirect href="/onboarding" />;
}
