import React from 'react';
import { Navigation } from './Navigation';
import { useAuth } from '../context/AuthContext';
import { Login } from '../pages/Login';

interface AppLayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, showNav = true }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#E5E7EB] border-t-[#2563EB] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col items-center">
      <main className="w-full max-w-md bg-white min-h-screen shadow-xl relative pb-20 overflow-x-hidden border-x border-[#E5E7EB]">
        {children}
      </main>
      {showNav && <Navigation />}
    </div>
  );
};
