import {
  ActivityLog,
  ActivityLogItem,
} from "@/components/activity/activity-log-item";
import { ThemedText } from "@/components/themed-text";
import { StatsCard } from "@/components/ui/stats-card";
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

import { AddActivityModal } from "@/components/ui/add-activity-modal";

const MOCK_ACTIVITY: ActivityLog[] = [
  {
    id: "1",
    platform: "Netflix",
    activityName: "Watched 'Dune: Part Two'",
    date: "Today, 8:45 PM",
    duration: "2h 46m",
  },
  {
    id: "2",
    platform: "Spotify",
    activityName: "Listening to 'Techno Bunker'",
    date: "Today, 10:30 AM",
    duration: "45m",
  },
  {
    id: "3",
    platform: "Adobe Photoshop",
    activityName: "Project: Logo Design",
    date: "Yesterday",
    duration: "3h 15m",
  },
  {
    id: "4",
    platform: "Netflix",
    activityName: "Watched 'The Gentlemen'",
    date: "March 18, 2024",
    duration: "52m",
  },
];

export default function ActivityScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const { theme: overrideTheme } = useThemeStore();
  const { currency } = useCurrencyStore();
  const effectiveColorScheme =
    overrideTheme === "system" ? colorScheme : overrideTheme;
  const theme = Colors[effectiveColorScheme];

  const [showAddModal, setShowAddModal] = React.useState(false);

  const handleAddActivity = async (activity: {
    platform: string;
    activityName: string;
    duration: string;
  }) => {
    // TODO: Implement API call to add activity
    console.log("Adding activity:", activity);
    // For now, just show success message
    return new Promise((resolve) => setTimeout(resolve, 1000));
  };

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
            onPress={() => setShowAddModal(true)}
          >
            <Ionicons name="add" size={20} color={theme.primaryForeground} />
          </Pressable>
        </View>

        <StatsCard
          items={[
            {
              label: "Most Used",
              value: "Netflix",
              trend: "+12% this week",
              trendColor: theme.primary,
            },
            {
              label: "Total Time",
              value: "24.5h",
              trend: "vs 22h last week",
            },
          ]}
          theme={theme}
        />

        <View
          style={[
            styles.intelligenceCard,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <View style={styles.intelligenceContent}>
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

          <View style={styles.intelligenceMetrics}>
            <View style={styles.metricItem}>
              <ThemedText
                type="default"
                style={[styles.metricLabel, { color: theme.mutedForeground }]}
              >
                This Month
              </ThemedText>
              <ThemedText
                type="title"
                style={[styles.metricValue, { color: theme.foreground }]}
              >
                {currency.symbol}24.50
              </ThemedText>
            </View>

            <View
              style={[styles.metricDivider, { backgroundColor: theme.border }]}
            />

            <View style={styles.metricItem}>
              <ThemedText
                type="default"
                style={[styles.metricLabel, { color: theme.mutedForeground }]}
              >
                Avg. per Watch
              </ThemedText>
              <ThemedText
                type="title"
                style={[styles.metricValue, { color: theme.foreground }]}
              >
                {currency.symbol}1.20
              </ThemedText>
            </View>
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

      <AddActivityModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddActivity}
        theme={theme}
      />
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
  intelligenceCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  intelligenceContent: {
    marginBottom: 20,
  },
  intelligenceTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
  },
  intelligenceDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
  intelligenceMetrics: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  metricItem: {
    flex: 1,
    alignItems: "center",
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
    opacity: 0.7,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  metricDivider: {
    width: 1,
    height: 40,
    marginHorizontal: 20,
    opacity: 0.3,
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
