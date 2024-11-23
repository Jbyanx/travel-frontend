import React, { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Alert, AlertDescription, AlertTitle } from './ui/Alert';
import { AxiosInstance } from 'axios';

const CreateAeropuerto = ({
  api,
  setError,
  onSuccess
}: {
  api: AxiosInstance;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  onSuccess: () => void;
}) => {
  const { token, userRole } = useAuth(); // Obtenemos token y rol desde el contexto
  const [airportData, setAirportData] = useState({
    nombre: '',
    ciudad: '',
    pais: ''
  });
  const [localError, setLocalError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAirportData({ ...airportData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verifica si el token está presente
    if (!token) {
      setError('No se encontró un token válido. Por favor, inicia sesión.');
      return;
    }

    // Verifica si el usuario tiene el rol adecuado
    if (!userRole || !userRole.includes('ROLE_ADMIN')) {
      setError('No tienes permisos para realizar esta acción.');
      return;
    }

    try {
      // Enviar la solicitud POST con el token en la cabecera de autenticación
      const response = await api.post('/aeropuertos', airportData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Respuesta del servidor:', response.data);
      alert('Aeropuerto creado con éxito');
      setAirportData({ nombre: '', ciudad: '', pais: '' });
      onSuccess(); // Ejecutamos la función que refresca la lista
    } catch (error) {
      console.error('Error completo:', error);
      setError('Error al crear el aeropuerto. Intenta nuevamente.');
    }
  };

  // Si el rol no es ADMIN, se muestra un mensaje de acceso denegado
  if (!userRole || !userRole.includes('ROLE_ADMIN')) {
    return (
      <Alert variant="destructive" className="p-4 rounded-md shadow-md bg-red-100 dark:bg-red-800">
        <AlertTitle className="text-red-700 dark:text-red-300">Acceso Denegado</AlertTitle>
        <AlertDescription className="text-red-600 dark:text-red-400">
          No tienes permisos para acceder a esta funcionalidad. Por favor, contacta al administrador si crees que esto es un error.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Crear Aeropuerto</h2>
      {localError && (
        <Alert variant="destructive" className="mb-4 bg-red-100 dark:bg-red-800 rounded-md">
          <AlertTitle className="text-red-700 dark:text-red-300">Error</AlertTitle>
          <AlertDescription className="text-red-600 dark:text-red-400">{localError}</AlertDescription>
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label htmlFor="nombre" className="text-gray-700 dark:text-gray-300">Nombre del Aeropuerto:</Label>
          <Input
            type="text"
            id="nombre"
            name="nombre"
            value={airportData.nombre}
            onChange={handleChange}
            required
            className="bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md p-2"
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="ciudad" className="text-gray-700 dark:text-gray-300">Ciudad:</Label>
          <Input
            type="text"
            id="ciudad"
            name="ciudad"
            value={airportData.ciudad}
            onChange={handleChange}
            required
            className="bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md p-2"
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="pais" className="text-gray-700 dark:text-gray-300">País:</Label>
          <Input
            type="text"
            id="pais"
            name="pais"
            value={airportData.pais}
            onChange={handleChange}
            required
            className="bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md p-2"
          />
        </div>

        <Button type="submit" className="mt-4 bg-blue-500 text-white hover:bg-blue-600 rounded-md">
          Crear Aeropuerto
        </Button>
      </form>
    </div>
  );
};

export default CreateAeropuerto;
