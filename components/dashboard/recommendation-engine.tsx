import { useAppTheme } from '@/hooks/use-app-theme';
import { useCurrencyStore } from '@/stores/currency-store';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
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
}

export function RecommendationEngine({
  recommendations,
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
        <Ionicons name="sparkles" size={20} color={theme.primary} />
        <Text style={[styles.title, { color: theme.foreground }]}>
          AI Recommendations
        </Text>
      </View>

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
                        {currency.symbol}
                        {rec.savings}/mo
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
    gap: 8,
    marginBottom: 12,
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
});
