import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/auth-store';
import type { Database } from '@/types/database';

type SubscriptionInsert =
  Database['public']['Tables']['subscriptions']['Insert'];
type SubscriptionUpdate =
  Database['public']['Tables']['subscriptions']['Update'];

const QUERY_KEY = ['subscriptions'];

export function useSubscriptions() {
  const user = useAuthStore((s) => s.user);

  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      console.log('LOG: Fetching subscriptions');
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.log('ERROR: Failed to fetch subscriptions:', error.message);
        throw error;
      }
      return data;
    },
    enabled: !!user,
  });
}

export function useCreateSubscription() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: async (input: Omit<SubscriptionInsert, 'user_id'>) => {
      console.log('LOG: Creating subscription:', input.name);
      const { data, error } = await supabase
        .from('subscriptions')
        .insert({ ...input, user_id: user!.id })
        .select()
        .single();

      if (error) throw error;

      await supabase.from('subscription_logs').insert({
        user_id: user!.id,
        subscription_name: input.name,
        action: 'Added',
        details: `Added ${input.name} at ${input.price}/${input.billing_cycle}`,
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['subscription_logs'] });
      queryClient.invalidateQueries({ queryKey: ['expense_summary'] });
    },
    onError: (error) => {
      console.log('ERROR: Failed to create subscription:', error.message);
    },
  });
}

export function useUpdateSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: SubscriptionUpdate & { id: string }) => {
      console.log('LOG: Updating subscription:', id);
      const { data, error } = await supabase
        .from('subscriptions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['expense_summary'] });
    },
    onError: (error) => {
      console.log('ERROR: Failed to update subscription:', error.message);
    },
  });
}

export function useDeleteSubscription() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      console.log('LOG: Deleting subscription:', id);
      const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await supabase.from('subscription_logs').insert({
        user_id: user!.id,
        subscription_name: name,
        action: 'Cancelled',
        details: `Cancelled ${name}`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['subscription_logs'] });
      queryClient.invalidateQueries({ queryKey: ['expense_summary'] });
    },
    onError: (error) => {
      console.log('ERROR: Failed to delete subscription:', error.message);
    },
  });
}

export function useSubscriptionLogs() {
  const user = useAuthStore((s) => s.user);

  return useQuery({
    queryKey: ['subscription_logs'],
    queryFn: async () => {
      console.log('LOG: Fetching subscription logs');
      const { data, error } = await supabase
        .from('subscription_logs')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}
