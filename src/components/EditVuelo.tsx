import React, { useState, useEffect } from 'react';
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/Select";
import { useAuth } from './contexts/AuthContext';
import { Alert, AlertDescription, AlertTitle } from './ui/Alert';

interface Airline {
  id: number;
  nombre: string;
}

interface Airport {
  id: number;
  nombre: string;
}

interface Vuelo {
  id: number;
  origen: string;
  destino: string;
  fechaDeSalida: string;
  horaDeSalida: string;
  duracion: string;
  capacidad: number;
  aerolinea: string;
  aeropuertoOrigen: string;
  aeropuertoDestino: string;
}

interface EditVueloProps {
  api: any;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  vuelo: Vuelo;
  onSuccess: () => void;
}

const EditVuelo: React.FC<EditVueloProps> = ({ api, setError, vuelo, onSuccess }) => {
  const { token, userRole } = useAuth();
  const [flightData, setFlightData] = useState({
    origen: vuelo.origen,
    destino: vuelo.destino,
    fechaDeSalida: vuelo.fechaDeSalida,
    horaDeSalida: vuelo.horaDeSalida,
    duracion: parseInt(vuelo.duracion.replace(/\D/g, '')) || 0,
    capacidad: vuelo.capacidad,
    idAerolinea: 0,
    idAeropuertoOrigen: 0,
    idAeropuertoDestino: 0
  });
  const [airlines, setAirlines] = useState<Airline[]>([]);
  const [airports, setAirports] = useState<Airport[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (userRole !== 'ROLE_ADMIN') {
      setLocalError('No tienes permisos para acceder a esta funcionalidad.');
    }
  }, [userRole]);

  useEffect(() => {
    const fetchAirlinesAndAirports = async () => {
      try {
        const [airlineResponse, airportResponse] = await Promise.all([
          api.get('/aerolineas'),
          api.get('/aeropuertos')
        ]);
        setAirlines(airlineResponse.data);
        setAirports(airportResponse.data);

        const selectedAirline = airlineResponse.data.find((a: Airline) => a.nombre === vuelo.aerolinea);
        const selectedOriginAirport = airportResponse.data.find((a: Airport) => a.nombre === vuelo.aeropuertoOrigen);
        const selectedDestinationAirport = airportResponse.data.find((a: Airport) => a.nombre === vuelo.aeropuertoDestino);

        setFlightData(prev => ({
          ...prev,
          idAerolinea: selectedAirline ? selectedAirline.id : 0,
          idAeropuertoOrigen: selectedOriginAirport ? selectedOriginAirport.id : 0,
          idAeropuertoDestino: selectedDestinationAirport ? selectedDestinationAirport.id : 0
        }));
      } catch (error) {
        setError('Error al cargar aerolíneas o aeropuertos.');
      }
    };
    fetchAirlinesAndAirports();
  }, [api, setError, vuelo]);

  const handleChange = (name: string, value: string | number) => {
    setFlightData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (userRole !== 'ROLE_ADMIN') {
      setError('No tienes permisos para realizar esta acción.');
      return;
    }

    if (flightData.idAeropuertoOrigen === flightData.idAeropuertoDestino) {
      setError('El aeropuerto de origen y destino no pueden ser el mismo.');
      return;
    }

    const updateVueloData = {
      origen: flightData.origen,
      destino: flightData.destino,
      fechaDeSalida: flightData.fechaDeSalida,
      horaDeSalida: flightData.horaDeSalida,
      duracion: `PT${flightData.duracion}M`,
      capacidad: flightData.capacidad,
      idAerolinea: flightData.idAerolinea,
      idAeropuertoOrigen: flightData.idAeropuertoOrigen,
      idAeropuertoDestino: flightData.idAeropuertoDestino
    };

    try {
      await api.put(`/vuelos/${vuelo.id}`, updateVueloData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Vuelo actualizado con éxito');
      onSuccess();
    } catch (error) {
      setError('Error al actualizar el vuelo.');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Editar Vuelo</h2>
      {localError && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{localError}</AlertDescription>
        </Alert>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="idAerolinea">Aerolínea</Label>
          <Select
            onValueChange={(value) => handleChange('idAerolinea', parseInt(value, 10))}
            value={flightData.idAerolinea.toString()}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione una aerolínea" />
            </SelectTrigger>
            <SelectContent style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {airlines.map((airline) => (
                <SelectItem key={airline.id} value={airline.id.toString()}>
                  {airline.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="idAeropuertoOrigen">Aeropuerto de Origen</Label>
          <Select
            onValueChange={(value) => {
              handleChange('idAeropuertoOrigen', parseInt(value, 10));
              handleChange('origen', airports.find(a => a.id === parseInt(value, 10))?.nombre || '');
            }}
            value={flightData.idAeropuertoOrigen.toString()}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione aeropuerto de origen" />
            </SelectTrigger>
            <SelectContent style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {airports.map((airport) => (
                <SelectItem key={airport.id} value={airport.id.toString()}>
                  {airport.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="idAeropuertoDestino">Aeropuerto de Destino</Label>
          <Select
            onValueChange={(value) => {
              handleChange('idAeropuertoDestino', parseInt(value, 10));
              handleChange('destino', airports.find(a => a.id === parseInt(value, 10))?.nombre || '');
            }}
            value={flightData.idAeropuertoDestino.toString()}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione aeropuerto de destino" />
            </SelectTrigger>
            <SelectContent style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {airports.map((airport) => (
                <SelectItem 
                  key={airport.id} 
                  value={airport.id.toString()}
                  disabled={airport.id === flightData.idAeropuertoOrigen}
                >
                  {airport.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="fechaDeSalida">Fecha de Salida</Label>
          <Input
            type="date"
            id="fechaDeSalida"
            value={flightData.fechaDeSalida}
            onChange={(e) => handleChange('fechaDeSalida', e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="horaDeSalida">Hora de Salida</Label>
          <Input
            type="time"
            id="horaDeSalida"
            value={flightData.horaDeSalida}
            onChange={(e) => handleChange('horaDeSalida', e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="duracion">Duración (en minutos)</Label>
          <Input
            type="number"
            id="duracion"
            value={flightData.duracion}
            onChange={(e) => handleChange('duracion', parseInt(e.target.value))}
            required
          />
        </div>

        <div>
          <Label htmlFor="capacidad">Capacidad</Label>
          <Input
            type="number"
            id="capacidad"
            value={flightData.capacidad}
            onChange={(e) => handleChange('capacidad', parseInt(e.target.value))}
            required
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit">Actualizar Vuelo</Button>
        </div>
      </form>
    </div>
  );
};

export default EditVuelo;
