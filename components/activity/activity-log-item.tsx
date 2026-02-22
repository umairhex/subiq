import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export interface ActivityLog {
  id: string;
  platform: string;
  activityName: string;
  date: string;
  duration?: string;
  notes?: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface ActivityLogItemProps {
  log: ActivityLog;
  theme: any;
}

export function ActivityLogItem({ log, theme }: ActivityLogItemProps) {
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
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: theme.primary + "20" },
        ]}
      >
        <Ionicons name={log.icon} size={20} color={theme.primary} />
      </View>
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={[styles.platform, { color: theme.mutedForeground }]}>
            {log.platform}
          </Text>
          <Text style={[styles.date, { color: theme.mutedForeground }]}>
            {log.date}
          </Text>
        </View>
        <Text style={[styles.activityName, { color: theme.foreground }]}>
          {log.activityName}
        </Text>
        {log.duration && (
          <View style={styles.metaRow}>
            <Ionicons
              name="time-outline"
              size={14}
              color={theme.mutedForeground}
            />
            <Text style={[styles.metaText, { color: theme.mutedForeground }]}>
              {log.duration}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 8,
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  platform: {
    fontSize: 12,
    fontFamily: "Inter-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  date: {
    fontSize: 12,
    fontFamily: "Inter",
  },
  activityName: {
    fontSize: 16,
    fontFamily: "Inter-Bold",
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    fontFamily: "Inter",
  },
});
