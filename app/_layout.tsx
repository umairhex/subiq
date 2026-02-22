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
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import 'react-native-reanimated';

import { useAppTheme } from '@/hooks/use-app-theme';

export default function RootLayout() {
  const { theme, colorScheme } = useAppTheme();

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
    <ThemeProvider value={navTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}
