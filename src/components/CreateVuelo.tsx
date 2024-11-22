import React, { useState, useEffect } from 'react';
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Select } from "../components/ui/Select"; // Asumiendo que tienes un componente Select
import { useAuth } from './contexts/AuthContext';

const CreateVuelo = ({ api, setError }: { api: any, setError: React.Dispatch<React.SetStateAction<string | null>> }) => {
  const { token } = useAuth();
  const [flightData, setFlightData] = useState({
    origen: '',
    destino: '',
    fechaDeSalida: '',
    horaDeSalida: '',
    duracion: 0, // en minutos
    capacidad: 1,
    idAerolinea: '',
    idAeropuertoOrigen: '',
    idAeropuertoDestino: ''
  });
  const [airlines, setAirlines] = useState<any[]>([]); // Lista de aerolíneas
  const [airports, setAirports] = useState<any[]>([]); // Lista de aeropuertos

  useEffect(() => {
    const fetchAirlinesAndAirports = async () => {
      try {
        const airlineResponse = await api.get('/aerolineas');
        const airportResponse = await api.get('/aeropuertos');
        console.log('Aerolineas:', airlineResponse.data);
        console.log('Aeropuerto:', airportResponse.data);
        setAirlines(airlineResponse.data);
        setAirports(airportResponse.data);
      } catch (error) {
        setError('Error al cargar aerolíneas o aeropuertos.');
      }
    };
    fetchAirlinesAndAirports();
  }, [api, setError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFlightData({ ...flightData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/vuelos', flightData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Vuelo creado con éxito');
      // Puedes limpiar los campos del formulario si deseas
    } catch (error) {
      setError('Error al crear el vuelo.');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Crear Vuelo</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label htmlFor="origen">Origen:  </Label>
          <Input
            type="text"
            id="origen"
            name="origen"
            value={flightData.origen}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="destino">Destino:  </Label>
          <Input
            type="text"
            id="destino"
            name="destino"
            value={flightData.destino}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="fechaDeSalida">Fecha de Salida:  </Label>
          <Input
            type="date"
            id="fechaDeSalida"
            name="fechaDeSalida"
            value={flightData.fechaDeSalida}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="horaDeSalida">Hora de Salida:  </Label>
          <Input
            type="time"
            id="horaDeSalida"
            name="horaDeSalida"
            value={flightData.horaDeSalida}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="duracion">Duración (en minutos):  </Label>
          <Input
            type="number"
            id="duracion"
            name="duracion"
            value={flightData.duracion}
            onChange={handleChange}
            required
            min={1}
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="capacidad">Capacidad:  </Label>
          <Input
            type="number"
            id="capacidad"
            name="capacidad"
            value={flightData.capacidad}
            onChange={handleChange}
            required
            min={1}
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="idAerolinea">Aerolínea:  </Label>
          <Select
            id="idAerolinea"
            name="idAerolinea"
            value={flightData.idAerolinea}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione una aerolínea</option>
            {airlines.map((airline) => (
              <option key={airline.id} value={airline.id}>
                {airline.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="mb-4">
          <Label htmlFor="idAeropuertoOrigen">Aeropuerto de Origen</Label>
          <Select
            id="idAeropuertoOrigen"
            name="idAeropuertoOrigen"
            value={flightData.idAeropuertoOrigen}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un aeropuerto de origen</option>
            {airports.map((airport) => (
              <option key={airport.id} value={airport.id}>
                {airport.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="mb-4">
          <Label htmlFor="idAeropuertoDestino">Aeropuerto de Destino</Label>
          <Select
            id="idAeropuertoDestino"
            name="idAeropuertoDestino"
            value={flightData.idAeropuertoDestino}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un aeropuerto de destino</option>
            {airports.map((airport) => (
              <option key={airport.id} value={airport.id}>
                {airport.name}
              </option>
            ))}
          </Select>
        </div>

        <Button type="submit" className="mt-4">
          Crear Vuelo
        </Button>
      </form>
    </div>
  );
};

export default CreateVuelo;
