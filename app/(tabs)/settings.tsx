import { SettingsItem } from "@/components/settings/settings-item";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useThemeStore } from "@/stores/theme-store";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? "light";
  const { theme: overrideTheme, setTheme } = useThemeStore();
  const effectiveColorScheme =
    overrideTheme === "system" ? colorScheme : overrideTheme;
  const theme = Colors[effectiveColorScheme];

  const toggleTheme = async () => {
    const newMode =
      overrideTheme === "light"
        ? "dark"
        : overrideTheme === "dark"
          ? "system"
          : "light";
    setTheme(newMode);
  };
  const getThemeSubtitle = () => {
    switch (overrideTheme) {
      case "light":
        return "Light";
      case "dark":
        return "Dark";
      case "system":
        return "System Default";
      default:
        return "System Default";
    }
  };

  const getThemeIcon = () => {
    switch (overrideTheme) {
      case "light":
        return "sunny-outline";
      case "dark":
        return "moon-outline";
      case "system":
        return "contrast-outline";
      default:
        return "moon-outline";
    }
  };

  const handleLogout = () => {
    router.replace("/");
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.background }}
      edges={["top"]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ThemedText
            type="title"
            style={[styles.title, { color: theme.foreground }]}
          >
            Settings
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText
            type="default"
            style={[styles.sectionLabel, { color: theme.mutedForeground }]}
          >
            PROFILE
          </ThemedText>
          <View
            style={[
              styles.card,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <View style={styles.profileRow}>
              <View
                style={[styles.avatarContainer, { borderColor: theme.border }]}
              >
                <Ionicons name="person" size={50} color={theme.muted} />
              </View>
              <View style={styles.profileInfo}>
                <ThemedText
                  type="title"
                  style={[styles.profileName, { color: theme.foreground }]}
                >
                  John Doe
                </ThemedText>
                <ThemedText
                  type="default"
                  style={[
                    styles.profileEmail,
                    { color: theme.mutedForeground },
                  ]}
                >
                  john.doe@example.com
                </ThemedText>
              </View>
              <Pressable
                style={[styles.editProfileBtn, { borderColor: theme.border }]}
              >
                <ThemedText
                  type="default"
                  style={[styles.editProfileText, { color: theme.foreground }]}
                >
                  Edit Profile
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText
            type="default"
            style={[styles.sectionLabel, { color: theme.mutedForeground }]}
          >
            APP PREFERENCES
          </ThemedText>
          <View
            style={[
              styles.card,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <SettingsItem
              icon="cash-outline"
              title="Currency"
              subtitle="USD ($)"
              theme={theme}
            />
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <SettingsItem
              icon="notifications-outline"
              title="Notifications"
              subtitle="On"
              theme={theme}
            />
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <SettingsItem
              icon={getThemeIcon()}
              title="Dark Mode"
              subtitle={getThemeSubtitle()}
              onPress={toggleTheme}
              theme={theme}
            />
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText
            type="default"
            style={[styles.sectionLabel, { color: theme.mutedForeground }]}
          >
            DATA & PRIVACY
          </ThemedText>
          <View
            style={[
              styles.card,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <SettingsItem
              icon="download-outline"
              title="Export Data"
              theme={theme}
            />
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <SettingsItem
              icon="shield-checkmark-outline"
              title="Privacy Policy"
              theme={theme}
            />
          </View>
        </View>

        <View style={[styles.section, { marginBottom: 40 }]}>
          <Pressable
            onPress={handleLogout}
            style={[styles.logoutBtn, { borderColor: theme.destructive }]}
          >
            <Ionicons
              name="log-out-outline"
              size={20}
              color={theme.destructive}
            />
            <ThemedText
              type="default"
              style={[styles.logoutText, { color: theme.destructive }]}
            >
              Logout
            </ThemedText>
          </Pressable>
          <ThemedText
            type="default"
            style={[styles.versionText, { color: theme.mutedForeground }]}
          >
            Subiq v1.0.0 (Gold)
          </ThemedText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    marginTop: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.02)",
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 14,
  },
  editProfileBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  editProfileText: {
    fontSize: 13,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 11,
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: "hidden",
    paddingVertical: 8,
  },
  divider: {
    height: 1,
    marginHorizontal: 24,
    opacity: 0.5,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 12,
  },
  logoutText: {
    fontSize: 16,
  },
  versionText: {
    textAlign: "center",
    fontSize: 12,
    marginTop: 24,
  },
});
