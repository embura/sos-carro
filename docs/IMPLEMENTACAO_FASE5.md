# 📢 Implementação da Fase 5: Realtime e Notificações

## Visão Geral

A **Fase 5** implementa o sistema de atualizações em tempo real e notificações do SOS Carros usando os recursos do Supabase Realtime e a API de Notificações do navegador.

---

## ✅ O que foi Implementado

### 1. Hook `useNotifications` - Gerenciamento de Notificações

**Arquivo:** `/workspace/src/hooks/useNotifications.ts`

**Funcionalidades:**
- ✅ Busca notificações do usuário
- ✅ Contagem de não lidas em tempo real
- ✅ Marcar notificação como lida
- ✅ Marcar todas como lidas
- ✅ Excluir notificações
- ✅ **Realtime**: Novas notificações aparecem instantaneamente
- ✅ **Browser Notifications**: Notificações nativas do navegador

**API do Hook:**

```typescript
const {
  notifications,      // Array de notificações
  loading,           // Estado de carregamento
  unreadCount,       // Quantidade de não lidas
  hasNotifications,  // Booleano se tem notificações
  fetchNotifications,// Refetch manual
  markAsRead,        // Marcar uma como lida
  markAllAsRead,     // Marcar todas como lidas
  deleteNotification,// Excluir notificação
} = useNotifications();
```

**Exemplo de Uso:**

```tsx
import { useNotifications } from '@/hooks/useNotifications';

function NotificationBell() {
  const { 
    notifications, 
    unreadCount, 
    markAsRead,
    markAllAsRead 
  } = useNotifications();

  return (
    <div className="notification-bell">
      <button>
        🔔 {unreadCount > 0 && <span>{unreadCount}</span>}
      </button>
      
      <div className="notifications-dropdown">
        <button onClick={markAllAsRead}>
          Marcar todas como lidas
        </button>
        
        {notifications.map(notification => (
          <div 
            key={notification.id}
            className={notification.is_read ? 'read' : 'unread'}
            onClick={() => markAsRead(notification.id)}
          >
            <h4>{notification.title}</h4>
            <p>{notification.message}</p>
            <small>{new Date(notification.created_at).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### 2. Hook `useRequestNotificationPermission` - Permissões

**Funcionalidades:**
- ✅ Solicita permissão para notificações do navegador
- ✅ Verifica status da permissão
- ✅ Retorna callback para solicitar permissão

**Exemplo de Uso:**

```tsx
import { useRequestNotificationPermission } from '@/hooks/useNotifications';

function NotificationSettings() {
  const { permission, requestPermission } = useRequestNotificationPermission();

  return (
    <div>
      <p>Status: {permission}</p>
      {permission !== 'granted' && (
        <button onClick={requestPermission}>
          Ativar Notificações
        </button>
      )}
    </div>
  );
}
```

---

### 3. Hook `useRealtimeBookings` - Reservas em Tempo Real (Provider)

**Arquivo:** `/workspace/src/hooks/useRealtimeBookings.ts`

**Funcionalidades:**
- ✅ Escuta novas reservas para o provider
- ✅ Escuta atualizações de status das reservas
- ✅ Notificações browser quando chega nova reserva
- ✅ Retorna lista de novas reservas
- ✅ Retorna histórico de atualizações

**API do Hook:**

```typescript
const {
  newBookings,        // Novas reservas recebidas
  bookingUpdates,     // Atualizações de status
  hasNewBookings,     // Tem novas reservas?
  clearNewBookings,   // Limpa contador
} = useRealtimeBookings(providerId, onNewBookingCallback);
```

**Exemplo de Uso no Dashboard do Provider:**

```tsx
import { useRealtimeBookings } from '@/hooks/useRealtimeBookings';

function ProviderDashboard({ providerId }) {
  const { newBookings, hasNewBookings, clearNewBookings } = useRealtimeBookings(
    providerId,
    (booking) => {
      console.log('Nova reserva recebida!', booking);
      // Tocar som de notificação
      // Mostrar toast notification
    }
  );

  return (
    <div>
      {hasNewBookings && (
        <div className="alert-new-bookings">
          <strong>{newBookings.length}</strong> nova(s) reserva(s)!
          <button onClick={clearNewBookings}>Ver agora</button>
        </div>
      )}
      
      {/* Lista de reservas */}
    </div>
  );
}
```

---

### 4. Hook `useRealtimeCustomerBookings` - Cliente Acompanha Reserva

**Funcionalidades:**
- ✅ Cliente recebe atualizações em tempo real
- ✅ Notificações de mudança de status
- ✅ Status labels em português

**Exemplo de Uso:**

```tsx
import { useRealtimeCustomerBookings } from '@/hooks/useRealtimeBookings';

