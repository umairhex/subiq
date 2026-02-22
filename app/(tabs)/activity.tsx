import {
    ActivityLog,
    ActivityLogItem,
} from "@/components/activity/activity-log-item";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useCurrencyStore } from "@/stores/currency-store";
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
  const { currency } = useCurrencyStore();
  const effectiveColorScheme =
    overrideTheme === "system" ? colorScheme : overrideTheme;
  const theme = Colors[effectiveColorScheme];

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.background }}
      edges={["top"]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <View>
            <ThemedText
              type="title"
              style={[styles.title, { color: theme.foreground }]}
            >
              Activity
            </ThemedText>
            <ThemedText
              type="default"
              style={[styles.subtitle, { color: theme.mutedForeground }]}
            >
              Track your usage and insights
            </ThemedText>
          </View>
          <Pressable
            style={[styles.logBtn, { backgroundColor: theme.primary }]}
          >
            <Ionicons name="add" size={20} color={theme.primaryForeground} />
          </Pressable>
        </View>

        <View
          style={[
            styles.statsCard,
            {
              backgroundColor: theme.primary + "08",
              borderColor: theme.primary + "20",
            },
          ]}
        >
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="flash" size={24} color={theme.primary} />
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
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <View style={styles.statItem}>
              <Ionicons name="time" size={24} color={theme.primary} />
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
        </View>

        <View
          style={[
            styles.intelligenceCard,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <View
            style={[
              styles.intelligenceIcon,
              { backgroundColor: theme.primary + "20" },
            ]}
          >
            <Ionicons name="analytics" size={24} color={theme.primary} />
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
              Your cost-per-watch for Netflix is {currency.symbol}1.20.
              You&apos;re getting great value!
            </ThemedText>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <ThemedText
            type="subtitle"
            style={[styles.sectionTitle, { color: theme.foreground }]}
          >
            Recent Activity
          </ThemedText>
        </View>

        <View style={styles.listContainer}>
          {MOCK_ACTIVITY.map((log) => (
            <ActivityLogItem key={log.id} log={log} theme={theme} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  logBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statsCard: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  statValue: {
    fontSize: 20,
    marginTop: 2,
  },
  statTrend: {
    fontSize: 12,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 40,
    opacity: 0.3,
  },
  intelligenceCard: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  intelligenceIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  intelligenceTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  intelligenceDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
  },
  listContainer: {
    gap: 8,
  },
});
