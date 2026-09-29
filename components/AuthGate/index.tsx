'use client';

import { useAuth } from '@/app/context/AuthContext';
import LoginModal from '@/components/LoginModal';
import NavDrawer from '@/components/NavDrawer';
import NavDrawerToggle from '@/components/NavDrawerToggle';

interface IProps {
  children: React.ReactNode;
}

const AuthGate = ({ children }: IProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading || !isAuthenticated) {
    return <LoginModal />;
  }

  return (
    <>
      <NavDrawerToggle />
      <NavDrawer />
      {children}
    </>
  );
};

export default AuthGate;
