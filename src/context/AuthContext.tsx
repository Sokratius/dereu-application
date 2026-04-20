import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (iin: string, code: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  setRole: (role: 'user' | 'admin') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('dereu_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (iin: string, code: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Accept any 4-digit code as valid for prototype
    // IIN must be 12 digits
    if (code.length === 4 && iin.length === 12) {
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        iin,
        role: 'user', // Default role
      };
      setUser(newUser);
      localStorage.setItem('dereu_user', JSON.stringify(newUser));
    } else if (iin.length !== 12) {
      throw new Error('ЖСН 12 саннан тұруы керек');
    } else {
      throw new Error('Қате растау коды');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dereu_user');
  };

  const setRole = (role: 'user' | 'admin') => {
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      localStorage.setItem('dereu_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
