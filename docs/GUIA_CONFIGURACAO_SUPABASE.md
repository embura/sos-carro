# 📋 Guia de Configuração do Supabase - SOS Carros

## 1. Criar Projeto no Supabase

1. Acesse https://app.supabase.com
2. Clique em "New Project"
3. Preencha:
   - **Name**: sos-carros
   - **Database Password**: (guarde esta senha!)
   - **Region**: us-east-1 (mais próxima do Brasil)
4. Aguarde a criação (2-3 minutos)

## 2. Obter Credenciais

No dashboard do projeto:
1. Vá em **Settings** → **API**
2. Copie:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...`

## 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```bash
cp .env.example .env.local
```

Edite `.env.local`:

```env
VITE_SUPABASE_URL=https://seu-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key-aqui
```

## 4. Executar Schema do Banco de Dados

1. No dashboard, vá em **SQL Editor**
2. Copie o conteúdo de `docs/SUPABASE_SCHEMA.sql`
3. Cole no editor e execute

### Verificar tabelas criadas:

```sql
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```

Deve retornar 8 tabelas: profiles, providers, services, availability, bookings, reviews, provider_photos, notifications

## 5. Configurar Autenticação

### 5.1 Email Provider (já habilitado por padrão)

1. Vá em **Authentication** → **Providers**
2. Verifique se **Email** está habilitado

### 5.2 Configurar Templates de Email

1. **Authentication** → **Email Templates**
2. Personalize:
   - **Confirm signup**
   - **Reset password**
   - **Magic link** (opcional)

### 5.3 Configurar Site URL

1. **Authentication** → **URL Configuration**
2. Defina:
   - **Site URL**: `http://localhost:5173` (desenvolvimento)
   - **Redirect URLs**: `http://localhost:5173/*`

## 6. Configurar Storage (para fotos dos prestadores)

1. Vá em **Storage**
2. Clique em **New Bucket**
3. Nome: `provider-photos`
4. Público: ✅ Sim
5. File size limit: 5MB

### Policies do Storage:

Execute no SQL Editor:

```sql
-- Qualquer um pode visualizar fotos
CREATE POLICY "Anyone can view photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'provider-photos');

-- Usuários autenticados podem upload
CREATE POLICY "Authenticated users can upload photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'provider-photos' AND
  auth.role() = 'authenticated'
);

-- Apenas dono do provider pode deletar
CREATE POLICY "Provider owners can delete photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'provider-photos' AND
  auth.uid() IN (
    SELECT user_id FROM providers 
    WHERE id = (storage.foldername(name))[1]::uuid
  )
);
```

## 7. Habilitar Realtime (para notificações de bookings)

1. Vá em **Database** → **Replication**
2. Enable realtime para as tabelas:
   - `bookings`
   - `notifications`

## 8. Testar Configuração

### Teste de conexão:

Crie um arquivo de teste ou use o console do navegador:

```javascript
import { supabase } from './src/lib/supabase';

// Testar conexão
const { data, error } = await supabase.from('providers').select('id').limit(1);
console.log(data, error);
```

### Testar autenticação:

```javascript
// Signup
const { data, error } = await supabase.auth.signUp({
  email: 'teste@example.com',
  password: 'senha123',
  options: {
    data: { full_name: 'Teste User', user_type: 'customer' }
  }
});

// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'teste@example.com',
  password: 'senha123'
});
```

## 9. Checklist Final

### Infraestrutura
- [ ] Projeto criado no Supabase
- [ ] Schema executado com sucesso
- [ ] 8 tabelas criadas
- [ ] Triggers funcionando (updated_at, create_profile)
- [ ] RLS policies ativas
- [ ] Bucket de storage criado
- [ ] Policies de storage configuradas
- [ ] Realtime habilitado

### Código
- [ ] Arquivo `.env.local` configurado
- [ ] SDK instalado (`@supabase/supabase-js`)
- [ ] Types gerados (`src/lib/supabase.ts`)
- [ ] AuthContext funcional
- [ ] Hooks criados (useProviders, useBookings, etc.)
- [ ] ProtectedRoute implementado

### Funcionalidades
- [ ] Cadastro de usuário funciona
- [ ] Login funciona
- [ ] Logout funciona
- [ ] Listagem de providers funciona
- [ ] Detalhes do provider funciona
- [ ] Criação de booking funciona

## 10. Troubleshooting

### Erro: "Invalid API key"
- Verifique se está usando a **anon key** (não service role)
- Confira se as variáveis estão carregadas: `console.log(import.meta.env)`

### Erro: "Row Level Security policy violation"
- Verifique se o usuário está autenticado
- Confira as policies no dashboard: **Authentication** → **Policies**

### Erro: "JWT expired"
- O cliente Supabase gerencia refresh automaticamente
- Verifique se `onAuthStateChange` está configurado

### Emails não chegando
- Verifique spam folder
- Em desenvolvimento, use **Magic Link** que não requer confirmação
- Production: configure SMTP próprio ou use Resend/SendGrid

## 11. Próximos Passos

Após configurar o Supabase:

1. Implementar telas de login/cadastro
2. Integrar hooks com componentes existentes
3. Substituir dados mockados por dados reais
4. Implementar CRUD de providers (para prestadores)
5. Implementar fluxo completo de booking

---

**Documentação oficial**: https://supabase.com/docs  
**SDK JS**: https://supabase.com/docs/reference/javascript/introduction
