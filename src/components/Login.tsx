import React, { useState } from 'react';
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/Alert";
import { Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

interface LoginData {
  correoElectronico: string;
  password: string;
}

interface JwtResponse {
  token: string;
  type: string;
  username: string;
  roles: string[];
}

const Login: React.FC = () => {
  const [loginData, setLoginData] = useState<LoginData>({
    correoElectronico: '',
    password: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Error al iniciar sesión');
      }

      const data: JwtResponse = await response.json();
      if (data.token) {
        const role = data.roles.includes('ROLE_ADMIN') ? 'ROLE_ADMIN' : 'ROLE_USER';
        login(data.token, loginData.correoElectronico, data.roles);
        if (role === 'ROLE_ADMIN') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        throw new Error('Token JWT no encontrado en la respuesta');
      }
      
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError((error as Error).message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-[350px] mx-auto mt-10">
      <CardHeader>
        <CardTitle>Iniciar Sesión</CardTitle>
        <CardDescription>Ingresa tus credenciales para acceder</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="correoElectronico">Correo electrónico</Label>
              <Input
                id="correoElectronico"
                name="correoElectronico"
                type="email"
                placeholder="tu@email.com"
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <CardFooter className="flex justify-between mt-4 p-0">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cargando
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
      {error && (
        <Alert className="mt-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <CardFooter className="flex justify-center mt-4">
        <p>
          ¿Aún no tienes cuenta?{' '}
          <Link to="/signup" className="text-blue-500 hover:text-blue-700">
            Regístrate
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default Login;

