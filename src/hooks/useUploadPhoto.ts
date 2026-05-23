import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useUploadPhoto() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const upload = async (file: File, providerId: string) => {
    try {
      setUploading(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${providerId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('provider-photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('provider-photos')
        .getPublicUrl(fileName);

      // Create record in provider_photos table
      const { data: photoRecord, error: insertError } = await supabase
        .from('provider_photos')
        .insert({
          provider_id: providerId,
          photo_url: publicUrl,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      return publicUrl;
    } catch (error) {
      console.error('Error uploading photo:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const deletePhoto = async (photoId: string, photoUrl?: string) => {
    try {
      // Delete from storage
      if (photoUrl) {
        const urlParts = photoUrl.split('/');
        const fileName = urlParts.slice(-2).join('/');
        
        await supabase.storage
          .from('provider-photos')
          .remove([fileName]);
      }

      // Delete from database
      const { error } = await supabase
        .from('provider_photos')
        .delete()
        .eq('id', photoId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting photo:', error);
      throw error;
    }
  };

  return { upload, deletePhoto, uploading, progress };
}
