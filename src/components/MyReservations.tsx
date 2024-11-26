import React, { useState, useEffect } from 'react';
import { AxiosInstance } from 'axios';
import { Button } from "../components/ui/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/Table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/Dialog";
import { ReservationForm } from './ReservationForm';
import { cn } from "./lib/utils";

interface Reservation {
  id: number;
  idVuelo: number;
  fechaDeReserva: string;
  numeroDePasajeros: number;
  origen: string;
  destino: string;
  userId: number; 
}

interface MyReservationsProps {
  api: AxiosInstance;
  setError: (error: string | null) => void;
  userRole: string;
  currentUserId: number; 
}

export function MyReservations({ api, setError, userRole, currentUserId }: MyReservationsProps) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isNewReservationDialogOpen, setIsNewReservationDialogOpen] = useState(false);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const endpoint = userRole && userRole.includes('ROLE_ADMIN') 
        ? '/reservas' 
        : '/reservas/misreservas';  

      const response = await api.get(endpoint);
      const updatedReservations = await Promise.all(response.data.map(async (reservation: Reservation) => {
        
        const flightResponse = await api.get(`/vuelos/${reservation.idVuelo}`);
        return {
          ...reservation,
          origen: flightResponse.data.origen,
          destino: flightResponse.data.destino
        };
      }));

      setReservations(updatedReservations);
    } catch (error) {
      setError('Failed to fetch reservations');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/reservas/${id}`);
      setError(null);
      fetchReservations();
    } catch (error) {
      setError('Failed to delete reservation');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{userRole && userRole.includes('ROLE_ADMIN') ? 'All Reservations' : 'My Reservations'}</h2>
        <Dialog open={isNewReservationDialogOpen} onOpenChange={setIsNewReservationDialogOpen}>
          <DialogTrigger asChild>
            <Button>New Reservation</Button>
          </DialogTrigger>
          <DialogContent className={cn("bg-background", "dark:bg-gray-800")}>
            <DialogHeader>
              <DialogTitle>Create New Reservation</DialogTitle>
            </DialogHeader>
            <ReservationForm 
              api={api} 
              setError={setError} 
              onSuccess={() => {
                setIsNewReservationDialogOpen(false);
                fetchReservations();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Flight (Origin - Destination)</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Passengers</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reservations.map((reservation) => (
            <TableRow key={reservation.id}>
              <TableCell>{reservation.origen} - {reservation.destino}</TableCell>
              <TableCell>{reservation.fechaDeReserva}</TableCell>
              <TableCell>{reservation.numeroDePasajeros}</TableCell>
              <TableCell>
                {(userRole && userRole.includes('ROLE_ADMIN')) || (reservation.userId === currentUserId) ? (
                  <Button variant="destructive" onClick={() => handleDelete(reservation.id)} className="ml-2">Delete</Button>
                ) : null}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
