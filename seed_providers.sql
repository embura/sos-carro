-- Seed para criar 10 prestadores de serviço completos
-- Executar no Editor SQL do Supabase Dashboard

-- Limpar dados existentes (opcional, cuidado em produção)
DELETE FROM reviews;
DELETE FROM bookings;
DELETE FROM provider_photos;
DELETE FROM availability;
DELETE FROM services;
DELETE FROM providers;

-- Criar 10 prestadores com dados completos
-- Schema correto baseado na estrutura real da tabela providers

INSERT INTO providers (
  id, 
  user_id, 
  business_name, 
  categories_offered,
  bio, 
  address, 
  city, 
  state, 
  zip_code, 
  country, 
  phone, 
  is_verified, 
  is_active,
  rating,
  created_at, 
  updated_at
)
VALUES 
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Silva Reformas', ARRAY['reformas']::service_category[], 'Especialista em reformas residenciais e comerciais com mais de 10 anos de experiência.', 'Rua das Flores, 123', 'São Paulo', 'SP', '01234-567', 'Brasil', '(11) 98765-4321', true, true, 4.8, now(), now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000002', 'Costa Elétrica', ARRAY['eletrica']::service_category[], 'Serviços elétricos completos para residências e empresas. Segurança e qualidade garantidas.', 'Av. Paulista, 456', 'São Paulo', 'SP', '01310-100', 'Brasil', '(11) 97654-3210', true, true, 4.9, now(), now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000003', 'Oliveira Hidráulica', ARRAY['hidraulica']::service_category[], 'Soluções em hidráulica, instalações e reparos. Atendimento rápido e eficiente.', 'Rua Augusta, 789', 'São Paulo', 'SP', '01305-000', 'Brasil', '(11) 96543-2109', false, true, 4.5, now(), now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000004', 'Santos Pintura', ARRAY['pintura']::service_category[], 'Pintura residencial e comercial, acabamentos finos e texturas. Orçamento sem compromisso.', 'Rua Consolação, 321', 'São Paulo', 'SP', '01302-000', 'Brasil', '(11) 95432-1098', true, true, 4.7, now(), now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000005', 'Ferreira Construtora', ARRAY['construcao']::service_category[], 'Construção e reforma de imóveis. Do alicerce ao acabamento, cuidamos de tudo.', 'Av. Faria Lima, 654', 'São Paulo', 'SP', '01452-000', 'Brasil', '(11) 94321-0987', true, true, 4.9, now(), now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000006', 'Almeida Jardinagem', ARRAY['jardinagem']::service_category[], 'Manutenção de jardins, paisagismo e poda de árvores. Deixe seu jardim lindo!', 'Rua Oscar Freire, 987', 'São Paulo', 'SP', '01426-000', 'Brasil', '(11) 93210-9876', false, true, 4.6, now(), now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000007', 'Rodrigues Limpeza', ARRAY['limpeza']::service_category[], 'Serviços de limpeza pós-obra, residencial e comercial. Produtos de qualidade.', 'Av. Rebouças, 147', 'São Paulo', 'SP', '05401-000', 'Brasil', '(11) 92109-8765', true, true, 4.8, now(), now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000008', 'Martins Ar Condicionado', ARRAY['climatizacao']::service_category[], 'Instalação, manutenção e reparo de ar condicionado. Todas as marcas.', 'Rua da Consolação, 258', 'São Paulo', 'SP', '01301-000', 'Brasil', '(11) 91098-7654', true, true, 4.7, now(), now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000009', 'Carvalho Marcenaria', ARRAY['marcenaria']::service_category[], 'Móveis sob medida, armários, cozinhas planejadas. Madeira de qualidade.', 'Av. Ibirapuera, 369', 'São Paulo', 'SP', '04029-000', 'Brasil', '(11) 90987-6543', false, true, 4.4, now(), now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000010', 'Pereira Serralheria', ARRAY['serralheria']::service_category[], 'Portões, grades, estruturas metálicas. Serviço personalizado e durável.', 'Rua Vergueiro, 741', 'São Paulo', 'SP', '01504-000', 'Brasil', '(11) 89876-5432', true, true, 4.6, now(), now());

