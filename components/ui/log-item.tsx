import { useAppTheme } from '@/hooks/use-app-theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface LogItemProps {
  title: string;

  action: string;

  date: string;

  details?: string;

  getActionColor: (theme: ReturnType<typeof useAppTheme>['theme']) => string;

  getActionIcon: () => keyof typeof Ionicons.glyphMap;
}

export function LogItem({
  title,
  action,
  date,
  details,
  getActionColor,
  getActionIcon,
}: LogItemProps) {
  const { theme } = useAppTheme();
  const actionColor = getActionColor(theme);

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
      <View style={[styles.accentLine, { backgroundColor: actionColor }]} />

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.actionContainer}>
            <Ionicons
              name={getActionIcon()}
              size={16}
              color={actionColor}
              style={styles.actionIcon}
            />
            <Text style={[styles.action, { color: actionColor }]}>
              {action}
            </Text>
          </View>
          <Text style={[styles.date, { color: theme.mutedForeground }]}>
            {date}
          </Text>
        </View>

        <Text style={[styles.title, { color: theme.foreground }]}>{title}</Text>

        {details && (
          <Text style={[styles.details, { color: theme.mutedForeground }]}>
            {details}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    marginRight: 6,
  },
  action: {
    fontSize: 14,
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
  },
});
