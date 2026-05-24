# 🧪 Fase 6: Testes e Validação

## Visão Geral

A **Fase 6** foca na validação completa do sistema SOS Carros através de testes automatizados, validação manual e preparação para produção.

---

## 📋 Objetivos da Fase

1. ✅ Validar todos os requisitos funcionais (RF01-RF08)
2. ✅ Implementar testes unitários dos hooks principais
3. ✅ Criar testes de integração das funcionalidades críticas
4. ✅ Desenvolver testes E2E dos fluxos principais
5. ✅ Realizar validação manual com checklist detalhado
6. ✅ Preparar ambiente de produção
7. ✅ Documentar bugs conhecidos e limitações

---

## 🎯 Escopo de Testes

### 1. Testes Unitários

#### Hooks a serem testados

| Hook | Prioridade | Cobertura Mínima |
|------|------------|------------------|
| `useAuth` | Alta | 90% |
| `useBookings` | Alta | 85% |
| `useCreateBooking` | Alta | 85% |
| `useUpdateBooking` | Alta | 85% |
| `useNotifications` | Alta | 80% |
| `useRealtimeBookings` | Média | 75% |
| `useProviders` | Média | 70% |
| `useServices` | Baixa | 60% |

#### Estrutura de Testes Unitários

```typescript
// __tests__/hooks/useNotifications.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useNotifications } from '@/hooks/useNotifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useNotifications', () => {
  beforeEach(() => {
    queryClient.clear();
    jest.clearAllMocks();
  });

  it('deve retornar estado inicial correto', async () => {
    const { result } = renderHook(() => useNotifications(), { wrapper });

    expect(result.current.loading).toBe(true);
    expect(result.current.notifications).toEqual([]);
    expect(result.current.unreadCount).toBe(0);
  });

  it('deve buscar notificações do usuário', async () => {
    const mockNotifications = [
      { id: '1', title: 'Teste', message: 'Msg', is_read: false, user_id: 'user1' },
    ];

    jest.spyOn(supabase, 'from').mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({ data: mockNotifications, error: null }),
    } as any);

    const { result } = renderHook(() => useNotifications(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.unreadCount).toBe(1);
  });

  it('deve marcar notificação como lida', async () => {
    const { result } = renderHook(() => useNotifications(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    jest.spyOn(supabase, 'from').mockReturnValue({
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({ error: null }),
    } as any);

    await result.current.markAsRead('1');

    expect(result.current.unreadCount).toBe(0);
  });
});
```

---

### 2. Testes de Integração

#### Fluxos Críticos

| Fluxo | Descrição | Prioridade |
|-------|-----------|------------|
| Autenticação | Login, logout, recuperação de senha | Alta |
| Criação de Reserva | Cliente cria reserva até confirmação | Alta |
| Aceite de Reserva | Provider aceita/recusa reserva | Alta |
| Atualização de Status | Provider atualiza status da reserva | Alta |
| Notificações | Recebimento e leitura de notificações | Alta |
| Upload de Fotos | Provider faz upload de fotos do serviço | Média |
| Busca de Providers | Cliente busca providers por localização | Média |
| Avaliações | Cliente avalia serviço concluído | Média |

#### Exemplo de Teste de Integração

