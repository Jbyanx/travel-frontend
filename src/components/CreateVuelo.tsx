import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/Select';
import { useAuth } from './contexts/AuthContext';
import { Alert, AlertDescription, AlertTitle } from './ui/Alert';
import axios from 'axios';

interface Airline {
  id: number;
  nombre: string;
}

interface Airport {
  id: number;
  nombre: string;
}

const CreateVuelo = ({ setError }: { setError: React.Dispatch<React.SetStateAction<string | null>> }) => {
  const { token, userRole } = useAuth();
  const [flightData, setFlightData] = useState({
    origen: '',
    destino: '',
    fechaDeSalida: '',
    horaDeSalida: '',
    duracion: 0,
    capacidad: 1,
    idAerolinea: 0,
    idAeropuertoOrigen: 0,
    idAeropuertoDestino: 0
  });
  const [airlines, setAirlines] = useState<Airline[]>([]);
  const [airports, setAirports] = useState<Airport[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);

  const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

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
      } catch (error) {
        console.error('Error al cargar aerolíneas o aeropuertos:', error);
        setError('Error al cargar aerolíneas o aeropuertos.');
      }
    };
    fetchAirlinesAndAirports();
  }, [api, setError]);

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

    const saveVueloData = {
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
      const response = await api.post('/vuelos', saveVueloData);
      console.log('Vuelo creado exitosamente:', response.data);
      alert('Vuelo creado con éxito');
      setFlightData({
        origen: '',
        destino: '',
        fechaDeSalida: '',
        horaDeSalida: '',
        duracion: 0,
        capacidad: 1,
        idAerolinea: 0,
        idAeropuertoOrigen: 0,
        idAeropuertoDestino: 0
      });
    } catch (error) {
      console.error('Error al crear el vuelo:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('Datos de la respuesta:', error.response.data);
        console.error('Estado de la respuesta:', error.response.status);
        console.error('Encabezados de la respuesta:', error.response.headers);
        setError(`Error al crear el vuelo: ${error.response.status} ${error.response.statusText}`);
      } else {
        setError('Error al crear el vuelo.');
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Crear Vuelo</h2>
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
            <SelectTrigger className="bg-white text-black">
              <SelectValue placeholder="Seleccione una aerolínea" />
            </SelectTrigger>
            <SelectContent>
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
              const selectedAirport = airports.find(a => a.id === parseInt(value, 10));
              handleChange('idAeropuertoOrigen', parseInt(value, 10));
              handleChange('origen', selectedAirport ? selectedAirport.nombre : '');
            }}
            value={flightData.idAeropuertoOrigen.toString()}
          >
            <SelectTrigger className="bg-white text-black">
              <SelectValue placeholder="Seleccione aeropuerto de origen" />
            </SelectTrigger>
            <SelectContent>
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
              const selectedAirport = airports.find(a => a.id === parseInt(value, 10));
              handleChange('idAeropuertoDestino', parseInt(value, 10));
              handleChange('destino', selectedAirport ? selectedAirport.nombre : '');
            }}
            value={flightData.idAeropuertoDestino.toString()}
          >
            <SelectTrigger className="bg-white text-black">
              <SelectValue placeholder="Seleccione aeropuerto de destino" />
            </SelectTrigger>
            <SelectContent>
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
            min={1}
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
            min={1}
          />
        </div>

        <Button type="submit" className="w-full">
          Crear Vuelo
        </Button>
      </form>
    </div>
  );
};

export default CreateVuelo;

