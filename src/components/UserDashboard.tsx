import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from './contexts/AuthContext'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/Tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card"
import { Alert, AlertDescription, AlertTitle } from "../components/ui/Alert"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Label } from "../components/ui/Label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/Table"
import { ReservationForm } from './ReservationForm'
import { MyReservations } from './MyReservations'
import { AirportList } from './AirportList'
import { AirlineList } from './AirlineList'

export function UserDashboard() {
  const { token } = useAuth(); // Ahora está dentro del componente
  const [error, setError] = useState<string | null>(null);

  // Create an axios instance with the bearer token
  const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard de Usuario</h1>
      {error && (
        <Alert className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Tabs defaultValue="reservations" className="w-full">
        <TabsList>
          <TabsTrigger value="reservations">Hacer Reserva</TabsTrigger>
          <TabsTrigger value="myReservations">Mis Reservas</TabsTrigger>
          <TabsTrigger value="airports">Aeropuertos</TabsTrigger>
          <TabsTrigger value="airlines">Aerolíneas</TabsTrigger>
        </TabsList>
        <TabsContent value="reservations">
          <ReservationForm api={api} setError={setError} />
        </TabsContent>
        <TabsContent value="myReservations">
          <MyReservations api={api} setError={setError} />
        </TabsContent>
        <TabsContent value="airports">
          <AirportList api={api} setError={setError} />
        </TabsContent>
        <TabsContent value="airlines">
          <AirlineList api={api} setError={setError} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
