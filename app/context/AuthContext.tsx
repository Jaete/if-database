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
}

interface IAuthContext {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  canEdit: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<IAuthContext | null>(null);

const STORAGE_KEY = 'auth_token';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const verifySession = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/verify', {
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
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
      const storedToken = localStorage.getItem(STORAGE_KEY);

      if (!storedToken) {
        setIsLoading(false);
        return;
      }

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
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        canEdit: user?.role === 'admin' || user?.role === 'editor',
        login,
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
