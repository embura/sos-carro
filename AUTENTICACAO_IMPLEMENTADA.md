# Autenticação e Autorização - SOS Carros

## ✅ Implementação Completa

A autenticação e autorização do Supabase foi completamente implementada no projeto SOS Carros.

---

## 📋 Funcionalidades Implementadas

### 1. **Contexto de Autenticação** (`src/contexts/AuthContext.tsx`)
- Gerenciamento completo de estado de autenticação
- Hooks personalizados:
  - `useAuth()` - Acesso ao estado de autenticação
  - `useIsProvider()` - Verifica se usuário é prestador
  - `useIsAdmin()` - Verifica se usuário é admin

**Funções disponíveis:**
- `signIn(email, password)` - Login
- `signUp(email, password, fullName, userType)` - Cadastro
- `signOut()` - Logout
- `resetPassword(email)` - Recuperação de senha
- `updateProfile(data)` - Atualização de perfil

### 2. **Páginas de Autenticação**

#### **Login** (`/entrar`)
- Formulário funcional com validação
- Integração com Supabase Auth
- Redirecionamento para dashboard após login
- Link para recuperação de senha
- Mensagens de erro tratadas

#### **Cadastro** (`/cadastro`)
- Dois tipos de conta: Cliente e Prestador
- Formulários específicos para cada tipo
- Validação de senha mínima (8 caracteres)
- Criação de perfil automático no Supabase
- Redirecionamento para login após cadastro

#### **Recuperação de Senha** (`/recuperar-senha`)
- Solicitação de reset de senha via e-mail
- Confirmação de envio
- Link para voltar ao login

### 3. **Proteção de Rotas** (`src/components/ProtectedRoute.tsx`)
- Componente para proteger rotas privadas
- Opções de proteção:
  - `requireProvider` - Apenas prestadores
  - `requireAdmin` - Apenas administradores
- Loading state durante verificação
- Redirecionamento automático para login

### 4. **Dashboard Protegida** (`/dashboard`)
- Acessível apenas para usuários autenticados
- Exibição dinâmica baseada no tipo de usuário
- Botão de logout funcional
- Saudação personalizada com nome do usuário

---

## 🔧 Configuração Necessária

### 1. Variáveis de Ambiente

Certifique-se de que o arquivo `.env` está configurado:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

### 2. Configuração no Supabase

No painel do Supabase, configure:

#### **Authentication > Providers**
- Email/Password: **Enabled**
- Confirm email: **Enabled** (recomendado)

#### **Authentication > Policies**

Crie as seguintes Row Level Security (RLS) policies:

**Tabela `profiles`:**
```sql
-- Permitir leitura do próprio perfil
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Permitir atualização do próprio perfil
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Permitir inserção do próprio perfil (trigger)
CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);
```

**Tabela `providers`:**
```sql
-- Permitir leitura de todos providers ativos
CREATE POLICY "Anyone can view active providers"
ON providers FOR SELECT
USING (is_active = true);

-- Permitir atualização apenas do próprio provider
CREATE POLICY "Providers can update own profile"
ON providers FOR UPDATE
USING (auth.uid() = user_id);
```

#### **Database > Triggers**

Crie um trigger para criar perfil automaticamente:

```sql
-- Função para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, user_type)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'customer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para chamar a função
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## 🚀 Como Usar

### No Código

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MeuComponente() {
  const { user, profile, signIn, signOut, loading } = useAuth();

  if (loading) return <div>Carregando...</div>;
  
  if (!user) {
    return <button onClick={() => signIn('email', 'senha')}>Entrar</button>;
  }

  return (
    <div>
      <p>Bem-vindo, {profile?.full_name}!</p>
      <button onClick={signOut}>Sair</button>
    </div>
  );
}
```

### Proteger uma Rota

```tsx
import { ProtectedRoute } from '@/components/ProtectedRoute';

function MinhaRotaPrivada() {
  return (
    <ProtectedRoute requireProvider>
      <ConteudoExclusivoParaPrestadores />
    </ProtectedRoute>
  );
}
```

---

## 🧪 Testes

### 1. Testar Cadastro
```bash
npm run dev
# Acesse http://localhost:5173/cadastro
# Preencha os dados e crie uma conta
```

### 2. Testar Login
```bash
# Acesse http://localhost:5173/entrar
# Use as credenciais criadas
```

### 3. Testar Proteção de Rotas
```bash
# Tente acessar /dashboard sem estar logado
# Deve redirecionar para /entrar
```

### 4. Testar Logout
```bash
# No dashboard, clique em "Sair"
# Deve redirecionar para a home
```

---

## 📁 Arquivos Criados/Modificados

| Arquivo | Descrição |
|---------|-----------|
| `src/main.tsx` | Adicionado AuthProvider |
| `src/contexts/AuthContext.tsx` | Contexto de autenticação (já existia) |
| `src/routes/entrar.tsx` | Página de login funcional |
| `src/routes/cadastro.tsx` | Página de cadastro funcional |
| `src/routes/recuperar-senha.tsx` | Nova página de recuperação |
| `src/routes/dashboard.tsx` | Dashboard protegida |
| `src/components/ProtectedRoute.tsx` | Componente de proteção (já existia) |

---

## 🔒 Segurança

### Boas Práticas Implementadas
- ✅ Senhas com mínimo de 8 caracteres
- ✅ RLS (Row Level Security) no banco de dados
- ✅ Sessões gerenciadas pelo Supabase
- ✅ Proteção de rotas privadas
- ✅ Validação de tipos de usuário

### Recomendações Adicionais
1. Habilitar confirmação de e-mail no Supabase
2. Implementar rate limiting para tentativas de login
3. Usar HTTPS em produção
4. Revisar periodicamente as políticas de segurança

---

## 🐛 Solução de Problemas

### Erro: "Missing Supabase environment variables"
**Solução:** Verifique se o arquivo `.env` existe e contém as variáveis corretas.

### Erro: "User already registered"
**Solução:** O e-mail já está cadastrado. Use a recuperação de senha.

### Erro: "Invalid login credentials"
**Solução:** Verifique e-mail e senha. Lembre-se que senhas são case-sensitive.

### Usuário não consegue acessar dashboard
**Solução:** 
1. Verifique se o e-mail foi confirmado (se habilitado)
2. Confira se o perfil foi criado na tabela `profiles`
3. Execute o script de validação: `npm run validate:supabase`

---

## 📞 Suporte

Para mais informações, consulte:
- [Documentação do Supabase](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
