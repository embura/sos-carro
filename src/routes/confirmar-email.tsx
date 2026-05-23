import { useEffect, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { supabase } from '@/lib/supabase';

export const Route = createFileRoute('/confirmar-email')({
  component: ConfirmarEmailComponent,
});

function ConfirmarEmailComponent() {
  const [status, setStatus] = useState<'verificando' | 'sucesso' | 'erro'>('verificando');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // O Supabase já processa a verificação automaticamente quando o usuário clica no link
        // Aqui apenas verificamos se há uma sessão válida após a verificação
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }

        if (session) {
          setStatus('sucesso');
          setMessage('Email confirmado com sucesso! Redirecionando...');
          
          // Obter o perfil do usuário para redirecionar corretamente
          const { data: profile } = await supabase
            .from('profiles')
            .select('user_type')
            .eq('id', session.user.id)
            .single();

          setTimeout(() => {
            if (profile?.user_type === 'provider') {
              window.location.href = '/dashboard-parceiro';
            } else {
              window.location.href = '/dashboard-cliente';
            }
          }, 2000);
        } else {
          // Se não há sessão, pode ser que o usuário precise fazer login
          setStatus('sucesso');
          setMessage('Email confirmado! Faça login para continuar.');
          setTimeout(() => {
            window.location.href = '/entrar';
          }, 2000);
        }
      } catch (error: any) {
        console.error('Erro ao verificar email:', error);
        setStatus('erro');
        setMessage(error.message || 'Erro ao confirmar email. Tente novamente.');
      }
    };

    verifyEmail();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center">
        {status === 'verificando' && (
          <>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-primary animate-spin"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Verificando email...</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Aguarde enquanto confirmamos seu email.
            </p>
          </>
        )}

        {status === 'sucesso' && (
          <>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Email confirmado!</h1>
            <p className="mt-2 text-sm text-muted-foreground">{message}</p>
          </>
        )}

        {status === 'erro' && (
          <>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-destructive"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Erro na confirmação</h1>
            <p className="mt-2 text-sm text-muted-foreground">{message}</p>
            <button
              onClick={() => { window.location.href = '/entrar'; }}
              className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Ir para login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
