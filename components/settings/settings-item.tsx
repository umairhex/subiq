import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface SettingsItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  destructive?: boolean;
  theme: any;
  showChevron?: boolean;
}

export function SettingsItem({
  icon,
  title,
  subtitle,
  onPress,
  destructive,
  theme,
  showChevron = true,
}: SettingsItemProps) {
  const color = destructive ? theme.destructive : theme.foreground;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: pressed ? theme.input : "transparent" },
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: destructive
              ? "rgba(239, 68, 68, 0.1)"
              : theme.input,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={22}
          color={destructive ? theme.destructive : theme.primary}
        />
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: theme.mutedForeground }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {showChevron && (
        <Ionicons name="chevron-forward" size={20} color={theme.muted} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginHorizontal: 8,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: "Inter-Bold",
  },
  subtitle: {
    fontSize: 13,
    fontFamily: "Inter",
    marginTop: 2,
  },
});
