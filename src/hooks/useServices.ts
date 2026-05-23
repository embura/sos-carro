import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useServices(providerId?: string) {
  return useQuery({
    queryKey: ['services', providerId],
    queryFn: async () => {
      if (!providerId) return [];

      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('provider_id', providerId)
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!providerId,
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (serviceData: {
      provider_id: string;
      name: string;
      description?: string;
      price: number;
      duration_minutes?: number;
      category?: string;
    }) => {
      const { data, error } = await supabase
        .from('services')
        .insert(serviceData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['services', variables.provider_id] });
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      serviceId, 
      updates 
    }: { 
      serviceId: string; 
      updates: {
        name?: string;
        description?: string;
        price?: number;
        duration_minutes?: number;
        is_active?: boolean;
      }
    }) => {
      const { data, error } = await supabase
        .from('services')
        .update(updates)
        .eq('id', serviceId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['services', data?.provider_id] });
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      serviceId, 
      providerId 
    }: { 
      serviceId: string; 
      providerId: string;
    }) => {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['services', variables.providerId] });
    },
  });
}
