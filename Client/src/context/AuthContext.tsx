import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { isAuthenticated } from '../services/auth';
import { logout as logoutService } from '../services/auth';

interface AuthContextType {
  isAuth: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check auth status on mount
    const authStatus = isAuthenticated();
    setIsAuth(authStatus);
    setIsLoading(false);
  }, []);

  const login = () => {
    setIsAuth(true);
  };

  const logout = async () => {
    await logoutService();
    setIsAuth(false);
  };

  return (
    <AuthContext.Provider value={{ isAuth, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthContext;
