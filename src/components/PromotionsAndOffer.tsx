import React from 'react'
import { Button } from "./ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card"

const PromotionsAndOffers: React.FC = () => {
  return (
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
}

export default PromotionsAndOffers