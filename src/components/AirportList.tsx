import React, { useState, useEffect } from 'react'
import { AxiosInstance } from 'axios'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/Table"

interface Airport {
  id: number;
  nombre: string;
  ciudad: string;
  pais: string;
}

interface AirportListProps {
  api: AxiosInstance;
  setError: (error: string | null) => void;
}

export function AirportList({ api, setError }: AirportListProps) {
  const [airports, setAirports] = useState<Airport[]>([]);

  useEffect(() => {
    fetchAirports();
  }, []);

  const fetchAirports = async () => {
    try {
      const response = await api.get('/aeropuertos');
      setAirports(response.data);
    } catch (error) {
      setError('Failed to fetch airports');
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>City</TableHead>
          <TableHead>Country</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {airports.map((airport) => (
          <TableRow key={airport.id}>
            <TableCell>{airport.nombre}</TableCell>
            <TableCell>{airport.ciudad}</TableCell>
            <TableCell>{airport.pais}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
