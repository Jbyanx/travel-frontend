import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Interfaz para el contexto de autenticación
interface AuthContextType {
  isLoggedIn: boolean;
  userRole: string | null;
  token: string | null;
  login: (token: string, email: string, roles: string | string[]) => void;
  logout: () => void;
}

// Creación del contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Proveedor del contexto
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Al montar el componente, verifica si hay datos almacenados en localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('userRole');

    // Verifica si los datos son válidos
    if (storedToken && (storedRole === 'ROLE_ADMIN' || storedRole === 'ROLE_USER')) {
      setIsLoggedIn(true);
      setToken(storedToken);
      setUserRole(storedRole);
    } else {
      logout(); // Limpia datos inválidos
    }
  }, []);

  // Función para iniciar sesión
  const login = (token: string, email: string, roles: string | string[]) => {
    // Asegúrate de que roles sea un array
    const parsedRoles = Array.isArray(roles) ? roles : [roles];

    // Determina el rol principal del usuario
    const role = parsedRoles.includes('ROLE_ADMIN') ? 'ROLE_ADMIN' : 'ROLE_USER';

    // Almacena los datos en localStorage
    localStorage.setItem('userRole', role);
    localStorage.setItem('token', token);

    // Actualiza el estado del contexto
    setIsLoggedIn(true);
    setToken(token);
    setUserRole(role);
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setIsLoggedIn(false);
    setToken(null);
    setUserRole(null);
  };

  // Proveedor del contexto
  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para consumir el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
