import {
  Inter_400Regular,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { JetBrainsMono_400Regular } from '@expo-google-fonts/jetbrains-mono';
import {
  SourceSerif4_400Regular,
  SourceSerif4_700Bold,
} from '@expo-google-fonts/source-serif-4';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { Toaster } from 'sonner-native';

import { useAppTheme } from '@/hooks/use-app-theme';
import { AppQueryProvider } from '@/providers/query-provider';
import { useAuthStore } from '@/stores/auth-store';

function useProtectedRoute() {
  const { session, isInitialized } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isInitialized) return;

    const firstSegment = segments[0] as string | undefined;
    const inAuthScreen = !firstSegment || firstSegment === 'index';
    const inForgotPassword = firstSegment === 'forgot-password';
    const inVerifyEmail = firstSegment === 'verify-email';

    if (!session && !inAuthScreen && !inForgotPassword && !inVerifyEmail) {
      console.log('LOG: No session, redirecting to login');
      router.replace('/');
    } else if (session && (inAuthScreen || inForgotPassword || inVerifyEmail)) {
      console.log('LOG: Session found, redirecting to tabs');
      router.replace('/(tabs)');
    }
  }, [session, isInitialized, segments]);
}

export default function RootLayout() {
  const { theme, colorScheme } = useAppTheme();
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    const cleanup = initialize();
    return cleanup;
  }, [initialize]);

  const [fontsLoaded, fontError] = useFonts({
    Inter: Inter_400Regular,
    'Inter-Bold': Inter_700Bold,
    'Source Serif 4': SourceSerif4_400Regular,
    'Source Serif 4-Bold': SourceSerif4_700Bold,
    'JetBrains Mono': JetBrainsMono_400Regular,
  });

  if (fontError) {
    console.warn('Font loading error, using system fonts:', fontError);
  }

  if (!fontsLoaded) {
    return null;
  }

  const navTheme = {
    ...(colorScheme === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(colorScheme === 'dark' ? DarkTheme : DefaultTheme).colors,
      primary: theme.primary,
      background: theme.background,
      card: theme.card,
      text: theme.text,
      border: theme.border,
      notification: theme.destructive,
    },
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppQueryProvider>
        <ThemeProvider value={navTheme}>
          <RootNavigator />
          <Toaster
            theme={colorScheme === 'dark' ? 'dark' : 'light'}
            position="top-center"
            richColors
            toastOptions={{
              style: {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
              titleStyle: {
                color: theme.foreground,
              },
              descriptionStyle: {
                color: theme.mutedForeground,
              },
            }}
          />
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        </ThemeProvider>
      </AppQueryProvider>
    </GestureHandlerRootView>
  );
}

function RootNavigator() {
  useProtectedRoute();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="verify-email" />
      <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
    </Stack>
  );
}
