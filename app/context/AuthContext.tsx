'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

interface IUser {
  username: string;
  role: string;
  provider: string;
  // Só contas do fórum têm avatar, e ele vem do banco a cada verify.
  avatarUrl?: string;
}

interface IAuthContext {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  canEdit: boolean;
  forumLink: string | null;
  login: (username: string, password: string) => Promise<void>;
  loginWithForum: (path?: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<IAuthContext | null>(null);

const STORAGE_KEY = 'auth_token';
const FORUM_LINK_KEY = 'forum_link';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [forumLink, setForumLink] = useState<string | null>(null);

  const verifySession = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/verify', {
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        if (data.token) {
          localStorage.setItem(STORAGE_KEY, data.token);
        }
        if (data.user?.provider === 'forum') {
          localStorage.setItem(FORUM_LINK_KEY, data.user.username);
          setForumLink(data.user.username);
        }
        return true;
      }

      // Token expired or invalid
      localStorage.removeItem(STORAGE_KEY);
      setUser(null);
      return false;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      setUser(null);
      return false;
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      // Always verify: the session cookie is httpOnly and can be set by the
      // forum SSO callback without anything landing in localStorage first.
      setForumLink(localStorage.getItem(FORUM_LINK_KEY));
      await verifySession();
      setIsLoading(false);
    };

    init();
  }, [verifySession]);

  const login = useCallback(async (username: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'include',
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Falha no login');
    }

    const data = await res.json();
    localStorage.setItem(STORAGE_KEY, data.token);
    setUser(data.user);
  }, []);

  const loginWithForum = useCallback((path?: string) => {
    const ssoUrl = process.env.NEXT_PUBLIC_FORUM_SSO_URL;
    if (!ssoUrl) {
      throw new Error(
        'Login pelo fórum não está configurado (NEXT_PUBLIC_FORUM_SSO_URL).'
      );
    }
    const target = path ?? window.location.pathname;
    const separator = /[?#]/.test(ssoUrl) ? '&' : '?';
    window.location.href = `${ssoUrl}${separator}path=${encodeURIComponent(target)}`;
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // Even if logout API fails, clear local state
    }
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(FORUM_LINK_KEY);
    setForumLink(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        canEdit: user?.role === 'admin' || user?.role === 'editor',
        forumLink,
        login,
        loginWithForum,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): IAuthContext {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
