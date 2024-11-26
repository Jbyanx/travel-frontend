import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from './contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/Alert';
import { MyReservations } from './MyReservations';
import { AirportList } from './AirportList';
import { AirlineList } from './AirlineList';
import { Navigate } from 'react-router-dom';

export function UserDashboard() {
  const { token, userRole } = useAuth(); 
  const [error, setError] = useState<string | null>(null);

  const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!userRole || userRole.includes('ROLE_ADMIN')) {
    return (
      <div>
        <Alert className="mb-4">
          <AlertTitle>Acceso Denegado</AlertTitle>
          <AlertDescription>Este contenido es exclusivo para usuarios. Contacta al administrador si es un error.</AlertDescription>
        </Alert>
        <Navigate to="/login" replace />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard de Usuario</h1>
      {error && (
        <Alert className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Tabs defaultValue="myReservations" className="w-full">
        <TabsList>
          <TabsTrigger value="myReservations">Mis Reservas</TabsTrigger>
          <TabsTrigger value="airports">Aeropuertos</TabsTrigger>
          <TabsTrigger value="airlines">Aerolíneas</TabsTrigger>
        </TabsList>
        <TabsContent value="myReservations">
          <MyReservations api={api} setError={setError} />
        </TabsContent>
        <TabsContent value="airports">
          <AirportList api={api} setError={setError} userRole={userRole} />
        </TabsContent>
        <TabsContent value="airlines">
          <AirlineList api={api} setError={setError} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
