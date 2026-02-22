export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          first_name: string | null;
          last_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          first_name?: string | null;
          last_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string | null;
          last_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          price: number;
          billing_cycle: 'Monthly' | 'Yearly';
          payment_method: string;
          start_date: string;
          renewal_date: string;
          status: 'Active' | 'Trial' | 'Cancelled';
          icon: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          price: number;
          billing_cycle: 'Monthly' | 'Yearly';
          payment_method: string;
          start_date: string;
          renewal_date?: string;
          status?: 'Active' | 'Trial' | 'Cancelled';
          icon?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          price?: number;
          billing_cycle?: 'Monthly' | 'Yearly';
          payment_method?: string;
          start_date?: string;
          renewal_date?: string;
          status?: 'Active' | 'Trial' | 'Cancelled';
          icon?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      assets: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          brand: string;
          purchase_date: string;
          warranty_start: string;
          warranty_end: string;
          has_invoice: boolean;
          reminder_enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          brand: string;
          purchase_date: string;
          warranty_start?: string;
          warranty_end: string;
          has_invoice?: boolean;
          reminder_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          brand?: string;
          purchase_date?: string;
          warranty_start?: string;
          warranty_end?: string;
          has_invoice?: boolean;
          reminder_enabled?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      activities: {
        Row: {
          id: string;
          user_id: string;
          platform: string;
          activity_name: string;
          duration: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          platform: string;
          activity_name: string;
          duration?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          platform?: string;
          activity_name?: string;
          duration?: string | null;
          notes?: string | null;
        };
        Relationships: [];
      };
      subscription_logs: {
        Row: {
          id: string;
          user_id: string;
          subscription_name: string;
          action:
            | 'Added'
            | 'Renewed'
            | 'Cancelled'
            | 'Payment Failed'
            | 'Price Changed';
          details: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          subscription_name: string;
          action:
            | 'Added'
            | 'Renewed'
            | 'Cancelled'
            | 'Payment Failed'
            | 'Price Changed';
          details?: string | null;
          created_at?: string;
        };
        Update: {
          subscription_name?: string;
          action?:
            | 'Added'
            | 'Renewed'
            | 'Cancelled'
            | 'Payment Failed'
            | 'Price Changed';
          details?: string | null;
        };
        Relationships: [];
      };
      asset_logs: {
        Row: {
          id: string;
          user_id: string;
          asset_name: string;
          action:
            | 'Added'
            | 'Warranty Expiring'
            | 'Warranty Expired'
            | 'Maintenance Due';
          details: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          asset_name: string;
          action:
            | 'Added'
            | 'Warranty Expiring'
            | 'Warranty Expired'
            | 'Maintenance Due';
          details?: string | null;
          created_at?: string;
        };
        Update: {
          asset_name?: string;
          action?:
            | 'Added'
            | 'Warranty Expiring'
            | 'Warranty Expired'
            | 'Maintenance Due';
          details?: string | null;
        };
        Relationships: [];
      };
      recommendations: {
        Row: {
          id: string;
          user_id: string;
          type: 'Duplicate' | 'Inactive' | 'Trial';
          title: string;
          description: string;
          savings: number;
          confidence: number;
          is_dismissed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'Duplicate' | 'Inactive' | 'Trial';
          title: string;
          description: string;
          savings: number;
          confidence: number;
          is_dismissed?: boolean;
          created_at?: string;
        };
        Update: {
          type?: 'Duplicate' | 'Inactive' | 'Trial';
          title?: string;
          description?: string;
          savings?: number;
          confidence?: number;
          is_dismissed?: boolean;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_expense_summary: {
        Args: { p_user_id: string };
        Returns: {
          total_monthly: number;
          total_yearly: number;
          trend_percentage: number;
        }[];
      };
    };
    Enums: Record<string, never>;
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];

export type SubscriptionRow =
  Database['public']['Tables']['subscriptions']['Row'];

export type AssetRow = Database['public']['Tables']['assets']['Row'];

export type ActivityRow = Database['public']['Tables']['activities']['Row'];

export type SubscriptionLogRow =
  Database['public']['Tables']['subscription_logs']['Row'];

export type AssetLogRow = Database['public']['Tables']['asset_logs']['Row'];

export type RecommendationRow =
  Database['public']['Tables']['recommendations']['Row'];
