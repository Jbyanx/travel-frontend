import React, { useState, useEffect } from 'react';
import { AxiosInstance } from 'axios';
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/Select";

interface Flight {
  id: number;
  flightNumber: string;
  origin: string;
  destination: string;
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

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      const response = await api.get('/vuelos');
      setFlights(response.data);
    } catch (error) {
      setError('Failed to fetch flights');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFlight) {
      setError('Please select a flight');
      return;
    }
    try {
      await api.post('/reservas', {
        idVuelo: selectedFlight,
        fechaDeReserva: new Date().toISOString().split('T')[0],
        numeroDePasajeros: passengerCount
      });
      setError(null);
      alert('Reservation created successfully');
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setError('Failed to create reservation');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="p-6 space-y-6 bg-white rounded-lg shadow-md max-w-lg mx-auto"
      style={{ fontFamily: 'Arial, sans-serif' }}
    >
      <h2 className="text-2xl font-semibold text-gray-700">Make a Reservation</h2>

      <div>
        <Label htmlFor="flight" className="block mb-2 text-gray-600">
          Select Flight
        </Label>
        <Select onValueChange={(value) => setSelectedFlight(Number(value))}>
          <SelectTrigger className="w-full bg-white border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-300">
            <SelectValue placeholder="Select a flight" />
          </SelectTrigger>
          <SelectContent className="bg-white shadow-lg rounded-md">
            {flights.map((flight) => (
              <SelectItem key={flight.id} value={flight.id.toString()}>
                {flight.flightNumber} - {flight.origin} to {flight.destination}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="passengerCount" className="block mb-2 text-gray-600">
          Number of Passengers
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

      <Button 
        type="submit" 
        className="w-full p-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700"
      >
        Make Reservation
      </Button>
    </form>
  );
}
