import React from 'react'
import { Button } from "./ui/Button"
import { Input } from "./ui/Input"
import { Select } from "./ui/Select"
import { Card, CardContent } from "./ui/Card"
import { CalendarIcon, MapPinIcon, UserIcon, SearchIcon } from 'lucide-react'

const SearchForm: React.FC = () => {
  return (
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
}

export default SearchForm