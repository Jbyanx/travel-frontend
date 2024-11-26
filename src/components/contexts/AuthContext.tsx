import React, { createContext, useState, useContext, useEffect } from 'react';

interface AuthContextType {
  token: string | null;
  userRole: string | null;
  userEmail: string | null;
  login: (token: string, role: string, email: string) => void;
  logout: () => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [userRole, setUserRole] = useState<string | null>(localStorage.getItem('userRole'));
  const [userEmail, setUserEmail] = useState<string | null>(localStorage.getItem('userEmail'));

  const login = (newToken: string, role: string, email: string) => {
    setToken(newToken);
    setUserRole(role);
    setUserEmail(email);
    localStorage.setItem('token', newToken);
    localStorage.setItem('userRole', role);
    localStorage.setItem('userEmail', email);
  };

  const logout = () => {
    setToken(null);
    setUserRole(null);
    setUserEmail(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
  };

  const isLoggedIn = !!token;

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('userRole');
    const storedEmail = localStorage.getItem('userEmail');
    if (storedToken && storedRole && storedEmail) {
      setToken(storedToken);
      setUserRole(storedRole);
      setUserEmail(storedEmail);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, userRole, userEmail, login, logout, isLoggedIn }}>
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