```typescript
// __tests__/integration/booking-flow.test.ts
import { supabase } from '@/lib/supabase';

describe('Fluxo de Reserva - Integração', () => {
  let testUserId: string;
  let testProviderId: string;
  let bookingId: string;

  beforeAll(async () => {
    // Setup: criar usuário de teste
    const { data: userData } = await supabase.auth.signUp({
      email: 'test.client@example.com',
      password: 'Test123!',
    });
    testUserId = userData.user?.id || '';

    // Setup: criar provider de teste
    const { data: providerData } = await supabase
      .from('providers')
      .insert({
        user_id: testUserId,
        full_name: 'Provider Test',
        phone: '11999999999',
        status: 'active',
      })
      .select()
      .single();
    testProviderId = providerData?.id || '';
  });

  afterAll(async () => {
    // Cleanup: remover dados de teste
    if (bookingId) {
      await supabase.from('bookings').delete().eq('id', bookingId);
    }
    if (testProviderId) {
      await supabase.from('providers').delete().eq('id', testProviderId);
    }
    if (testUserId) {
      await supabase.auth.admin.deleteUser(testUserId);
    }
  });

  it('deve completar fluxo de reserva com sucesso', async () => {
    // 1. Cliente cria reserva
    const { data: booking } = await supabase
      .from('bookings')
      .insert({
        customer_id: testUserId,
        provider_id: testProviderId,
        service_type: 'guincho',
        status: 'pending',
        location_address: 'Rua Teste, 123',
        location_lat: -23.5505,
        location_lng: -46.6333,
      })
      .select()
      .single();

    expect(booking).toBeDefined();
    bookingId = booking.id;
    expect(booking.status).toBe('pending');

    // 2. Provider aceita reserva
    const { data: updatedBooking } = await supabase
      .from('bookings')
      .update({ status: 'confirmed' })
      .eq('id', bookingId)
      .select()
      .single();

    expect(updatedBooking.status).toBe('confirmed');

    // 3. Provider inicia serviço
    const { data: inProgressBooking } = await supabase
      .from('bookings')
      .update({ status: 'in_progress' })
      .eq('id', bookingId)
      .select()
      .single();

    expect(inProgressBooking.status).toBe('in_progress');

    // 4. Provider conclui serviço
    const { data: completedBooking } = await supabase
      .from('bookings')
      .update({ status: 'completed' })
      .eq('id', bookingId)
      .select()
      .single();

    expect(completedBooking.status).toBe('completed');

    // 5. Verificar se notificação foi criada
    const { data: notifications } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', testUserId)
      .eq('type', 'booking_completed');

    expect(notifications).toBeDefined();
    expect(notifications!.length).toBeGreaterThan(0);
  });
});
```

---

### 3. Testes E2E (Playwright)

#### Configuração do Playwright

```bash
npm install -D @playwright/test
npx playwright install
```

