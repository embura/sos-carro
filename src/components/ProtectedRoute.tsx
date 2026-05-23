import { useEffect } from 'react';
import { useRouter } from '@tanstack/react-router';
import { useAuth } from '@/contexts/AuthContext';
import type { UserType } from '@/lib/supabase';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireProvider?: boolean;
  requireAdmin?: boolean;
  allowedUserTypes?: UserType[];
}

export function ProtectedRoute({ 
  children, 
  requireProvider = false,
  requireAdmin = false,
  allowedUserTypes
}: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.navigate({ to: '/entrar' });
      return;
    }

    if (!loading && allowedUserTypes && profile?.user_type && !allowedUserTypes.includes(profile.user_type)) {
      // Redireciona para o dashboard correto baseado no tipo de usuário
      if (profile.user_type === 'provider') {
        router.navigate({ to: '/dashboard-parceiro' });
      } else if (profile.user_type === 'customer') {
        router.navigate({ to: '/dashboard-cliente' });
      } else {
        router.navigate({ to: '/' });
      }
      return;
    }

    if (!loading && requireProvider && profile?.user_type !== 'provider') {
      router.navigate({ to: '/' });
      return;
    }

    if (!loading && requireAdmin && profile?.user_type !== 'admin') {
      router.navigate({ to: '/' });
      return;
    }
  }, [user, profile, loading, requireProvider, requireAdmin, allowedUserTypes, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (allowedUserTypes && profile?.user_type && !allowedUserTypes.includes(profile.user_type)) {
    return null;
  }

  if (requireProvider && profile?.user_type !== 'provider') {
    return null;
  }

  if (requireAdmin && profile?.user_type !== 'admin') {
    return null;
  }

  return <>{children}</>;
}
