import React from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import TravelPage from './components/TravelPage'
import Login from './components/Login'
import SignupForm from './components/SignUpForm'

import { Button } from "./components/ui/Button"
import { Input } from "./components/ui/Input"
import { Select } from "./components/ui/Select"
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/Card"
import { CalendarIcon, MapPinIcon, UserIcon, SearchIcon, FacebookIcon, TwitterIcon, InstagramIcon } from 'lucide-react'

const Navigation = () => (
  <nav className="bg-white shadow-md">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16">
        <div className="flex">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold text-blue-600">AeroViajes</span>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <Link to="/" className="border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
              Inicio
            </Link>
            <Link to="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
              Reservar Vuelos
            </Link>
            <Link to="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
              Mi Cuenta
            </Link>
          </div>
        </div>
        <div className="hidden sm:ml-6 sm:flex sm:items-center">
          <Link to="/login">
            <Button variant="outline">Iniciar Sesión</Button>
          </Link>
          <Link to="/signup">
            <Button className="ml-3">Registrarse</Button>
          </Link>
        </div>
      </div>
    </div>
  </nav>
)

const Hero = () => (
  <div className="relative bg-gray-900 overflow-hidden">
    <div className="max-w-7xl mx-auto">
      <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
        <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
          <div className="sm:text-center lg:text-left">
            <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
              <span className="block xl:inline">Descubre el mundo</span>{' '}
              <span className="block text-blue-400 xl:inline">con un solo clic</span>
            </h1>
            <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
              Explora nuevos destinos, vive experiencias únicas y crea recuerdos inolvidables con nuestras ofertas de vuelos.
            </p>
          </div>
        </main>
      </div>
    </div>
    <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
      <img
        className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
        src="/placeholder.svg?height=1080&width=1920"
        alt="Avión despegando"
      />
    </div>
  </div>
)

const SearchForm = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
    <Card className="bg-white shadow-lg">
      <CardContent className="p-6">
        <form className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label htmlFor="origin" className="block text-sm font-medium text-gray-700">Origen</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPinIcon className="h-5 w-5 text-gray-400" />
                </div>
                <Input id="origin" type="text" placeholder="Ciudad de origen" className="pl-10" />
              </div>
            </div>
            <div>
              <label htmlFor="destination" className="block text-sm font-medium text-gray-700">Destino</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPinIcon className="h-5 w-5 text-gray-400" />
                </div>
                <Input id="destination" type="text" placeholder="Ciudad de destino" className="pl-10" />
              </div>
            </div>
            <div>
              <label htmlFor="departure" className="block text-sm font-medium text-gray-700">Fecha de ida</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                </div>
                <Input id="departure" type="date" className="pl-10" />
              </div>
            </div>
            <div>
              <label htmlFor="return" className="block text-sm font-medium text-gray-700">Fecha de vuelta</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                </div>
                <Input id="return" type="date" className="pl-10" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label htmlFor="passengers" className="block text-sm font-medium text-gray-700">Pasajeros</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <Select id="passengers">
                  <option>1 Pasajero</option>
                  <option>2 Pasajeros</option>
                  <option>3 Pasajeros</option>
                  <option>4+ Pasajeros</option>
                </Select>
              </div>
            </div>
            <div className="lg:col-span-3 flex items-end">
              <Button className="w-full" size="lg">
                <SearchIcon className="mr-2 h-5 w-5" />
                Buscar Vuelos
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
)

const PromotionsAndOffers = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
    <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Promociones y Ofertas Destacadas</h2>
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[
        { title: "Vuelos a Europa", description: "Descubre las maravillas del viejo continente", price: "desde $599" },
        { title: "Escapadas de fin de semana", description: "Relájate con nuestras ofertas de última hora", price: "desde $199" },
        { title: "Vuelos Intercontinentales", description: "Explora nuevos horizontes a precios increíbles", price: "desde $799" },
      ].map((promo, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{promo.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{promo.description}</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">{promo.price}</p>
            <Button className="mt-4" variant="outline">Ver oferta</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
)

const PopularDestinations = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
    <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Destinos Populares</h2>
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {["París", "Nueva York", "Tokio", "Río de Janeiro", "Londres", "Sídney", "Roma", "Bangkok"].map((city, index) => (
        <div key={index} className="relative">
          <img
            src={`/placeholder.svg?height=300&width=400&text=${city}`}
            alt={city}
            className="w-full h-48 object-cover rounded-lg shadow-md"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-lg">
            <span className="text-white text-xl font-bold">{city}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
)

const Footer = () => (
  <footer className="bg-gray-800 mt-12">
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-center space-x-6">
        <a href="#" className="text-gray-400 hover:text-gray-300">
          <span className="sr-only">Facebook</span>
          <FacebookIcon className="h-6 w-6" />
        </a>
        <a href="#" className="text-gray-400 hover:text-gray-300">
          <span className="sr-only">Twitter</span>
          <TwitterIcon className="h-6 w-6" />
        </a>
        <a href="#" className="text-gray-400 hover:text-gray-300">
          <span className="sr-only">Instagram</span>
          <InstagramIcon className="h-6 w-6" />
        </a>
      </div>
      <div className="mt-8 text-center text-base text-gray-400">
        &copy; 2023 AeroViajes. Todos los derechos reservados.
      </div>
    </div>
  </footer>
)

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <SearchForm />
              <PromotionsAndOffers />
              <PopularDestinations />
            </>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignupForm />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App