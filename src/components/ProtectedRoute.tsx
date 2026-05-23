import { useEffect } from 'react';
import { useRouter } from '@tanstack/react-router';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireProvider?: boolean;
  requireAdmin?: boolean;
  requireCustomer?: boolean;
}

export function ProtectedRoute({ 
  children, 
  requireProvider = false,
  requireAdmin = false,
  requireCustomer = false
}: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Só redireciona se NÃO estiver carregando E não for uma rota protegida específica
    // Isso evita redirect infinito quando o usuário está navegando entre páginas públicas
    if (!loading && !user) {
      // Não redireciona automaticamente - deixa o componente retornar null
      // O redirecionamento deve ser feito explicitamente pelo componente de login
      return;
    }

    // Validações de tipo de usuário - apenas redireciona se o usuário estiver logado mas não tiver permissão
    if (!loading && requireProvider && user && profile?.user_type !== 'provider') {
      router.navigate({ to: '/' });
    }

    if (!loading && requireAdmin && user && profile?.user_type !== 'admin') {
      router.navigate({ to: '/' });
    }

    if (!loading && requireCustomer && user && profile?.user_type !== 'customer') {
      router.navigate({ to: '/' });
    }
  }, [user, profile, loading, requireProvider, requireAdmin, requireCustomer, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Se não há usuário e é uma rota protegida, não renderiza nada
  // O componente de login deve lidar com o redirecionamento se necessário
  if (!user) {
    return null;
  }

  if (requireProvider && profile?.user_type !== 'provider') {
    return null;
  }

  if (requireAdmin && profile?.user_type !== 'admin') {
    return null;
  }

  if (requireCustomer && profile?.user_type !== 'customer') {
    return null;
  }

  return <>{children}</>;
}
