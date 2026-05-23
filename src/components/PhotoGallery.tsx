import { useProvider } from '@/hooks/useProvider';
import { useUploadPhoto } from '@/hooks/useUploadPhoto';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { Trash2, ImageIcon } from 'lucide-react';

interface PhotoGalleryProps {
  providerId: string;
  isOwner?: boolean;
}

export function PhotoGallery({ providerId, isOwner = false }: PhotoGalleryProps) {
  const { data: provider, isLoading } = useProvider(providerId);
  const { deletePhoto, uploading } = useUploadPhoto();

  const handleDelete = async (photoId: string, photoUrl: string) => {
    if (!confirm('Tem certeza que deseja excluir esta foto?')) return;

    try {
      await deletePhoto(photoId, photoUrl);
      toast.success('Foto excluída com sucesso');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao excluir foto');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const photos = provider?.provider_photos || [];

  if (photos.length === 0) {
    return (
      <div className="text-center py-12">
        <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-sm">
          {isOwner 
            ? 'Nenhuma foto cadastrada. Adicione fotos para mostrar seu trabalho!'
            : 'Este prestador ainda não adicionou fotos.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo) => (
        <div key={photo.id} className="relative group aspect-square">
          <img
            src={photo.photo_url}
            alt={photo.caption || 'Foto do prestador'}
            className="w-full h-full object-cover rounded-lg border transition-transform group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNjY2MiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cmVjdCB4PSIzIiB5PSIzIiB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHJ4PSIyIiByeT0iMiI+PC9yZWN0PjxjaXJjbGUgY3g9IjguNSIgY3k9IjguNSIgcj0iMS41Ij48L2NpcmNsZT48cG9seWxpbmUgcG9pbnRzPSIyMSAxNSAxNiAxMCA1IDIxIj48L3BvbHlsaW5lPjwvc3ZnPg==';
            }}
          />
          
          {isOwner && (
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(photo.id, photo.photo_url)}
                disabled={uploading}
                className="gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Excluir
              </Button>
            </div>
          )}
          
          {photo.is_primary && (
            <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
              Principal
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
