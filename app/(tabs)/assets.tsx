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
      <View style={styles.header}>
        <ThemedText
          type="title"
          style={[styles.title, { color: theme.foreground }]}
        >
          My Assets
        </ThemedText>
        <Pressable style={[styles.addBtn, { backgroundColor: theme.primary }]}>
          <Ionicons name="add" size={24} color={theme.primaryForeground} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.summaryCard, { backgroundColor: theme.primary }]}>
          <View style={styles.summaryItem}>
            <ThemedText
              type="default"
              style={[
                styles.summaryLabel,
                { color: theme.primaryForeground, opacity: 0.8 },
              ]}
            >
              Total Assets
            </ThemedText>
            <ThemedText
              type="subtitle"
              style={[styles.summaryValue, { color: theme.primaryForeground }]}
            >
              12 Items
            </ThemedText>
          </View>
          <View
            style={[
              styles.summaryDivider,
              { backgroundColor: theme.primaryForeground },
            ]}
          />
          <View style={styles.summaryItem}>
            <ThemedText
              type="default"
              style={[
                styles.summaryLabel,
                { color: theme.primaryForeground, opacity: 0.8 },
              ]}
            >
              In Warranty
            </ThemedText>
            <ThemedText
              type="subtitle"
              style={[styles.summaryValue, { color: theme.primaryForeground }]}
            >
              8 Active
            </ThemedText>
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

        <View style={styles.filterSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            {["All Items", "Warranty Soon", "Electronics", "Appliances"].map(
              (label, idx) => (
                <Pressable
                  key={label}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: idx === 0 ? theme.primary : theme.input,
                    },
                  ]}
                >
                  <ThemedText
                    type="default"
                    style={[
                      styles.filterText,
                      {
                        color:
                          idx === 0
                            ? theme.primaryForeground
                            : theme.mutedForeground,
                      },
                    ]}
                  >
                    {label}
                  </ThemedText>
                </Pressable>
              ),
            )}
          </ScrollView>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginTop: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  summaryCard: {
    marginHorizontal: 24,
    padding: 24,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 12,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  summaryValue: {
    fontSize: 20,
  },
  summaryDivider: {
    width: 1,
    height: 40,
    opacity: 0.3,
  },
  searchBar: {
    marginHorizontal: 24,
    height: 56,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  searchText: {
    marginLeft: 12,
    fontSize: 15,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterScroll: {
    paddingHorizontal: 24,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  filterText: {
    fontSize: 14,
  },
  assetsList: {
    paddingHorizontal: 24,
  },
});
