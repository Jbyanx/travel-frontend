import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './contexts/AuthContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/Dialog';
import { Pencil, Trash2 } from 'lucide-react';
import CreateVuelo from './CreateVuelo';
import EditVuelo from './EditVuelo';

interface Airport {
  id: number;
  nombre: string;
  ciudad: string;
  pais: string;
}

interface Escala {
  id: number;
  aeropuerto: Airport;
  duracion: string;
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
  aeropuertoOrigen: string;  // Cambiado a string
  aeropuertoDestino: string; // Cambiado a string
  escalas: Escala[];
}

// Función para formatear la fecha
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? "Fecha inválida" : date.toLocaleDateString();
};

// Función para formatear la hora
const formatTime = (timeString: string) => {
  const timeParts = timeString.split(':');
  if (timeParts.length === 3) {
    return `${timeParts[0]}:${timeParts[1]}:${timeParts[2]}`;
  }
  return "Hora inválida";
};

export function FlightList({ api, setError }: { api: any; setError: React.Dispatch<React.SetStateAction<string | null>> }) {
  const [vuelos, setVuelos] = useState<Vuelo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingVuelo, setEditingVuelo] = useState<Vuelo | null>(null);
  const { userRole } = useAuth();

  useEffect(() => {
    fetchVuelos();
  }, []);

  const fetchVuelos = async () => {
    try {
      const response = await api.get('/vuelos');
      const vuelosWithFormattedDates = response.data.map((vuelo: Vuelo) => ({
        ...vuelo,
        // Transforma los aeropuertos de cadena a objetos
        aeropuertoOrigen: { nombre: vuelo.aeropuertoOrigen, ciudad: 'Desconocida', pais: 'Desconocido' },
        aeropuertoDestino: { nombre: vuelo.aeropuertoDestino, ciudad: 'Desconocida', pais: 'Desconocido' },
        fechaDeSalida: formatDate(vuelo.fechaDeSalida),
        horaDeSalida: formatTime(vuelo.horaDeSalida),
      }));
      setVuelos(vuelosWithFormattedDates);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch flights.');
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estas seguro de eliminar este vuelo?')) {
      try {
        await api.delete(`/vuelos/${id}`);
        setError(null);
        fetchVuelos();
      } catch (error) {
        console.error('Error deleting flight:', error);
        setError('Failed to delete flight. Please try again later.');
        alert("Error al eliminar vuelo con reservas asociadas, elimine primero las reservas");
      }
    }
  };

  if (loading) {
    return <div>Loading flights...</div>;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8">
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Lista de vuelos y Escalas</CardTitle>
        {userRole === 'ROLE_ADMIN' && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>Crear Vuelo</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nuevo Vuelo</DialogTitle>
              </DialogHeader>
              <CreateVuelo 
                api={api} 
                setError={setError} 
                onSuccess={() => {
                  setIsCreateDialogOpen(false);
                  fetchVuelos();
                }}
              />
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        {/* Contenedor con scroll horizontal */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ciudad origen</TableHead>
                <TableHead>Ciudad destino</TableHead>
                <TableHead>Fecha de salida</TableHead>
                <TableHead>Hora de salida</TableHead>
                <TableHead>Aerolínea</TableHead>
                <TableHead>Aeropuerto origen</TableHead>
                <TableHead>Aeropuerto destino</TableHead>
                <TableHead>Duracion / Escala</TableHead>
                {userRole === 'ROLE_ADMIN' && <TableHead>Acciones</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {vuelos.map((vuelo) => ( 
                <React.Fragment key={vuelo.id}>
                  <TableRow>
                    <TableCell>{vuelo.origen}</TableCell>
                    <TableCell>{vuelo.destino}</TableCell>
                    <TableCell>{vuelo.fechaDeSalida}</TableCell>
                    <TableCell>{vuelo.horaDeSalida}</TableCell>
                    <TableCell>{vuelo.aerolinea}</TableCell>
                    <TableCell>{vuelo.aeropuertoOrigen.nombre}</TableCell>
                    <TableCell>{vuelo.aeropuertoDestino.nombre}</TableCell>
                    <TableCell>{vuelo.escalas.length > 0 ? `${vuelo.escalas.length} escalas(s)` : `Duración: ${vuelo.duracion}`}</TableCell>
                    {userRole === 'ROLE_ADMIN' && (
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => {
                          setEditingVuelo(vuelo);
                          setIsEditDialogOpen(true);
                        }}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(vuelo.id)} className="ml-2">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                  {vuelo.escalas.map((escala) => (
                    <TableRow key={`escala-${escala.id}`}>
                      <TableCell colSpan={8}>
                        Escala en {escala.aeropuerto.nombre} ({escala.aeropuerto.ciudad}, {escala.aeropuerto.pais}) - Duración: {escala.duracion}
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      {userRole === 'ROLE_ADMIN' && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Vuelo</DialogTitle>
            </DialogHeader>
            {editingVuelo && (
              <EditVuelo
                api={api}
                setError={setError}
                vuelo={editingVuelo}
                onSuccess={() => {
                  setIsEditDialogOpen(false);
                  fetchVuelos();
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      )}
    </Card>

  );
}

export default FlightList;
