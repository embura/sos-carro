# Guia de Seed dos Prestadores - Supabase

Este documento descreve como popular o banco de dados do Supabase com dados mock dos prestadores para validar a funcionalidade de busca.

## ✅ Compatibilidade Verificada

### Schema vs Seed

| Campo | Schema (SUPABASE_SCHEMA.sql) | Seed (seed-providers.ts) | Status |
|-------|------------------------------|--------------------------|--------|
| `id` | UUID PRIMARY KEY | `crypto.randomUUID()` | ✅ Compatível |
| `user_id` | UUID REFERENCES profiles(id) | `crypto.randomUUID()` | ⚠️ Requer atenção* |
| `business_name` | TEXT NOT NULL | provider.name | ✅ Compatível |
| `category` | service_category ENUM | categoryId (mecanica, eletrica, etc.) | ✅ Compatível |
| `categories_offered` | service_category[] | [categoryId] | ✅ Compatível |
| `bio` | TEXT | provider.bio | ✅ Compatível |
| `address` | TEXT NOT NULL | 'Rua Exemplo, 123' | ✅ Compatível |
| `city` | TEXT NOT NULL | provider.city | ✅ Compatível |
| `state` | TEXT NOT NULL | 'SP' | ✅ Compatível |
| `zip_code` | TEXT NOT NULL | '01234-567' | ✅ Compatível |
| `country` | TEXT NOT NULL | 'Brasil' | ✅ Compatível |
| `latitude` | DECIMAL(10, 8) | -23.5505 + random | ✅ Compatível |
| `longitude` | DECIMAL(11, 8) | -46.6333 + random | ✅ Compatível |
| `phone` | TEXT NOT NULL | '(11) 9XXXXXXX' | ✅ Compatível |
| `rating` | DECIMAL(3, 2) CHECK 0-5 | provider.rating (4.6-4.9) | ✅ Compatível |
| `reviews_count` | INTEGER DEFAULT 0 | provider.reviewsCount | ✅ Compatível |
| `total_bookings` | INTEGER DEFAULT 0 | 0 | ✅ Compatível |
| `price_from` | DECIMAL(10, 2) | provider.priceFrom | ✅ Compatível |
| `currency` | TEXT DEFAULT 'BRL' | 'BRL' | ✅ Compatível |
| `is_available` | BOOLEAN DEFAULT true | provider.available | ✅ Compatível |
| `response_time` | TEXT | provider.responseTime | ✅ Compatível |
| `badges` | TEXT[] DEFAULT '{}' | [badge] ou [] | ✅ Compatível |
| `certifications` | TEXT[] DEFAULT '{}' | [] | ✅ Compatível |
| `is_verified` | BOOLEAN DEFAULT false | true | ✅ Compatível |
| `is_active` | BOOLEAN DEFAULT true | true | ✅ Compatível |

*\* Nota sobre user_id: O seed gera UUIDs aleatórios para user_id. Em produção, este seria o ID do usuário autenticado na tabela profiles.*

### ENUM service_category

Valores válidos conforme schema:
```sql
CREATE TYPE service_category AS ENUM (
  'mecanica',    ✅ Usado no seed
  'eletrica',    ✅ Usado no seed
  'guincho',     ✅ Usado no seed
  'pneus',       ✅ Usado no seed
  'funilaria',   ✅ Usado no seed
  'vidracaria',  ⚪ Disponível, não usado no seed
  'chaveiro',    ✅ Usado no seed
  'lavagem',     ⚪ Disponível, não usado no seed
  'outros'       ⚪ Disponível, não usado no seed
);
```

## 📋 Prestadores Incluídos no Seed

