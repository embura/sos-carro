import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos auxiliares
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Database types (serão gerados pelo Supabase CLI)
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone: string | null;
          avatar_url: string | null;
          user_type: 'customer' | 'provider' | 'admin';
          status: 'active' | 'inactive' | 'suspended' | 'pending_verification';
          created_at: string;
          updated_at: string;
          last_login_at: string | null;
          metadata: Json;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          phone?: string | null;
          avatar_url?: string | null;
          user_type?: 'customer' | 'provider' | 'admin';
          status?: 'active' | 'inactive' | 'suspended' | 'pending_verification';
          created_at?: string;
          updated_at?: string;
          last_login_at?: string | null;
          metadata?: Json;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          phone?: string | null;
          avatar_url?: string | null;
          user_type?: 'customer' | 'provider' | 'admin';
          status?: 'active' | 'inactive' | 'suspended' | 'pending_verification';
          created_at?: string;
          updated_at?: string;
          last_login_at?: string | null;
          metadata?: Json;
        };
      };
      providers: {
        Row: {
          id: string;
          user_id: string;
          business_name: string;
          category: string;
          categories_offered: string[];
          bio: string | null;
          specialties: string[] | null;
          address: string;
          city: string;
          state: string;
          zip_code: string;
          country: string;
          latitude: number | null;
          longitude: number | null;
          phone: string;
          whatsapp: string | null;
          website: string | null;
          rating: number;
          reviews_count: number;
          total_bookings: number;
          price_from: number | null;
          currency: string;
          is_available: boolean;
          response_time: string | null;
          badges: string[];
          certifications: string[];
          is_verified: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          business_name: string;
          category: string;
          categories_offered?: string[];
          bio?: string | null;
          specialties?: string[] | null;
          address: string;
          city: string;
          state: string;
          zip_code: string;
          country?: string;
          latitude?: number | null;
          longitude?: number | null;
          phone: string;
          whatsapp?: string | null;
          website?: string | null;
          rating?: number;
          reviews_count?: number;
          total_bookings?: number;
          price_from?: number | null;
          currency?: string;
          is_available?: boolean;
          response_time?: string | null;
          badges?: string[];
          certifications?: string[];
          is_verified?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          business_name?: string;
          category?: string;
          categories_offered?: string[];
          bio?: string | null;
          specialties?: string[] | null;
          address?: string;
          city?: string;
          state?: string;
          zip_code?: string;
          country?: string;
          latitude?: number | null;
          longitude?: number | null;
          phone?: string;
          whatsapp?: string | null;
          website?: string | null;
          rating?: number;
          reviews_count?: number;
          total_bookings?: number;
          price_from?: number | null;
          currency?: string;
          is_available?: boolean;
          response_time?: string | null;
          badges?: string[];
          certifications?: string[];
          is_verified?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      services: {
        Row: {
          id: string;
          provider_id: string;
          name: string;
          description: string | null;
          category: string;
          price: number;
          price_type: string;
          currency: string;
          estimated_duration: number | null;
          is_available: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          provider_id: string;
          name: string;
          description?: string | null;
          category: string;
          price: number;
          price_type?: string;
          currency?: string;
          estimated_duration?: number | null;
          is_available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          provider_id?: string;
          name?: string;
          description?: string | null;
          category?: string;
          price?: number;
          price_type?: string;
          currency?: string;
          estimated_duration?: number | null;
          is_available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          customer_id: string;
          provider_id: string;
          service_id: string | null;
          service_description: string;
          service_category: string;
          service_address: string;
          service_city: string;
          service_state: string;
          service_zip_code: string;
          service_latitude: number | null;
          service_longitude: number | null;
          scheduled_at: string;
          estimated_duration: number | null;
          quoted_price: number | null;
          final_price: number | null;
          currency: string;
          status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
          notes: string | null;
          customer_notes: string | null;
          provider_notes: string | null;
          cancelled_by: string | null;
          cancellation_reason: string | null;
          cancelled_at: string | null;
          created_at: string;
          updated_at: string;
          confirmed_at: string | null;
          started_at: string | null;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          customer_id: string;
          provider_id: string;
          service_id?: string | null;
          service_description: string;
          service_category: string;
          service_address: string;
          service_city: string;
          service_state: string;
          service_zip_code: string;
          service_latitude?: number | null;
          service_longitude?: number | null;
          scheduled_at: string;
          estimated_duration?: number | null;
          quoted_price?: number | null;
          final_price?: number | null;
          currency?: string;
          status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
          notes?: string | null;
          customer_notes?: string | null;
          provider_notes?: string | null;
          cancelled_by?: string | null;
          cancellation_reason?: string | null;
          cancelled_at?: string | null;
          created_at?: string;
          updated_at?: string;
          confirmed_at?: string | null;
          started_at?: string | null;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          customer_id?: string;
          provider_id?: string;
          service_id?: string | null;
          service_description?: string;
          service_category?: string;
          service_address?: string;
          service_city?: string;
          service_state?: string;
          service_zip_code?: string;
          service_latitude?: number | null;
          service_longitude?: number | null;
          scheduled_at?: string;
          estimated_duration?: number | null;
          quoted_price?: number | null;
          final_price?: number | null;
          currency?: string;
          status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
          notes?: string | null;
          customer_notes?: string | null;
          provider_notes?: string | null;
          cancelled_by?: string | null;
          cancellation_reason?: string | null;
          cancelled_at?: string | null;
          created_at?: string;
          updated_at?: string;
          confirmed_at?: string | null;
          started_at?: string | null;
          completed_at?: string | null;
        };
      };
      reviews: {
        Row: {
          id: string;
          booking_id: string;
          reviewer_id: string;
          reviewed_provider_id: string;
          rating: number;
          title: string | null;
          comment: string | null;
          quality_rating: number | null;
          punctuality_rating: number | null;
          price_rating: number | null;
          provider_response: string | null;
          provider_response_at: string | null;
          is_visible: boolean;
          is_flagged: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          reviewer_id: string;
          reviewed_provider_id: string;
          rating: number;
          title?: string | null;
          comment?: string | null;
          quality_rating?: number | null;
          punctuality_rating?: number | null;
          price_rating?: number | null;
          provider_response?: string | null;
          provider_response_at?: string | null;
          is_visible?: boolean;
          is_flagged?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          reviewer_id?: string;
          reviewed_provider_id?: string;
          rating?: number;
          title?: string | null;
          comment?: string | null;
          quality_rating?: number | null;
          punctuality_rating?: number | null;
          price_rating?: number | null;
          provider_response?: string | null;
          provider_response_at?: string | null;
          is_visible?: boolean;
          is_flagged?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      availability: {
        Row: {
          id: string;
          provider_id: string;
          day_of_week: number;
          start_time: string;
          end_time: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          provider_id: string;
          day_of_week: number;
          start_time: string;
          end_time: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          provider_id?: string;
          day_of_week?: number;
          start_time?: string;
          end_time?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      provider_photos: {
        Row: {
          id: string;
          provider_id: string;
          photo_url: string;
          caption: string | null;
          is_primary: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          provider_id: string;
          photo_url: string;
          caption?: string | null;
          is_primary?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          provider_id?: string;
          photo_url?: string;
          caption?: string | null;
          is_primary?: boolean;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          related_booking_id: string | null;
          related_review_id: string | null;
          is_read: boolean;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          related_booking_id?: string | null;
          related_review_id?: string | null;
          is_read?: boolean;
          read_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          title?: string;
          message?: string;
          related_booking_id?: string | null;
          related_review_id?: string | null;
          is_read?: boolean;
          read_at?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {
      user_status: 'active' | 'inactive' | 'suspended' | 'pending_verification';
      user_type: 'customer' | 'provider' | 'admin';
      booking_status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
      service_category: 'mecanica' | 'eletrica' | 'guincho' | 'pneus' | 'funilaria' | 'vidracaria' | 'chaveiro' | 'lavagem' | 'outros';
    };
  };
}

// Type helpers
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

// Specific type exports
export type Profile = Tables<'profiles'>;
export type Provider = Tables<'providers'>;
export type Service = Tables<'services'>;
export type Booking = Tables<'bookings'>;
export type Review = Tables<'reviews'>;
export type Availability = Tables<'availability'>;
export type ProviderPhoto = Tables<'provider_photos'>;
export type Notification = Tables<'notifications'>;

export type UserStatus = Database['public']['Enums']['user_status'];
export type UserType = Database['public']['Enums']['user_type'];
export type BookingStatus = Database['public']['Enums']['booking_status'];
export type ServiceCategory = Database['public']['Enums']['service_category'];
