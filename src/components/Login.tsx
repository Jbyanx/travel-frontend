import React, { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Label } from "../components/ui/Label"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import { Alert, AlertDescription } from "../components/ui/Alert"
import axios from 'axios';

interface LoginRequest {
  correoElectronico: string;
  password: string;
}

interface JwtResponse {
  token: string;
  type: string;
  email: string;
  roles: string[];
}

export const Login: React.FC = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginRequest>({ correoElectronico: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post<JwtResponse>('http://localhost:8080/api/v1/auth/login', formData);
      console.log('Login response:', response.data);
      login(response.data.token, response.data.roles);
      if (response.data.roles.includes('ROLE_ADMIN')) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Credenciales incorrectas o error en el servidor.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Iniciar Sesión</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="correoElectronico">Correo Electrónico</Label>
              <Input
                id="correoElectronico"
                type="email"
                value={formData.correoElectronico}
                onChange={(e) => setFormData({ ...formData, correoElectronico: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Iniciar Sesión
            </Button>
          </form>
          <p className="text-center mt-4">
            ¿No tienes una cuenta?{' '}
            <a href="/signup" className="text-blue-500 hover:underline">
              Regístrate
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

