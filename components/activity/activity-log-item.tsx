import { useAppTheme } from '@/hooks/use-app-theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export interface ActivityLog {
  id: string;
  platform: string;
  activityName: string;
  date: string;
  duration?: string;
  notes?: string;
}

interface ActivityLogItemProps {
  log: ActivityLog;
}

export function ActivityLogItem({ log }: ActivityLogItemProps) {
  const { theme } = useAppTheme();
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
          borderLeftColor: theme.primary,
          shadowColor: theme.foreground,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={[styles.platform, { color: theme.primary }]}>
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
          <View style={styles.metaContainer}>
            <View
              style={[
                styles.durationBadge,
                { backgroundColor: theme.muted + '20' },
              ]}
            >
              <Ionicons
                name="time-outline"
                size={12}
                color={theme.mutedForeground}
              />
              <Text
                style={[styles.durationText, { color: theme.mutedForeground }]}
              >
                {log.duration}
              </Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.arrowContainer}>
        <Ionicons
          name="chevron-forward"
          size={16}
          color={theme.mutedForeground}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderLeftWidth: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  content: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  platform: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  date: {
    fontSize: 12,
    fontWeight: '400',
  },
  activityName: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  durationText: {
    fontSize: 12,
    fontWeight: '500',
  },
  arrowContainer: {
    marginLeft: 12,
  },
});
