import React, { createContext, useState, useContext, useEffect } from 'react';

interface AuthContextType {
  token: string | null;
  userRole: string | null;
  login: (token: string, roles: string[]) => void;
  logout: () => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [userRole, setUserRole] = useState<string | null>(localStorage.getItem('userRole'));

  const login = (newToken: string, roles: string[]) => {
    setToken(newToken);
    setUserRole(roles[0]); // Assuming we're using the first role
    localStorage.setItem('token', newToken);
    localStorage.setItem('userRole', roles[0]);
  };

  const logout = () => {
    setToken(null);
    setUserRole(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
  };

  const isLoggedIn = !!token;

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('userRole');
    if (storedToken && storedRole) {
      setToken(storedToken);
      setUserRole(storedRole);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, userRole, login, logout, isLoggedIn }}>
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

