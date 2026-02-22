import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    View,
} from "react-native";

interface AuthInputProps extends TextInputProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  showPasswordToggle?: boolean;
  isPasswordVisible?: boolean;
  onTogglePassword?: () => void;
}

export function AuthInput({
  label,
  icon,
  showPasswordToggle,
  isPasswordVisible,
  onTogglePassword,
  ...props
}: AuthInputProps) {
  const { theme } = useAppTheme();
  return (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: theme.foreground }]}>{label}</Text>
      <View
        style={[
          styles.inputWrapper,
          { backgroundColor: theme.input, borderColor: theme.border },
        ]}
      >
        <Ionicons
          name={icon}
          size={20}
          color={theme.foreground}
          style={styles.inputIcon}
        />
        <TextInput
          style={[styles.input, { color: theme.foreground }]}
          placeholderTextColor={theme.mutedForeground}
          secureTextEntry={showPasswordToggle && !isPasswordVisible}
          {...props}
        />
        {showPasswordToggle && (
          <Pressable onPress={onTogglePassword}>
            <Ionicons
              name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={theme.mutedForeground}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputGroup: {
    gap: 8,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Inter",
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 64,
  },
  inputIcon: {
    marginRight: 12,
    opacity: 0.8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Inter",
    height: "100%",
  },
});
