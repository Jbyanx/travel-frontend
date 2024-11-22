import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './contexts/AuthContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/Table';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Alert, AlertDescription } from './ui/Alert';
import { Flashlight } from 'lucide-react';

interface Airport{
    id: number;
    nombre: string;
    ciudad: string;
    pais: string;
}

interface Escala{
    id: number;
    aeropuerto: Airport;
    duracion: string;
}

interface Getvuelo{
    id: number;
    origen: string;
    destino: string;
    fechaSalida: string;
    horaSalida: string;
    duracion: string;
    capacidad: number;
    aerolinea: string;
    aeropuertoOrigen: Airport;
    aeropuertoDestino: Airport;
    escalas: Escala[];
}

export function VueloListWithEscalas(){
    const [vuelos, setVuelos] = useState<Getvuelo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchVuelos();
    }, []);

    const fetchVuelos = async () => {
        try{
            const response = await axios.get('http://localhost:8080/api/v1/vuelos');
            setVuelos(response.data);
            setLoading(false);
        } catch(err){
            console.error(err);
            setError('Failed to fetch.');
            setLoading(false);
        }
    };

    if(loading){
        return <div>Loading travels...</div>;
    }

    if(error) {
        return <div>{error}</div>;
    }

    return (
        <Card className="w-full max-w-4xl mx-auto mt-8">
            <CardHeader>
                <CardTitle>Lista de vuelos y Escalas</CardTitle>
            </CardHeader>
            <CardContent>
                <table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Vuelo origen</TableHead>
                            <TableHead>Vuelo estino</TableHead>
                            <TableHead>Fecha de salida</TableHead>
                            <TableHead>Hora de salida</TableHead>
                            <TableHead>Aerolínea</TableHead>
                            <TableHead>Aeropuerto origen</TableHead>
                            <TableHead>Aeropuerto destino</TableHead>
                            <TableHead>Duracion / Escala</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {vuelos.map((vuelo) => ( 
                            <><TableRow key={vuelo.id}>
                                <TableCell>{vuelo.origen}</TableCell>
                                <TableCell>{vuelo.destino}</TableCell>
                                <TableCell>{vuelo.fechaSalida}</TableCell>
                                <TableCell>{vuelo.horaSalida}</TableCell>
                                <TableCell>{vuelo.aerolinea}</TableCell>
                                <TableCell>{vuelo.aeropuertoOrigen.nombre} ({vuelo.aeropuertoOrigen.ciudad}, {vuelo.aeropuertoOrigen.pais})</TableCell>
                                <TableCell>{vuelo.aeropuertoDestino.nombre} ({vuelo.aeropuertoDestino.ciudad}, {vuelo.aeropuertoDestino.pais})</TableCell>
                                <TableCell>{vuelo.escalas.length > 0 ? `${vuelo.escalas.length} escalas(s)`
                                : `Duración: ${vuelo.duracion}`}</TableCell>
                            </TableRow>
                            {vuelo.escalas.map((escala) => (
                                <TableRow key={`escala-${escala.id}`}>
                                    <TableCell colSpan={8}>
                                        Escala en {escala.aeropuerto.nombre} ({escala.aeropuerto.ciudad}, {escala.aeropuerto.pais}) - Duración: {escala.duracion}
                                    </TableCell>
                                </TableRow>
                            ))}
                            </>
                        ))}
                    </TableBody>
                </table>
            </CardContent>
        </Card>
    );
}

export default Flashlight;