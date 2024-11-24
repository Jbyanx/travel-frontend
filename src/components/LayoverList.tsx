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
  aeropuerto: {
    id: number;
    nombre: string;
    ciudad: string;
    pais: string;
  };
  idVuelo: number;
  duracion: {
    seconds: number;
  };
}

interface LayoverListProps {
  api: any;
  setError: (error: string | null) => void;
}

export function LayoverList({ api, setError }: LayoverListProps) {
  const [layovers, setLayovers] = useState<Layover[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingLayover, setEditingLayover] = useState<Layover | null>(null);
  const { userRole } = useAuth();

  useEffect(() => {
    fetchLayovers();
  }, []);

  const fetchLayovers = async () => {
    try {
      const response = await api.get('/escalas');
      setLayovers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching layovers:', error);
      setError('Failed to fetch layovers');
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this layover?')) {
      try {
        await api.delete(`/escalas/${id}`);
        setError(null);
        fetchLayovers();
      } catch (error) {
        console.error('Error deleting layover:', error);
        setError('Failed to delete layover. Please try again later.');
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
              <TableHead>ID de Vuelo</TableHead>
              <TableHead>Aeropuerto</TableHead>
              <TableHead>Duración (segundos)</TableHead>
              {userRole === 'ROLE_ADMIN' && <TableHead>Acciones</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {layovers.map((layover) => (
              <TableRow key={layover.id}>
                <TableCell>{layover.idVuelo}</TableCell>
                <TableCell>{layover.aeropuerto.nombre} ({layover.aeropuerto.ciudad}, {layover.aeropuerto.pais})</TableCell>
                <TableCell>{layover.duracion.seconds}</TableCell>
                {userRole === 'ROLE_ADMIN' && (
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => {
                      setEditingLayover(layover);
                      setIsEditDialogOpen(true);
                    }}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(layover.id)} className="ml-2">
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

