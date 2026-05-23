# 🚀 Quick Start - Configuração do Database

## Resumo Rápido

**Pergunta:** Preciso criar as tabelas `bookings` e `notifications`?

**Resposta:** O schema já está pronto! Você só precisa executar no Supabase.

---

## ⚡ Configuração em 3 Passos

### Passo 1: Executar Schema (5 min)

1. Acesse [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá em **SQL Editor**
3. Cole o conteúdo de `/workspace/docs/SUPABASE_SCHEMA.sql`
4. Clique em **Run**

✅ Isso cria TODAS as tabelas, índices, triggers e políticas RLS

---

### Passo 2: Habilitar Realtime (1 min)

Ainda no SQL Editor, execute:

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
```

✅ Isso habilita atualizações em tempo real para a Fase 5

---

### Passo 3: Verificar (30 seg)

Execute:

```sql
SELECT tablename FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime'
AND tablename IN ('bookings', 'notifications');
```

**Resultado esperado:**
```
bookings
notifications
```

✅ Pronto! Seu database está configurado.

---

## 📋 O Que Foi Criado

| Tabela | Finalidade | Realtime |
|--------|-----------|----------|
| `profiles` | Dados dos usuários | ❌ |
| `providers` | Prestadores de serviço | ❌ |
| `services` | Serviços oferecidos | ❌ |
| `availability` | Disponibilidade | ❌ |
| **`bookings`** | **Reservas/Solicitações** | ✅ |
| `reviews` | Avaliações | ❌ |
| `provider_photos` | Fotos dos prestadores | ❌ |
| **`notifications`** | **Notificações** | ✅ |

---

## 🎯 Próximos Passos

Agora você pode usar os hooks da Fase 5:

- `useNotifications()` - Gerenciar notificações
- `useRealtimeBookings()` - Acompanhar reservas em tempo real
- `useRealtimeCustomerBookings()` - Cliente acompanha status

Veja exemplos em: `/workspace/docs/IMPLEMENTACAO_FASE5.md`

---

## ❓ Problemas Comuns

### Erro: "relation already exists"

As tabelas já existem. Tudo certo! Pule para o Passo 2.

### Erro: "publication does not exist"

O Supabase já cria automaticamente. Tente apenas habilitar as tabelas via Dashboard UI:
- Database → Replication → Ative toggle das tabelas

### Realtime não funciona

Verifique se as tabelas estão na publicação:

```sql
SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';
```

Se não aparecerem, execute novamente:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
```

---

**Tempo total estimado:** 7 minutos  
**Dificuldade:** Fácil

Para mais detalhes, veja: `/workspace/docs/CONFIGURACAO_DATABASE_FASE5.md`
