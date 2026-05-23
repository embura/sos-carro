import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { Profile, UserType } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, fullName: string, userType: UserType) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updateProfile: (data: Partial<Profile>) => Promise<{ error: any }>;
  navigateToDashboard: (userType: UserType) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Callback para navegação - será chamado pelos componentes quando necessário
  const navigateToDashboard = useCallback((userType: UserType) => {
    // A navegação real será feita pelo componente que chamou
    // Este método é apenas um placeholder para futura implementação
    console.log('Navigating to dashboard for:', userType);
  }, []);

  // Fetch profile when user changes
  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setProfile(data);
        
        // Redirecionar baseado no tipo de usuário após carregar o perfil
        // Isso é útil quando o usuário já está logado e recarrega a página
        const currentPath = window.location.pathname;
        if (currentPath === '/' || currentPath === '/entrar' || currentPath === '/cadastro') {
          if (data.user_type === 'provider') {
            window.location.href = '/sos-carro/dashboard-parceiro';
          } else if (data.user_type === 'customer') {
            window.location.href = '/sos-carro/dashboard-cliente';
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
      }
    };

    fetchProfile();
  }, [user]);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error: AuthError | null }> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string, userType: UserType): Promise<{ error: AuthError | null }> => {
    const redirectUrl = `${window.location.origin}${import.meta.env.BASE_URL || '/'}confirmar-email`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          user_type: userType,
        },
        emailRedirectTo: redirectUrl,
      },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string): Promise<{ error: AuthError | null }> => {
    const redirectUrl = `${window.location.origin}${import.meta.env.BASE_URL || '/'}confirmar-email`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });
    return { error };
  };

  const updateProfile = async (data: Partial<Profile>): Promise<{ error: any }> => {
    if (!user) {
      return { error: new Error('No user logged in') };
    }

    const { error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', user.id);

    if (error) return { error };

    // Update local state
    setProfile(prev => prev ? { ...prev, ...data } : null);

    return { error: null };
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    navigateToDashboard,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

// Hook para verificar se é um prestador
export const useIsProvider = () => {
  const { profile } = useAuth();
  return profile?.user_type === 'provider';
};

// Hook para verificar se é um admin
export const useIsAdmin = () => {
  const { profile } = useAuth();
  return profile?.user_type === 'admin';
};
