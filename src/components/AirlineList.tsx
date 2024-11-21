import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from './contexts/AuthContext'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/Table"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import { Alert, AlertDescription } from "../components/ui/Alert"

interface Airline {
  id: number;
  nombre: string;
  codigoIATA: string;
}

interface AirlineListProps {
  setError: (error: string | null) => void;
}

export function AirlineList({ setError }: AirlineListProps) {
  const [airlines, setAirlines] = useState<Airline[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    fetchAirlines();
  }, []);

  const fetchAirlines = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/aerolineas', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setAirlines(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching airlines:', error);
      setError('Failed to fetch airlines. Please try again later.');
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading airlines...</div>;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Lista de Aerolíneas</CardTitle>
      </CardHeader>
      <CardContent>
        {airlines.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Código IATA</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {airlines.map((airline) => (
                <TableRow key={airline.id}>
                  <TableCell>{airline.nombre}</TableCell>
                  <TableCell>{airline.codigoIATA}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Alert>
            <AlertDescription>No se encontraron aerolíneas.</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

