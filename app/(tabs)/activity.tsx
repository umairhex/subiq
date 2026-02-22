import { ActivityLogItem } from '@/components/activity/activity-log-item';
import { ThemedText } from '@/components/themed-text';
import { AddActivityModal } from '@/components/ui/add-activity-modal';
import { StatsCard } from '@/components/ui/stats-card';
import { useActivities, useCreateActivity } from '@/hooks/use-activities';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useSubscriptions } from '@/hooks/use-subscriptions';
import { useCurrencyStore } from '@/stores/currency-store';
import { toActivity } from '@/utils/transforms';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ActivityScreen() {
  const { theme } = useAppTheme();
  const { currency } = useCurrencyStore();

  const [showAddModal, setShowAddModal] = React.useState(false);

  const { data: activities, isLoading } = useActivities();
  const { data: subscriptions } = useSubscriptions();
  const createActivity = useCreateActivity();

  const mapped = useMemo(
    () => (activities ?? []).map(toActivity),
    [activities]
  );

  const stats = useMemo(() => {
    const platformCounts: Record<string, number> = {};
    let totalHours = 0;

    for (const a of mapped) {
      platformCounts[a.platform] = (platformCounts[a.platform] ?? 0) + 1;
      if (a.duration) {
        const hours = parseFloat(a.duration);
        if (!isNaN(hours)) totalHours += hours;
      }
    }

    const mostUsed = Object.entries(platformCounts).sort(
      (a, b) => b[1] - a[1]
    )[0];
    return {
      mostUsed: mostUsed?.[0] ?? 'N/A',
      totalHours: totalHours.toFixed(1),
    };
  }, [mapped]);

  const costInsight = useMemo(() => {
    if (!subscriptions || subscriptions.length === 0 || mapped.length === 0) {
      return { platform: 'N/A', costPerUse: 0, monthlySpend: 0 };
    }
    const platform = stats.mostUsed;
    const sub = subscriptions.find(
      (s) => s.name.toLowerCase() === platform.toLowerCase()
    );
    const monthlyPrice = sub
      ? sub.billing_cycle === 'Yearly'
        ? sub.price / 12
        : sub.price
      : 0;
    const uses = mapped.filter(
      (a) => a.platform.toLowerCase() === platform.toLowerCase()
    ).length;
    return {
      platform,
      costPerUse: uses > 0 ? monthlyPrice / uses : 0,
      monthlySpend: monthlyPrice,
    };
  }, [subscriptions, mapped, stats.mostUsed]);

  const handleAddActivity = async (activity: {
    platform: string;
    activityName: string;
    duration: string;
  }): Promise<void> => {
    console.log('LOG: Adding activity:', activity);
    await createActivity.mutateAsync({
      platform: activity.platform,
      activity_name: activity.activityName,
      duration: activity.duration || null,
    });
    setShowAddModal(false);
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.background }}
      edges={['top']}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <View>
            <ThemedText
              type="title"
              style={[styles.title, { color: theme.foreground }]}
            >
              Activity
            </ThemedText>
            <ThemedText
              type="default"
              style={[styles.subtitle, { color: theme.mutedForeground }]}
            >
              Track your usage and insights
            </ThemedText>
          </View>
          <Pressable
            style={[styles.logBtn, { backgroundColor: theme.primary }]}
            onPress={() => setShowAddModal(true)}
          >
            <Ionicons name="add" size={20} color={theme.primaryForeground} />
          </Pressable>
        </View>

        <StatsCard
          items={[
            {
              label: 'Most Used',
              value: stats.mostUsed,
              trend:
                mapped.length > 0
                  ? `${mapped.length} activities logged`
                  : undefined,
              trendColor: theme.primary,
            },
            {
              label: 'Total Time',
              value: `${stats.totalHours}h`,
            },
          ]}
        />

        <View
          style={[
            styles.intelligenceCard,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <View style={styles.intelligenceContent}>
            <ThemedText
              type="subtitle"
              style={[styles.intelligenceTitle, { color: theme.foreground }]}
            >
              Usage Intelligence
            </ThemedText>
            <ThemedText
              type="default"
              style={[
                styles.intelligenceDesc,
                { color: theme.mutedForeground },
              ]}
            >
              {costInsight.costPerUse > 0
                ? `Your cost-per-use for ${costInsight.platform} is ${currency.symbol}${costInsight.costPerUse.toFixed(2)}. ${costInsight.costPerUse < 2 ? "You're getting great value!" : 'Consider your usage.'}`
                : 'Log more activities to see cost-per-use insights.'}
            </ThemedText>
          </View>

          <View style={styles.intelligenceMetrics}>
            <View style={styles.metricItem}>
              <ThemedText
                type="default"
                style={[styles.metricLabel, { color: theme.mutedForeground }]}
              >
                This Month
              </ThemedText>
              <ThemedText
                type="defaultSemiBold"
                style={[
                  styles.metricValue,
                  { color: theme.foreground, fontFamily: 'Inter-Bold' },
                ]}
              >
                {currency.symbol} {costInsight.monthlySpend.toFixed(2)}
              </ThemedText>
            </View>

            <View
              style={[styles.metricDivider, { backgroundColor: theme.border }]}
            />

            <View style={styles.metricItem}>
              <ThemedText
                type="default"
                style={[styles.metricLabel, { color: theme.mutedForeground }]}
              >
                Avg. per Use
              </ThemedText>
              <ThemedText
                type="defaultSemiBold"
                style={[
                  styles.metricValue,
                  { color: theme.foreground, fontFamily: 'Inter-Bold' },
                ]}
              >
                {currency.symbol} {costInsight.costPerUse.toFixed(2)}
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <ThemedText
            type="subtitle"
            style={[styles.sectionTitle, { color: theme.foreground }]}
          >
            Recent Activity
          </ThemedText>
        </View>

        {isLoading ? (
          <ActivityIndicator color={theme.primary} style={{ marginTop: 20 }} />
        ) : (
          <View style={styles.listContainer}>
            {mapped.length === 0 ? (
              <ThemedText
                type="default"
                style={{
                  color: theme.mutedForeground,
                  textAlign: 'center',
                  marginTop: 20,
                }}
              >
                No activities yet. Tap + to log one.
              </ThemedText>
            ) : (
              mapped.map((log) => <ActivityLogItem key={log.id} log={log} />)
            )}
          </View>
        )}
      </ScrollView>

      <AddActivityModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddActivity}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  logBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  intelligenceCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  intelligenceContent: {
    marginBottom: 20,
  },
  intelligenceTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  intelligenceDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
  intelligenceMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
    opacity: 0.7,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  metricDivider: {
    width: 1,
    height: 40,
    marginHorizontal: 20,
    opacity: 0.3,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
  },
  listContainer: {
    gap: 8,
  },
});
