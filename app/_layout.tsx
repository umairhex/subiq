import {
  Inter_400Regular,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { JetBrainsMono_400Regular } from "@expo-google-fonts/jetbrains-mono";
import {
  SourceSerif4_400Regular,
  SourceSerif4_700Bold,
} from "@expo-google-fonts/source-serif-4";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { useColorScheme } from "react-native";
import "react-native-reanimated";

import { Colors } from "@/constants/theme";
import { useThemeStore } from "@/stores/theme-store";

export default function RootLayout() {
  const colorScheme = useColorScheme() ?? "light";
  const { theme: overrideTheme } = useThemeStore();

  const effectiveColorScheme =
    overrideTheme === "system" ? colorScheme : overrideTheme;

  const [fontsLoaded, fontError] = useFonts({
    Inter: Inter_400Regular,
    "Inter-Bold": Inter_700Bold,
    "Source Serif 4": SourceSerif4_400Regular,
    "Source Serif 4-Bold": SourceSerif4_700Bold,
    "JetBrains Mono": JetBrainsMono_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  if (fontError) {
    console.warn("Font loading error, using system fonts:", fontError);
  }

  const CustomLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: Colors.light.primary,
      background: Colors.light.background,
      card: Colors.light.card,
      text: Colors.light.text,
      border: Colors.light.border,
      notification: Colors.light.destructive,
    },
  };

  const CustomDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: Colors.dark.primary,
      background: Colors.dark.background,
      card: Colors.dark.card,
      text: Colors.dark.text,
      border: Colors.dark.border,
      notification: Colors.dark.destructive,
    },
  };

  return (
    <ThemeProvider
      value={
        effectiveColorScheme === "dark" ? CustomDarkTheme : CustomLightTheme
      }
    >
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
      </Stack>
      <StatusBar style={effectiveColorScheme === "dark" ? "light" : "dark"} />
    </ThemeProvider>
  );
}
