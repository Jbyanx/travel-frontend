import React, { useState } from 'react';
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";

const CreateAeropuerto = ({ api, setError }: { api: any, setError: React.Dispatch<React.SetStateAction<string | null>> }) => {
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
    try {
      await api.post('/aeropuertos', airportData);
      alert('Aeropuerto creado con éxito');
      setAirportData({ nombre: '', ciudad: '', pais: '' }); // Limpia los campos del formulario
    } catch (error) {
      setError('Error al crear el aeropuerto. Intenta nuevamente.');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Crear Aeropuerto</h2>
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

        <Button type="submit" className="mt-4">
          Crear Aeropuerto
        </Button>
      </form>
    </div>
  );
};

export default CreateAeropuerto;