-- Inserir serviços para cada provider
WITH provider_ids AS (
  SELECT id, business_name, categories_offered FROM providers ORDER BY created_at DESC LIMIT 10
)
INSERT INTO services (id, provider_id, name, description, price, category, estimated_duration, is_active, created_at)
SELECT 
  gen_random_uuid(),
  p.id,
  CASE p.business_name
    WHEN 'Silva Reformas' THEN 'Reforma Completa'
    WHEN 'Costa Elétrica' THEN 'Instalação Elétrica'
    WHEN 'Oliveira Hidráulica' THEN 'Reparo Hidráulico'
    WHEN 'Santos Pintura' THEN 'Pintura de Ambientes'
    WHEN 'Ferreira Construtora' THEN 'Construção Residencial'
    WHEN 'Almeida Jardinagem' THEN 'Manutenção de Jardim'
    WHEN 'Rodrigues Limpeza' THEN 'Limpeza Pós-Obra'
    WHEN 'Martins Ar Condicionado' THEN 'Instalação de Ar Condicionado'
    WHEN 'Carvalho Marcenaria' THEN 'Móvel Sob Medida'
    WHEN 'Pereira Serralheria' THEN 'Portão Personalizado'
  END,
  CASE p.business_name
    WHEN 'Silva Reformas' THEN 'Reforma completa de ambientes incluindo demolição, alvenaria e acabamento.'
    WHEN 'Costa Elétrica' THEN 'Instalação de fiação, tomadas, disjuntores e iluminação.'
    WHEN 'Oliveira Hidráulica' THEN 'Reparo de vazamentos, instalação de torneiras e tubulações.'
    WHEN 'Santos Pintura' THEN 'Pintura interna e externa com preparação de superfície.'
    WHEN 'Ferreira Construtora' THEN 'Construção de casas e edifícios do início ao fim.'
    WHEN 'Almeida Jardinagem' THEN 'Corte de grama, poda, adubação e plantio.'
    WHEN 'Rodrigues Limpeza' THEN 'Limpeza profunda após obras com remoção de entulho.'
    WHEN 'Martins Ar Condicionado' THEN 'Instalação de split e janela com garantia.'
    WHEN 'Carvalho Marcenaria' THEN 'Fabricação de armários, racks e móveis personalizados.'
    WHEN 'Pereira Serralheria' THEN 'Fabricação e instalação de portões e grades.'
  END,
  CASE p.business_name
    WHEN 'Silva Reformas' THEN 5000.00
    WHEN 'Costa Elétrica' THEN 350.00
    WHEN 'Oliveira Hidráulica' THEN 200.00
    WHEN 'Santos Pintura' THEN 800.00
    WHEN 'Ferreira Construtora' THEN 150000.00
    WHEN 'Almeida Jardinagem' THEN 150.00
    WHEN 'Rodrigues Limpeza' THEN 400.00
    WHEN 'Martins Ar Condicionado' THEN 500.00
    WHEN 'Carvalho Marcenaria' THEN 2500.00
    WHEN 'Pereira Serralheria' THEN 1200.00
  END,
  (p.categories_offered[1])::service_category,
  CASE p.business_name
    WHEN 'Silva Reformas' THEN 480
    WHEN 'Costa Elétrica' THEN 120
    WHEN 'Oliveira Hidráulica' THEN 90
    WHEN 'Santos Pintura' THEN 240
    WHEN 'Ferreira Construtora' THEN 14400
    WHEN 'Almeida Jardinagem' THEN 180
    WHEN 'Rodrigues Limpeza' THEN 300
    WHEN 'Martins Ar Condicionado' THEN 180
    WHEN 'Carvalho Marcenaria' THEN 720
    WHEN 'Pereira Serralheria' THEN 360
  END,
  true,
  now()
FROM provider_ids p;

-- Inserir disponibilidade para cada provider (segunda a sexta, 08:00-18:00)
WITH provider_ids AS (
  SELECT id FROM providers ORDER BY created_at DESC LIMIT 10
)
INSERT INTO availability (provider_id, day_of_week, start_time, end_time, is_active, created_at)
SELECT 
  p.id,
  d.day,
  '08:00'::time,
  '18:00'::time,
  true,
  now()
FROM provider_ids p
CROSS JOIN (
  SELECT unnest(ARRAY[1, 2, 3, 4, 5]) AS day
) d;

-- Inserir fotos de exemplo para providers
WITH provider_ids AS (
  SELECT id, business_name FROM providers ORDER BY created_at DESC LIMIT 10
)
INSERT INTO provider_photos (provider_id, photo_url, is_primary, created_at)
SELECT 
  p.id,
  'https://images.unsplash.com/photo-' || CASE p.business_name
    WHEN 'Silva Reformas' THEN '1581090992942-bde0c29443b5?w=400'
    WHEN 'Costa Elétrica' THEN '1621923644885-e4b5e2d7c1f3?w=400'
    WHEN 'Oliveira Hidráulica' THEN '1585704542078-a9a4f1eb1e7f?w=400'
    WHEN 'Santos Pintura' THEN '1562252063-ffb6a15f6e8f?w=400'
    WHEN 'Ferreira Construtora' THEN '1541829039-208095bb6e2b?w=400'
    WHEN 'Almeida Jardinagem' THEN '1558904511-21c52d424fc8?w=400'
    WHEN 'Rodrigues Limpeza' THEN '1584622050141-24a54e0e3a3c?w=400'
    WHEN 'Martins Ar Condicionado' THEN '1617165890028-3dbb5c7bc8b5?w=400'
    WHEN 'Carvalho Marcenaria' THEN '1611454898-3c2a0e1e5b7e?w=400'
    WHEN 'Pereira Serralheria' THEN '1535159472-e0c97f3904a1?w=400'
  END,
  true,
  now()
FROM provider_ids p;

-- Verificar dados inseridos
SELECT 'Providers criados:' as info, COUNT(*) as quantidade FROM providers;
SELECT 'Serviços criados:' as info, COUNT(*) as quantidade FROM services;
SELECT 'Disponibilidades criadas:' as info, COUNT(*) as quantidade FROM availability;
SELECT 'Fotos criadas:' as info, COUNT(*) as quantidade FROM provider_photos;

-- Listar todos os providers criados
SELECT id, business_name, categories_offered, bio, city, state, phone, is_verified, rating FROM providers ORDER BY created_at;
