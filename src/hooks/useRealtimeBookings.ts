import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useRealtimeBookings(providerId: string, onNewBooking: (booking: any) => void) {
  useEffect(() => {
    const channel = supabase
      .channel('bookings-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bookings',
          filter: `provider_id=eq.${providerId}`,
        },
        (payload) => {
          onNewBooking(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [providerId, onNewBooking]);
}
