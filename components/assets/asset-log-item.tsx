import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export interface AssetLog {
  id: string;
  assetName: string;
  action:
    | "Added"
    | "Warranty Expiring"
    | "Warranty Expired"
    | "Maintenance Due";
  date: string;
  details?: string;
}

interface AssetLogItemProps {
  log: AssetLog;
  theme: any;
}

export function AssetLogItem({ log, theme }: AssetLogItemProps) {
  const getActionColor = () => {
    switch (log.action) {
      case "Added":
        return theme.primary;
      case "Warranty Expiring":
        return theme.destructive;
      case "Warranty Expired":
        return theme.mutedForeground;
      case "Maintenance Due":
        return theme.warning || theme.primary;
      default:
        return theme.primary;
    }
  };

  const getActionIcon = () => {
    switch (log.action) {
      case "Added":
        return "add-circle";
      case "Warranty Expiring":
        return "warning";
      case "Warranty Expired":
        return "close-circle";
      case "Maintenance Due":
        return "construct";
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

        <Text style={[styles.assetName, { color: theme.foreground }]}>
          {log.assetName}
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
  assetName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
  },
});
