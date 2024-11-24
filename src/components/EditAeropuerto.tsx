import React, { useState } from 'react';
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { AxiosInstance } from 'axios';

interface Airport {
  id: number;
  nombre: string;
  ciudad: string;
  pais: string;
}

interface EditAeropuertoProps {
  api: AxiosInstance;
  setError: (error: string | null) => void;
  airport: Airport;
  onSuccess: () => void;
}

const EditAeropuerto: React.FC<EditAeropuertoProps> = ({ api, setError, airport, onSuccess }) => {
  const [airportData, setAirportData] = useState({
    nombre: airport.nombre,
    ciudad: airport.ciudad,
    pais: airport.pais
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAirportData({ ...airportData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/aeropuertos/${airport.id}`, airportData);
      alert('Aeropuerto actualizado con éxito');
      onSuccess();
    } catch (error) {
      console.error('Error updating airport:', error);
      setError('Error al actualizar el aeropuerto.');
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
          maxLength={100}
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
          maxLength={100}
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
          maxLength={100}
        />
      </div>

      <Button type="submit" className="mt-4">
        Actualizar Aeropuerto
      </Button>
    </form>
  );
};

export default EditAeropuerto;

