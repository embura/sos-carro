import { useEffect } from 'react';
import { useRouter } from '@tanstack/react-router';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireProvider?: boolean;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ 
  children, 
  requireProvider = false,
  requireAdmin = false 
}: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.navigate({ to: '/entrar' });
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
  }, [user, profile, loading, requireProvider, requireAdmin, router]);

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

  if (requireProvider && profile?.user_type !== 'provider') {
    return null;
  }

  if (requireAdmin && profile?.user_type !== 'admin') {
    return null;
  }

  return <>{children}</>;
}
