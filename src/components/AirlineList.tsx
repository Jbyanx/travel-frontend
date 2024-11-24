import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from './contexts/AuthContext'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/Table"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import { Alert, AlertDescription } from "../components/ui/Alert"
import { Button } from "./ui/Button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/Dialog"
import { Pencil, Trash2 } from 'lucide-react'
import CreateAerolinea from './CreateAerolinea'
import EditAerolinea from './EditAerolinea'

interface Airline {
  id: number;
  nombre: string;
  codigo: number;
  pais: string;
}

import { Dispatch, SetStateAction } from 'react';

interface AirlineListProps {
  api: any;
  setError: Dispatch<SetStateAction<string | null>>;
}

export function AirlineList({ api, setError }: AirlineListProps) {
  const { userRole, token } = useAuth();
  const [airlines, setAirlines] = useState<Airline[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAirline, setEditingAirline] = useState<Airline | null>(null);

  useEffect(() => {
    fetchAirlines();
  }, []);

  const fetchAirlines = async () => {
    try {
      const response = await api.get('/aerolineas', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAirlines(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching airlines:', error);
      setError('Failed to fetch airlines. Please try again later.');
      setLoading(false);
    }
  };

  const handleEdit = (airline: Airline) => {
    setEditingAirline(airline);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this airline?')) {
      try {
        await api.delete(`/aerolineas/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Airline deleted successfully');
        fetchAirlines();
      } catch (error) {
        console.error('Error deleting airline:', error);
        setError('Failed to delete airline. Please try again later.');
      }
    }
  };

  if (loading) {
    return <div>Loading airlines...</div>;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8">
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Lista de Aerolíneas</CardTitle>
        {userRole === 'ROLE_ADMIN' && (
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
                {userRole === 'ROLE_ADMIN' && <TableHead>Acciones</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {airlines.map((airline) => (
                <TableRow key={airline.id}>
                  <TableCell>{airline.nombre}</TableCell>
                  <TableCell>{airline.codigo}</TableCell>
                  <TableCell>{airline.pais}</TableCell>
                  {userRole === 'ROLE_ADMIN' && (
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(airline)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(airline.id)} className="ml-2">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </TableCell>
                  )}
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
      {userRole === 'ROLE_ADMIN' && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Aerolínea</DialogTitle>
            </DialogHeader>
            {editingAirline && (
              <EditAerolinea
                api={api}
                setError={setError}
                airline={editingAirline}
                onSuccess={() => {
                  setIsEditDialogOpen(false);
                  fetchAirlines();
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      )}
    </Card>
  )
}

