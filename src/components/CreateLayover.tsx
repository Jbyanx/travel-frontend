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

interface CreateLayoverProps {
  api: any;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  onSuccess: () => void;
}

const CreateLayover: React.FC<CreateLayoverProps> = ({ api, setError, onSuccess }) => {
  const { token, userRole } = useAuth();
  const [layoverData, setLayoverData] = useState({
    idVuelo: 0,
    idAeropuerto: 0,
    duracion: ''
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

  // Función para convertir minutos a formato ISO 8601
  const convertToISO8601Duration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0) {
      return `PT${hours}H${remainingMinutes > 0 ? remainingMinutes + 'M' : ''}`;
    }
    return `PT${remainingMinutes}M`; // Solo minutos si no hay horas
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (userRole !== 'ROLE_ADMIN') {
      setError('No tienes permisos para realizar esta acción.');
      return;
    }

    // Convertir la duración de minutos a formato ISO 8601
    const duracionEnMinutos = parseInt(layoverData.duracion, 10);
    if (isNaN(duracionEnMinutos) || duracionEnMinutos <= 0) {
      setLocalError('Por favor, ingrese una duración válida en minutos.');
      return;
    }

    const formattedDuracion = convertToISO8601Duration(duracionEnMinutos);

    const saveLayoverData = {
      idVuelo: layoverData.idVuelo,
      idAeropuerto: layoverData.idAeropuerto,
      duracion: formattedDuracion // Duración en formato ISO 8601
    };

    try {
      await api.post('/escalas', saveLayoverData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Escala creada con éxito');
      setLayoverData({
        idVuelo: 0,
        idAeropuerto: 0,
        duracion: ''
      });
      onSuccess();
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        const backendMessage = error.response.data.message;
        const errorMessage = backendMessage.includes("duplicate key")
          ? "Ya existe una escala con los mismos datos, por favor verifica los campos."
          : "Ya existe una escala con los mismos datos de vuelo, por favor verifica los campos.";

        setLocalError(errorMessage);
      } else {
        setLocalError('Error al crear la escala.');
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Crear Escala</h2>
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
            value={layoverData.idAeropuerto.toString()}
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
            type="text"
            id="duracion"
            value={layoverData.duracion}
            onChange={(e) => handleChange('duracion', e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full">
          Crear Escala
        </Button>
      </form>
    </div>
  );
};

export default CreateLayover;
