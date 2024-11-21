import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  userRole: string | null;
  token: string | null;
  login: (token: string, email: string, roles: string[]) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('userRole');
    if (storedToken && storedRole) {
      setIsLoggedIn(true);
      setToken(storedToken);
      setUserRole(storedRole);
    }
  }, []);

  const login = (token: string, email: string, roles: string[]) => {
    localStorage.setItem('token', token);
    const role = roles.includes('ROLE_ADMIN') ? 'ROLE_ADMIN' : 'ROLE_USER';
    localStorage.setItem('userRole', role);
    setIsLoggedIn(true);
    setToken(token);
    setUserRole(role);
  };
  

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setIsLoggedIn(false);
    setToken(null);
    setUserRole(null);
  };
  

  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, token, login, logout }}>
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