import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Colors } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'CinzelDecorative-Regular': require('@expo-google-fonts/cinzel-decorative/CinzelDecorative_400Regular.ttf'),
    'CinzelDecorative-Bold': require('@expo-google-fonts/cinzel-decorative/CinzelDecorative_700Bold.ttf'),
    'SpaceMono-Regular': require('@expo-google-fonts/space-mono/SpaceMono_400Regular.ttf'),
    'SpaceMono-Bold': require('@expo-google-fonts/space-mono/SpaceMono_700Bold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" backgroundColor={Colors.navy} />
      <Stack screenOptions={{ headerShown: false, animation: 'fade', contentStyle: { backgroundColor: Colors.navy } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(admin)" />
        <Stack.Screen name="kyc" options={{ presentation: 'card' }} />
        <Stack.Screen name="pool/[id]" options={{ presentation: 'card' }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
