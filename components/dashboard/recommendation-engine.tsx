import { useAppTheme } from '@/hooks/use-app-theme';
import { useCurrencyStore } from '@/stores/currency-store';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  UIManager,
  View,
} from 'react-native';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export interface Recommendation {
  id: string;
  type: 'Duplicate' | 'Inactive' | 'Trial';
  title: string;
  description: string;
  savings: number;
  confidence: number;
}

interface RecommendationEngineProps {
  recommendations: Recommendation[];
  onGenerate?: () => void;
  isGenerating?: boolean;
}

export function RecommendationEngine({
  recommendations,
  onGenerate,
  isGenerating,
}: RecommendationEngineProps) {
  const { theme } = useAppTheme();
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const { currency } = useCurrencyStore();

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Duplicate':
        return theme.destructive;
      case 'Inactive':
        return theme.mutedForeground;
      case 'Trial':
        return theme.warning;
      default:
        return theme.primary;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="sparkles" size={20} color={theme.primary} />
          <Text style={[styles.title, { color: theme.foreground }]}>
            AI Recommendations
          </Text>
        </View>
        {onGenerate && (
          <Pressable
            onPress={onGenerate}
            disabled={isGenerating}
            style={[
              styles.generateBtn,
              {
                backgroundColor: theme.primary,
                opacity: isGenerating ? 0.6 : 1,
              },
            ]}
          >
            {isGenerating ? (
              <ActivityIndicator size="small" color={theme.primaryForeground} />
            ) : (
              <>
                <Ionicons
                  name="refresh"
                  size={14}
                  color={theme.primaryForeground}
                />
                <Text
                  style={[
                    styles.generateText,
                    { color: theme.primaryForeground },
                  ]}
                >
                  Generate
                </Text>
              </>
            )}
          </Pressable>
        )}
      </View>

      {recommendations.length === 0 && !isGenerating && (
        <View
          style={[
            styles.emptyState,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <Ionicons
            name="bulb-outline"
            size={32}
            color={theme.mutedForeground}
          />
          <Text style={[styles.emptyText, { color: theme.mutedForeground }]}>
            Tap Generate to get AI-powered savings recommendations based on your
            subscriptions.
          </Text>
        </View>
      )}

      {isGenerating && recommendations.length === 0 && (
        <View
          style={[
            styles.emptyState,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.emptyText, { color: theme.mutedForeground }]}>
            Analyzing your subscriptions...
          </Text>
        </View>
      )}

      {recommendations.map((rec) => {
        const isExpanded = expandedIds.includes(rec.id);
        const typeColor = getTypeColor(rec.type);
        return (
          <Pressable
            key={rec.id}
            onPress={() => toggleExpand(rec.id)}
            style={[
              styles.card,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
                borderLeftColor: typeColor,
                shadowColor: theme.foreground,
                elevation: 2,
              },
            ]}
          >
            <View style={styles.cardContent}>
              <View style={styles.headerRow}>
                <Text style={[styles.recTitle, { color: theme.foreground }]}>
                  {rec.title}
                </Text>
                <View style={styles.rightHeader}>
                  <View style={styles.scoreRow}>
                    <Text
                      style={[
                        styles.scoreLabel,
                        { color: theme.mutedForeground },
                      ]}
                    >
                      Confidence
                    </Text>
                    <Text
                      style={[styles.scoreValue, { color: theme.foreground }]}
                    >
                      {rec.confidence}%
                    </Text>
                  </View>
                  <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={theme.mutedForeground}
                    style={{ marginLeft: 8 }}
                  />
                </View>
              </View>

              {isExpanded && (
                <View style={styles.expandedContent}>
                  <Text
                    style={[styles.recDesc, { color: theme.mutedForeground }]}
                  >
                    {rec.description}
                  </Text>

                  <View style={styles.footer}>
                    <View>
                      <Text
                        style={[
                          styles.saveLabel,
                          { color: theme.mutedForeground },
                        ]}
                      >
                        Potential Savings
                      </Text>
                      <Text
                        style={[styles.saveAmount, { color: theme.primary }]}
                      >
                        {currency.symbol} {rec.savings}/mo
                      </Text>
                    </View>
                    <Pressable
                      style={[
                        styles.actionBtn,
                        { backgroundColor: theme.primary },
                      ]}
                    >
                      <Text
                        style={[
                          styles.actionText,
                          { color: theme.primaryForeground },
                        ]}
                      >
                        Review
                      </Text>
                    </Pressable>
                  </View>
                </View>
              )}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderLeftWidth: 4,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cardContent: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  rightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scoreLabel: {
    fontSize: 12,
    fontFamily: 'Inter',
  },
  scoreValue: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  recTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
  },
  expandedContent: {
    marginTop: 8,
  },
  recDesc: {
    fontSize: 13,
    fontFamily: 'Inter',
    lineHeight: 18,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  saveLabel: {
    fontSize: 11,
    fontFamily: 'Inter',
  },
  saveAmount: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
  },
  actionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionText: {
    fontSize: 13,
    fontFamily: 'Inter-Bold',
  },
  generateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  generateText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    gap: 12,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 13,
    fontFamily: 'Inter',
    textAlign: 'center',
    lineHeight: 18,
  },
});
