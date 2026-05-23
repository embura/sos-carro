import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingData: {
      provider_id: string;
      customer_id: string;
      service_id?: string;
      scheduled_date: string;
      scheduled_time?: string;
      status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
      notes?: string;
    }) => {
      const { data, error } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}
