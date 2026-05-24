/**
 * Script para popular o Supabase com dados mock dos prestadores
 * 
 * Este script insere os dados de exemplo no Supabase para validar a busca
 */

import { supabase } from '../src/lib/supabase';
import { providers as mockProviders, categories as mockCategories } from '../src/data/mock';

interface MockProvider {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  rating: number;
  reviewsCount: number;
  distanceKm: number;
  priceFrom: number;
  responseTime: string;
  available: boolean;
  badge?: string;
  avatar: string;
  city: string;
  bio: string;
}

async function seedProviders() {
  console.log('🌱 Iniciando seed dos prestadores no Supabase...\n');

  // Verificar conexão
  try {
    const { data: test, error: testError } = await supabase.from('providers').select('count').limit(1);
    if (testError) {
      console.error('❌ Erro ao conectar:', testError.message);
      process.exit(1);
    }
    console.log('✅ Conexão com Supabase estabelecida\n');
  } catch (error: any) {
    console.error('❌ Erro inesperado:', error.message);
    process.exit(1);
  }

  // Dados mock dos prestadores
  const providers: MockProvider[] = [
    {
      id: "1",
      name: "Auto Mecânica Silva",
      category: "Mecânica geral",
      categoryId: "mecanica",
      rating: 4.9,
      reviewsCount: 312,
      distanceKm: 1.2,
      priceFrom: 80,
      responseTime: "~5 min",
      available: true,
      badge: "Resposta rápida",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Auto%20Silva&backgroundColor=c0392b",
      city: "São Paulo",
      bio: "20 anos de experiência em mecânica automotiva. Especialistas em motores nacionais e importados.",
    },
    {
      id: "2",
      name: "Guincho 24h Express",
      category: "Guincho",
      categoryId: "guincho",
      rating: 4.8,
      reviewsCount: 528,
      distanceKm: 2.5,
      priceFrom: 150,
      responseTime: "~10 min",
      available: true,
      badge: "Mais avaliado",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Guincho%20Express&backgroundColor=e67e22",
      city: "São Paulo",
      bio: "Reboque 24 horas para toda a região metropolitana. Equipamentos modernos.",
    },
    {
      id: "3",
      name: "Elétrica Volt Power",
      category: "Elétrica automotiva",
      categoryId: "eletrica",
      rating: 4.7,
      reviewsCount: 189,
      distanceKm: 3.1,
      priceFrom: 60,
      responseTime: "~15 min",
      available: true,
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Volt%20Power&backgroundColor=f1c40f",
      city: "São Paulo",
      bio: "Diagnóstico computadorizado, troca de bateria a domicílio e reparos elétricos.",
    },
    {
      id: "4",
      name: "Pneus & Cia",
      category: "Pneus",
      categoryId: "pneus",
      rating: 4.6,
      reviewsCount: 421,
      distanceKm: 4.8,
      priceFrom: 40,
      responseTime: "~20 min",
      available: true,
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Pneus%20Cia&backgroundColor=2c3e50",
      city: "São Paulo",
      bio: "Troca, reparo, alinhamento e balanceamento. Atendimento em domicílio disponível.",
    },
    {
      id: "5",
      name: "Funilaria Premium",
      category: "Funilaria e pintura",
      categoryId: "funilaria",
      rating: 4.9,
      reviewsCount: 156,
      distanceKm: 6.2,
      priceFrom: 250,
      responseTime: "~30 min",
      available: false,
      badge: "Premium",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Funilaria%20Premium&backgroundColor=8e44ad",
      city: "São Paulo",
      bio: "Funilaria de excelência com pintura automotiva profissional. Garantia de 1 ano.",
    },
    {
      id: "6",
      name: "Chaveiro Auto Key",
      category: "Chaveiro automotivo",
      categoryId: "chaveiro",
      rating: 4.8,
      reviewsCount: 94,
      distanceKm: 5.4,
      priceFrom: 90,
      responseTime: "~12 min",
      available: true,
      badge: "Resposta rápida",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Auto%20Key&backgroundColor=16a085",
      city: "São Paulo",
      bio: "Chaves codificadas, abertura de veículos e cópias para todas as montadoras.",
    },
  ];

  console.log(`📦 Inserindo ${providers.length} prestadores...\n`);

  for (const provider of providers) {
    console.log(`➡️  Inserindo: ${provider.name}`);

    // Primeiro, verificar se já existe
    const { data: existing } = await supabase
      .from('providers')
      .select('id')
      .eq('business_name', provider.name)
      .single();

    if (existing) {
      console.log(`   ⚠️  Prestador já existe (ID: ${existing.id})`);
      continue;
    }

    // Criar usuário fake para o provider (necessário por causa da foreign key user_id)
    const fakeUserId = `user-${provider.id}-${Date.now()}`;
    
    // Inserir provider diretamente (usando UUID gerado)
    const providerData = {
      id: `provider-${provider.id}`,
      business_name: provider.name,
      category: provider.categoryId,
      categories_offered: [provider.categoryId],
      bio: provider.bio,
      address: 'Rua Exemplo, 123',
      city: provider.city,
      state: 'SP',
      zip_code: '01234-567',
      country: 'Brasil',
      latitude: -23.5505 + (Math.random() * 0.1),
      longitude: -46.6333 + (Math.random() * 0.1),
      phone: '(11) 9' + Math.floor(Math.random() * 90000000 + 10000000),
      rating: provider.rating,
      reviews_count: provider.reviewsCount,
      total_bookings: 0,
      price_from: provider.priceFrom,
      currency: 'BRL',
      is_available: provider.available,
      response_time: provider.responseTime,
      badges: provider.badge ? [provider.badge] : [],
      certifications: [],
      is_verified: true,
      is_active: true,
      // user_id será um UUID válido
      user_id: crypto.randomUUID(),
    };

    const { data, error } = await supabase
      .from('providers')
      .insert(providerData)
      .select()
      .single();

    if (error) {
      console.error(`   ❌ Erro: ${error.message}`);
    } else {
      console.log(`   ✅ Sucesso! ID: ${data.id}`);
    }

    // Pequeno delay para evitar rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n✅ Seed concluído!');
  console.log('\nPróximos passos:');
  console.log('1. Acesse o painel do Supabase para verificar os dados');
  console.log('2. Teste a busca na aplicação com `npm run dev`');
}

// Executar seed
seedProviders().catch(console.error);
