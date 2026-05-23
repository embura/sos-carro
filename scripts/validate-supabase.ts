import { supabase } from '../src/lib/supabase';

/**
 * Script de validação do funcionamento do Supabase
 * 
 * Este script testa:
 * 1. Conexão com o Supabase
 * 2. Autenticação das variáveis de ambiente
 * 3. Consulta básica ao banco de dados
 */

async function validateSupabase() {
  console.log('🔍 Validando conexão com Supabase...\n');
  
  // Teste 1: Verificar se as variáveis de ambiente estão configuradas
  console.log('✅ Passo 1: Verificando variáveis de ambiente');
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    console.error('❌ Erro: Variáveis de ambiente não configuradas');
    console.error('   Crie um arquivo .env na raiz do projeto com:');
    console.error('   VITE_SUPABASE_URL=sua-url-aqui');
    console.error('   VITE_SUPABASE_ANON_KEY=sua-chave-aqui');
    process.exit(1);
  }
  console.log('   ✓ URL configurada:', url.substring(0, 30) + '...');
  console.log('   ✓ Chave configurada:', key.substring(0, 20) + '...');
  
  // Teste 2: Testar conexão com o Supabase
  console.log('\n📡 Passo 2: Testando conexão com o Supabase');
  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    if (error) {
      if (error.message.includes('relation') || error.message.includes('does not exist')) {
        console.log('   ⚠️  Conexão estabelecida, mas as tabelas ainda não existem');
        console.log('   Você precisa rodar as migrations no Supabase');
      } else {
        console.error('   ❌ Erro na conexão:', error.message);
        process.exit(1);
      }
    } else {
      console.log('   ✓ Conexão bem-sucedida!');
      console.log('   ✓ Dados retornados:', data);
    }
  } catch (error: any) {
    console.error('   ❌ Erro inesperado:', error.message);
    process.exit(1);
  }
  
  // Teste 3: Verificar autenticação
  console.log('\n🔐 Passo 3: Verificando status de autenticação');
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.log('   ⚠️  Erro ao obter sessão:', error.message);
    } else if (session) {
      console.log('   ✓ Usuário autenticado:', session.user.email);
    } else {
      console.log('   ℹ️  Nenhum usuário autenticado (isso é normal)');
    }
  } catch (error: any) {
    console.error('   ❌ Erro na autenticação:', error.message);
  }
  
  console.log('\n✅ Validação concluída!\n');
  console.log('Próximos passos:');
  console.log('1. Configure suas credenciais no arquivo .env');
  console.log('2. Execute as migrations no painel do Supabase ou via CLI');
  console.log('3. Teste a aplicação com `npm run dev`');
}

// Executar validação
validateSupabase().catch(console.error);
