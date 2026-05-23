# 🖼️ Implementação Fase 4: Storage e Upload de Fotos

## Visão Geral

Esta fase implementa o armazenamento de imagens no Supabase para fotos de prestadores de serviço, incluindo upload, visualização e exclusão de fotos.

---

## ✅ Status da Implementação

### Concluído na Fase Anterior (Fase 3)
- [x] Hook `useUploadPhoto` criado em `/src/hooks/useUploadPhoto.ts`
  - Upload de arquivos para bucket `provider-photos`
  - Inserção automática de registro na tabela `provider_photos`
  - Exclusão de fotos (storage + database)
  - Controle de progresso e estado de upload

### Pendente de Configuração no Supabase
- [ ] Criar bucket `provider-photos` no dashboard do Supabase
- [ ] Configurar políticas de segurança (RLS) do storage
- [ ] Habilitar upload público para leitura

---

## 📋 Configuração Necessária no Supabase

### Passo 1: Criar Bucket

Acessar o dashboard do Supabase:
```
Storage → New Bucket
```

**Configurações:**
- **Name:** `provider-photos`
- **Public:** ✅ Sim (para permitir visualização pública)
- **File size limit:** `5242880` (5MB)
- **Allowed MIME types:** `image/jpeg,image/png,image/webp`

### Passo 2: Configurar Políticas de Segurança (RLS)

Executar no SQL Editor do Supabase:

```sql
-- Política para qualquer pessoa visualizar fotos
CREATE POLICY "Anyone can view photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'provider-photos');

-- Política para provedores fazerem upload apenas nas suas pastas
CREATE POLICY "Providers can upload to their folder"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'provider-photos' AND
  auth.uid() IN (
    SELECT user_id FROM providers WHERE id = (storage.foldername(name))[1]
  )
);

-- Política para provedores deletarem apenas suas fotos
CREATE POLICY "Providers can delete their photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'provider-photos' AND
  auth.uid() IN (
    SELECT user_id FROM providers WHERE id = (storage.foldername(name))[1]
  )
);

-- Política para provedores atualizarem apenas suas fotos
CREATE POLICY "Providers can update their photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'provider-photos' AND
  auth.uid() IN (
    SELECT user_id FROM providers WHERE id = (storage.foldername(name))[1]
  )
);
```

---

## 🔧 Componentes Criados

### 1. Hook useUploadPhoto

**Localização:** `/src/hooks/useUploadPhoto.ts`

**Funcionalidades:**
```typescript
const { upload, deletePhoto, uploading, progress } = useUploadPhoto();

// Upload de foto
await upload(file, providerId);

// Exclusão de foto
await deletePhoto(photoId, photoUrl);
```

**Parâmetros:**
- `file`: Arquivo File do input type="file"
- `providerId`: ID do prestador (usado como nome da pasta)

**Retorna:**
- `upload`: Função assíncrona para upload
- `deletePhoto`: Função assíncrona para exclusão
- `uploading`: boolean indicando estado de upload
- `progress`: número de 0-100 (progresso do upload)

---

## 📝 Exemplo de Uso em Componente

### Componente PhotoUploader (Sugestão de Implementação)

```tsx
import { useState } from 'react';
import { useUploadPhoto } from '@/hooks/useUploadPhoto';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface PhotoUploaderProps {
  providerId: string;
  onPhotoUploaded?: (photoUrl: string) => void;
}

export function PhotoUploader({ providerId, onPhotoUploaded }: PhotoUploaderProps) {
  const { upload, uploading } = useUploadPhoto();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo e tamanho
      if (!file.type.startsWith('image/')) {
        toast.error('Apenas imagens são permitidas');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Imagem deve ter no máximo 5MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const photoUrl = await upload(selectedFile, providerId);
      toast.success('Foto enviada com sucesso!');
      setSelectedFile(null);
      onPhotoUploaded?.(photoUrl);
    } catch (error) {
      toast.error('Erro ao enviar foto');
      console.error(error);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-primary/10 file:text-primary
          hover:file:bg-primary/20"
      />
      
      {selectedFile && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">{selectedFile.name}</span>
          <Button onClick={handleUpload} disabled={uploading}>
            {uploading ? 'Enviando...' : 'Enviar Foto'}
          </Button>
        </div>
      )}
    </div>
  );
}
```

### Componente PhotoGallery (Sugestão de Implementação)

