import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './contexts/AuthContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/Table";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Alert, AlertDescription } from "../components/ui/Alert";
import { Button } from "./ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/Dialog";
import CreateAerolinea from './CreateAerolinea';

interface Airline {
  id: number;
  nombre: string;
  codigo: number;
  pais: string;
}

interface AirlineListProps {
  api: any;
  setError: (error: string | null) => void;
}

export function AirlineList({ api, setError }: AirlineListProps) {
  const { userRole } = useAuth(); // Consumir userRole del contexto
  const [airlines, setAirlines] = useState<Airline[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    fetchAirlines();
  }, []);

  const fetchAirlines = async () => {
    try {
      const response = await api.get('/aerolineas');
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
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Lista de Aerolíneas</CardTitle>
        {userRole === 'ROLE_ADMIN' && ( // Renderizar el botón solo si el rol es ADMIN
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>Crear Aerolínea</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nueva Aerolínea</DialogTitle>
              </DialogHeader>
              <CreateAerolinea 
                api={api} 
                setError={setError} 
                onSuccess={() => {
                  setIsCreateDialogOpen(false);
                  fetchAirlines();
                }}
              />
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        {airlines.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>País</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {airlines.map((airline) => (
                <TableRow key={airline.id}>
                  <TableCell>{airline.nombre}</TableCell>
                  <TableCell>{airline.codigo}</TableCell>
                  <TableCell>{airline.pais}</TableCell>
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
  );
}
