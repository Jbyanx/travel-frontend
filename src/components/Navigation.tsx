import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from "../components/ui/Button"

const Navigation: React.FC = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-blue-600">Travel</Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Inicio
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isLoggedIn ? (
              <Button onClick={handleLogout}>Cerrar Sesión</Button>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Iniciar Sesión</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="ghost">Registrarse</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

