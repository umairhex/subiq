import { useCurrencyStore } from "@/stores/currency-store";
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
  const { currency } = useCurrencyStore();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
          shadowColor: theme.foreground,
          elevation: 4,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons
            name="wallet"
            size={20}
            color={theme.primary}
            style={styles.icon}
          />
          <Text style={[styles.label, { color: theme.mutedForeground }]}>
            Total Expenses
          </Text>
        </View>
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
        {currency.symbol} {totalMonthly.toFixed(2)}
      </Text>

      <View style={[styles.yearlyBox, { borderColor: theme.border }]}>
        <View>
          <Text style={[styles.yearlyLabel, { color: theme.mutedForeground }]}>
            Yearly Projection
          </Text>
          <Text style={[styles.yearlyAmount, { color: theme.foreground }]}>
            {currency.symbol} {totalYearly.toFixed(2)}
          </Text>
        </View>
        <Ionicons name="calendar" size={24} color={theme.primary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  icon: {
    marginRight: 4,
  },
  label: {
    fontSize: 16,
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
    fontSize: 32,
    fontFamily: "Inter-Bold",
    marginBottom: 16,
  },
  yearlyBox: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  yearlyLabel: {
    fontSize: 13,
    fontFamily: "Inter",
  },
  yearlyAmount: {
    fontSize: 16,
    fontFamily: "Inter-Bold",
  },
});
