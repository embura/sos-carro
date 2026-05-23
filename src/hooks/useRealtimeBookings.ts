import { useState, useEffect, useCallback } from 'react';
import { supabase, Booking, BookingStatus } from '@/lib/supabase';

interface BookingUpdate {
  bookingId: string;
  status: BookingStatus;
  updatedAt: string;
}

export function useRealtimeBookings(providerId: string, onNewBooking?: (booking: Booking) => void) {
  const [newBookings, setNewBookings] = useState<Booking[]>([]);
  const [bookingUpdates, setBookingUpdates] = useState<BookingUpdate[]>([]);

  useEffect(() => {
    if (!providerId) return;

    // Subscribe to new bookings for this provider
    const newBookingsChannel = supabase
      .channel('bookings-new-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bookings',
          filter: `provider_id=eq.${providerId}`,
        },
        (payload) => {
          const newBooking = payload.new as Booking;
          setNewBookings(prev => [newBooking, ...prev]);
          
          if (onNewBooking) {
            onNewBooking(newBooking);
          }

          // Optional: Show browser notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Nova Reserva Recebida!', {
              body: `Nova reserva de ${newBooking.customer_name || 'um cliente'}`,
              icon: '/logo.png',
            });
          }
        }
      )
      .subscribe();

    // Subscribe to booking status updates
    const updatesChannel = supabase
      .channel('bookings-updates-channel')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bookings',
          filter: `provider_id=eq.${providerId}`,
        },
        (payload) => {
          const updatedBooking = payload.new as Booking;
          setBookingUpdates(prev => [{
            bookingId: updatedBooking.id,
            status: updatedBooking.status,
            updatedAt: updatedBooking.updated_at,
          }, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(newBookingsChannel);
      supabase.removeChannel(updatesChannel);
    };
  }, [providerId, onNewBooking]);

  return {
    newBookings,
    bookingUpdates,
    hasNewBookings: newBookings.length > 0,
    clearNewBookings: () => setNewBookings([]),
  };
}

// Hook para clientes acompanharem suas reservas
export function useRealtimeCustomerBookings(customerId: string) {
  const [bookingUpdates, setBookingUpdates] = useState<Array<{
    bookingId: string;
    status: BookingStatus;
    updatedAt: string;
  }>>([]);

  useEffect(() => {
    if (!customerId) return;

    const channel = supabase
      .channel('customer-bookings-channel')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bookings',
          filter: `customer_id=eq.${customerId}`,
        },
        (payload) => {
          const updatedBooking = payload.new as Booking;
          setBookingUpdates(prev => [{
            bookingId: updatedBooking.id,
            status: updatedBooking.status,
            updatedAt: updatedBooking.updated_at,
          }, ...prev]);

          // Optional: Show browser notification
          if ('Notification' in window && Notification.permission === 'granted') {
            const statusLabels: Record<BookingStatus, string> = {
              pending: 'Pendente',
              confirmed: 'Confirmada',
              in_progress: 'Em Andamento',
              completed: 'Concluída',
              cancelled: 'Cancelada',
              no_show: 'Não Compareceu',
            };

            new Notification('Atualização da Reserva', {
              body: `Status atualizado para: ${statusLabels[updatedBooking.status]}`,
              icon: '/logo.png',
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [customerId]);

  return {
    bookingUpdates,
    clearUpdates: () => setBookingUpdates([]),
  };
}

// Hook genérico para realtime de bookings com filtros customizados
export function useRealtimeBookingsAdvanced(filters: {
  providerId?: string;
  customerId?: string;
  status?: BookingStatus[];
  onInsert?: (booking: Booking) => void;
  onUpdate?: (booking: Booking) => void;
  onDelete?: (bookingId: string) => void;
}) {
  const [events, setEvents] = useState<Array<{
    type: 'INSERT' | 'UPDATE' | 'DELETE';
    booking: Booking | null;
    bookingId?: string;
    timestamp: string;
  }>>([]);

  useEffect(() => {
    let channel = supabase.channel('bookings-advanced-channel');

    // Filter construction
    const baseFilter: any = {
      event: '*', // Listen to all events
      schema: 'public',
      table: 'bookings',
    };

    // Add provider filter if specified
    if (filters.providerId) {
      channel = channel.on(
        'postgres_changes',
        {
          ...baseFilter,
          event: 'INSERT',
          filter: `provider_id=eq.${filters.providerId}`,
        },
        (payload) => {
          const booking = payload.new as Booking;
          setEvents(prev => [{
            type: 'INSERT',
            booking,
            timestamp: new Date().toISOString(),
          }, ...prev]);
          
          filters.onInsert?.(booking);
        }
      );

      channel = channel.on(
        'postgres_changes',
        {
          ...baseFilter,
          event: 'UPDATE',
          filter: `provider_id=eq.${filters.providerId}`,
        },
        (payload) => {
          const booking = payload.new as Booking;
          setEvents(prev => [{
            type: 'UPDATE',
            booking,
            timestamp: new Date().toISOString(),
          }, ...prev]);
          
          filters.onUpdate?.(booking);
        }
      );
    }

    // Add customer filter if specified
    if (filters.customerId) {
      channel = channel.on(
        'postgres_changes',
        {
          ...baseFilter,
          event: 'UPDATE',
          filter: `customer_id=eq.${filters.customerId}`,
        },
        (payload) => {
          const booking = payload.new as Booking;
          setEvents(prev => [{
            type: 'UPDATE',
            booking,
            timestamp: new Date().toISOString(),
          }, ...prev]);
          
          filters.onUpdate?.(booking);
        }
      );
    }

    // Subscribe to DELETE events (requires special handling)
    if (filters.onDelete) {
      channel = channel.on(
        'postgres_changes',
        {
          ...baseFilter,
          event: 'DELETE',
        },
        (payload) => {
          const oldBooking = payload.old as Booking;
          setEvents(prev => [{
            type: 'DELETE',
            booking: null,
            bookingId: oldBooking.id,
            timestamp: new Date().toISOString(),
          }, ...prev]);
          
          filters.onDelete?.(oldBooking.id);
        }
      );
    }

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filters.providerId, filters.customerId, filters.onInsert, filters.onUpdate, filters.onDelete]);

  return {
    events,
    clearEvents: () => setEvents([]),
  };
}
