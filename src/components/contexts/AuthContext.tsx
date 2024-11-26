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

  const login = (newToken: string, idCliente: number, roles: string[]) => {
    try {
      setToken(newToken);
      setUserRole(roles[0] || null);
  
      localStorage.setItem('token', newToken);
      localStorage.setItem('userRole', roles[0] || "");
      localStorage.setItem('idCliente', String(idCliente));
  
    } catch (error) {
      console.error("Error al procesar el login:", error);
      throw error;
    }
  };
  

  const logout = () => {
    setToken(null);
    setUserRole(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
  };

  const isLoggedIn = !!token;

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('userRole');
    if (storedToken && storedRole && storedEmail) {
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

