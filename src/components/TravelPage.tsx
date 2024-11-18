import { Button } from "../components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card"
import { PlaneTakeoff, UserPlus, LogIn } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function TravelPage() {
  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center p-4" style={{backgroundImage: "url('/placeholder.svg?height=1080&width=1920')"}}>
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-800 flex items-center justify-center">
            <PlaneTakeoff className="mr-2" />
            Travel
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Descubre nuevos destinos y vive experiencias inolvidables
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-gray-700">
            Para acceder a las mejores ofertas y gestionar tus reservas, por favor inicia sesión o regístrate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="w-full sm:w-auto flex items-center justify-center" variant="outline">
              <Link to="/signup">
                <UserPlus className="mr-2 h-4 w-4" />
                Registrarse
              </Link>
            </Button>
            <Button asChild className="w-full sm:w-auto flex items-center justify-center">
              <Link to="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Iniciar Sesión
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}