**playwright.config.ts:**
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
```

#### Exemplo de Teste E2E

```typescript
// e2e/booking-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Fluxo de Reserva E2E', () => {
  test('cliente deve conseguir criar e acompanhar reserva', async ({ page }) => {
    // 1. Acessar página de login
    await page.goto('/entrar');

    // 2. Fazer login
    await page.fill('input[type="email"]', 'cliente@teste.com');
    await page.fill('input[type="password"]', 'Senha123!');
    await page.click('button[type="submit"]');

    // 3. Aguardar redirecionamento para dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=Bem-vindo')).toBeVisible();

    // 4. Navegar para página de criar reserva
    await page.click('text=Solicitar Serviço');
    await expect(page).toHaveURL('/buscar');

    // 5. Preencher formulário de reserva
    await page.selectOption('select[name="service_type"]', 'guincho');
    await page.fill('textarea[name="description"]', 'Carro quebrou no meio da rua');
    await page.fill('input[name="address"]', 'Av. Paulista, 1000');

    // 6. Submeter reserva
    await page.click('button[type="submit"]');

    // 7. Aguardar confirmação
    await expect(page.locator('text=Reserva criada com sucesso')).toBeVisible();

    // 8. Verificar se reserva aparece na lista
    await page.click('text=Minhas Reservas');
    await expect(page.locator('[data-testid="booking-item"]').first()).toBeVisible();

    // 9. Verificar status inicial
    const statusBadge = page.locator('[data-testid="booking-status"]').first();
    await expect(statusBadge).toContainText('Pendente');
  });

  test('provider deve receber notificação em tempo real', async ({ page }) => {
    // Setup: Grant notification permission
    const context = page.context();
    await context.grantPermissions(['notifications']);

    // 1. Login como provider
    await page.goto('/entrar');
    await page.fill('input[type="email"]', 'provider@teste.com');
    await page.fill('input[type="password"]', 'Senha123!');
    await page.click('button[type="submit"]');

    // 2. Aguardar dashboard
    await expect(page).toHaveURL('/dashboard-parceiro');

    // 3. Solicitar permissão de notificação
    const notificationPromise = page.waitForEvent('notification');
    await page.click('text=Ativar Notificações');

    // 4. Aguardar nova reserva (simulada)
    await expect(page.locator('text=Nova Reserva')).toBeVisible({ timeout: 10000 });

    // 5. Verificar contador de novas reservas
    const badge = page.locator('[data-testid="new-bookings-badge"]');
    await expect(badge).toHaveText('1');
  });
});
```

---

## ✅ Validação Manual

### Checklist por Requisito Funcional

#### RF01 - Cadastro de Usuários

| ID | Cenário | Passos | Resultado Esperado | Status |
|----|---------|--------|-------------------|--------|
| RF01-01 | Cadastro cliente | Preencher form com dados válidos | Conta criada, redireciona para dashboard | ⬜ |
| RF01-02 | Cadastro provider | Preencher form + documentos | Conta criada, aguarda aprovação | ⬜ |
| RF01-03 | Email já cadastrado | Tentar cadastro com email existente | Erro: "Email já cadastrado" | ⬜ |
| RF01-04 | Validação de campos | Deixar campos obrigatórios vazios | Erros de validação exibidos | ⬜ |
| RF01-05 | Confirmação de email | Clicar link no email | Email confirmado, conta ativa | ⬜ |

#### RF02 - Autenticação

| ID | Cenário | Passos | Resultado Esperado | Status |
|----|---------|--------|-------------------|--------|
| RF02-01 | Login válido | Email + senha corretos | Redireciona para dashboard | ⬜ |
| RF02-02 | Login inválido | Senha incorreta | Erro: "Credenciais inválidas" | ⬜ |
| RF02-03 | Recuperação de senha | Clicar "Esqueci senha" | Email enviado | ⬜ |
| RF02-04 | Logout | Clicar em "Sair" | Redireciona para home, session limpa | ⬜ |
| RF02-05 | Sessão persistente | Fechar e abrir navegador | Continua logado | ⬜ |

#### RF03 - Criar Reserva

| ID | Cenário | Passos | Resultado Esperado | Status |
|----|---------|--------|-------------------|--------|
| RF03-01 | Reserva completa | Preencher todos campos | Reserva criada, status "pending" | ⬜ |
| RF03-02 | Localização via mapa | Selecionar no mapa | Lat/lng preenchidos | ⬜ |
| RF03-03 | Upload de foto | Anexar foto do veículo | Foto salva, preview exibido | ⬜ |
| RF03-04 | Reserva urgente | Marcar checkbox urgente | Badge "URGENTE" exibido | ⬜ |
| RF03-05 | Cancelar reserva | Clicar cancelar antes de aceite | Status "cancelled" | ⬜ |

#### RF04 - Gerenciar Reservas (Provider)

| ID | Cenário | Passos | Resultado Esperado | Status |
|----|---------|--------|-------------------|--------|
| RF04-01 | Aceitar reserva | Clicar "Aceitar" | Status "confirmed", notificação cliente | ⬜ |
| RF04-02 | Recusar reserva | Clicar "Recusar" | Status "cancelled", volta pra lista | ⬜ |
| RF04-03 | Iniciar serviço | Clicar "Iniciar" | Status "in_progress" | ⬜ |
| RF04-04 | Concluir serviço | Clicar "Concluir" | Status "completed", libera avaliação | ⬜ |
| RF04-05 | Upload fotos | Adicionar fotos do serviço | Fotos salvas na reserva | ⬜ |

#### RF05 - Acompanhamento em Tempo Real

| ID | Cenário | Passos | Resultado Esperado | Status |
|----|---------|--------|-------------------|--------|
| RF05-01 | Update status | Provider muda status | Cliente vê mudança < 1s | ⬜ |
| RF05-02 | Nova reserva | Cliente cria reserva | Provider recebe notificação | ⬜ |
| RF05-03 | Browser notification | Permissão concedida | Notificação OS exibida | ⬜ |
| RF05-04 | Contador não lidas | Nova notificação | Badge atualiza | ⬜ |
| RF05-05 | Marcar como lida | Clicar notificação | Contador diminui | ⬜ |

#### RF06 - Busca de Providers

| ID | Cenário | Passos | Resultado Esperado | Status |
|----|---------|--------|-------------------|--------|
| RF06-01 | Busca por localização | Inserir endereço | Lista de providers próximos | ⬜ |
| RF06-02 | Filtro por serviço | Selecionar categoria | Apenas providers do serviço | ⬜ |
| RF06-03 | Ordenação por distância | Ordenar por "Mais próximo" | Lista ordenada | ⬜ |
| RF06-04 | Ver perfil provider | Clicar no provider | Página com detalhes, avaliações | ⬜ |
| RF06-05 | Sem resultados | Buscar em área sem providers | Mensagem "Nenhum provider encontrado" | ⬜ |

#### RF07 - Avaliações

| ID | Cenário | Passos | Resultado Esperado | Status |
|----|---------|--------|-------------------|--------|
| RF07-01 | Avaliar serviço | Concluir reserva, dar estrelas | Avaliação salva | ⬜ |
| RF07-02 | Comentário opcional | Adicionar texto | Texto salvo com avaliação | ⬜ |
| RF07-03 | Nota máxima | Dar 5 estrelas | Provider nota média atualizada | ⬜ |
| RF07-04 | Nota mínima | Dar 1 estrela | Provider notificado | ⬜ |
| RF07-05 | Não pode reavaliar | Tentar avaliar novamente | Bloqueado, já avaliou | ⬜ |

#### RF08 - Notificações

| ID | Cenário | Passos | Resultado Esperado | Status |
|----|---------|--------|-------------------|--------|
| RF08-01 | Listar notificações | Abrir central | Lista cronológica exibida | ⬜ |
| RF08-02 | Marcar todas lidas | Clicar "Marcar todas" | Todas is_read = true | ⬜ |
| RF08-03 | Excluir notificação | Clicar excluir | Removida da lista | ⬜ |
| RF08-04 | Tipos de notificação | Criar reserva, aceitar, concluir | 3 notificações diferentes | ⬜ |
| RF08-05 | Limite de 50 | Criar 51 notificações | Apenas 50 mais recentes | ⬜ |

---

## 🐛 Bugs Conhecidos e Limitações

### Bugs Registrados

| ID | Severidade | Descrição | Status | Workaround |
|----|------------|-----------|--------|------------|
| BUG-001 | Baixa | Notificação browser não aparece no Safari iOS | Aberto | Usuário deve verificar central manualmente |
| BUG-002 | Média | Realtime desconecta após 30min inativo | Em análise | Recarregar página restaura conexão |
| BUG-003 | Baixa | Contador de não lidas não atualiza instantaneamente no mobile | Aberto | Pull-to-refresh atualiza |

### Limitações Técnicas

1. **Realtime**: Conexão mantém-se ativa por max 2 horas (limitação Supabase free tier)
2. **Notificações**: Requer interação prévia do usuário para solicitar permissão
3. **Upload de fotos**: Limite de 5MB por foto, max 10 fotos por reserva
4. **Busca geográfica**: Raio máximo de 50km para performance
5. **Paginação**: Max 50 itens por página em listagens

---

## 📊 Métricas de Qualidade

### Cobertura de Testes

| Tipo | Meta | Atual | Status |
|------|------|-------|--------|
| Unitários | 80% | ⬜ | Pendente |
| Integração | 70% | ⬜ | Pendente |
| E2E | 60% | ⬜ | Pendente |

### Performance

| Métrica | Meta | Medição | Status |
|---------|------|---------|--------|
| LCP (Largest Contentful Paint) | < 2.5s | ⬜ | Pendente |
| FID (First Input Delay) | < 100ms | ⬜ | Pendente |
| CLS (Cumulative Layout Shift) | < 0.1 | ⬜ | Pendente |
| TTI (Time to Interactive) | < 3.8s | ⬜ | Pendente |

### Acessibilidade (WCAG 2.1 AA)

| Critério | Status | Ferramenta |
|----------|--------|------------|
| Contraste de cores | ⬜ | axe DevTools |
| Navegação por teclado | ⬜ | Manual |
| Screen readers | ⬜ | NVDA/VoiceOver |
| Focus indicators | ⬜ | Manual |
| Alt text em imagens | ⬜ | axe DevTools |

---

## 🚀 Preparação para Produção

### Checklist de Deploy

#### Pré-Deploy

- [ ] Todos testes passando (CI/CD)
- [ ] Code review aprovado
- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados migrado
- [ ] SSL certificado instalado
- [ ] Domínio configurado
- [ ] Backup automático habilitado
- [ ] Monitoring configurado (Sentry, LogRocket)
- [ ] Analytics configurado (Google Analytics, Mixpanel)

#### Pós-Deploy

- [ ] Smoke tests executados
- [ ] Performance baseline estabelecida
- [ ] Error tracking verificado
- [ ] Logs centralizados funcionando
- [ ] Alertas configurados
- [ ] Documentação atualizada
- [ ] Equipe treinada
- [ ] Plano de rollback definido

### Monitoramento

#### Ferramentas Sugeridas

| Categoria | Ferramenta | Custo |
|-----------|------------|-------|
| Error Tracking | Sentry | Free tier |
| Performance | Google Lighthouse | Free |
| Uptime | UptimeRobot | Free |
| Logs | Logtail | Free tier |
| Analytics | Plausible | Pago |
| Session Replay | LogRocket | Pago |

#### Alertas Críticos

```yaml
# Exemplo de configuração de alertas
alerts:
  - name: High Error Rate
    condition: error_rate > 5%
    period: 5m
    action: slack #ops-alerts

  - name: Database Connection Pool Exhausted
    condition: db_pool_usage > 90%
    period: 2m
    action: pagerduty

  - name: API Response Time Slow
    condition: p95_latency > 2000ms
    period: 10m
    action: email

  - name: Realtime Disconnections Spike
    condition: realtime_disconnects > 100
    period: 5m
    action: slack #dev-team
