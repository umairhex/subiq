import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/auth-store';
import type { Database } from '@/types/database';

type ActivityInsert = Database['public']['Tables']['activities']['Insert'];

const QUERY_KEY = ['activities'];

export function useActivities() {
  const user = useAuthStore((s) => s.user);

  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      console.log('LOG: Fetching activities');
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.log('ERROR: Failed to fetch activities:', error.message);
        throw error;
      }
      return data;
    },
    enabled: !!user,
  });
}

export function useCreateActivity() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: async (input: Omit<ActivityInsert, 'user_id'>) => {
      console.log('LOG: Creating activity:', input.activity_name);
      const { data, error } = await supabase
        .from('activities')
        .insert({ ...input, user_id: user!.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error) => {
      console.log('ERROR: Failed to create activity:', error.message);
    },
  });
}

export function useDeleteActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      console.log('LOG: Deleting activity:', id);
      const { error } = await supabase.from('activities').delete().eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error) => {
      console.log('ERROR: Failed to delete activity:', error.message);
    },
  });
}
