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
    <View style={[styles.container, { borderBottomColor: theme.border }]}>
      <View style={[styles.iconContainer, { backgroundColor: theme.input }]}>
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
    paddingVertical: 16,
    borderBottomWidth: 1,
    alignItems: "center",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
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
    marginBottom: 4,
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
