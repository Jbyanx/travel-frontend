import React, { useState, useEffect } from 'react';
import { AxiosInstance } from 'axios';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/Table";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "./ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/Dialog";
import CreateAeropuerto from './CreateAeropuerto';

interface Airport {
  id: number;
  nombre: string;
  ciudad: string;
  pais: string;
}

interface AirportListProps {
  api: AxiosInstance;
  setError: (error: string | null) => void;
  userRole: string; // Agregamos esta prop para conocer el rol del usuario
}

export function AirportList({ api, setError, userRole }: AirportListProps) {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    fetchAirports();
  }, []);

  const fetchAirports = async () => {
    try {
      const response = await api.get('/aeropuertos');
      setAirports(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch airports');
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading airports...</div>;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8">
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Lista de Aeropuertos</CardTitle>
        {userRole === 'ROLE_ADMIN' && ( // Solo muestra el botón si el usuario es administrador
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>Crear Aeropuerto</Button>
            </DialogTrigger>
            <DialogContent className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg w-full">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Aeropuerto</DialogTitle>
              </DialogHeader>
              <CreateAeropuerto
                api={api}
                setError={setError}
                onSuccess={() => {
                  setIsCreateDialogOpen(false);
                  fetchAirports();
                }}
              />
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}
