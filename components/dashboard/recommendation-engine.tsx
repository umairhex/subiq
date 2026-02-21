import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  UIManager,
  View,
} from "react-native";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export interface Recommendation {
  id: string;
  type: "Duplicate" | "Inactive" | "Trial";
  title: string;
  description: string;
  savings: number;
  confidence: number;
}

interface RecommendationEngineProps {
  recommendations: Recommendation[];
  theme: any;
}

export function RecommendationEngine({
  recommendations,
  theme,
}: RecommendationEngineProps) {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
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
        return (
          <Pressable
            key={rec.id}
            onPress={() => toggleExpand(rec.id)}
            style={[
              styles.card,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <View style={styles.badgeRow}>
              <View
                style={[styles.typeBadge, { backgroundColor: theme.input }]}
              >
                <Text style={[styles.typeText, { color: theme.primary }]}>
                  {rec.type}
                </Text>
              </View>
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
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size={18}
                  color={theme.mutedForeground}
                  style={{ marginLeft: 8 }}
                />
              </View>
            </View>

            <Text style={[styles.recTitle, { color: theme.foreground }]}>
              {rec.title}
            </Text>

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
                    <Text style={[styles.saveAmount, { color: theme.primary }]}>
                      ${rec.savings}/mo
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
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: "Inter-Bold",
  },
  card: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  rightHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 12,
    fontFamily: "Inter-Bold",
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  scoreLabel: {
    fontSize: 12,
    fontFamily: "Inter",
  },
  scoreValue: {
    fontSize: 12,
    fontFamily: "Inter-Bold",
  },
  recTitle: {
    fontSize: 16,
    fontFamily: "Inter-Bold",
  },
  expandedContent: {
    marginTop: 12,
  },
  recDesc: {
    fontSize: 14,
    fontFamily: "Inter",
    lineHeight: 20,
    marginBottom: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  saveLabel: {
    fontSize: 11,
    fontFamily: "Inter",
  },
  saveAmount: {
    fontSize: 16,
    fontFamily: "Inter-Bold",
  },
  actionBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  actionText: {
    fontSize: 14,
    fontFamily: "Inter-Bold",
  },
});
