import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ExpenseSummaryProps {
  totalMonthly: number;
  totalYearly: number;
  trendPercentage: number;
  theme: any;
}

export function ExpenseSummary({
  totalMonthly,
  totalYearly,
  trendPercentage,
  theme,
}: ExpenseSummaryProps) {
  const isTrendUp = trendPercentage > 0;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.card, borderColor: theme.border },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.label, { color: theme.mutedForeground }]}>
          Total Expenses
        </Text>
        <View style={styles.trendRow}>
          <Ionicons
            name={isTrendUp ? "trending-up" : "trending-down"}
            size={16}
            color={isTrendUp ? theme.destructive : theme.primary}
          />
          <Text
            style={[
              styles.trendText,
              { color: isTrendUp ? theme.destructive : theme.primary },
            ]}
          >
            {Math.abs(trendPercentage)}% vs last month
          </Text>
        </View>
      </View>

      <Text style={[styles.amount, { color: theme.foreground }]}>
        ${totalMonthly.toFixed(2)}
      </Text>

      <View style={[styles.yearlyBox, { backgroundColor: theme.input }]}>
        <Text style={[styles.yearlyLabel, { color: theme.mutedForeground }]}>
          Yearly Projection
        </Text>
        <Text style={[styles.yearlyAmount, { color: theme.foreground }]}>
          ${totalYearly.toFixed(2)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: "Inter",
    fontWeight: "600",
  },
  trendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  trendText: {
    fontSize: 12,
    fontFamily: "Inter-Bold",
  },
  amount: {
    fontSize: 36,
    fontFamily: "Inter-Bold",
    marginBottom: 16,
  },
  yearlyBox: {
    padding: 12,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  yearlyLabel: {
    fontSize: 13,
    fontFamily: "Inter",
  },
  yearlyAmount: {
    fontSize: 14,
    fontFamily: "Inter-Bold",
  },
});
