import React, { useState } from 'react';
import { AxiosInstance } from 'axios';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { useAuth } from './contexts/AuthContext';

interface CreateAeropuertoProps {
  api: AxiosInstance;
  setError: (error: string | null) => void;
  onSuccess: () => void;
}

const CreateAeropuerto: React.FC<CreateAeropuertoProps> = ({ api, setError, onSuccess }) => {
  const { token, userRole } = useAuth();
  const [airportData, setAirportData] = useState({
    nombre: '',
    ciudad: '',
    pais: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAirportData({ ...airportData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (userRole !== 'ROLE_ADMIN') {
      setError('No tienes permisos para realizar esta acción.');
      return;
    }

    try {
      await api.post('/aeropuertos', airportData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Aeropuerto creado con éxito');
      setAirportData({ nombre: '', ciudad: '', pais: '' });
      onSuccess();
    } catch (error) {
      console.error('Error creating airport:', error);
      setError('Error al crear el aeropuerto. Intenta nuevamente.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <Label htmlFor="nombre">Nombre del Aeropuerto:</Label>
        <Input
          type="text"
          id="nombre"
          name="nombre"
          value={airportData.nombre}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-4">
        <Label htmlFor="ciudad">Ciudad:</Label>
        <Input
          type="text"
          id="ciudad"
          name="ciudad"
          value={airportData.ciudad}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-4">
        <Label htmlFor="pais">País:</Label>
        <Input
          type="text"
          id="pais"
          name="pais"
          value={airportData.pais}
          onChange={handleChange}
          required
        />
      </div>

      <Button type="submit">Crear Aeropuerto</Button>
    </form>
  );
};

export default CreateAeropuerto;

