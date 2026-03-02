import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function LoadingSpinner({ fullscreen = true }: { fullscreen?: boolean }) {
    return (
        <View style={[styles.container, fullscreen && styles.fullscreen]}>
            <ActivityIndicator size="large" color="#1601AA" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { alignItems: 'center', justifyContent: 'center', padding: 24 },
    fullscreen: { flex: 1, backgroundColor: '#FFFFFF' },
});
