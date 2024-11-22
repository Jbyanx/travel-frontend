import React, { useState } from 'react';
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Alert, AlertDescription } from "../components/ui/Alert";
import { Link, useNavigate } from 'react-router-dom';

const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: "",
    correoElectronico: "",
    password: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (formData.nombre.trim().length < 2) newErrors.nombre = "El nombre debe tener al menos 2 caracteres";
    if (formData.apellido.trim().length < 2) newErrors.apellido = "El apellido debe tener al menos 2 caracteres";
    if (formData.direccion.trim().length < 5) newErrors.direccion = "La dirección debe tener al menos 5 caracteres";
    if (!/^\d{9,}$/.test(formData.telefono)) newErrors.telefono = "El teléfono debe contener al menos 9 dígitos";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correoElectronico)) newErrors.correoElectronico = "Correo electrónico inválido";
    if (formData.password.length < 8) newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage("¡Registro exitoso! Redirigiendo...");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "Error en el registro");
      }
    } catch (error) {
      setMessage("Error en la conexión con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Registro</CardTitle>
        <CardDescription>Crea tu cuenta para acceder a nuestros servicios</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: "nombre", label: "Nombre", type: "text" },
            { name: "apellido", label: "Apellido", type: "text" },
            { name: "direccion", label: "Dirección", type: "text" },
            { name: "telefono", label: "Teléfono", type: "text" },
            { name: "correoElectronico", label: "Correo Electrónico", type: "email" },
            { name: "password", label: "Contraseña", type: "password" },
          ].map((field) => (
            <div key={field.name}>
              <Label htmlFor={field.name}>{field.label}</Label>
              <Input
                id={field.name}
                name={field.name}
                type={field.type}
                value={formData[field.name]}
                onChange={handleChange}
                disabled={isLoading}
                required
                className={errors[field.name] ? "border-red-500" : ""}
              />
              {errors[field.name] && <p className="text-red-500 text-xs">{errors[field.name]}</p>}
            </div>
          ))}
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Procesando..." : "Registrarse"}
          </Button>
        </form>
        {message && (
          <Alert
            className={`mt-4 ${
              message.includes("Error") ? "bg-red-100 border-red-400 text-red-700" : "bg-green-100 border-green-400 text-green-700"
            }`}
          >
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-blue-500 hover:text-blue-700">
              Inicia sesión
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignupForm;
