import { FontAwesome, Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface SocialAuthButtonsProps {
  theme: any;
  onGooglePress?: () => void;
  onApplePress?: () => void;
}

export function SocialAuthButtons({
  theme,
  onGooglePress,
  onApplePress,
}: SocialAuthButtonsProps) {
  return (
    <>
      <View style={styles.dividerContainer}>
        <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
        <Text style={[styles.dividerText, { color: theme.mutedForeground }]}>
          Or continue with
        </Text>
        <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
      </View>

      <View style={styles.socialRow}>
        <Pressable
          onPress={onGooglePress}
          style={[
            styles.socialButton,
            { backgroundColor: theme.input, borderColor: theme.border },
          ]}
        >
          <FontAwesome name="google" size={20} color={theme.foreground} />
          <Text style={[styles.socialButtonText, { color: theme.foreground }]}>
            Google
          </Text>
        </Pressable>
        <Pressable
          onPress={onApplePress}
          style={[
            styles.socialButton,
            { backgroundColor: "#000", borderColor: "#000" },
          ]}
        >
          <Ionicons name="logo-apple" size={22} color="#fff" />
          <Text style={[styles.socialButtonText, { color: "#fff" }]}>
            Apple
          </Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
    marginTop: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    opacity: 0.5,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Inter",
  },
  socialRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 32,
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Inter",
  },
});
