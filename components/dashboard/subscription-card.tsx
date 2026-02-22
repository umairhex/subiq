import { useCurrencyStore } from "@/stores/currency-store";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export interface Subscription {
  id: string;
  name: string;
  startDate: string;
  renewalDate: string;
  billingCycle: "Monthly" | "Yearly";
  price: number;
  paymentMethod: string;
  status: "Active" | "Trial" | "Cancelled";
  daysLeft: number;
  icon: keyof typeof Ionicons.glyphMap;
}

interface SubscriptionCardProps {
  subscription: Subscription;
  theme: any;
}

export function SubscriptionCard({
  subscription,
  theme,
}: SubscriptionCardProps) {
  const getStatusColor = () => {
    switch (subscription.status) {
      case "Active":
        return theme.primary;
      case "Trial":
        return "#FFAB00";
      case "Cancelled":
        return theme.mutedForeground;
      default:
        return theme.primary;
    }
  };

  const { currency } = useCurrencyStore();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
          shadowColor: theme.foreground,
          elevation: 2,
        },
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.platformInfo}>
          <View style={[styles.iconBox, { backgroundColor: theme.input }]}>
            <Ionicons
              name={subscription.icon}
              size={24}
              color={theme.foreground}
            />
          </View>
          <View>
            <Text style={[styles.name, { color: theme.foreground }]}>
              {subscription.name}
            </Text>
            <Text style={[styles.billing, { color: theme.mutedForeground }]}>
              {subscription.billingCycle}
            </Text>
          </View>
        </View>
        <Text style={[styles.price, { color: theme.foreground }]}>
          {currency.symbol}
          {subscription.price.toFixed(2)}
        </Text>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      <View style={styles.detailsRow}>
        <View>
          <Text style={[styles.detailLabel, { color: theme.mutedForeground }]}>
            Next Renewal
          </Text>
          <Text style={[styles.detailValue, { color: theme.foreground }]}>
            {subscription.renewalDate}
          </Text>
        </View>
        <View style={styles.statusBox}>
          <View
            style={[styles.statusDot, { backgroundColor: getStatusColor() }]}
          />
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {subscription.status}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.countdown, { color: theme.mutedForeground }]}>
          Renews in{" "}
          <Text style={{ color: theme.foreground }}>
            {subscription.daysLeft} days
          </Text>
        </Text>
        <Text style={[styles.method, { color: theme.mutedForeground }]}>
          {subscription.paymentMethod}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  platformInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 15,
    fontFamily: "Inter-Bold",
  },
  billing: {
    fontSize: 12,
    fontFamily: "Inter",
  },
  price: {
    fontSize: 16,
    fontFamily: "Inter-Bold",
  },
  divider: {
    height: 1,
    marginVertical: 8,
    opacity: 0.5,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 11,
    fontFamily: "Inter",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 13,
    fontFamily: "Inter-Bold",
  },
  statusBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.03)",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontFamily: "Inter-Bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  countdown: {
    fontSize: 12,
    fontFamily: "Inter",
  },
  method: {
    fontSize: 11,
    fontFamily: "Inter",
    fontStyle: "italic",
  },
});