```

---

## 📝 Matriz de Rastreabilidade

| Requisito | Casos de Teste | Status | Observações |
|-----------|---------------|--------|-------------|
| RF01 | TC001-TC005 | ⬜ | Cobertura completa |
| RF02 | TC006-TC010 | ⬜ | Cobertura completa |
| RF03 | TC011-TC015 | ⬜ | Cobertura completa |
| RF04 | TC016-TC020 | ⬜ | Cobertura completa |
| RF05 | TC021-TC025 | ⬜ | Cobertura completa |
| RF06 | TC026-TC030 | ⬜ | Cobertura completa |
| RF07 | TC031-TC035 | ⬜ | Cobertura completa |
| RF08 | TC036-TC040 | ⬜ | Cobertura completa |

---

## 🎯 Critérios de Aceitação da Fase 6

### Mínimos (Obrigatórios)

- [ ] 100% dos testes unitários críticos passando
- [ ] 100% dos testes de integração críticos passando
- [ ] 80% dos testes E2E principais passando
- [ ] Zero bugs críticos ou bloqueantes
- [ ] Checklist de validação manual 100% completado
- [ ] Performance dentro das metas (LCP < 2.5s)
- [ ] Acessibilidade básica verificada

### Desejáveis

- [ ] Cobertura de código > 80%
- [ ] Todos browsers suportados testados
- [ ] Mobile responsivo testado
- [ ] Load testing executado (100 usuários concorrentes)
- [ ] Security scan executado
- [ ] Documentação de deployment completa

---

## 📅 Cronograma Sugerido

| Semana | Atividades | Entregáveis |
|--------|------------|-------------|
| 1 | Testes unitários dos hooks | Suite de testes unitários |
| 2 | Testes de integração | Testes de fluxos críticos |
| 3 | Testes E2E | Scripts Playwright |
| 4 | Validação manual | Checklists preenchidos |
| 5 | Correção de bugs | Release candidate |
| 6 | Preparação produção | Deploy em staging |

---

## 🔗 Referências

- [Testing Library](https://testing-library.com/)
- [Playwright Documentation](https://playwright.dev/)
- [Supabase Testing Guide](https://supabase.com/docs/guides/testing)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web Vitals](https://web.dev/vitals/)

---

**Status da Fase 6**: 🟡 **Em Andamento**  
**Data de Início**: Maio 2025  
**Previsão de Conclusão**: Junho 2025
