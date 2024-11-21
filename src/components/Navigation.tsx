import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from "./ui/Button"
import { useAuth } from './contexts/AuthContext'

const Navigation: React.FC = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-blue-600">Travel</span>
            </div>
            {isLoggedIn && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link to="/dashboard" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Dashboard
                </Link>
              </div>
            )}
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isLoggedIn ? (
              <Button onClick={handleLogout}>Cerrar Sesión</Button>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline">Iniciar Sesión</Button>
                </Link>
                <Link to="/signup">
                  <Button className="ml-3">Registrarse</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
