import { ExpenseSummary } from '@/components/dashboard/expense-summary';
import { RecommendationEngine } from '@/components/dashboard/recommendation-engine';
import {
  SubscriptionCard,
  type Subscription,
} from '@/components/dashboard/subscription-card';
import { UnifiedLogsSection } from '@/components/dashboard/unified-logs-section';
import { ThemedText } from '@/components/themed-text';
import { AddSubscriptionModal } from '@/components/ui/add-subscription-modal';
import { useGenerateRecommendations } from '@/hooks/use-ai-recommendations';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAssetLogs } from '@/hooks/use-assets';
import { useExpenseSummary, useRecommendations } from '@/hooks/use-dashboard';
import {
  useCreateSubscription,
  useDeleteSubscription,
  useSubscriptionLogs,
  useSubscriptions,
  useUpdateSubscription,
} from '@/hooks/use-subscriptions';
import {
  toAssetLog,
  toRecommendation,
  toSubscription,
  toSubscriptionLog,
} from '@/utils/transforms';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DashboardScreen() {
  const { theme } = useAppTheme();
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [editingSubscription, setEditingSubscription] =
    React.useState<Subscription | null>(null);

  const { data: subscriptions, isLoading: subsLoading } = useSubscriptions();
  const { data: expenseSummary } = useExpenseSummary();
  const { data: recommendations } = useRecommendations();
  const { data: subscriptionLogs } = useSubscriptionLogs();
  const { data: assetLogs } = useAssetLogs();
  const createSubscription = useCreateSubscription();
  const updateSubscription = useUpdateSubscription();
  const deleteSubscription = useDeleteSubscription();
  const generateRecs = useGenerateRecommendations();

  const handleAddSubscription = async (subscription: {
    name: string;
    price: string;
    billingCycle: 'Monthly' | 'Yearly';
    paymentMethod: string;
    startDate: string;
    icon: string;
  }): Promise<void> => {
    console.log('LOG: Adding subscription:', subscription);
    await createSubscription.mutateAsync({
      name: subscription.name,
      price: parseFloat(subscription.price),
      billing_cycle: subscription.billingCycle,
      payment_method: subscription.paymentMethod,
      start_date: subscription.startDate,
      icon: subscription.icon,
    });
    setShowAddModal(false);
  };

  const handleEditSubscription = (subscription: Subscription) => {
    setEditingSubscription(subscription);
  };

  const handleDeleteSubscription = async (subscriptionId: string) => {
    const subscription = mappedSubs.find((s) => s.id === subscriptionId);
    if (subscription) {
      await deleteSubscription.mutateAsync({
        id: subscriptionId,
        name: subscription.name,
      });
    }
  };

  const handleUpdateSubscription = async (subscription: {
    name: string;
    price: string;
    billingCycle: 'Monthly' | 'Yearly';
    paymentMethod: string;
    startDate: string;
    icon: string;
  }): Promise<void> => {
    if (editingSubscription) {
      await updateSubscription.mutateAsync({
        id: editingSubscription.id,
        name: subscription.name,
        price: parseFloat(subscription.price),
        billing_cycle: subscription.billingCycle,
        payment_method: subscription.paymentMethod,
        start_date: subscription.startDate,
        icon: subscription.icon,
      });
      setEditingSubscription(null);
    }
  };

  const mappedSubs = (subscriptions ?? []).map(toSubscription);
  const mappedRecs = (recommendations ?? []).map(toRecommendation);
  const mappedSubLogs = (subscriptionLogs ?? []).map(toSubscriptionLog);
  const mappedAssetLogs = (assetLogs ?? []).map(toAssetLog);

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
          totalMonthly={expenseSummary?.totalMonthly ?? 0}
          totalYearly={expenseSummary?.totalYearly ?? 0}
          trendPercentage={expenseSummary?.trendPercentage ?? 0}
        />

        <RecommendationEngine
          recommendations={mappedRecs}
          onGenerate={() => generateRecs.mutate()}
          isGenerating={generateRecs.isPending}
        />

        <UnifiedLogsSection
          assetLogs={mappedAssetLogs}
          subscriptionLogs={mappedSubLogs}
        />

        <View style={styles.sectionHeader}>
          <ThemedText
            type="subtitle"
            style={[styles.sectionTitle, { color: theme.foreground }]}
          >
            Subscriptions
          </ThemedText>
        </View>

        {subsLoading ? (
          <ActivityIndicator color={theme.primary} style={{ marginTop: 20 }} />
        ) : (
          <View style={styles.subscriptionList}>
            {mappedSubs.length === 0 ? (
              <ThemedText
                type="default"
                style={{
                  color: theme.mutedForeground,
                  textAlign: 'center',
                  marginTop: 20,
                }}
              >
                No subscriptions yet. Tap + to add one.
              </ThemedText>
            ) : (
              mappedSubs.map((sub) => (
                <SubscriptionCard
                  key={sub.id}
                  subscription={sub}
                  onEdit={handleEditSubscription}
                  onDelete={handleDeleteSubscription}
                />
              ))
            )}
          </View>
        )}
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

      <AddSubscriptionModal
        visible={!!editingSubscription}
        onClose={() => setEditingSubscription(null)}
        onAdd={handleUpdateSubscription}
        editingSubscription={editingSubscription}
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
