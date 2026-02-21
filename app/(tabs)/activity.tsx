import {
  ActivityLog,
  ActivityLogItem,
} from "@/components/activity/activity-log-item";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useThemeStore } from "@/stores/theme-store";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MOCK_ACTIVITY: ActivityLog[] = [
  {
    id: "1",
    platform: "Netflix",
    activityName: "Watched 'Dune: Part Two'",
    date: "Today, 8:45 PM",
    duration: "2h 46m",
    icon: "play-circle",
  },
  {
    id: "2",
    platform: "Spotify",
    activityName: "Listening to 'Techno Bunker'",
    date: "Today, 10:30 AM",
    duration: "45m",
    icon: "musical-note",
  },
  {
    id: "3",
    platform: "Adobe Photoshop",
    activityName: "Project: Logo Design",
    date: "Yesterday",
    duration: "3h 15m",
    icon: "brush",
  },
  {
    id: "4",
    platform: "Netflix",
    activityName: "Watched 'The Gentlemen'",
    date: "March 18, 2024",
    duration: "52m",
    icon: "play-circle",
  },
];

export default function ActivityScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const { theme: overrideTheme } = useThemeStore();
  const effectiveColorScheme =
    overrideTheme === "system" ? colorScheme : overrideTheme;
  const theme = Colors[effectiveColorScheme];

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.background }}
      edges={["top"]}
    >
      <View style={styles.header}>
        <ThemedText
          type="title"
          style={[styles.title, { color: theme.foreground }]}
        >
          Activity Log
        </ThemedText>
        <Pressable style={[styles.logBtn, { backgroundColor: theme.primary }]}>
          <ThemedText
            type="defaultSemiBold"
            style={[styles.logBtnText, { color: theme.primaryForeground }]}
          >
            + Log Usage
          </ThemedText>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.statsRow}>
          <View style={[styles.statItem, { backgroundColor: theme.input }]}>
            <View style={[styles.statIcon, { backgroundColor: theme.primary }]}>
              <Ionicons
                name="flash"
                size={18}
                color={theme.primaryForeground}
              />
            </View>
            <View>
              <ThemedText
                type="default"
                style={[styles.statLabel, { color: theme.mutedForeground }]}
              >
                Most Used
              </ThemedText>
              <ThemedText
                type="subtitle"
                style={[styles.statValue, { color: theme.foreground }]}
              >
                Netflix
              </ThemedText>
              <ThemedText
                type="default"
                style={[styles.statTrend, { color: theme.primary }]}
              >
                +12% this week
              </ThemedText>
            </View>
          </View>

          <View style={[styles.statItem, { backgroundColor: theme.input }]}>
            <View style={[styles.statIcon, { backgroundColor: theme.accent }]}>
              <Ionicons name="time" size={18} color={theme.accentForeground} />
            </View>
            <View>
              <ThemedText
                type="default"
                style={[styles.statLabel, { color: theme.mutedForeground }]}
              >
                Total Time
              </ThemedText>
              <ThemedText
                type="subtitle"
                style={[styles.statValue, { color: theme.foreground }]}
              >
                24.5h
              </ThemedText>
              <ThemedText
                type="default"
                style={[styles.statTrend, { color: theme.mutedForeground }]}
              >
                vs 22h last week
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.intelligenceCard}>
          <View
            style={[
              styles.intelligenceIcon,
              { backgroundColor: theme.primary },
            ]}
          >
            <Ionicons
              name="analytics"
              size={24}
              color={theme.primaryForeground}
            />
          </View>
          <View style={{ flex: 1 }}>
            <ThemedText
              type="subtitle"
              style={[styles.intelligenceTitle, { color: theme.foreground }]}
            >
              Usage Intelligence
            </ThemedText>
            <ThemedText
              type="default"
              style={[
                styles.intelligenceDesc,
                { color: theme.mutedForeground },
              ]}
            >
              Your cost-per-watch for Netflix is $1.20. You&apos;re getting
              great value!
            </ThemedText>
          </View>
        </View>

        <View style={styles.listContainer}>
          <ThemedText
            type="default"
            style={[styles.listHeader, { color: theme.mutedForeground }]}
          >
            RECENT ACTIVITY
          </ThemedText>
          {MOCK_ACTIVITY.map((log) => (
            <ActivityLogItem key={log.id} log={log} theme={theme} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginTop: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
  },
  logBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  logBtnText: {
    fontSize: 14,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  statLabel: {
    fontSize: 10,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  statValue: {
    fontSize: 18,
  },
  statTrend: {
    fontSize: 11,
    marginTop: 2,
  },
  intelligenceCard: {
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 24,
    backgroundColor: "rgba(0,0,0,0.02)",
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  intelligenceIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  intelligenceTitle: {
    fontSize: 16,
    marginBottom: 2,
  },
  intelligenceDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  listContainer: {
    paddingHorizontal: 24,
  },
  listHeader: {
    fontSize: 12,
    letterSpacing: 1,
    marginBottom: 16,
  },
});
