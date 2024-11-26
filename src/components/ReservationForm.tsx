import React, { useState, useEffect } from 'react';
import { AxiosInstance } from 'axios';
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/Select";

interface Flight {
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
  escalas: any[];
}

interface ReservationFormProps {
  api: AxiosInstance;
  setError: (error: string | null) => void;
  onSuccess?: () => void;
}

export function ReservationForm({ api, setError, onSuccess }: ReservationFormProps) {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<number | null>(null);
  const [passengerCount, setPassengerCount] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const idCliente = localStorage.getItem('idCliente'); // Obtener el idCliente desde el localStorage

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    setLoading(true);
    try {
      const response = await api.get("/vuelos");
      setFlights(response.data);
    } catch (error) {
      setError("No se pudo obtener los vuelos");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!selectedFlight) {
      setError("Por favor, selecciona un vuelo");
      return;
    }

    if (!idCliente) {
      setError("El cliente debe estar identificado");
      return;
    }

    if (passengerCount <= 0) {
      setError("El número de pasajeros debe ser mayor a 0");
      return;
    }

    try {
      await api.post("/reservas", {
        idCliente: Number(idCliente),
        idVuelo: selectedFlight,
        numeroDePasajeros: passengerCount,
      });
      setSuccessMessage("¡Reserva creada con éxito!");
      setSelectedFlight(null);
      setPassengerCount(1);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setError("No se pudo crear la reserva");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 space-y-6 bg-white rounded-lg shadow-md max-w-lg mx-auto"
      style={{ fontFamily: "Arial, sans-serif" }}
    >
      <h2 className="text-2xl font-semibold text-gray-700">Hacer una Reserva</h2>

      {loading ? (
        <p className="text-gray-500">Cargando vuelos...</p>
      ) : (
        <div>
          <Label htmlFor="flight" className="block mb-2 text-gray-600">
            Seleccionar Vuelo
          </Label>
          <Select onValueChange={(value) => setSelectedFlight(Number(value))}>
            <SelectTrigger className="w-full bg-white border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-300">
              <SelectValue placeholder="Selecciona un vuelo" />
            </SelectTrigger>
            <SelectContent className="bg-white shadow-lg rounded-md">
              {flights.map((flight) => (
                <SelectItem key={flight.id} value={flight.id.toString()}>
                  {flight.origen} a {flight.destino} ({flight.fechaDeSalida})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <Label htmlFor="passengerCount" className="block mb-2 text-gray-600">
          Número de Pasajeros
        </Label>
        <Input
          id="passengerCount"
          type="number"
          min="1"
          value={passengerCount}
          onChange={(e) => setPassengerCount(Number(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-300"
        />
      </div>

      {successMessage && <p className="text-green-600">{successMessage}</p>}
      <Button type="submit" className="w-full p-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700">
        Hacer Reserva
      </Button>
    </form>
  );
}
