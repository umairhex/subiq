import { ExpenseSummary } from '@/components/dashboard/expense-summary';
import { RecommendationEngine } from '@/components/dashboard/recommendation-engine';
import { SubscriptionCard } from '@/components/dashboard/subscription-card';
import { UnifiedLogsSection } from '@/components/dashboard/unified-logs-section';
import { ThemedText } from '@/components/themed-text';
import { AddSubscriptionModal } from '@/components/ui/add-subscription-modal';
import {
  MOCK_ASSET_LOGS,
  MOCK_RECOMMENDATIONS,
  MOCK_SUBSCRIPTION_LOGS,
  MOCK_SUBSCRIPTIONS,
} from '@/constants/mock-data';
import { useAppTheme } from '@/hooks/use-app-theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DashboardScreen() {
  const { theme } = useAppTheme();
  const [showAddModal, setShowAddModal] = React.useState(false);

  const handleAddSubscription = async (subscription: {
    name: string;
    price: string;
    billingCycle: 'Monthly' | 'Yearly';
    paymentMethod: string;
    startDate: string;
  }): Promise<void> => {
    console.log('LOG: Adding subscription:', subscription);
    return new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.background }}
      edges={['top']}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.userHeader}>
          <ThemedText
            type="title"
            style={[styles.userName, { color: theme.foreground }]}
          >
            Dashboard
          </ThemedText>
        </View>

        <ExpenseSummary
          totalMonthly={76.97}
          totalYearly={923.64}
          trendPercentage={-4.2}
        />

        <RecommendationEngine recommendations={MOCK_RECOMMENDATIONS} />

        <UnifiedLogsSection
          assetLogs={MOCK_ASSET_LOGS}
          subscriptionLogs={MOCK_SUBSCRIPTION_LOGS}
        />

        <View style={styles.sectionHeader}>
          <ThemedText
            type="subtitle"
            style={[styles.sectionTitle, { color: theme.foreground }]}
          >
            Subscriptions
          </ThemedText>
        </View>

        <View style={styles.subscriptionList}>
          {MOCK_SUBSCRIPTIONS.map((sub) => (
            <SubscriptionCard key={sub.id} subscription={sub} />
          ))}
        </View>
      </ScrollView>

      <Pressable
        style={[
          styles.fab,
          { backgroundColor: theme.primary, shadowColor: theme.primary },
        ]}
        onPress={() => setShowAddModal(true)}
      >
        <Ionicons name="add" size={32} color={theme.primaryForeground} />
      </Pressable>

      <AddSubscriptionModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddSubscription}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
  },
  subscriptionList: {
    gap: 12,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
});
