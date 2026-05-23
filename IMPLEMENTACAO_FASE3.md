# ✅ Fase 3 - Integração Frontend com Supabase

## Resumo da Implementação

Esta etapa implementa a **Fase 3** do plano de integração com Supabase, focando na criação de hooks personalizados para integração do frontend com o backend.

---

## 📦 Hooks Implementados

### 1. `useProvider` - Dados de um Prestador Individual

**Arquivo**: `src/hooks/useProvider.ts`

**Funcionalidade**: Busca dados completos de um prestador específico, incluindo:
- Informações do perfil
- Serviços oferecidos
- Fotos
- Reviews com dados dos clientes

**Uso**:
```tsx
import { useProvider } from '@/hooks/useProvider';

function ProviderProfile({ providerId }) {
  const { data: provider, isLoading, error } = useProvider(providerId);
  
  if (isLoading) return <Loading />;
  if (error) return <Error message={error.message} />;
  
  return <Profile provider={provider} />;
}
```

---

### 2. `useCreateBooking` - Criar Agendamento

**Arquivo**: `src/hooks/useCreateBooking.ts`

**Funcionalidade**: Cria um novo agendamento no banco de dados.

**Uso**:
```tsx
import { useCreateBooking } from '@/hooks/useCreateBooking';

function BookingForm({ providerId, customerId }) {
  const createBooking = useCreateBooking();
  
  const handleSubmit = async (data) => {
    try {
      await createBooking.mutateAsync({
        provider_id: providerId,
        customer_id: customerId,
        scheduled_date: data.date,
        scheduled_time: data.time,
        status: 'pending',
        notes: data.notes,
      });
      toast.success('Agendamento criado!');
    } catch (error) {
      toast.error('Erro ao criar agendamento');
    }
  };
  
  return <Form onSubmit={handleSubmit} />;
}
```

---

### 3. `useUpdateBooking` - Atualizar Agendamento

**Arquivo**: `src/hooks/useUpdateBooking.ts`

**Funcionalidade**: Atualiza status e informações de um agendamento existente.

**Uso**:
```tsx
import { useUpdateBooking } from '@/hooks/useUpdateBooking';

function BookingActions({ bookingId }) {
  const updateBooking = useUpdateBooking();
  
  const handleConfirm = () => {
    updateBooking.mutate({
      bookingId,
      updates: { 
        status: 'confirmed',
        confirmed_at: new Date().toISOString()
      }
    });
  };
  
  return <Button onClick={handleConfirm}>Confirmar</Button>;
}
```

---

### 4. `useServices` - Gerenciar Serviços

**Arquivo**: `src/hooks/useServices.ts`

**Funcionalidades**:
- `useServices(providerId)` - Lista serviços de um prestador
- `useCreateService()` - Cria novo serviço
- `useUpdateService()` - Atualiza serviço existente
- `useDeleteService()` - Remove serviço

**Uso**:
```tsx
import { useServices, useCreateService, useDeleteService } from '@/hooks/useServices';

function ServicesManager({ providerId }) {
  const { data: services } = useServices(providerId);
  const createService = useCreateService();
  const deleteService = useDeleteService();
  
  const handleAddService = async (newService) => {
    await createService.mutateAsync({
      provider_id: providerId,
      name: newService.name,
      price: newService.price,
      description: newService.description,
    });
  };
  
  return <ServicesList services={services} onAdd={handleAddService} />;
}
```

---

### 5. `useUploadPhoto` - Upload de Fotos

**Arquivo**: `src/hooks/useUploadPhoto.ts`

**Funcionalidade**: Upload e exclusão de fotos no storage do Supabase.

**Uso**:
```tsx
import { useUploadPhoto } from '@/hooks/useUploadPhoto';

function PhotoUploader({ providerId }) {
  const { upload, deletePhoto, uploading } = useUploadPhoto();
  
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const url = await upload(file, providerId);
        toast.success('Foto enviada!');
      } catch (error) {
        toast.error('Erro no upload');
      }
    }
  };
  
  return <input type="file" onChange={handleFileChange} disabled={uploading} />;
}
```

---

### 6. `useRealtimeBookings` - Notificações em Tempo Real

**Arquivo**: `src/hooks/useRealtimeBookings.ts`

**Funcionalidade**: Escuta novas reservas em tempo real via WebSocket.

**Uso**:
```tsx
import { useRealtimeBookings } from '@/hooks/useRealtimeBookings';

function Dashboard({ providerId }) {
  const [bookings, setBookings] = useState([]);
  
  useRealtimeBookings(providerId, (newBooking) => {
    setBookings(prev => [newBooking, ...prev]);
    toast.info('Nova reserva recebida!');
  });
  
  return <BookingsList bookings={bookings} />;
}
```

---

## 📋 Checklist da Fase 3

- [x] Hook `useProvider` para dados de prestador individual
- [x] Hook `useCreateBooking` para criar agendamentos
- [x] Hook `useUpdateBooking` para atualizar status
- [x] Hook `useServices` com CRUD completo
- [x] Hook `useUploadPhoto` para storage
- [x] Hook `useRealtimeBookings` para realtime
- [x] Componente `ProtectedRoute` atualizado

---

## 🔗 Integração com Componentes Existentes

### Página de Detalhes do Prestador (`prestador.$id.tsx`)

```tsx
import { useProvider } from '@/hooks/useProvider';
import { useCreateBooking } from '@/hooks/useCreateBooking';

export default function ProviderDetail({ route }) {
  const { id } = route.params;
  const { data: provider, isLoading } = useProvider(id);
  const createBooking = useCreateBooking();
  
  // ... renderização
}
```

### Dashboard do Prestador (`dashboard-parceiro.tsx`)

```tsx
import { useServices } from '@/hooks/useServices';
import { useUpdateBooking } from '@/hooks/useUpdateBooking';
import { useUploadPhoto } from '@/hooks/useUploadPhoto';
import { useRealtimeBookings } from '@/hooks/useRealtimeBookings';

export default function PartnerDashboard() {
  const { user } = useAuth();
  const { data: services } = useServices(user?.providerId);
  const updateBooking = useUpdateBooking();
  const { upload } = useUploadPhoto();
  
  useRealtimeBookings(user?.providerId, (booking) => {
    // Notificar nova reserva
  });
  
  // ... renderização
}
```

---

## 🧪 Próximos Passos (Fase 4+)

1. **Fase 4 - Storage**: Configurar bucket no Supabase e policies
2. **Fase 5 - Realtime**: Habilitar realtime nas tabelas
3. **Fase 6 - Testes**: Validar todos os fluxos

---

## 📁 Arquivos Criados

| Arquivo | Descrição |
|---------|-----------|
| `src/hooks/useProvider.ts` | Hook para buscar prestador individual |
| `src/hooks/useCreateBooking.ts` | Hook para criar agendamentos |
| `src/hooks/useUpdateBooking.ts` | Hook para atualizar agendamentos |
| `src/hooks/useServices.ts` | Hooks para CRUD de serviços |
| `src/hooks/useUploadPhoto.ts` | Hook para upload/deleção de fotos |
| `src/hooks/useRealtimeBookings.ts` | Hook para realtime de bookings |
| `src/components/ProtectedRoute.tsx` | Componente de proteção de rotas |

---

**Status**: ✅ Fase 3 Completa

**Próxima Etapa**: Fase 4 - Configuração de Storage e Realtime
