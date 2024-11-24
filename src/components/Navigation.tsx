import React from 'react';

const Navigation: React.FC = () => {
  return (
    <nav className="bg-gray-900 p-4 flex justify-between items-center">
      <a href="/" className="text-white text-2xl font-bold hover:text-blue-400">
        Travel
      </a>
      <div>
        <a
          href="/login"
          className="text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Iniciar Sesión
        </a>
        <a
          href="/signup"
          className="ml-4 text-white px-4 py-2 rounded bg-blue-500 hover:bg-blue-600"
        >
          Registrarse
        </a>
      </div>
    </nav>
  );
};

export default Navigation;
