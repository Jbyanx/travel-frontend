import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useAuth } from './contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/Tabs"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Alert, AlertDescription, AlertTitle} from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/Table";
import { AirportList } from './AirportList';
import { AirlineList } from './AirlineList';
import CreateVuelo from './CreateVuelo';
import FlightList from './FlightList';
import CreateAerolinea from './CreateAerolinea'; 
import CreateAeropuerto from './CreateAeropuerto';

export function AdminDashboard() {
  const { token } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font mb-4">DashBoard de Administrador</h1>
      {error && (
        <Alert className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="flights" className="w-full">
        <TabsList>
          <TabsTrigger value="flights">Vuelos</TabsTrigger>
          <TabsTrigger value="airports">Aeropuertos</TabsTrigger>
          <TabsTrigger value="airlines">Aerolíneas</TabsTrigger>
          <TabsTrigger value="createFlight">Crear Vuelo</TabsTrigger>
          <TabsTrigger value="createAirline">Crear Aerolinea</TabsTrigger>
          <TabsTrigger value="createAirport">Crear Aeropuerto</TabsTrigger>
        </TabsList>

        <TabsContent value="flights">
          <FlightList api={api} setError={setError} />
        </TabsContent>

        <TabsContent value="airports">
          <AirportList api={api} setError={setError} />
        </TabsContent>

        <TabsContent value="airlines">
          <AirlineList api={api} setError={setError} />
        </TabsContent>

        <TabsContent value="createFlight">
          <CreateVuelo api={api} setError={setError} />
        </TabsContent>

        <TabsContent value="createAirline"> 
          <CreateAerolinea api={api} setError={setError} />
        </TabsContent>

        <TabsContent value="createAirport"> 
          <CreateAeropuerto api={api} setError={setError} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AdminDashboard;


