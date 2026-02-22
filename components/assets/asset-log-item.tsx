import { LogItem } from '@/components/ui/log-item';
import { useAppTheme } from '@/hooks/use-app-theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

export interface AssetLog {
  id: string;
  assetName: string;
  action:
    | 'Added'
    | 'Warranty Expiring'
    | 'Warranty Expired'
    | 'Maintenance Due';
  date: string;
  details?: string;
}

interface AssetLogItemProps {
  log: AssetLog;
}

export function AssetLogItem({ log }: AssetLogItemProps) {
  const { theme } = useAppTheme();

  const getActionColor = () => {
    switch (log.action) {
      case 'Added':
        return theme.primary;
      case 'Warranty Expiring':
        return theme.destructive;
      case 'Warranty Expired':
        return theme.mutedForeground;
      case 'Maintenance Due':
        return theme.warning;
    }
  };

  const getActionIcon = (): keyof typeof Ionicons.glyphMap => {
    switch (log.action) {
      case 'Added':
        return 'add-circle';
      case 'Warranty Expiring':
        return 'warning';
      case 'Warranty Expired':
        return 'close-circle';
      case 'Maintenance Due':
        return 'construct';
    }
  };

  return (
    <LogItem
      title={log.assetName}
      action={log.action}
      date={log.date}
      details={log.details}
      getActionColor={() => getActionColor()}
      getActionIcon={getActionIcon}
    />
  );
}
