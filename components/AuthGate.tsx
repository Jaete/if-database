'use client';

import { useAuth } from '@/app/context/AuthContext';
import LoginModal from '@/components/LoginModal';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading || !isAuthenticated) {
    return <LoginModal />;
  }

  return <>{children}</>;
}
