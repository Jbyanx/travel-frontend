import React, { useState, useRef, useEffect } from 'react'
import { Button } from "./ui/Button"
import { ChevronLeft, ChevronRight } from 'lucide-react'

const PopularDestinations: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const cities = ["París", "Nueva York", "Tokio", "Río de Janeiro", "Londres", "Sídney", "Roma", "Bangkok"]

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef
      const scrollAmount = direction === 'left' ? -current.offsetWidth : current.offsetWidth
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const checkScroll = () => {
    if (scrollRef.current) {
      const { current } = scrollRef
      setCanScrollLeft(current.scrollLeft > 0)
      setCanScrollRight(current.scrollLeft < current.scrollWidth - current.clientWidth)
    }
  }

  useEffect(() => {
    const { current } = scrollRef
    if (current) {
      current.addEventListener('scroll', checkScroll)
      window.addEventListener('resize', checkScroll)
      checkScroll()
    }
    return () => {
      if (current) {
        current.removeEventListener('scroll', checkScroll)
      }
      window.removeEventListener('resize', checkScroll)
    }
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Destinos Populares</h2>
      <div className="relative">
        <Button 
          variant="outline" 
          size="icon" 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10"
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div 
          ref={scrollRef} 
          className="flex overflow-x-auto space-x-4 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {cities.map((city, index) => (
            <div key={index} className="flex-none w-64">
              <div className="relative">
                <img
                  src={`/placeholder.svg?height=300&width=400&text=${city}`}
                  alt={city}
                  className="w-full h-48 object-cover rounded-lg shadow-md"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-lg">
                  <span className="text-white text-xl font-bold">{city}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10"
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default PopularDestinations