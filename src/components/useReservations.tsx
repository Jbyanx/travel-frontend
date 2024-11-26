import { useState, useCallback } from 'react';
import { AxiosInstance } from 'axios';

export const useReservations = (api: AxiosInstance, setError: (error: string | null) => void) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const fetchReservations = useCallback(async () => {
    try {
      const response = await api.get('/reservas/misreservas');
      setReservations(response.data);
    } catch (error) {
      setError('Failed to fetch reservations');
    }
  }, [api, setError]);

  const handleUpdate = useCallback(async (id: number, updatedData: Partial<Reservation>) => {
    try {
      await api.put(`/reservas/${id}`, updatedData);
      setError(null);
      fetchReservations();
    } catch (error) {
      setError('Failed to update reservation');
    }
  }, [api, setError, fetchReservations]);

  const handleDelete = useCallback(async (id: number) => {
    try {
      await api.delete(`/reservas/${id}`);
      setError(null);
      fetchReservations();
    } catch (error) {
      setError('Failed to delete reservation');
    }
  }, [api, setError, fetchReservations]);

  return { reservations, fetchReservations, handleUpdate, handleDelete };
};
