# 📊 Configuração do Banco de Dados - Fase 5

## Visão Geral

As tabelas `bookings` e `notifications` **JÁ ESTÃO DEFINIDAS** no schema principal do projeto. Este documento explica a configuração necessária para habilitar o Realtime na Fase 5.

---

## ✅ Status das Tabelas

### Tabela: `bookings`
- **Localização**: `/workspace/docs/SUPABASE_SCHEMA.sql` (linhas 186-234)
- **Status**: ✅ Schema completo definido
- **Realtime**: ⚠️ Precisa ser habilitado (ver seção abaixo)

### Tabela: `notifications`
- **Localização**: `/workspace/docs/SUPABASE_SCHEMA.sql` (linhas 299-322)
- **Status**: ✅ Schema completo definido
- **Realtime**: ⚠️ Precisa ser habilitado (ver seção abaixo)

---

## 🔧 Configuração Necessária para Fase 5

### Passo 1: Executar o Schema Principal

Se você ainda não criou as tabelas no Supabase:

1. Acesse o **SQL Editor** no [Supabase Dashboard](https://supabase.com/dashboard)
2. Copie todo o conteúdo de `/workspace/docs/SUPABASE_SCHEMA.sql`
3. Execute o script completo

**OU** via terminal com psql:

```bash
psql -h db.<your-project>.supabase.co -U postgres -d postgres -f docs/SUPABASE_SCHEMA.sql
```

### Passo 2: Habilitar Realtime (CRÍTICO PARA FASE 5)

Após criar as tabelas, você **PRECISA** habilitar o realtime:

#### Opção A: Via SQL Editor (Recomendado)

Execute estes comandos no SQL Editor do Supabase:

```sql
-- Habilitar Realtime na tabela bookings
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;

-- Habilitar Realtime na tabela notifications
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
```

#### Opção B: Via Dashboard UI

1. Acesse **Database** → **Replication** no Supabase Dashboard
2. Encontre a tabela `bookings` na lista
3. Ative o toggle "Enable Realtime"
4. Repita para a tabela `notifications`

#### Opção C: Via Terminal

```bash
psql -h db.<your-project>.supabase.co -U postgres -d postgres <<EOF
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
EOF
```

---

## 📋 Estrutura Completa das Tabelas

### Tabela `bookings`

```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Relacionamentos
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  
  -- Detalhes do serviço
  service_description TEXT NOT NULL,
  service_category service_category NOT NULL,
  
  -- Localização do atendimento
  service_address TEXT NOT NULL,
  service_city TEXT NOT NULL,
  service_state TEXT NOT NULL,
  service_zip_code TEXT NOT NULL,
  service_latitude DECIMAL(10, 8),
  service_longitude DECIMAL(11, 8),
  
  -- Agendamento
  scheduled_at TIMESTAMPTZ NOT NULL,
  estimated_duration INTEGER, -- minutos
  
  -- Preço
  quoted_price DECIMAL(10, 2),
  final_price DECIMAL(10, 2),
  currency TEXT DEFAULT 'BRL',
  
  -- Status
  status booking_status NOT NULL DEFAULT 'pending',
  
  -- Informações adicionais
  notes TEXT,
  customer_notes TEXT,
  provider_notes TEXT,
  
  -- Cancelamento
  cancelled_by UUID REFERENCES profiles(id),
  cancellation_reason TEXT,
  cancelled_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);
```

**Índices Criados:**
```sql
CREATE INDEX idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX idx_bookings_provider_id ON bookings(provider_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_scheduled_at ON bookings(scheduled_at);
CREATE INDEX idx_bookings_created_at ON bookings(created_at DESC);
```

### Tabela `notifications`

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  type TEXT NOT NULL, -- booking_request, booking_confirmed, review_received, etc.
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  
  -- Dados relacionados
  related_booking_id UUID REFERENCES bookings(id),
  related_review_id UUID REFERENCES reviews(id),
  
  -- Status
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Índices Criados:**
```sql
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
```

---

## 🔍 Verificação da Configuração

### Verificar se as tabelas existem

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('bookings', 'notifications');
```

### Verificar se Realtime está habilitado

```sql
SELECT schemaname, tablename, pubname
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime'
AND tablename IN ('bookings', 'notifications');
```

**Resultado esperado:**
```
schemaname | tablename     | pubname
-----------+---------------+------------------
public     | bookings      | supabase_realtime
public     | notifications | supabase_realtime
```

### Verificar Row Level Security (RLS)

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('bookings', 'notifications');
```

Ambas devem retornar `rowsecurity = true`.

---

## 🎯 Testando o Realtime

### Teste 1: Inserir uma notificação e verificar realtime

```sql
-- Primeiro, obtenha seu user_id
SELECT id FROM profiles WHERE email = 'seu@email.com';

-- Insira uma notificação de teste (substitua <USER_ID>)
INSERT INTO notifications (user_id, type, title, message)
VALUES (
  '<USER_ID>',
  'booking_request',
  'Nova solicitação de serviço',
  'Você recebeu uma nova solicitação de orçamento'
);
```

No seu frontend, o hook `useNotifications` deve receber esta notificação em tempo real.

### Teste 2: Atualizar status de booking

```sql
-- Atualize o status de um booking existente
UPDATE bookings 
SET status = 'confirmed', 
    confirmed_at = NOW()
WHERE id = '<BOOKING_ID>';
```

O hook `useRealtimeBookings` deve detectar esta mudança instantaneamente.

---

## 🛠️ Troubleshooting

### Problema: Realtime não funciona

**Solução 1:** Verifique se as tabelas estão no publication

```sql
SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';
```

Se `bookings` ou `notifications` não aparecerem, execute:

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
```

**Solução 2:** Verifique se RLS está habilitado

```sql
-- Se RLS não estiver habilitado
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
```

**Solução 3:** Verifique as políticas de RLS

As políticas já estão definidas no schema, mas verifique se existem:

```sql
SELECT policyname, tablename, cmd
FROM pg_policies
WHERE tablename IN ('bookings', 'notifications');
```

### Problema: Erro de permissão ao inserir notificações

Verifique se o usuário autenticado tem permissão:

```sql
-- Políticas devem estar configuradas assim:
-- "Users can view their own notifications" - SELECT
-- "Users can update their own notifications" - UPDATE
-- "System can insert notifications" - INSERT (pode precisar ser criada)
```

Se precisar de uma política de INSERT mais permissiva para triggers:

```sql
CREATE POLICY "Authenticated users can receive notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);
```

---

## 📝 Resumo da Configuração

| Item | Status | Localização |
|------|--------|-------------|
| Schema `bookings` | ✅ Definido | `SUPABASE_SCHEMA.sql` linha 186 |
| Schema `notifications` | ✅ Definido | `SUPABASE_SCHEMA.sql` linha 299 |
| Índices `bookings` | ✅ Definidos | `SUPABASE_SCHEMA.sql` linha 237-241 |
| Índices `notifications` | ✅ Definidos | `SUPABASE_SCHEMA.sql` linha 319-321 |
| RLS `bookings` | ✅ Definido | `SUPABASE_SCHEMA.sql` linha 540+ |
| RLS `notifications` | ✅ Definido | `SUPABASE_SCHEMA.sql` linha 607+ |
| Realtime `bookings` | ⚠️ Manual | Execute ALTER PUBLICATION |
| Realtime `notifications` | ⚠️ Manual | Execute ALTER PUBLICATION |

---

## 🚀 Próximos Passos

1. ✅ Executar schema completo no Supabase
2. ✅ Habilitar Realtime nas tabelas
3. ✅ Verificar configuração com queries de teste
4. ✅ Testar hooks no frontend
5. 📋 Integrar componentes de UI (NotificationBell, etc.)

---

## 📚 Links Relacionados

- [Documentação da Fase 5](./IMPLEMENTACAO_FASE5.md)
- [Schema Completo](./SUPABASE_SCHEMA.sql)
- [Hooks Implementados](../src/hooks/)
- [Guia Supabase Realtime](https://supabase.com/docs/guides/realtime)

---

**Última atualização:** Maio 2025  
**Versão:** 1.0.0
