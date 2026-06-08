'use client';

import { useState, FormEvent } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import LoginModalHandles from './handles';
import '@/styles/components/loginModal.scss';
import { useAuth } from '@/app/context/AuthContext';

const LoginModal = () => {
  const handles = useCssHandles(LoginModalHandles);
  const { login, isLoading } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
        throw new Error(data.error || 'Erro ao criar conta');
      }

      const data = await res.json();
      localStorage.setItem('auth_token', data.token);
      // Login to update AuthContext state seamlessly
      await login(username, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta');
    } finally {
      setSubmitting(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
    setUsername('');
    setPassword('');
  };

  if (isLoading) {
    return (
      <div className={handles.loginOverlay}>
        <div className={handles.card}>
          <div className={handles.loadingSpinner} />
        </div>
      </div>
    );
  }

  return (
    <div className={handles.loginOverlay}>
      <div className={handles.card}>
        <h1 className={handles.title}>BESTIÁRIO DE TERRALÉM</h1>
        {mode === 'login' ? (
          <form className={handles.form} onSubmit={handleLogin}>
            <div className={handles.inputGroup}>
              <label className={handles.inputLabel} htmlFor="login-username">
                Usuário
              </label>
              <input
                id="login-username"
                className={handles.input}
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Digite seu usuário"
                autoFocus
                disabled={submitting}
              />
            </div>
            <div className={handles.inputGroup}>
              <label className={handles.inputLabel} htmlFor="login-password">
                Senha
              </label>
              <input
                id="login-password"
                className={handles.input}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                disabled={submitting}
              />
            </div>
            {error && <p className={handles.errorMsg}>{error}</p>}
            <button
              className={handles.submitBtn}
              type="submit"
              disabled={submitting || !username || !password}
            >
              {submitting ? 'Entrando...' : 'ENTRAR'}
            </button>
          </form>
        ) : (
          <form className={handles.form} onSubmit={handleRegister}>
            <div className={handles.inputGroup}>
              <label className={handles.inputLabel} htmlFor="reg-username">
                Usuário
              </label>
              <input
                id="reg-username"
                className={handles.input}
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Mínimo de 3 caracteres"
                autoFocus
                disabled={submitting}
              />
            </div>
            <div className={handles.inputGroup}>
              <label className={handles.inputLabel} htmlFor="reg-password">
                Senha
              </label>
              <input
                id="reg-password"
                className={handles.input}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo de 4 caracteres"
                disabled={submitting}
              />
            </div>
            {error && <p className={handles.errorMsg}>{error}</p>}
            <button
              className={handles.submitBtn}
              type="submit"
              disabled={submitting || !username || !password}
            >
              {submitting ? 'Criando...' : 'CRIAR CONTA'}
            </button>
          </form>
        )}
        <p className={handles.toggleText}>
          {mode === 'login' ? (
            <>
              Não tem conta?{' '}
              <button className={handles.toggleLink} onClick={switchMode}>
                Criar conta
              </button>
            </>
          ) : (
            <>
              Já tem conta?{' '}
              <button className={handles.toggleLink} onClick={switchMode}>
                Fazer login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
