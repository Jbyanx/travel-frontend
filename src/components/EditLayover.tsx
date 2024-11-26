import React, { useState, useEffect } from 'react';
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/Select";
import { useAuth } from './contexts/AuthContext';
import { Alert, AlertDescription, AlertTitle } from './ui/Alert';

interface Airport {
  id: number;
  nombre: string;
}

interface Flight {
  id: number;
  origen: string;
  destino: string;
}

interface Layover {
  id: number;
  aeropuerto: Airport;
  idVuelo: number;
  duracion: string; // En minutos
}

interface EditLayoverProps {
  api: any;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  layover: Layover;
  onSuccess: () => void;
}

const EditLayover: React.FC<EditLayoverProps> = ({ api, setError, layover, onSuccess }) => {
  const { token, userRole } = useAuth();
  const [layoverData, setLayoverData] = useState({
    idVuelo: layover?.idVuelo || 0,
    idAeropuerto: layover?.aeropuerto?.id || 0,
    duracion: layover?.duracion || '' // Mantenemos la duración como número de minutos
  });
  const [airports, setAirports] = useState<Airport[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (userRole !== 'ROLE_ADMIN') {
      setLocalError('No tienes permisos para acceder a esta funcionalidad.');
    }
  }, [userRole]);

  useEffect(() => {
    const fetchAirportsAndFlights = async () => {
      try {
        const [airportResponse, flightResponse] = await Promise.all([
          api.get('/aeropuertos'),
          api.get('/vuelos')
        ]);
        setAirports(airportResponse.data);
        setFlights(flightResponse.data);
      } catch (error) {
        setError('Error al cargar aeropuertos o vuelos.');
      }
    };
    fetchAirportsAndFlights();
  }, [api, setError]);

  const handleChange = (name: string, value: string | number) => {
    setLayoverData(prev => ({ ...prev, [name]: value }));
  };

  const convertMinutesToISO = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    let isoDuration = 'PT';

    if (hours > 0) isoDuration += `${hours}H`;
    if (remainingMinutes > 0) isoDuration += `${remainingMinutes}M`;

    return isoDuration;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (userRole !== 'ROLE_ADMIN') {
      setError('No tienes permisos para realizar esta acción.');
      return;
    }

    // Convertir la duración de minutos a formato ISO 8601
    const { duracion } = layoverData;
    if (!duracion || isNaN(Number(duracion)) || Number(duracion) <= 0) {
      setLocalError('Por favor, ingrese una duración válida en minutos.');
      return;
    }

    const isoDuration = convertMinutesToISO(Number(duracion));

    const updateLayoverData = {
      idVuelo: layoverData.idVuelo,
      idAeropuerto: layoverData.idAeropuerto,
      duracion: isoDuration // Duración en formato ISO 8601
    };

    try {
      await api.put(`/escalas/${layover.id}`, updateLayoverData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Escala actualizada con éxito');
      onSuccess();
    } catch (error) {
      setError('Error al actualizar la escala, ese aeropuerto ya tiene una escala asignada');
    }
  };

  // Verificar si `layover` está definido antes de renderizar
  if (!layover) {
    return <div>No se encontró la escala para editar.</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Editar Escala</h2>
      {localError && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{localError}</AlertDescription>
        </Alert>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="idVuelo">Vuelo</Label>
          <Select
            onValueChange={(value) => handleChange('idVuelo', parseInt(value, 10))}
            value={layoverData.idVuelo.toString()}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione un vuelo" />
            </SelectTrigger>
            <SelectContent className={`max-h-[300px] ${flights.length > 5 ? 'overflow-y-auto' : ''}`}>
              {flights.map((flight) => (
                <SelectItem key={flight.id} value={flight.id.toString()}>
                  {flight.origen} - {flight.destino}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="idAeropuerto">Aeropuerto de Escala</Label>
          <Select
            onValueChange={(value) => handleChange('idAeropuerto', parseInt(value, 10))}
            value={layoverData.idAeropuerto.toString()} // Aseguramos que el valor del select esté sincronizado
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione aeropuerto de escala" />
            </SelectTrigger>
            <SelectContent className={`max-h-[300px] ${airports.length > 5 ? 'overflow-y-auto' : ''}`}>
              {airports.map((airport) => (
                <SelectItem key={airport.id} value={airport.id.toString()}>
                  {airport.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="duracion">Duración de la Escala (en minutos)</Label>
          <Input
            type="number"
            id="duracion"
            value={layoverData.duracion}
            onChange={(e) => handleChange('duracion', e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full">
          Actualizar Escala
        </Button>
      </form>
    </div>
  );
};

export default EditLayover;