| ID | Nome | Categoria | Rating | Cidade | Disponível |
|----|------|-----------|--------|--------|------------|
| 1 | Auto Mecânica Silva | mecanica | 4.9 | São Paulo | ✅ |
| 2 | Guincho 24h Express | guincho | 4.8 | São Paulo | ✅ |
| 3 | Elétrica Volt Power | eletrica | 4.7 | São Paulo | ✅ |
| 4 | Pneus & Cia | pneus | 4.6 | São Paulo | ✅ |
| 5 | Funilaria Premium | funilaria | 4.9 | São Paulo | ❌ |
| 6 | Chaveiro Auto Key | chaveiro | 4.8 | São Paulo | ✅ |

## 🚀 Como Executar o Seed

### Pré-requisitos

1. **Variáveis de ambiente configuradas**
   ```bash
   # .env na raiz do projeto
   VITE_SUPABASE_URL=https://seu-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-anon-key
   ```

2. **Schema executado no Supabase**
   - Acesse o painel do Supabase
   - Vá em SQL Editor
   - Execute o conteúdo do arquivo `docs/SUPABASE_SCHEMA.sql`

### Execução

```bash
# Instale as dependências (se necessário)
npm install

# Execute o script de seed
npx tsx scripts/seed-providers.ts
```

### Saída Esperada

```
🌱 Iniciando seed dos prestadores no Supabase...

✅ Conexão com Supabase estabelecida

📦 Inserindo 6 prestadores...
📋 Categorias usadas: mecanica, guincho, eletrica, pneus, funilaria, chaveiro

➡️  Inserindo: Auto Mecânica Silva
   📝 Categoria: mecanica
   🔑 User ID: abc12345...
   ✅ Sucesso! ID: uuid-aqui

➡️  Inserindo: Guincho 24h Express
   ...

✅ Seed concluído!

Próximos passos:
1. Acesse o painel do Supabase para verificar os dados
2. Teste a busca na aplicação com `npm run dev`
3. Rota de teste: http://localhost:5173/buscar
```

## 🔍 Validação

### No Painel do Supabase

1. Acesse https://app.supabase.com
2. Selecione seu projeto
3. Vá em Table Editor → providers
4. Verifique se os 6 prestadores foram inseridos

### Via SQL

```sql
SELECT 
  business_name, 
  category, 
  city, 
  rating, 
  is_available,
  price_from
FROM providers
ORDER BY rating DESC;
```

### Na Aplicação

1. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

2. Acesse a rota de busca:
   ```
   http://localhost:5173/buscar
   ```

3. Teste os filtros:
   - Por categoria (Mecânica, Guincho, Elétrica, etc.)
   - Por cidade (São Paulo)
   - Por faixa de preço
   - Por disponibilidade

## ⚠️ Possíveis Erros e Soluções

### Erro: "invalid input value for enum"

**Causa:** O ENUM `service_category` não foi criado ou está incompleto.

**Solução:** Execute o schema SQL completo no Supabase.

### Erro: "foreign key constraint"

**Causa:** O campo `user_id` referencia um UUID que não existe na tabela `profiles`.

**Solução:** O seed atual contorna isso gerando UUIDs aleatórios. Para uma solução mais robusta:
1. Crie perfis de usuário antes de inserir os providers, OU
2. Remova temporariamente a constraint de foreign key, OU
3. Use o trigger automático que cria profiles ao criar usuários auth

### Erro: "relation 'providers' does not exist"

**Causa:** A tabela não foi criada.

**Solução:** Execute o schema SQL completo no Supabase.

## 📁 Arquivos Relacionados

- `scripts/seed-providers.ts` - Script de seed
- `docs/SUPABASE_SCHEMA.sql` - Schema do banco de dados
- `src/data/mock.ts` - Dados mock originais
- `.env` - Variáveis de ambiente do Supabase

## 🔄 Próximos Passos

1. ✅ Seed executado com sucesso
2. ✅ Dados validados no Supabase
3. ✅ Busca funcionando com dados reais
4. 🔄 Implementar autenticação real para prestadores
5. 🔄 Criar interface de cadastro de prestadores
6. 🔄 Implementar upload de fotos e documentos
