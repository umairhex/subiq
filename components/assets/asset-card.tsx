import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export interface Asset {
  id: string;
  name: string;
  brand: string;
  purchaseDate: string;
  warrantyStart: string;
  warrantyEnd: string;
  hasInvoice: boolean;
  reminderEnabled: boolean;
  status: "In Warranty" | "Expiring Soon" | "Out of Warranty";
}

interface AssetCardProps {
  asset: Asset;
}

export function AssetCard({ asset }: AssetCardProps) {
  const { theme } = useAppTheme();
  const isExpiringSoon = asset.status === "Expiring Soon";
  const isOutOfWarranty = asset.status === "Out of Warranty";

  const getStatusColor = () => {
    if (isOutOfWarranty) return theme.mutedForeground;
    if (isExpiringSoon) return theme.destructive;
    return theme.primary;
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
          shadowColor: theme.foreground,
          elevation: 2,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="cube" size={24} color={theme.primary} />
        </View>
        <View style={styles.info}>
          <Text style={[styles.name, { color: theme.foreground }]}>
            {asset.name}
          </Text>
          <Text style={[styles.brand, { color: theme.mutedForeground }]}>
            {asset.brand}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: getStatusColor() + "20",
              borderColor: getStatusColor(),
            },
          ]}
        >
          <Ionicons
            name={
              isOutOfWarranty
                ? "close-circle"
                : isExpiringSoon
                  ? "warning"
                  : "checkmark-circle"
            }
            size={14}
            color={getStatusColor()}
          />
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {asset.status}
          </Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      <View style={styles.warrantyRow}>
        <View style={styles.dateBox}>
          <Text style={[styles.label, { color: theme.mutedForeground }]}>
            Purchased
          </Text>
          <Text style={[styles.value, { color: theme.foreground }]}>
            {asset.purchaseDate}
          </Text>
        </View>
        <View style={styles.dateBox}>
          <Text style={[styles.label, { color: theme.mutedForeground }]}>
            Warranty Expiry
          </Text>
          <Text style={[styles.value, { color: theme.foreground }]}>
            {asset.warrantyEnd}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.actions}>
          {asset.hasInvoice && (
            <View style={styles.actionIcon}>
              <Ionicons
                name="document-text-outline"
                size={18}
                color={theme.primary}
              />
              <Text style={[styles.actionLabel, { color: theme.primary }]}>
                Invoice
              </Text>
            </View>
          )}
          <View style={styles.actionIcon}>
            <Ionicons
              name={
                asset.reminderEnabled
                  ? "notifications"
                  : "notifications-outline"
              }
              size={18}
              color={
                asset.reminderEnabled ? theme.primary : theme.mutedForeground
              }
            />
            <Text
              style={[
                styles.actionLabel,
                {
                  color: asset.reminderEnabled
                    ? theme.primary
                    : theme.mutedForeground,
                },
              ]}
            >
              Alert
            </Text>
          </View>
        </View>
        <Pressable style={[styles.editBtn, { backgroundColor: theme.input }]}>
          <Ionicons
            name="ellipsis-horizontal"
            size={20}
            color={theme.foreground}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.05)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontFamily: "Inter-Bold",
    marginBottom: 2,
  },
  brand: {
    fontSize: 14,
    fontFamily: "Inter",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
    fontFamily: "Inter-Bold",
  },
  divider: {
    height: 1,
    marginVertical: 12,
    opacity: 0.5,
  },
  warrantyRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  dateBox: {
    flex: 1,
  },
  label: {
    fontSize: 11,
    fontFamily: "Inter",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  value: {
    fontSize: 14,
    fontFamily: "Inter-Bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actions: {
    flexDirection: "row",
    gap: 16,
  },
  actionIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionLabel: {
    fontSize: 12,
    fontFamily: "Inter-Bold",
  },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
