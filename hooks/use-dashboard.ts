import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/auth-store';

export function useExpenseSummary() {
  const user = useAuthStore((s) => s.user);

  return useQuery({
    queryKey: ['expense_summary'],
    queryFn: async () => {
      console.log('LOG: Fetching expense summary');
      const { data, error } = await supabase.rpc('get_expense_summary', {
        p_user_id: user!.id,
      });

      if (error) {
        console.log('ERROR: Failed to fetch expense summary:', error.message);
        throw error;
      }

      const row = data?.[0] ?? {
        total_monthly: 0,
        total_yearly: 0,
        trend_percentage: 0,
      };
      return {
        totalMonthly: Number(row.total_monthly),
        totalYearly: Number(row.total_yearly),
        trendPercentage: Number(row.trend_percentage),
      };
    },
    enabled: !!user,
  });
}

export function useRecommendations() {
  const user = useAuthStore((s) => s.user);

  return useQuery({
    queryKey: ['recommendations'],
    queryFn: async () => {
      console.log('LOG: Fetching recommendations');
      const { data, error } = await supabase
        .from('recommendations')
        .select('*')
        .eq('user_id', user!.id)
        .eq('is_dismissed', false)
        .order('savings', { ascending: false });

      if (error) {
        console.log('ERROR: Failed to fetch recommendations:', error.message);
        throw error;
      }
      return data;
    },
    enabled: !!user,
  });
}
