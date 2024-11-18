import { useState } from 'react';
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Alert, AlertDescription } from "../components/ui/Alert";
import { Link } from 'react-router-dom'; // Para redirigir al login

export default function SignupForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: "",
    correoElectronico: "",
    password: ""
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSuccess, setIsSuccess] = useState(false); // Estado para controlar el éxito del registro

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (formData.nombre.length < 2) newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    if (formData.apellido.length < 2) newErrors.apellido = 'El apellido debe tener al menos 2 caracteres';
    if (formData.direccion.length < 5) newErrors.direccion = 'La dirección debe tener al menos 5 caracteres';
    if (!/^\d{9,}$/.test(formData.telefono)) newErrors.telefono = 'El teléfono debe tener al menos 9 dígitos';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correoElectronico)) newErrors.correoElectronico = 'Correo electrónico inválido';
    if (formData.password.length < 8) newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/signup", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMessage('Registro exitoso!');
        setIsSuccess(true); // Indicamos que el registro fue exitoso

        // Restablecemos el formulario después del registro
        setFormData({
          nombre: "",
          apellido: "",
          direccion: "",
          telefono: "",
          correoElectronico: "",
          password: ""
        });

        // Esperamos 3 segundos antes de redirigir al login
        setTimeout(() => {
          window.location.href = "/login"; // Redirige a la página de login
        }, 3000);
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "Error en el registro");
      }
    } catch (error) {
      setMessage("Error en la conexión");
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
          {['nombre', 'apellido', 'direccion', 'telefono', 'correoElectronico', 'password'].map((field) => (
            <div key={field}>
              <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
              <Input
                id={field}
                type={field === 'password' ? 'password' : field === 'correoElectronico' ? 'email' : 'text'}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
                className={errors[field] ? 'border-red-500' : ''}
              />
              {errors[field] && <p className="text-red-500 text-xs italic">{errors[field]}</p>}
            </div>
          ))}
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Procesando...' : 'Registrarse'}
          </Button>
        </form>

        {message && (
          <Alert className={`mt-4 ${message.includes('Error') ? 'bg-red-100 border-red-400 text-red-700' : 'bg-green-100 border-green-400 text-green-700'}`}>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {isSuccess && !isLoading && (
          <div className="mt-4 text-center">
            <p className="text-green-500">¡Registro exitoso! Serás redirigido al inicio de sesión en unos segundos.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
