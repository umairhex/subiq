import { useMutation, useQueryClient } from '@tanstack/react-query';

import { generateAndSaveRecommendations } from '@/lib/ai';
import { useAuthStore } from '@/stores/auth-store';

export function useGenerateRecommendations() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');
      return generateAndSaveRecommendations(user.id);
    },
    onSuccess: () => {
      console.log(
        'LOG: AI recommendations generated, invalidating query cache'
      );
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
    },
    onError: (error) => {
      console.log('ERROR: AI recommendation mutation failed:', error.message);
    },
  });
}
