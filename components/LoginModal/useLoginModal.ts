'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { useAuth } from '@/app/context/AuthContext';

const SSO_ERRORS: Record<string, string> = {
  nao_logado: 'Você não está logado no fórum. Entre no fórum e tente de novo.',
  ticket_invalido: 'O vínculo com o fórum expirou. Tente novamente.',
  conta_local: 'Esta conta usa senha própria. Entre com usuário e senha.',
  erro_interno: 'Não foi possível entrar pelo fórum. Tente novamente.',
};

function readSsoError(): string {
  if (typeof window === 'undefined') return '';
  const reason = new URLSearchParams(window.location.search).get('sso_error');
  if (!reason) return '';
  return SSO_ERRORS[reason] ?? 'Falha ao entrar pelo fórum.';
}

export const useLoginModal = () => {
  const { login, loginWithForum, isLoading, forumLink } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(readSsoError);
  const [submitting, setSubmitting] = useState(false);
  const [forumAccountAlert, setForumAccountAlert] = useState('');
  const [resumeDismissed, setResumeDismissed] = useState(false);

  // Strip sso_error from the URL so a refresh does not resurface the message.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (!params.has('sso_error')) return;

    params.delete('sso_error');
    const query = params.toString();
    window.history.replaceState(
      null,
      '',
      window.location.pathname + (query ? `?${query}` : '')
    );
  }, []);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(username, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });

      if (!res.ok) {
        const data = await res.json();
        if (data.code === 'FORUM_ACCOUNT') {
          setForumAccountAlert(
            `O usuário "${username}" já está vinculado ao fórum. Entre pelo fórum para acessar sua conta.`
          );
          return;
        }
        throw new Error(data.error || 'Erro ao criar conta');
      }

      // Login to update AuthContext state seamlessly
      await login(username, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta');
    } finally {
      setSubmitting(false);
    }
  };

  const handleForumLogin = () => {
    try {
      loginWithForum();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao entrar pelo fórum'
      );
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
    setUsername('');
    setPassword('');
  };

  return {
    isLoading,
    mode,
    username,
    setUsername,
    password,
    setPassword,
    error,
    submitting,
    handleLogin,
    handleRegister,
    switchMode,
    handleForumLogin,
    forumAccountAlert,
    dismissForumAccountAlert: () => setForumAccountAlert(''),
    showResumePrompt: !isLoading && !!forumLink && !resumeDismissed,
    forumLink,
    dismissResumePrompt: () => setResumeDismissed(true),
  };
};
