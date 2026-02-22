import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { AuthButton } from "@/components/ui/auth-button";
import { AuthInput } from "@/components/ui/auth-input";
import { useAppTheme } from "@/hooks/use-app-theme";

export default function EditProfileScreen() {
  const { theme } = useAppTheme();

  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Doe");

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.back();
    } catch (error) {
      console.error("Failed to save profile:", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style="auto" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, padding: 24 }}
        >
          <View style={{ flex: 1 }}>
            <View style={{ marginBottom: 32 }}>
              <ThemedText
                type="title"
                style={{
                  fontSize: 28,
                  fontWeight: "700",
                  marginBottom: 8,
                  color: theme.foreground,
                }}
              >
                Edit Profile
              </ThemedText>
              <ThemedText
                type="default"
                style={{
                  fontSize: 16,
                  color: theme.mutedForeground,
                }}
              >
                Update your personal information
              </ThemedText>
            </View>

            <View style={{ gap: 20 }}>
              <AuthInput
                label="First Name"
                icon="person-outline"
                placeholder="Enter your first name"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
                autoComplete="given-name"
              />

              <AuthInput
                label="Last Name"
                icon="person-outline"
                placeholder="Enter your last name"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
                autoComplete="family-name"
              />
            </View>

            <View style={{ marginTop: 40 }}>
              <AuthButton title="Save Changes" onPress={handleSave} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
