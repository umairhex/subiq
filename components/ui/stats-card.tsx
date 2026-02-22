import { useAppTheme } from '@/hooks/use-app-theme';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../themed-text';

export interface StatItem {
  label: string;
  value: string;
  trend?: string;
  trendColor?: string;
}

interface StatsCardProps {
  items: StatItem[];
}

export function StatsCard({ items }: StatsCardProps) {
  const { theme } = useAppTheme();
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
      ]}
    >
      <View style={styles.row}>
        {items.map((item, index) => (
          <React.Fragment key={item.label}>
            <View style={styles.item}>
              <View>
                <ThemedText
                  type="default"
                  style={[styles.label, { color: theme.mutedForeground }]}
                >
                  {item.label}
                </ThemedText>
                <ThemedText
                  type="subtitle"
                  style={[styles.value, { color: theme.foreground }]}
                >
                  {item.value}
                </ThemedText>
                {item.trend && (
                  <ThemedText
                    type="default"
                    style={[
                      styles.trend,
                      {
                        color: item.trendColor || theme.mutedForeground,
                      },
                    ]}
                  >
                    {item.trend}
                  </ThemedText>
                )}
              </View>
            </View>
            {index < items.length - 1 && <View style={styles.divider} />}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  item: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 2,
  },
  trend: {
    fontSize: 12,
    fontWeight: '500',
  },
  divider: {
    width: 1,
    height: 40,
    marginHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
});