function CustomerBookings({ customerId }) {
  const { bookingUpdates, clearUpdates } = useRealtimeCustomerBookings(customerId);

  return (
    <div>
      {bookingUpdates.map(update => (
        <Toast key={update.bookingId}>
          Sua reserva foi atualizada para: {update.status}
        </Toast>
      ))}
    </div>
  );
}
```

---

### 5. Hook `useRealtimeBookingsAdvanced` - Uso Avançado

**Funcionalidades:**
- ✅ Filtros customizados por provider OU customer
- ✅ Escuta eventos INSERT, UPDATE, DELETE
- ✅ Callbacks para cada tipo de evento
- ✅ Histórico completo de eventos

**Exemplo de Uso:**

```tsx
import { useRealtimeBookingsAdvanced } from '@/hooks/useRealtimeBookings';

function AdvancedBookingsTracker({ providerId }) {
  const { events, clearEvents } = useRealtimeBookingsAdvanced({
    providerId,
    onInsert: (booking) => {
      console.log('Nova reserva:', booking);
    },
    onUpdate: (booking) => {
      console.log('Reserva atualizada:', booking);
    },
    onDelete: (bookingId) => {
      console.log('Reserva cancelada:', bookingId);
    },
  });

  return (
    <div>
      {events.map(event => (
        <div key={event.timestamp}>
          {event.type}: {event.booking?.id || event.bookingId}
        </div>
      ))}
    </div>
  );
}
```

---

## 🔧 Configuração Necessária no Supabase

### Passo 1: Habilitar Realtime nas Tabelas

```sql
-- No dashboard do Supabase:
-- Database -> Replication

-- Habilitar para bookings
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;

-- Habilitar para notifications
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
```

**Via Dashboard:**
1. Acesse https://app.supabase.com
2. Selecione seu projeto
3. Vá em **Database** → **Replication**
4. Ative o toggle para as tabelas `bookings` e `notifications`

---

### Passo 2: Configurar Policies de Realtime

```sql
-- Bookings: Providers podem ver mudanças nas suas reservas
CREATE POLICY "Providers can realtime their bookings"
ON bookings FOR SELECT
USING (
  auth.uid() IN (
    SELECT user_id FROM providers WHERE id = provider_id
  )
);

-- Notifications: Usuários podem ver suas notificações em realtime
CREATE POLICY "Users can realtime their notifications"
ON notifications FOR SELECT
USING (auth.uid() = user_id);
```

---

### Passo 3: Testar Realtime

```typescript
// Teste simples no console do navegador
import { supabase } from '@/lib/supabase';

const channel = supabase
  .channel('test-channel')
  .on('postgres_changes', 
    { 
      event: '*', 
      schema: 'public', 
      table: 'bookings' 
    }, 
    (payload) => {
      console.log('Mudança detectada:', payload);
    }
  )
  .subscribe();

// Agora faça uma inserção/atualização no SQL Editor
// e veja o log aparecer no console
```

---

## 🎯 Integração com Componentes Existentes

### Dashboard do Parceiro

**Arquivo sugerido:** `/workspace/src/routes/dashboard-parceiro.tsx`

```tsx
import { useRealtimeBookings } from '@/hooks/useRealtimeBookings';
import { useNotifications } from '@/hooks/useNotifications';

export default function DashboardParceiro() {
  const { user } = useAuth();
  const [providerId, setProviderId] = useState<string | null>(null);
  
  // Hooks de realtime
  const { newBookings, hasNewBookings } = useRealtimeBookings(
    providerId!,
    (booking) => {
      // Tocar som
      const audio = new Audio('/notification-sound.mp3');
      audio.play();
    }
  );
  
  const { unreadCount } = useNotifications();

  // Buscar provider_id ao montar
  useEffect(() => {
    async function fetchProvider() {
      const { data } = await supabase
        .from('providers')
        .select('id')
        .eq('user_id', user?.id)
        .single();
      setProviderId(data?.id || null);
    }
    fetchProvider();
  }, [user]);

  return (
    <div>
      <header>
        <h1>Dashboard do Parceiro</h1>
        {hasNewBookings && (
          <Badge variant="destructive">
            {newBookings.length} novas reservas
          </Badge>
        )}
        {unreadCount > 0 && (
          <Badge>{unreadCount} notificações</Badge>
        )}
      </header>
      
      {/* Conteúdo do dashboard */}
    </div>
  );
}
```

---

### Dashboard do Cliente

**Arquivo sugerido:** `/workspace/src/routes/dashboard-cliente.tsx`

```tsx
import { useRealtimeCustomerBookings } from '@/hooks/useRealtimeBookings';
import { useNotifications } from '@/hooks/useNotifications';

