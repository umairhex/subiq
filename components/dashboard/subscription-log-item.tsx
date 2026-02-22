import { LogItem } from "@/components/ui/log-item";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";

export interface SubscriptionLog {
  id: string;
  subscriptionName: string;
  action:
    | "Added"
    | "Renewed"
    | "Cancelled"
    | "Payment Failed"
    | "Price Changed";
  date: string;
  details?: string;
}

interface SubscriptionLogItemProps {
  log: SubscriptionLog;
}

export function SubscriptionLogItem({ log }: SubscriptionLogItemProps) {
  const { theme } = useAppTheme();

  const getActionColor = () => {
    switch (log.action) {
      case "Added":
      case "Renewed":
        return theme.primary;
      case "Cancelled":
      case "Payment Failed":
        return theme.destructive;
      case "Price Changed":
        return theme.warning;
    }
  };

  const getActionIcon = (): keyof typeof Ionicons.glyphMap => {
    switch (log.action) {
      case "Added":
        return "add-circle";
      case "Renewed":
        return "refresh-circle";
      case "Cancelled":
        return "close-circle";
      case "Payment Failed":
        return "alert-circle";
      case "Price Changed":
        return "trending-up";
    }
  };

  return (
    <LogItem
      title={log.subscriptionName}
      action={log.action}
      date={log.date}
      details={log.details}
      getActionColor={() => getActionColor()}
      getActionIcon={getActionIcon}
    />
  );
}
