# 🚗 SOS Carros - Plataforma de Serviços Automotivos

[![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)](https://github.com/users/mjpfelicia/projects/5)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev)
[![TanStack Router](https://img.shields.io/badge/TanStack%20Router-1.168-red)](https://tanstack.com/router)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.2.1-38bdf8)](https://tailwindcss.com)

Plataforma de conexão entre motoristas e prestadores de serviços automotivos emergenciais como mecânica, elétrica, guincho, pneus, funilaria e mais.

## 📋 Índice

- [Funcionalidades](#-funcionalidades)
- [Stack Tecnológico](#-stack-tecnológico)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração do Supabase](#-configuração-do-supabase)
- [Desenvolvimento](#-desenvolvimento)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Documentação](#-documentação)
- [Status das Fases](#-status-das-fases)
- [Contribuição](#-contribuição)

---

## ✨ Funcionalidades

### Para Clientes
- 🔍 Busca de prestadores por categoria e localização
- 👁️ Visualização de perfis detalhados com serviços e avaliações
- 📅 Agendamento de serviços
- ⭐ Sistema de avaliações e reviews
- 🔔 Notificações em tempo real

### Para Prestadores
- 📝 Cadastro completo de perfil profissional
- 🛠️ Gestão de serviços oferecidos
- 📊 Dashboard com métricas e bookings
- 📸 Upload de fotos de trabalhos realizados
- 🔔 Recebimento de notificações em tempo real
- ✅ Confirmação e gestão de agendamentos

### Autenticação e Segurança
- 🔐 Login/Cadastro com email e senha
- 🔄 Recuperação de senha
- 🛡️ Row Level Security (RLS) no banco de dados
- 🚧 Rotas protegidas por tipo de usuário

---

## 🛠️ Stack Tecnológico

### Frontend
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **React** | 19.2.0 | Framework UI |
| **TanStack Router** | 1.168.0 | Router type-safe |
| **TailwindCSS** | 4.2.1 | Estilização |
| **Radix UI** | Latest | Componentes acessíveis |
| **React Hook Form** | 7.71.2 | Gestão de formulários |
| **Zod** | 3.24.2 | Validação de schemas |
| **TanStack Query** | 5.83.0 | Estado server-side |
| **Vite** | 7.3.1 | Build tool |

### Backend (Supabase)
| Tecnologia | Descrição |
|------------|-----------|
| **PostgreSQL** | Banco de dados relacional |
| **Supabase Auth** | Autenticação e autorização |
| **Supabase Storage** | Armazenamento de imagens |
| **Supabase Realtime** | WebSocket para atualizações em tempo real |
| **Row Level Security** | Segurança granular no banco |

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter:

- ✅ Node.js >= 24.0.0
- ✅ npm ou bun instalado
- ✅ Conta no [Supabase](https://supabase.com)
- ✅ Git configurado

---

## 🚀 Instalação

### 1. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd sos-carros
```

### 2. Instalar dependências

```bash
npm install
# ou
bun install
```

### 3. Configurar variáveis de ambiente

```bash
cp .env.example .env.local
```

Edite `.env.local` com suas credenciais do Supabase:

```env
VITE_SUPABASE_URL=https://seu-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

---

## 🗄️ Configuração do Supabase

### Passo 1: Criar Projeto

1. Acesse https://app.supabase.com
2. Clique em "New Project"
3. Preencha:
   - **Name**: sos-carros
   - **Database Password**: (gerar senha forte)
   - **Region**: us-east-1 (mais próxima do Brasil)

### Passo 2: Executar Schema

1. No dashboard do Supabase, vá para **SQL Editor**
2. Execute o conteúdo do arquivo [`docs/SUPABASE_SCHEMA.sql`](./docs/SUPABASE_SCHEMA.sql)

Isso criará todas as tabelas, triggers, policies e views necessárias:
- `profiles` - Perfis de usuários
- `providers` - Prestadores de serviço
- `services` - Serviços oferecidos
- `bookings` - Agendamentos
- `reviews` - Avaliações
- `availability` - Disponibilidade horária
- `provider_photos` - Fotos dos prestadores
- `notifications` - Notificações

### Passo 3: Configurar Storage

1. Vá para **Storage** → **New Bucket**
2. Crie bucket com nome: `provider-photos`
3. Configure como **público**
4. Defina limite de tamanho: 5MB
5. Tipos MIME permitidos: `image/jpeg,image/png,image/webp`

### Passo 4: Políticas RLS

Execute no SQL Editor as políticas de segurança descritas em [`docs/PLANO_IMPLEMENTACAO_SUPABASE.md`](./docs/PLANO_IMPLEMENTACAO_SUPABASE.md).

---

## 💻 Desenvolvimento

### Iniciar servidor de desenvolvimento

```bash
npm run dev
# ou
bun run dev
```

Acesse http://localhost:5173

### Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Build para produção |
| `npm run build:dev` | Build modo desenvolvimento |
| `npm run preview` | Preview da build |
| `npm run lint` | Executa ESLint |
| `npm run format` | Formata código com Prettier |
| `npm run validate:supabase` | Valida conexão com Supabase |

---

## 📁 Estrutura do Projeto

```
/workspace
├── src/
│   ├── components/          # Componentes React
│   │   ├── ui/              # Componentes UI (Radix)
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── PhotoGallery.tsx
│   │   ├── PhotoUploader.tsx
│   │   └── ProtectedRoute.tsx
│   ├── contexts/            # Contextos React
│   │   └── AuthContext.tsx  # Autenticação
│   ├── hooks/               # Hooks personalizados
│   │   ├── useProviders.ts
│   │   ├── useProvider.ts
│   │   ├── useBookings.ts
│   │   ├── useCreateBooking.ts
│   │   ├── useUpdateBooking.ts
│   │   ├── useServices.ts
│   │   ├── useUploadPhoto.ts
│   │   ├── useRealtimeBookings.ts
│   │   └── useReviews.ts
│   ├── lib/                 # Utilitários e configs
│   │   └── supabase.ts      # Cliente Supabase + Types
│   ├── routes/              # Rotas da aplicação
│   │   ├── index.tsx        # Landing Page
│   │   ├── buscar.tsx       # Busca de prestadores
│   │   ├── prestador.$id.tsx# Perfil do prestador
│   │   ├── entrar.tsx       # Login
│   │   ├── cadastro.tsx     # Cadastro
│   │   ├── recuperar-senha.tsx
│   │   ├── dashboard.tsx
│   │   ├── dashboard-cliente.tsx
│   │   ├── dashboard-parceiro.tsx
│   │   ├── minhas-fotos.tsx
│   │   ├── seja-prestador.tsx
│   │   ├── como-funciona.tsx
│   │   └── __root.tsx
│   ├── data/                # Dados mock (dev)
│   ├── assets/              # Assets estáticos
│   └── main.tsx             # Entry point
├── docs/                    # Documentação completa
├── public/                  # Arquivos públicos
├── scripts/                 # Scripts utilitários
└── package.json
```

---

## 📚 Documentação

A documentação completa está organizada no diretório [`docs/`](./docs/):

| Documento | Descrição |
|-----------|-----------|
| [README.md](./docs/README.md) | Visão geral da documentação |
| [DECISOES_ARQUITETURAIS.md](./docs/DECISOES_ARQUITETURAIS.md) | Decisões técnicas e stack |
| [SUPABASE_SCHEMA.sql](./docs/SUPABASE_SCHEMA.sql) | Schema completo do banco |
| [SDD_ESPECIFICACOES.md](./docs/SDD_ESPECIFICACOES.md) | Especificações de requisitos (RF01-RF08) |
| [PLANO_IMPLEMENTACAO_SUPABASE.md](./docs/PLANO_IMPLEMENTACAO_SUPABASE.md) | Plano de implementação em 6 fases |
| [GUIA_CONFIGURACAO_SUPABASE.md](./docs/GUIA_CONFIGURACAO_SUPABASE.md) | Guia passo-a-passo |
| [TAREFAS_GITHUB_SUMMARY.md](./docs/TAREFAS_GITHUB_SUMMARY.md) | Tarefas para GitHub Projects |

### Documentos de Implementação

| Documento | Status |
|-----------|--------|
| [AUTENTICACAO_IMPLEMENTADA.md](./AUTENTICACAO_IMPLEMENTADA.md) | ✅ Autenticação completa |
| [IMPLEMENTACAO_FASE3.md](./IMPLEMENTACAO_FASE3.md) | ✅ Hooks de integração |
| [FASE4_CONCLUIDA.md](./docs/FASE4_CONCLUIDA.md) | ✅ Storage e upload de fotos |
| [VALIDACAO_SUPABASE.md](./VALIDACAO_SUPABASE.md) | ✅ Guia de validação |

---

## ✅ Status das Fases

| Fase | Descrição | Status | Data |
|------|-----------|--------|------|
| **Fase 0** | Configuração inicial | ✅ Concluída | Jan 2025 |
| **Fase 1** | Banco de dados (schema) | ✅ Concluída | Jan 2025 |
| **Fase 2** | Autenticação | ✅ Concluída | Jan 2025 |
| **Fase 3** | Integração frontend (hooks) | ✅ Concluída | Mai 2025 |
| **Fase 4** | Storage e upload de fotos | ✅ Concluída | Mai 2025 |
| **Fase 5** | Realtime e notificações | ⏳ Pendente | - |
| **Fase 6** | Testes e validação | ⏳ Pendente | - |

### Funcionalidades Implementadas

- ✅ Landing page com busca e categorias
- ✅ Página de busca com filtros
- ✅ Perfil detalhado do prestador
- ✅ Sistema de autenticação completo
- ✅ Cadastro de clientes e prestadores
- ✅ Dashboard do prestador
- ✅ Upload e galeria de fotos
- ✅ Proteção de rotas
- ✅ Integração com Supabase (auth, database, storage)

### Próximas Funcionalidades

- ⏳ Notificações em tempo real
- ⏳ Fluxo completo de booking
- ⏳ Resposta a reviews
- ⏳ Gestão de disponibilidade
- ⏳ Testes automatizados

---

## 🤝 Contribuição

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Links Úteis

- [GitHub Projects](https://github.com/users/mjpfelicia/projects/5)
- [Documentação do Supabase](https://supabase.com/docs)
- [TanStack Router Docs](https://tanstack.com/router/latest/docs)

---

## 📞 Suporte

Para dúvidas ou problemas:

1. Consulte a [documentação](./docs/)
2. Verifique os [guias de troubleshooting](./VALIDACAO_SUPABASE.md)
3. Abra uma issue no repositório

---

## 📄 Licença

Este projeto está sob licença MIT.

---

**Desenvolvido com ❤️ pela equipe SOS Carros**

_Última atualização: Maio 2025_
