# Guia para Configurar a Busca de Prestadores com Supabase

## Problema
A busca de prestadores não estava funcionando porque utilizava dados mock (estáticos) em vez de consultar o banco de dados do Supabase.

## Solução Implementada

### 1. Atualização da Página de Busca (`/src/routes/buscar.tsx`)

**Mudanças principais:**
- Substituído o uso de dados mock (`import { providers } from "@/data/mock"`) pelo hook `useProviders`
- A busca agora consulta diretamente o Supabase
- Adicionado estados de loading e erro para melhor UX
- Atualizado o render dos cards para usar os campos do schema do Supabase

**Campos mapeados:**
| Mock (antigo) | Supabase (novo) |
|---------------|-----------------|
| `p.name` | `p.business_name` |
| `p.avatar` | `p.profiles?.avatar_url` |
| `p.available` | `p.is_available` |
| `p.badge` | `p.badges[0]` |
| `p.reviewsCount` | `p.reviews_count` |
| `p.distanceKm` | `p.city` |
| `p.responseTime` | `p.response_time` |
| `p.priceFrom` | `p.price_from` |

### 2. Hook `useProviders` (`/src/hooks/useProviders.ts`)

O hook já existia e faz a consulta correta ao Supabase com filtros opcionais:
- `category`: Filtra por categoria do serviço
- `city`: Filtra por cidade (busca parcial com ILIKE)
- `state`: Filtra por estado
- `minRating`: Filtra por avaliação mínima
- `maxPrice`: Filtra por preço máximo
- `isAvailable`: Filtra por disponibilidade

### 3. Script de Seed (`/scripts/seed-providers.ts`)

Criado script para popular o Supabase com os dados mock originais, permitindo validar a busca.

**Como executar:**
```bash
# Primeiro, configure as variáveis de ambiente no arquivo .env
cp .env.example .env
# Edite .env com suas credenciais do Supabase

# Execute o script
bun run scripts/seed-providers.ts
# ou
npx tsx scripts/seed-providers.ts
```

## Configuração Necessária

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com:

```env
VITE_SUPABASE_URL=https://seu-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key
```

### 2. Schema do Banco de Dados

Execute o SQL do arquivo `/docs/SUPABASE_SCHEMA.sql` no painel do Supabase (SQL Editor) para criar:
- Tabelas: `profiles`, `providers`, `services`, `bookings`, `reviews`, `availability`, `provider_photos`, `notifications`
- Enums: `user_status`, `user_type`, `booking_status`, `service_category`
- Triggers e funções
- Políticas de RLS (Row Level Security)
- Views úteis

### 3. Inserir Dados de Teste

Após criar o schema, execute o script de seed para inserir os prestadores de exemplo.

## Validação

### Testar a busca:

1. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   # ou
   bun run dev
   ```

2. Acesse `/buscar` no navegador

3. Teste:
   - **Busca por texto**: Digite "mecânica", "guincho", etc.
   - **Filtro por categoria**: Clique nos botões de categoria
   - **Combinação**: Use ambos os filtros juntos

### Verificar no Supabase:

1. Acesse o painel do Supabase
2. Vá para Table Editor
3. Selecione a tabela `providers`
4. Confirme que os dados foram inseridos

## Estrutura de Dados do Supabase

A tabela `providers` tem os seguintes campos principais:

```typescript
{
  id: string (UUID)
  user_id: string (UUID) - referência ao profiles.id
  business_name: string
  category: service_category (enum)
  categories_offered: string[]
  bio: string | null
  address: string
  city: string
  state: string
  zip_code: string
  country: string
  latitude: number | null
  longitude: number | null
  phone: string
  whatsapp: string | null
  website: string | null
  rating: number (0-5)
  reviews_count: number
  total_bookings: number
  price_from: number | null
  currency: string
  is_available: boolean
  response_time: string | null
  badges: string[]
  certifications: string[]
  is_verified: boolean
  is_active: boolean
  created_at: timestamp
  updated_at: timestamp
}
```

## Troubleshooting

### Erro: "Missing Supabase environment variables"
- Verifique se o arquivo `.env` existe e está configurado corretamente

### Erro: "relation does not exist"
- Execute o schema SQL no Supabase antes de usar a aplicação

### Erro: "permission denied for table providers"
- Verifique se as políticas de RLS estão configuradas corretamente
- O schema SQL inclui políticas que permitem leitura pública de providers ativos

### Dados não aparecem na busca
- Execute o script de seed para inserir dados
- Verifique se `is_active = true` nos registros

## Próximos Passos

1. **Implementar cadastro de prestadores**: Permitir que novos prestadores se cadastrem
2. **Upload de fotos**: Integrar com Supabase Storage para fotos dos prestadores
3. **Sistema de avaliações**: Permitir que clientes avaliem os prestadores
4. **Geolocalização**: Usar os campos latitude/longitude para busca por proximidade
