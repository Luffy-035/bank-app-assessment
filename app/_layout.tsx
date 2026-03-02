import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
} from '@expo-google-fonts/inter';
import {
  Lato_300Light,
  Lato_300Light_Italic,
  Lato_400Regular,
  Lato_400Regular_Italic,
  Lato_700Bold,
  Lato_700Bold_Italic,
  Lato_900Black,
} from '@expo-google-fonts/lato';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from '@/context/AuthContext';

// Prevent the splash screen from auto-hiding before fonts are loaded
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
    Lato_300Light,
    Lato_400Regular,
    Lato_700Bold,
    Lato_900Black,
    Lato_300Light_Italic,
    Lato_400Regular_Italic,
    Lato_700Bold_Italic,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Failsafe: Hide splash screen after 5 seconds even if fonts fail
  useEffect(() => {
    const timeout = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 5000);
    return () => clearTimeout(timeout);
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="otp" options={{ headerShown: false }} />
          <Stack.Screen name="role-selection" options={{ headerShown: false }} />
          <Stack.Screen name="role-selection-register" options={{ headerShown: false }} />
          <Stack.Screen name="tenant-create-account" options={{ headerShown: false }} />
          <Stack.Screen name="landlord-create-account" options={{ headerShown: false }} />
          <Stack.Screen name="add-payment-method" options={{ headerShown: false }} />
          <Stack.Screen name="card-details" options={{ headerShown: false }} />
          <Stack.Screen
            name="account-success"
            options={{
              headerShown: false,
              presentation: 'transparentModal',
              animation: 'slide_from_bottom',
            }}
          />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="request-maintenance" options={{ headerShown: false }} />
          <Stack.Screen name="documents" options={{ headerShown: false }} />
          <Stack.Screen name="request-support" options={{ headerShown: false }} />
          <Stack.Screen name="landlord-dashboard" options={{ headerShown: false }} />
          <Stack.Screen name="rent-income" options={{ headerShown: false }} />
          <Stack.Screen name="tenant-directory" options={{ headerShown: false }} />
          <Stack.Screen name="profile" options={{ headerShown: false }} />
          <Stack.Screen name="record-payment" options={{ headerShown: false }} />
          <Stack.Screen name="occupancy" options={{ headerShown: false }} />
          <Stack.Screen name="add-property" options={{ headerShown: false }} />
          <Stack.Screen name="properties" options={{ headerShown: false }} />
          <Stack.Screen name="property-details" options={{ headerShown: false }} />
          <Stack.Screen name="landlord-requests" options={{ headerShown: false }} />
          <Stack.Screen name="dues-pending" options={{ headerShown: false }} />
          <Stack.Screen name="tenant-detail" options={{ headerShown: false }} />
          <Stack.Screen name="help-support" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}