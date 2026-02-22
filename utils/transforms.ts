import type { ActivityLog } from '@/components/activity/activity-log-item';
import type { Asset } from '@/components/assets/asset-card';
import type { AssetLog } from '@/components/assets/asset-log-item';
import type { Recommendation } from '@/components/dashboard/recommendation-engine';
import type { Subscription } from '@/components/dashboard/subscription-card';
import type { SubscriptionLog } from '@/components/dashboard/subscription-log-item';
import type {
    ActivityRow,
    AssetLogRow,
    AssetRow,
    RecommendationRow,
    SubscriptionLogRow,
    SubscriptionRow,
} from '@/types/database';

export function toSubscription(row: SubscriptionRow): Subscription {
  const renewalDate = row.renewal_date
    ? new Date(row.renewal_date)
    : new Date();
  const now = new Date();
  const daysLeft = Math.max(
    0,
    Math.ceil((renewalDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  );

  return {
    id: row.id,
    name: row.name,
    startDate: row.start_date,
    renewalDate: row.renewal_date ?? row.start_date,
    billingCycle: row.billing_cycle,
    price: row.price,
    paymentMethod: row.payment_method,
    status: row.status,
    daysLeft,
    icon: (row.icon ?? 'card-outline') as Subscription['icon'],
  };
}

export function toSubscriptionLog(row: SubscriptionLogRow): SubscriptionLog {
  return {
    id: row.id,
    subscriptionName: row.subscription_name,
    action: row.action,
    date: new Date(row.created_at).toLocaleDateString(),
    details: row.details ?? undefined,
  };
}

export function toAssetLog(row: AssetLogRow): AssetLog {
  return {
    id: row.id,
    assetName: row.asset_name,
    action: row.action,
    date: new Date(row.created_at).toLocaleDateString(),
    details: row.details ?? undefined,
  };
}

export function toActivity(row: ActivityRow): ActivityLog {
  return {
    id: row.id,
    platform: row.platform,
    activityName: row.activity_name,
    date: new Date(row.created_at).toLocaleDateString(),
    duration: row.duration ?? undefined,
    notes: row.notes ?? undefined,
  };
}

export function toAsset(row: AssetRow): Asset {
  const warrantyEnd = new Date(row.warranty_end);
  const now = new Date();
  const daysUntilExpiry = Math.ceil(
    (warrantyEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  let status: Asset['status'];
  if (daysUntilExpiry < 0) {
    status = 'Out of Warranty';
  } else if (daysUntilExpiry <= 30) {
    status = 'Expiring Soon';
  } else {
    status = 'In Warranty';
  }

  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    purchaseDate: row.purchase_date,
    warrantyStart: row.warranty_start,
    warrantyEnd: row.warranty_end,
    hasInvoice: row.has_invoice,
    reminderEnabled: row.reminder_enabled,
    status,
  };
}

export function toRecommendation(row: RecommendationRow): Recommendation {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    description: row.description,
    savings: row.savings,
    confidence: row.confidence,
  };
}
