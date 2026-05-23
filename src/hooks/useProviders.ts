import { useQuery } from '@tanstack/react-query';
import { supabase, type Provider, type ServiceCategory } from '@/lib/supabase';

interface UseProvidersFilters {
  category?: ServiceCategory;
  city?: string;
  state?: string;
  minRating?: number;
  maxPrice?: number;
  isAvailable?: boolean;
}

export function useProviders(filters?: UseProvidersFilters) {
  return useQuery({
    queryKey: ['providers', filters],
    queryFn: async () => {
      let query = supabase
        .from('providers')
        .select(`
          *,
          profiles(full_name, avatar_url, phone),
          provider_photos(photo_url, is_primary)
        `)
        .eq('is_active', true);

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      if (filters?.city) {
        query = query.ilike('city', `%${filters.city}%`);
      }

      if (filters?.state) {
        query = query.eq('state', filters.state);
      }

      if (filters?.minRating) {
        query = query.gte('rating', filters.minRating);
      }

      if (filters?.maxPrice) {
        query = query.lte('price_from', filters.maxPrice);
      }

      if (filters?.isAvailable !== undefined) {
        query = query.eq('is_available', filters.isAvailable);
      }

      const { data, error } = await query.order('rating', { ascending: false });

      if (error) throw error;
      return data as (Provider & {
        profiles: { full_name: string; avatar_url: string | null; phone: string | null };
        provider_photos: { photo_url: string; is_primary: boolean }[];
      })[];
    },
  });
}

export function useProvider(id: string) {
  return useQuery({
    queryKey: ['provider', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('providers')
        .select(`
          *,
          profiles(full_name, avatar_url, phone, email),
          services(*),
          provider_photos(*),
          reviews(
            *,
            profiles(full_name, avatar_url)
          ),
          availability(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Provider & {
        profiles: { full_name: string; avatar_url: string | null; phone: string | null; email: string };
        services: any[];
        provider_photos: any[];
        reviews: any[];
        availability: any[];
      };
    },
    enabled: !!id,
  });
}

export function useProviderServices(providerId: string) {
  return useQuery({
    queryKey: ['provider-services', providerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('provider_id', providerId)
        .eq('is_available', true)
        .order('name');

      if (error) throw error;
      return data;
    },
    enabled: !!providerId,
  });
}
