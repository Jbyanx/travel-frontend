import React from 'react'

const PopularDestinations: React.FC = () => {
  return (
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
}

export default PopularDestinations