export default function DashboardCliente() {
  const { user } = useAuth();
  
  const { bookingUpdates } = useRealtimeCustomerBookings(user?.id!);
  const { notifications, markAsRead } = useNotifications();

  return (
    <div>
      <h1>Minhas Reservas</h1>
      
      {/* Toast de atualizações */}
      {bookingUpdates.map(update => (
        <Toast key={update.bookingId}>
          Status da sua reserva atualizado!
        </Toast>
      ))}
      
      {/* Lista de notificações */}
      <section>
        <h2>Notificações</h2>
        {notifications.map(n => (
          <NotificationItem 
            key={n.id}
            notification={n}
            onMarkRead={() => markAsRead(n.id)}
          />
        ))}
      </section>
    </div>
  );
}
```

---

## 📋 Checklist de Implementação

### Código
- [x] Hook `useNotifications` criado
- [x] Hook `useRequestNotificationPermission` criado
- [x] Hook `useRealtimeBookings` atualizado
- [x] Hook `useRealtimeCustomerBookings` criado
- [x] Hook `useRealtimeBookingsAdvanced` criado
- [ ] Componente `NotificationBell` criado
- [ ] Componente `Toast` para notificações
- [ ] Integração com dashboards existente

### Supabase
- [ ] Realtime habilitado na tabela `bookings`
- [ ] Realtime habilitado na tabela `notifications`
- [ ] Policies de realtime configuradas
- [ ] Testes de conexão realizados

### UX/UI
- [ ] Som de notificação adicionado
- [ ] Ícone de notificações no header
- [ ] Badge de contador de não lidas
- [ ] Dropdown de notificações
- [ ] Toast notifications funcionando

---

## 🧪 Testes

### Teste 1: Nova Reserva (Provider)

1. Abra duas abas do navegador
2. Na aba 1: Faça login como **cliente**
3. Na aba 2: Faça login como **provider**
4. Na aba 1: Crie uma nova reserva
5. **Resultado esperado:** Aba 2 recebe notificação instantânea

### Teste 2: Atualização de Status (Cliente)

1. Abra duas abas
2. Na aba 1: Login como **provider**
3. Na aba 2: Login como **cliente**
4. Na aba 1: Atualize status de uma reserva
5. **Resultado esperado:** Aba 2 recebe atualização em tempo real

### Teste 3: Notificações Browser

1. Aceite permissão de notificações
2. Gere um evento (nova reserva ou atualização)
3. **Resultado esperado:** Notificação aparece mesmo com aba em segundo plano

---

## 🚨 Troubleshooting

### Problema: Realtime não funciona

**Solução:**
```bash
# Verificar se realtime está habilitado
# Dashboard -> Database -> Replication
# As tabelas devem estar com toggle ativo
```

### Problema: Notificações browser não aparecem

**Solução:**
```typescript
// Verificar permissão
console.log(Notification.permission);

// Se for 'denied', usuário precisa reabilitar nas configurações do browser
// Se for 'default', chamar requestPermission()
```

### Problema: Channels não limpam corretamente

**Solução:**
```typescript
// Sempre remover channels no cleanup do useEffect
useEffect(() => {
  const channel = supabase.channel('my-channel').subscribe();
  
  return () => {
    supabase.removeChannel(channel);
  };
}, []);
```

---

## 📊 Métricas de Performance

| Métrica                  | Valor Alvo | Observação                    |
|--------------------------|------------|-------------------------------|
| Latência do Realtime     | < 100ms    | Dependente da região do DB    |
| Conexões simultâneas     | Ilimitadas | Plano Free: 500 conexões      |
| Mensagens/mês (Free)     | 2 milhões  | Suficiente para MVP           |
| Notificações browser     | Imediatas  | Depende do SO/browser         |

---

## 🔗 Próximos Passos (Fase 6)

- [ ] Implementar testes E2E do realtime
- [ ] Adicionar sons de notificação customizados
- [ ] Criar central de notificações completa
- [ ] Implementar preferências de notificação
- [ ] Adicionar push notifications (PWA)

---

## 📚 Referências

- [Supabase Realtime Docs](https://supabase.com/docs/guides/realtime)
- [Browser Notification API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)
- [Postgres Changes](https://supabase.com/docs/guides/realtime/postgres-changes)

---

**Status:** ✅ Implementado  
**Data:** Maio 2025  
**Responsável:** Equipe de Desenvolvimento
