# Como Validar o Funcionamento do Supabase

Este documento explica como validar e testar a integração com o Supabase no projeto.

## 📋 Pré-requisitos

1. Ter uma conta no [Supabase](https://supabase.com)
2. Ter um projeto criado no Supabase
3. Node.js instalado (versão 20 ou superior)

## 🔧 Configuração

### 1. Obter Credenciais do Supabase

1. Acesse o painel do Supabase: https://app.supabase.com
2. Selecione seu projeto
3. Vá em **Settings** (Configurações) → **API**
4. Copie as seguintes informações:
   - **Project URL** (URL do Projeto)
   - **anon/public key** (Chave Pública)

### 2. Criar Arquivo de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```bash
VITE_SUPABASE_URL=https://seu-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

**Importante:** Nunca commit o arquivo `.env` no Git. Use `.env.example` como referência.

### 3. Instalar Dependências

```bash
npm install
```

## ✅ Validação Automática

Execute o script de validação:

```bash
npm run validate:supabase
```

O script irá testar:
- ✓ Se as variáveis de ambiente estão configuradas
- ✓ Se a conexão com o Supabase está funcionando
- ✓ Se é possível autenticar (sessão)

### Resultado Esperado

Se tudo estiver correto, você verá:

```
🔍 Validando conexão com Supabase...

✅ Passo 1: Verificando variáveis de ambiente
   ✓ URL configurada: https://your-project-id.su...
   ✓ Chave configurada: eyJhbGciOiJIUzI1NiIs...

📡 Passo 2: Testando conexão com o Supabase
   ✓ Conexão bem-sucedida!

🔐 Passo 3: Verificando status de autenticação
   ℹ️  Nenhum usuário autenticado (isso é normal)

✅ Validação concluída!
```

## 🗄️ Configurar Banco de Dados

### Opção 1: Via Painel do Supabase (SQL Editor)

1. No painel do Supabase, vá para **SQL Editor**
2. Execute os scripts SQL para criar as tabelas necessárias
3. As tabelas esperadas são:
   - `profiles`
   - `providers`
   - `services`
   - `bookings`
   - `reviews`
   - `availability`
   - `provider_photos`
   - `notifications`

### Opção 2: Via Supabase CLI

```bash
# Instalar Supabase CLI globalmente
npm install -g supabase

# Linkar com seu projeto
supabase link --project-ref seu-project-id

# Aplicar migrations
supabase db push
```

## 🧪 Testes Manuais

### Testar Conexão no Código

```typescript
import { supabase } from './src/lib/supabase';

// Testar busca de dados
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .limit(5);

if (error) {
  console.error('Erro:', error);
} else {
  console.log('Dados:', data);
}
```

### Testar Autenticação

```typescript
import { supabase } from './src/lib/supabase';

// Registrar usuário
const { data, error } = await supabase.auth.signUp({
  email: 'teste@exemplo.com',
  password: 'senha-forte-aqui'
});

// Login
const { data: session } = await supabase.auth.signInWithPassword({
  email: 'teste@exemplo.com',
  password: 'senha-forte-aqui'
});
```

## 🐛 Solução de Problemas

### Erro: "Missing Supabase environment variables"

**Causa:** Arquivo `.env` não existe ou está mal configurado.

**Solução:** 
- Verifique se o arquivo `.env` existe na raiz do projeto
- Confirme que as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estão presentes
- Reinicie o servidor de desenvolvimento após alterar o `.env`

### Erro: "relation does not exist"

**Causa:** As tabelas do banco de dados ainda não foram criadas.

**Solução:**
- Crie as tabelas no painel do Supabase ou use a CLI
- Execute as migrations necessárias

### Erro de CORS

**Causa:** URL do projeto incorreta ou permissões de API não configuradas.

**Solução:**
- Verifique se a URL no `.env` está correta (deve ser `https://xxx.supabase.co`)
- No painel do Supabase, verifique as configurações de API

## 📚 Recursos Adicionais

- [Documentação Oficial do Supabase](https://supabase.com/docs)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript/introduction)
- [Dashboard do Projeto](https://app.supabase.com)

## 📞 Suporte

Em caso de dúvidas, consulte:
- A documentação do Supabase
- O código em `src/lib/supabase.ts`
- Os tipos TypeScript definidos no arquivo acima
