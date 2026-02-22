import { ActivityLog } from "@/components/activity/activity-log-item";
import { Asset } from "@/components/assets/asset-card";
import { AssetLog } from "@/components/assets/asset-log-item";
import { Recommendation } from "@/components/dashboard/recommendation-engine";
import { Subscription } from "@/components/dashboard/subscription-card";
import { SubscriptionLog } from "@/components/dashboard/subscription-log-item";

export const MOCK_SUBSCRIPTIONS: Subscription[] = [
  {
    id: "1",
    name: "Netflix",
    startDate: "2023-01-15",
    renewalDate: "Mar 15, 2024",
    billingCycle: "Monthly",
    price: 15.99,
    paymentMethod: "Visa **** 4242",
    status: "Active",
    daysLeft: 12,
    icon: "play-circle",
  },
  {
    id: "2",
    name: "Spotify Premium",
    startDate: "2023-06-20",
    renewalDate: "Mar 20, 2024",
    billingCycle: "Monthly",
    price: 10.99,
    paymentMethod: "Mastercard **** 8888",
    status: "Active",
    daysLeft: 17,
    icon: "musical-notes",
  },
  {
    id: "3",
    name: "Adobe Creative Cloud",
    startDate: "2024-01-01",
    renewalDate: "Jan 01, 2025",
    billingCycle: "Yearly",
    price: 599.99,
    paymentMethod: "Apple Pay",
    status: "Active",
    daysLeft: 290,
    icon: "brush",
  },
];

export const MOCK_RECOMMENDATIONS: Recommendation[] = [
  {
    id: "1",
    type: "Duplicate",
    title: "Overlapping Streaming Content",
    description:
      "You have Netflix and HBO Max. 65% of trending content overlaps between these services.",
    savings: 14.99,
    confidence: 92,
  },
  {
    id: "2",
    type: "Inactive",
    title: "Unused Software License",
    description:
      "Adobe Illustrator hasn't been opened in 45 days. Consider downgrading your plan.",
    savings: 32.0,
    confidence: 88,
  },
];

export const MOCK_ASSET_LOGS: AssetLog[] = [
  {
    id: "1",
    assetName: "MacBook Pro M2",
    action: "Added",
    date: "Feb 15, 2024",
    details: "Added with 1-year warranty",
  },
  {
    id: "2",
    assetName: "Washing Machine",
    action: "Warranty Expiring",
    date: "Feb 10, 2024",
    details: "Warranty expires in 12 days",
  },
  {
    id: "3",
    assetName: "PS5 Console",
    action: "Warranty Expired",
    date: "Jan 15, 2024",
    details: "Warranty expired 1 month ago",
  },
  {
    id: "4",
    assetName: "MacBook Pro M2",
    action: "Maintenance Due",
    date: "Jan 20, 2024",
    details: "Recommended cleaning and software update",
  },
];

export const MOCK_SUBSCRIPTION_LOGS: SubscriptionLog[] = [
  {
    id: "1",
    subscriptionName: "Netflix",
    action: "Added",
    date: "Feb 15, 2024",
    details: "Monthly subscription added",
  },
  {
    id: "2",
    subscriptionName: "Spotify Premium",
    action: "Renewed",
    date: "Feb 10, 2024",
    details: "Auto-renewed for $10.99",
  },
  {
    id: "3",
    subscriptionName: "Adobe Creative Cloud",
    action: "Price Changed",
    date: "Jan 20, 2024",
    details: "Price increased from $599 to $699",
  },
  {
    id: "4",
    subscriptionName: "Disney+",
    action: "Cancelled",
    date: "Jan 15, 2024",
    details: "Subscription cancelled by user",
  },
];

export const MOCK_ACTIVITY: ActivityLog[] = [
  {
    id: "1",
    platform: "Netflix",
    activityName: "Watched 'Dune: Part Two'",
    date: "Today, 8:45 PM",
    duration: "2h 46m",
  },
  {
    id: "2",
    platform: "Spotify",
    activityName: "Listening to 'Techno Bunker'",
    date: "Today, 10:30 AM",
    duration: "45m",
  },
  {
    id: "3",
    platform: "Adobe Photoshop",
    activityName: "Project: Logo Design",
    date: "Yesterday",
    duration: "3h 15m",
  },
  {
    id: "4",
    platform: "Netflix",
    activityName: "Watched 'The Gentlemen'",
    date: "March 18, 2024",
    duration: "52m",
  },
];

export const MOCK_ASSETS: Asset[] = [
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
