import React from 'react'
import { FacebookIcon, TwitterIcon, InstagramIcon } from 'lucide-react'

const Footer: React.FC = () => {
  return (
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
}

export default Footer