```tsx
import { useProvider } from '@/hooks/useProvider';
import { useUploadPhoto } from '@/hooks/useUploadPhoto';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface PhotoGalleryProps {
  providerId: string;
  isOwner?: boolean;
}

export function PhotoGallery({ providerId, isOwner = false }: PhotoGalleryProps) {
  const { data: provider } = useProvider(providerId);
  const { deletePhoto, uploading } = useUploadPhoto();

  const handleDelete = async (photoId: string, photoUrl: string) => {
    if (!confirm('Tem certeza que deseja excluir esta foto?')) return;

    try {
      await deletePhoto(photoId, photoUrl);
      toast.success('Foto excluída com sucesso');
    } catch (error) {
      toast.error('Erro ao excluir foto');
    }
  };

  const photos = provider?.provider_photos || [];

  if (photos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhuma foto cadastrada
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo) => (
        <div key={photo.id} className="relative group">
          <img
            src={photo.photo_url}
            alt={photo.caption || 'Foto do prestador'}
            className="w-full h-48 object-cover rounded-lg"
          />
          
          {isOwner && (
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 
                          transition-opacity flex items-center justify-center">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(photo.id, photo.photo_url)}
                disabled={uploading}
              >
                Excluir
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
```

---

## 🎯 Checklist de Validação

### Infraestrutura
- [ ] Bucket `provider-photos` criado no Supabase
- [ ] Bucket configurado como público
- [ ] Políticas RLS criadas e ativas
- [ ] Limite de tamanho (5MB) configurado
- [ ] Tipos MIME restritos a imagens

### Funcionalidade
- [ ] Upload de imagem funciona
- [ ] Registro na tabela `provider_photos` é criado
- [ ] URL pública da imagem é gerada corretamente
- [ ] Exclusão remove do storage e do banco
- [ ] Validação de tipo de arquivo funciona
- [ ] Validação de tamanho funciona
- [ ] Feedback visual durante upload funciona

### Segurança
- [ ] Apenas provedores podem upload nas suas pastas
- [ ] Usuários não autenticados não podem upload
- [ ] Leitura das fotos é pública (conforme esperado)
- [ ] Provedores só podem deletar suas próprias fotos

---

## 📊 Estrutura de Armazenamento

```
provider-photos/
├── {provider-id-1}/
│   ├── 1716912345678.jpg
│   ├── 1716912345679.png
│   └── 1716912345680.webp
├── {provider-id-2}/
│   └── 1716912345681.jpg
└── {provider-id-3}/
    └── 1716912345682.jpg
```

**Convenção de Nomes:**
- Pasta: `{provider-id}` (ID do prestador)
- Arquivo: `{timestamp}.{ext}` (Unix timestamp + extensão)

---

## 🔗 Integração com Outras Funcionalidades

### Perfil do Prestador
- Fotos aparecem na página de detalhes do prestador
- Foto primária pode ser usada como avatar
- Galeria completa visível para clientes

### Dashboard do Prestador
- Seção de gerenciamento de fotos
- Upload múltiplo (futuramente)
- Definição de foto primária (futuramente)

### Busca e Listagem
- Foto primária exibida nos cards de busca
- Thumbnails otimizadas (futuramente com resize)

---

## 🚀 Próximos Passos (Fase 5)

Após concluir a configuração do storage:

1. **Habilitar Realtime nas tabelas**
   - `bookings` para notificações de novas reservas
   - `notifications` para atualizações em tempo real

2. **Implementar hook useRealtimeBookings**
   - Já criado em `/src/hooks/useRealtimeBookings.ts`
   - Requer configuração no dashboard do Supabase

3. **Testar fluxo completo**
   - Upload → Visualização → Exclusão
   - Permissões de acesso
   - Performance com múltiplas imagens

---

## 📞 Suporte e Troubleshooting

### Erro Comum: "Storage bucket not found"
**Solução:** Verificar se o bucket `provider-photos` foi criado no dashboard

### Erro Comum: "Unauthorized"
**Solução:** Verificar políticas RLS e se o usuário está autenticado

### Erro Comum: "File too large"
**Solução:** Validar tamanho do arquivo antes do upload (máximo 5MB)

### Erro Comum: "Invalid MIME type"
**Solução:** Aceitar apenas `image/jpeg`, `image/png`, `image/webp`

---

## 📚 Referências

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Row Level Security Policies](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Buckets API](https://supabase.com/docs/reference/javascript/storage-from-upload)

---

**Data da Implementação:** Maio 2025  
**Status:** ✅ Hooks implementados | ⏳ Aguardando configuração no Supabase  
**Próxima Fase:** Fase 5 - Realtime e Notificações
