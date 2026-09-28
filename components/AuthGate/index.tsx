'use client';

import { useAuth } from '@/app/context/AuthContext';
import LoginModal from '@/components/LoginModal';

interface IProps {
  children: React.ReactNode;
}

const AuthGate = ({ children }: IProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading || !isAuthenticated) {
    return <LoginModal />;
  }

  return <>{children}</>;
};

export default AuthGate;
