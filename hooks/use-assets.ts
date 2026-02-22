import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/auth-store';
import type { Database } from '@/types/database';

type AssetInsert = Database['public']['Tables']['assets']['Insert'];
type AssetUpdate = Database['public']['Tables']['assets']['Update'];

const QUERY_KEY = ['assets'];

export function useAssets() {
  const user = useAuthStore((s) => s.user);

  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      console.log('LOG: Fetching assets');
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.log('ERROR: Failed to fetch assets:', error.message);
        throw error;
      }
      return data;
    },
    enabled: !!user,
  });
}

export function useCreateAsset() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: async (input: Omit<AssetInsert, 'user_id'>) => {
      console.log('LOG: Creating asset:', input.name);
      const { data, error } = await supabase
        .from('assets')
        .insert({ ...input, user_id: user!.id })
        .select()
        .single();

      if (error) throw error;

      await supabase.from('asset_logs').insert({
        user_id: user!.id,
        asset_name: input.name,
        action: 'Added',
        details: `Added ${input.name} (${input.brand})`,
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['asset_logs'] });
    },
    onError: (error) => {
      console.log('ERROR: Failed to create asset:', error.message);
    },
  });
}

export function useUpdateAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: AssetUpdate & { id: string }) => {
      console.log('LOG: Updating asset:', id);
      const { data, error } = await supabase
        .from('assets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error) => {
      console.log('ERROR: Failed to update asset:', error.message);
    },
  });
}

export function useDeleteAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      console.log('LOG: Deleting asset:', id);
      const { error } = await supabase.from('assets').delete().eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['asset_logs'] });
    },
    onError: (error) => {
      console.log('ERROR: Failed to delete asset:', error.message);
    },
  });
}

export function useAssetLogs() {
  const user = useAuthStore((s) => s.user);

  return useQuery({
    queryKey: ['asset_logs'],
    queryFn: async () => {
      console.log('LOG: Fetching asset logs');
      const { data, error } = await supabase
        .from('asset_logs')
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
