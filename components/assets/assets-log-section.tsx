import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "../themed-text";
import { AssetLog, AssetLogItem } from "./asset-log-item";

interface AssetsLogSectionProps {
  logs: AssetLog[];
  theme: any;
}

export function AssetsLogSection({ logs, theme }: AssetsLogSectionProps) {
  if (logs.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText
          type="subtitle"
          style={[styles.title, { color: theme.foreground }]}
        >
          Recent Asset Activity
        </ThemedText>
      </View>

      <View style={styles.logsList}>
        {logs.slice(0, 5).map((log) => (
          <AssetLogItem key={log.id} log={log} theme={theme} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
  },
  logsList: {
    gap: 8,
  },
});
