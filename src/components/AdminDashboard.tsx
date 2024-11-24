import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from './contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/Alert';
import { AirportList } from './AirportList';
import { AirlineList } from './AirlineList';
import { FlightList } from './FlightList';
import { LayoverList } from './LayoverList';
import { Navigate } from 'react-router-dom';

export function AdminDashboard() {
  const { token, userRole } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    headers: {
      Authorization: `Bearer ${token}`,
    },
});

  if (!userRole || !userRole.includes('ROLE_ADMIN')) {
    return (
      <div>
        <Alert className="mb-4">
          <AlertTitle>Acceso Denegado</AlertTitle>
          <AlertDescription>No tienes permisos para acceder a este contenido. Contacta al administrador.</AlertDescription>
        </Alert>
        <Navigate to="/login" replace />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard de Administrador</h1>
      {error && (
        <Alert className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="flights" className="w-full">
        <TabsList>
          <TabsTrigger value="flights">Vuelos</TabsTrigger>
          <TabsTrigger value="layovers">Escalas</TabsTrigger>
          <TabsTrigger value="airports">Aeropuertos</TabsTrigger>
          <TabsTrigger value="airlines">Aerolíneas</TabsTrigger>
        </TabsList>

        <TabsContent value="flights">
          <FlightList api={api} setError={setError} />
        </TabsContent>

        <TabsContent value="layovers">
          <LayoverList api={api} setError={setError} />
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

export default AdminDashboard;

