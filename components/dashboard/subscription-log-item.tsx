import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export interface SubscriptionLog {
  id: string;
  subscriptionName: string;
  action:
    | "Added"
    | "Renewed"
    | "Cancelled"
    | "Payment Failed"
    | "Price Changed";
  date: string;
  details?: string;
}

interface SubscriptionLogItemProps {
  log: SubscriptionLog;
  theme: any;
}

export function SubscriptionLogItem({ log, theme }: SubscriptionLogItemProps) {
  const getActionColor = () => {
    switch (log.action) {
      case "Added":
        return theme.primary;
      case "Renewed":
        return theme.primary;
      case "Cancelled":
        return theme.destructive;
      case "Payment Failed":
        return theme.destructive;
      case "Price Changed":
        return theme.warning || theme.primary;
      default:
        return theme.primary;
    }
  };

  const getActionIcon = () => {
    switch (log.action) {
      case "Added":
        return "add-circle";
      case "Renewed":
        return "refresh-circle";
      case "Cancelled":
        return "close-circle";
      case "Payment Failed":
        return "alert-circle";
      case "Price Changed":
        return "trending-up";
      default:
        return "information-circle";
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
          shadowColor: theme.foreground,
        },
      ]}
    >
      <View
        style={[styles.accentLine, { backgroundColor: getActionColor() }]}
      />

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.actionContainer}>
            <Ionicons
              name={getActionIcon()}
              size={16}
              color={getActionColor()}
              style={styles.actionIcon}
            />
            <Text style={[styles.action, { color: getActionColor() }]}>
              {log.action}
            </Text>
          </View>
          <Text style={[styles.date, { color: theme.mutedForeground }]}>
            {log.date}
          </Text>
        </View>

        <Text style={[styles.subscriptionName, { color: theme.foreground }]}>
          {log.subscriptionName}
        </Text>

        {log.details && (
          <Text style={[styles.details, { color: theme.mutedForeground }]}>
            {log.details}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 12,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 8,
  },
  accentLine: {
    width: 4,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionIcon: {
    marginRight: 6,
  },
  action: {
    fontSize: 14,
    fontWeight: "600",
  },
  date: {
    fontSize: 12,
  },
  subscriptionName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
  },
});
