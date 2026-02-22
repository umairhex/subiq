import { Asset, AssetCard } from "@/components/assets/asset-card";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useThemeStore } from "@/stores/theme-store";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    useColorScheme,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MOCK_ASSETS: Asset[] = [
  {
    id: "1",
    name: "MacBook Pro M2",
    brand: "Apple",
    purchaseDate: "Oct 12, 2023",
    warrantyStart: "Oct 12, 2023",
    warrantyEnd: "Oct 12, 2024",
    hasInvoice: true,
    reminderEnabled: true,
    status: "In Warranty",
  },
  {
    id: "2",
    name: "Washing Machine",
    brand: "Samsung",
    purchaseDate: "Mar 10, 2022",
    warrantyStart: "Mar 10, 2022",
    warrantyEnd: "Mar 10, 2024",
    hasInvoice: false,
    reminderEnabled: true,
    status: "Expiring Soon",
  },
  {
    id: "3",
    name: "PS5 Console",
    brand: "Sony",
    purchaseDate: "Nov 15, 2021",
    warrantyStart: "Nov 15, 2021",
    warrantyEnd: "Nov 15, 2022",
    hasInvoice: true,
    reminderEnabled: false,
    status: "Out of Warranty",
  },
];

export default function AssetsScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const { theme: overrideTheme } = useThemeStore();
  const effectiveColorScheme =
    overrideTheme === "system" ? colorScheme : overrideTheme;
  const theme = Colors[effectiveColorScheme];

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.background }}
      edges={["top"]}
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
              My Assets
            </ThemedText>
            <ThemedText
              type="default"
              style={[styles.subtitle, { color: theme.mutedForeground }]}
            >
              Track your warranties and items
            </ThemedText>
          </View>
          <Pressable
            style={[styles.addBtn, { backgroundColor: theme.primary }]}
          >
            <Ionicons name="add" size={24} color={theme.primaryForeground} />
          </Pressable>
        </View>

        <View
          style={[
            styles.summaryCard,
            {
              backgroundColor: theme.primary + "08",
              borderColor: theme.primary + "20",
            },
          ]}
        >
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Ionicons name="cube" size={24} color={theme.primary} />
              <View>
                <ThemedText
                  type="default"
                  style={[
                    styles.summaryLabel,
                    { color: theme.mutedForeground },
                  ]}
                >
                  Total Assets
                </ThemedText>
                <ThemedText
                  type="subtitle"
                  style={[styles.summaryValue, { color: theme.foreground }]}
                >
                  12 Items
                </ThemedText>
              </View>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <View style={styles.summaryItem}>
              <Ionicons
                name="shield-checkmark"
                size={24}
                color={theme.primary}
              />
              <View>
                <ThemedText
                  type="default"
                  style={[
                    styles.summaryLabel,
                    { color: theme.mutedForeground },
                  ]}
                >
                  In Warranty
                </ThemedText>
                <ThemedText
                  type="subtitle"
                  style={[styles.summaryValue, { color: theme.foreground }]}
                >
                  8 Active
                </ThemedText>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.searchBar, { backgroundColor: theme.input }]}>
          <Ionicons name="search" size={20} color={theme.mutedForeground} />
          <ThemedText
            type="default"
            style={[styles.searchText, { color: theme.mutedForeground }]}
          >
            Search assets or brands...
          </ThemedText>
        </View>

        <View style={styles.sectionHeader}>
          <ThemedText
            type="subtitle"
            style={[styles.sectionTitle, { color: theme.foreground }]}
          >
            All Assets
          </ThemedText>
        </View>

        <View style={styles.assetsList}>
          {MOCK_ASSETS.map((asset) => (
            <AssetCard key={asset.id} asset={asset} theme={theme} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
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
  addBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryCard: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  summaryItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  summaryValue: {
    fontSize: 20,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 40,
    opacity: 0.3,
  },
  searchBar: {
    height: 48,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  searchText: {
    marginLeft: 12,
    fontSize: 15,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
  },
  assetsList: {
    gap: 12,
  },
});
