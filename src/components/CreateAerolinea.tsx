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
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Crear Aerolínea</h2>
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
          Crear Aerolínea
        </Button>
      </form>
    </div>
  );
};

export default CreateAerolinea;
