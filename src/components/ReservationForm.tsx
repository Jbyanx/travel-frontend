import React, { useState, useEffect } from 'react'
import { AxiosInstance } from 'axios'
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Label } from "../components/ui/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/Select"

interface Flight {
  id: number;
  flightNumber: string;
  origin: string;
  destination: string;
}

interface ReservationFormProps {
  api: AxiosInstance;
  setError: (error: string | null) => void;
}

export function ReservationForm({ api, setError }: ReservationFormProps) {
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
    } catch (error) {
      setError('Failed to create reservation');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="flight">Select Flight</Label>
        <Select onValueChange={(value) => setSelectedFlight(Number(value))}>
          <SelectTrigger>
            <SelectValue placeholder="Select a flight" />
          </SelectTrigger>
          <SelectContent>
            {flights.map((flight) => (
              <SelectItem key={flight.id} value={flight.id.toString()}>
                {flight.flightNumber} - {flight.origin} to {flight.destination}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="passengerCount">Number of Passengers</Label>
        <Input
          id="passengerCount"
          type="number"
          min="1"
          value={passengerCount}
          onChange={(e) => setPassengerCount(Number(e.target.value))}
        />
      </div>
      <Button type="submit">Make Reservation</Button>
    </form>
  )
}
