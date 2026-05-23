import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, type InsertTables } from '@/lib/supabase';

export function useProviderReviews(providerId: string) {
  return useQuery({
    queryKey: ['provider-reviews', providerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles(full_name, avatar_url)
        `)
        .eq('reviewed_provider_id', providerId)
        .eq('is_visible', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!providerId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewData: InsertTables<'reviews'>) => {
      const { data, error } = await supabase
        .from('reviews')
        .insert(reviewData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['providers'] });
    },
  });
}

export function useUpdateProviderResponse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, response }: { id: string; response: string }) => {
      const { data, error } = await supabase
        .from('reviews')
        .update({
          provider_response: response,
          provider_response_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider-reviews'] });
    },
  });
}
