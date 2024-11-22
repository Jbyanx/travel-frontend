import React, { useState } from 'react';
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { useAuth } from './contexts/AuthContext';

const CreateAerolinea = ({ api, setError }: { api: any, setError: React.Dispatch<React.SetStateAction<string | null>> }) => {
  const { token } = useAuth();
  const [airlineData, setAirlineData] = useState({
    nombre: '',
    codigo: '',
    pais: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAirlineData({ ...airlineData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/aerolineas', airlineData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Aerolínea creada con éxito');
      // Limpia los campos después de enviar el formulario
      setAirlineData({ nombre: '', codigo: '', pais: '' });
    } catch (error) {
      setError('Error al crear la aerolínea.');
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Crear Aerolínea</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label htmlFor="nombre" className="text-gray-700 dark:text-gray-300">Nombre de la Aerolínea:</Label>
          <Input
            type="text"
            id="nombre"
            name="nombre"
            value={airlineData.nombre}
            onChange={handleChange}
            required
            maxLength={100}
            className="bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md p-2"
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="codigo" className="text-gray-700 dark:text-gray-300">Código:</Label>
          <Input
            type="text"
            id="codigo"
            name="codigo"
            value={airlineData.codigo}
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
            value={airlineData.pais}
            onChange={handleChange}
            required
            maxLength={100}
            className="bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md p-2"
          />
        </div>

        <Button type="submit" className="mt-4 bg-blue-500 text-white hover:bg-blue-600">
          Crear Aerolínea
        </Button>
      </form>
    </div>
  );
};

export default CreateAerolinea;
