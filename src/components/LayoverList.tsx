import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/Dialog';
import { Pencil, Trash2 } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import CreateLayover from './CreateLayover';
import EditLayover from './EditLayover';

interface Layover {
  id: number;
  idAeropuerto: number; // El id del aeropuerto en la escala
  idVuelo: number;      // El id del vuelo en la escala
  duracion: string;
}

interface Aeropuerto {
  id: number;           
  nombre: string;
  ciudad: string;
  pais: string;
}

interface Vuelo {
  id: number;           
  origen: string;
  destino: string;
}

interface LayoverListProps {
  api: any;
  setError: (error: string | null) => void;
}

export function LayoverList({ api, setError }: LayoverListProps) {
  const [layovers, setLayovers] = useState<Layover[]>([]);
  const [aeropuertos, setAeropuertos] = useState<Record<number, Aeropuerto>>({});
  const [vuelos, setVuelos] = useState<Record<number, Vuelo>>({});
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingLayover, setEditingLayover] = useState<Layover | null>(null);
  const { userRole } = useAuth();

  useEffect(() => {
    fetchLayovers();
    fetchAeropuertos();
    fetchVuelos();
  }, []);

  const fetchLayovers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/escalas');
      setLayovers(response.data);
    } catch (error) {
      console.error('Error fetching layovers:', error);
      setError('Failed to fetch layovers');
    } finally {
      setLoading(false);
    }
  };

  const fetchAeropuertos = async () => {
    try {
      const response = await api.get('/aeropuertos');
      const aeropuertosData = response.data.reduce((acc: Record<number, Aeropuerto>, aeropuerto: Aeropuerto) => {
        acc[aeropuerto.id] = aeropuerto; 
        return acc;
      }, {});
      setAeropuertos(aeropuertosData);
    } catch (error) {
      console.error('Error fetching aeropuertos:', error);
      setError('Failed to fetch aeropuertos');
    }
  };

  const fetchVuelos = async () => {
    try {
      const response = await api.get('/vuelos');
      const vuelosData = response.data.reduce((acc: Record<number, Vuelo>, vuelo: Vuelo) => {
        acc[vuelo.id] = vuelo; 
        return acc;
      }, {});
      setVuelos(vuelosData);
    } catch (error) {
      console.error('Error fetching vuelos:', error);
      setError('Failed to fetch vuelos');
    }
  };

  const formatDuration = (duration: string) => {
    const hoursMatch = duration.match(/PT(\d+)H/);
    const minutesMatch = duration.match(/(\d+)M/);
    const hours = hoursMatch ? `${hoursMatch[1]}h` : '';
    const minutes = minutesMatch ? `${minutesMatch[1]}m` : '';
    return `${hours} ${minutes}`.trim();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar esta escala?')) {
      try {
        await api.delete(`/escalas/${id}`);
        setError(null);
        fetchLayovers();
      } catch (error) {
        console.error('Error deleting layover:', error);
        setError('Failed to delete layover. Please try again later.');
        alert("Error al eliminar escala con alguna entidad relacionada");
      }
    }
  };

  if (loading) {
    return <div>Loading layovers...</div>;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8">
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Lista de Escalas</CardTitle>
        {userRole === 'ROLE_ADMIN' && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>Crear Escala</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nueva Escala</DialogTitle>
              </DialogHeader>
              <CreateLayover
                api={api}
                setError={setError}
                onSuccess={() => {
                  setIsCreateDialogOpen(false);
                  fetchLayovers();
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
              <TableHead>Vuelo</TableHead>
              <TableHead>Aeropuerto</TableHead>
              <TableHead>Duración</TableHead>
              {userRole === 'ROLE_ADMIN' && <TableHead>Acciones</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {layovers.map((layover) => {
              const aeropuerto = aeropuertos[layover.idAeropuerto]; 
              const vuelo = vuelos[layover.idVuelo]; 
              return (
                <TableRow key={layover.id}>
                  <TableCell>
                    {vuelo ? `${vuelo.origen} - ${vuelo.destino}` : 'Cargando Vuelo...'}
                  </TableCell>
                  <TableCell>
                    {aeropuerto ? `${aeropuerto.nombre} (${aeropuerto.ciudad}, ${aeropuerto.pais})` : 'Cargando Aeropuerto...'}
                  </TableCell>
                  <TableCell>{formatDuration(layover.duracion)}</TableCell>
                  {userRole === 'ROLE_ADMIN' && (
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingLayover(layover);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(layover.id)}
                        className="ml-2"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
      {userRole === 'ROLE_ADMIN' && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Escala</DialogTitle>
            </DialogHeader>
            {editingLayover && (
              <EditLayover
                api={api}
                setError={setError}
                layover={editingLayover}
                onSuccess={() => {
                  setIsEditDialogOpen(false);
                  fetchLayovers();
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}

export default LayoverList;
