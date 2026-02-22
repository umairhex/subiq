import { ExpenseSummary } from "@/components/dashboard/expense-summary";
import {
    Recommendation,
    RecommendationEngine,
} from "@/components/dashboard/recommendation-engine";
import {
    Subscription,
    SubscriptionCard,
} from "@/components/dashboard/subscription-card";
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

const MOCK_SUBSCRIPTIONS: Subscription[] = [
  {
    id: "1",
    name: "Netflix",
    startDate: "2023-01-15",
    renewalDate: "Mar 15, 2024",
    billingCycle: "Monthly",
    price: 15.99,
    paymentMethod: "Visa **** 4242",
    status: "Active",
    daysLeft: 12,
    icon: "play-circle",
  },
  {
    id: "2",
    name: "Spotify Premium",
    startDate: "2023-06-20",
    renewalDate: "Mar 20, 2024",
    billingCycle: "Monthly",
    price: 10.99,
    paymentMethod: "Mastercard **** 8888",
    status: "Active",
    daysLeft: 17,
    icon: "musical-notes",
  },
  {
    id: "3",
    name: "Adobe Creative Cloud",
    startDate: "2024-01-01",
    renewalDate: "Jan 01, 2025",
    billingCycle: "Yearly",
    price: 599.99,
    paymentMethod: "Apple Pay",
    status: "Active",
    daysLeft: 290,
    icon: "brush",
  },
];

const MOCK_RECOMMENDATIONS: Recommendation[] = [
  {
    id: "1",
    type: "Duplicate",
    title: "Overlapping Streaming Content",
    description:
      "You have Netflix and HBO Max. 65% of trending content overlaps between these services.",
    savings: 14.99,
    confidence: 92,
  },
  {
    id: "2",
    type: "Inactive",
    title: "Unused Software License",
    description:
      "Adobe Illustrator hasn't been opened in 45 days. Consider downgrading your plan.",
    savings: 32.0,
    confidence: 88,
  },
];

export default function DashboardScreen() {
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.userHeader}>
          <View>
            <ThemedText
              type="title"
              style={[styles.userName, { color: theme.foreground }]}
            >
              Dashboard
            </ThemedText>
          </View>
        </View>

        <ExpenseSummary
          totalMonthly={76.97}
          totalYearly={923.64}
          trendPercentage={-4.2}
          theme={theme}
        />

        <RecommendationEngine
          recommendations={MOCK_RECOMMENDATIONS}
          theme={theme}
        />

        <View style={styles.sectionHeader}>
          <ThemedText
            type="subtitle"
            style={[styles.sectionTitle, { color: theme.foreground }]}
          >
            Subscriptions
          </ThemedText>
        </View>

        <View style={styles.subscriptionList}>
          {MOCK_SUBSCRIPTIONS.map((sub) => (
            <SubscriptionCard key={sub.id} subscription={sub} theme={theme} />
          ))}
        </View>
      </ScrollView>

      <Pressable
        style={[
          styles.fab,
          { backgroundColor: theme.primary, shadowColor: theme.primary },
        ]}
      >
        <Ionicons name="add" size={32} color={theme.primaryForeground} />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  userHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 16,
  },
  greeting: {
    fontSize: 14,
  },
  userName: {
    fontSize: 24,
  },
  notificationBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  notificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: "absolute",
    top: 12,
    right: 12,
    borderWidth: 2,
    borderColor: "#fff",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
  },
  seeAll: {
    fontSize: 14,
  },
  sortBar: {
    marginBottom: 20,
  },
  sortScroll: {
    gap: 8,
  },
  sortChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  sortChipText: {
    fontSize: 13,
  },
  subscriptionList: {
    gap: 12,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
});
