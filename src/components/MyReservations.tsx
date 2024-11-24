import React, { useState, useEffect } from 'react'
import { AxiosInstance } from 'axios'
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/Table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/Dialog"
import { ReservationForm } from './ReservationForm'
import { cn } from "./lib/utils"

interface Reservation {
  id: number;
  idVuelo: number;
  fechaDeReserva: string;
  numeroDePasajeros: number;
}

interface MyReservationsProps {
  api: AxiosInstance;
  setError: (error: string | null) => void;
}

export function MyReservations({ api, setError }: MyReservationsProps) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [isNewReservationDialogOpen, setIsNewReservationDialogOpen] = useState(false);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await api.get('/reservas');
      setReservations(response.data);
    } catch (error) {
      setError('Failed to fetch reservations');
    }
  };

  const handleUpdate = async (id: number, updatedData: Partial<Reservation>) => {
    try {
      await api.put(`/reservas/${id}`, updatedData);
      setError(null);
      fetchReservations();
    } catch (error) {
      setError('Failed to update reservation');
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
        <h2 className="text-xl font-semibold">My Reservations</h2>
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
            <TableHead>Flight ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Passengers</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reservations.map((reservation) => (
            <TableRow key={reservation.id}>
              <TableCell>{reservation.idVuelo}</TableCell>
              <TableCell>{reservation.fechaDeReserva}</TableCell>
              <TableCell>{reservation.numeroDePasajeros}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" onClick={() => setEditingReservation(reservation)}>Edit</Button>
                  </DialogTrigger>
                  <DialogContent className={cn("bg-background", "dark:bg-gray-800")}>
                    <DialogHeader>
                      <DialogTitle>Edit Reservation</DialogTitle>
                    </DialogHeader>
                    {editingReservation && (
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        handleUpdate(editingReservation.id, editingReservation);
                      }} className="space-y-4">
                        <div>
                          <label htmlFor="passengerCount">Number of Passengers</label>
                          <Input
                            id="passengerCount"
                            type="number"
                            min="1"
                            value={editingReservation.numeroDePasajeros}
                            onChange={(e) => setEditingReservation({
                              ...editingReservation,
                              numeroDePasajeros: Number(e.target.value)
                            })}
                          />
                        </div>
                        <Button type="submit">Update</Button>
                      </form>
                    )}
                  </DialogContent>
                </Dialog>
                <Button variant="destructive" onClick={() => handleDelete(reservation.id)} className="ml-2">Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
