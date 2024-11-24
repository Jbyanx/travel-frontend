import React, { useState, useEffect } from 'react'
import { AxiosInstance } from 'axios'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/Table"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/Dialog"
import { Pencil, Trash2 } from 'lucide-react'
import { useAuth } from './contexts/AuthContext'
import CreateAeropuerto from './CreateAeropuerto'
import EditAeropuerto from './EditAeropuerto'

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
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAirport, setEditingAirport] = useState<Airport | null>(null);
  const { userRole, token } = useAuth();

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

  const handleEdit = (airport: Airport) => {
    setEditingAirport(airport);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this airport?')) {
      try {
        await api.delete(`/aeropuertos/${id}`);
        alert('Airport deleted successfully');
        fetchAirports();
      } catch (error) {
        console.error('Error deleting airport:', error);
        setError('Failed to delete airport. Please try again later.');
      }
    }
  };

  if (loading) {
    return <div>Loading airports...</div>;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8">
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Lista de Aeropuertos</CardTitle>
        {userRole === 'ROLE_ADMIN' && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>Crear Aeropuerto</Button>
            </DialogTrigger>
            <DialogContent>
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
              <TableHead>Nombre</TableHead>
              <TableHead>Ciudad</TableHead>
              <TableHead>País</TableHead>
              {userRole === 'ROLE_ADMIN' && <TableHead>Acciones</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {airports.map((airport) => (
              <TableRow key={airport.id}>
                <TableCell>{airport.nombre}</TableCell>
                <TableCell>{airport.ciudad}</TableCell>
                <TableCell>{airport.pais}</TableCell>
                {userRole === 'ROLE_ADMIN' && (
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(airport)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(airport.id)} className="ml-2">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      {userRole === 'ROLE_ADMIN' && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Aeropuerto</DialogTitle>
            </DialogHeader>
            {editingAirport && (
              <EditAeropuerto
                api={api}
                setError={setError}
                airport={editingAirport}
                onSuccess={() => {
                  setIsEditDialogOpen(false);
                  fetchAirports();
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      )}
    </Card>
  )
}

