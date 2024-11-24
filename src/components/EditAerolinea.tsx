import React, { useState } from 'react';
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { useAuth } from './contexts/AuthContext';

interface Airline {
  id: number;
  nombre: string;
  codigo: number;
  pais: string;
}

interface EditAerolineaProps {
  api: any;
  setError: (error: string | null) => void;
  airline: Airline;
  onSuccess: () => void;
}

const EditAerolinea: React.FC<EditAerolineaProps> = ({ api, setError, airline, onSuccess }) => {
  const { token } = useAuth();
  const [airlineData, setAirlineData] = useState({
    nombre: airline.nombre,
    codigo: airline.codigo,
    pais: airline.pais
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAirlineData({ ...airlineData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/aerolineas/${airline.id}`, airlineData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Aerolínea actualizada con éxito');
      onSuccess();
    } catch (error) {
      console.error('Error updating airline:', error);
      setError('Error al actualizar la aerolínea.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <Label htmlFor="nombre">Nombre de la Aerolínea:</Label>
        <Input
          type="text"
          id="nombre"
          name="nombre"
          value={airlineData.nombre}
          onChange={handleChange}
          required
          maxLength={100}
        />
      </div>

      <div className="mb-4">
        <Label htmlFor="codigo">Código:</Label>
        <Input
          type="text"
          id="codigo"
          name="codigo"
          value={airlineData.codigo}
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
          value={airlineData.pais}
          onChange={handleChange}
          required
          maxLength={100}
        />
      </div>

      <Button type="submit" className="mt-4">
        Actualizar Aerolínea
      </Button>
    </form>
  );
};

export default EditAerolinea;

