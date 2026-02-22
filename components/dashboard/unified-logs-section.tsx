import { useAppTheme } from '@/hooks/use-app-theme';
import { AssetLog, AssetLogItem } from '../assets/asset-log-item';
import { SubscriptionLog, SubscriptionLogItem } from './subscription-log-item';

import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../themed-text';

type LogType = 'all' | 'assets' | 'subscriptions';

interface UnifiedLogsSectionProps {
  assetLogs: AssetLog[];
  subscriptionLogs: SubscriptionLog[];
}

export function UnifiedLogsSection({
  assetLogs,
  subscriptionLogs,
}: UnifiedLogsSectionProps) {
  const { theme } = useAppTheme();
  const [activeFilter, setActiveFilter] = useState<LogType>('all');

  const getFilteredLogs = () => {
    switch (activeFilter) {
      case 'assets':
        return assetLogs.map((log) => ({ ...log, type: 'asset' as const }));
      case 'subscriptions':
        return subscriptionLogs.map((log) => ({
          ...log,
          type: 'subscription' as const,
        }));
      default:
        return [
          ...assetLogs.map((log) => ({ ...log, type: 'asset' as const })),
          ...subscriptionLogs.map((log) => ({
            ...log,
            type: 'subscription' as const,
          })),
        ].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
    }
  };

  const filteredLogs = getFilteredLogs();

  if (filteredLogs.length === 0) {
    return null;
  }

  const renderLogItem = (log: any) => {
    if (log.type === 'asset') {
      return <AssetLogItem key={`asset-${log.id}`} log={log} />;
    } else {
      return <SubscriptionLogItem key={`subscription-${log.id}`} log={log} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText
          type="subtitle"
          style={[styles.title, { color: theme.foreground }]}
        >
          Recent Activity
        </ThemedText>
      </View>

      <View style={styles.filterContainer}>
        {[
          { key: 'all', label: 'All' },
          { key: 'assets', label: 'Assets' },
          { key: 'subscriptions', label: 'Subscriptions' },
        ].map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterTab,
              {
                backgroundColor:
                  activeFilter === filter.key ? theme.primary : theme.secondary,
                borderColor: theme.border,
              },
            ]}
            onPress={() => setActiveFilter(filter.key as LogType)}
          >
            <ThemedText
              type="default"
              style={[
                styles.filterText,
                {
                  color:
                    activeFilter === filter.key
                      ? theme.primaryForeground
                      : theme.secondaryForeground,
                },
              ]}
            >
              {filter.label}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.logsContainer, { borderColor: theme.border }]}>
        <ScrollView
          showsVerticalScrollIndicator={true}
          contentContainerStyle={styles.scrollContent}
          style={styles.scrollView}
        >
          {filteredLogs.slice(0, 10).map(renderLogItem)}
        </ScrollView>
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
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 6,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 32,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
  },
  logsContainer: {
    borderWidth: 1,
    borderRadius: 12,
    height: 320,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 8,
  },
});
