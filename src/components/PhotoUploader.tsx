import { useState, useCallback } from 'react';
import { useUploadPhoto } from '@/hooks/useUploadPhoto';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface PhotoUploaderProps {
  providerId: string;
  onPhotoUploaded?: (photoUrl: string) => void;
}

export function PhotoUploader({ providerId, onPhotoUploaded }: PhotoUploaderProps) {
  const { upload, uploading } = useUploadPhoto();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const validateFile = (file: File): boolean => {
    if (!file.type.startsWith('image/')) {
      toast.error('Apenas imagens são permitidas (JPEG, PNG, WebP)');
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Imagem deve ter no máximo 5MB');
      return false;
    }
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const photoUrl = await upload(selectedFile, providerId);
      toast.success('Foto enviada com sucesso!');
      setSelectedFile(null);
      setPreview(null);
      onPhotoUploaded?.(photoUrl);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao enviar foto. Verifique se o bucket provider-photos está configurado no Supabase.');
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver
            ? 'border-primary bg-primary/5'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
          id="photo-upload"
        />
        
        {!selectedFile ? (
          <label
            htmlFor="photo-upload"
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            <Upload className="w-12 h-12 text-gray-400" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-700">
                Clique para selecionar ou arraste uma imagem
              </p>
              <p className="text-xs text-gray-500">
                JPEG, PNG ou WebP (máx. 5MB)
              </p>
            </div>
          </label>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={preview || undefined}
                alt="Preview"
                className="w-48 h-48 object-cover rounded-lg border"
              />
              <button
                onClick={handleCancel}
                disabled={uploading}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={uploading}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleUpload}
                disabled={uploading}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {uploading ? (
                  <>
                    <ImageIcon className="w-4 h-4 mr-2 animate-pulse" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Enviar Foto
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
