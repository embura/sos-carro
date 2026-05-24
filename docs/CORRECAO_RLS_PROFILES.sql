-- =====================================================
-- CORREÇÃO RLS - TABELA PROFILES
-- =====================================================
-- Este script corrige o erro 406 Not Acceptable na requisição
-- GET /rest/v1/profiles?select=*&id=eq.{uuid}
-- 
-- Execute este script no SQL Editor do Supabase
-- =====================================================

-- Remover políticas antigas conflitantes
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Public can view basic provider profiles" ON profiles;

-- Criar nova política de SELECT para usuários autenticados
-- Permite que qualquer usuário autenticado visualize perfis (necessário para home)
CREATE POLICY "Authenticated users can view any profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

-- Política para usuários atualizarem apenas o próprio perfil
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Política para inserção de perfil (apenas o próprio)
CREATE POLICY "Enable insert for authenticated users only"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Política adicional para visualização pública de prestadores ativos
-- (caso queira permitir acesso não autenticado a perfis de providers)
CREATE POLICY "Public can view active provider profiles"
  ON profiles FOR SELECT
  USING (user_type = 'provider' AND status = 'active');

-- Garantir que RLS está habilitado
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================
-- Para verificar as políticas aplicadas:
-- SELECT * FROM pg_policies WHERE tablename = 'profiles';
-- =====================================================
