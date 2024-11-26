import React from 'react';
import './styles/globals.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/contexts/AuthContext';
import Navigation from './components/Navigation';
import { Login } from './components/Login';
import { Signup as SignupForm } from './components/SignUpForm';
import { UserDashboard } from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';
import PromotionsAndOffers from './components/PromotionsAndOffers';
import PopularDestinations from './components/PopularDestinations';

const ProtectedRoute: React.FC<{ element: React.ReactElement, allowedRole: string }> = ({ element, allowedRole }) => {
  const { isLoggedIn, userRole } = useAuth();
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (userRole !== allowedRole) {
    return <Navigate to={userRole === 'ROLE_ADMIN' ? '/admin' : '/dashboard'} replace />;
  }

  return element;
};

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
            <div className="mt-5 sm:mt-8 flex justify-center lg:justify-start">
              <a
                href="/login"
                className="rounded-md shadow bg-blue-500 text-white px-6 py-3 text-base font-medium hover:bg-blue-600"
              >
                Iniciar Sesión
              </a>
              <a
                href="/signup"
                className="ml-4 rounded-md shadow bg-gray-200 text-gray-900 px-6 py-3 text-base font-medium hover:bg-gray-300"
              >
                Registrarse
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
    <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
      <img
        className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
        src="https://ibiza.travel/wp-content/uploads/2017/09/avion-despegando.jpg"
        alt="Avión despegando"
      />
    </div>
  </div>
);

const Home: React.FC = () => (
  <>
    <Hero />
    <PromotionsAndOffers />
    <PopularDestinations />
  </>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route 
              path="/dashboard" 
              element={<ProtectedRoute element={<UserDashboard />} allowedRole="ROLE_USER" />} 
            />
            <Route 
              path="/admin" 
              element={<ProtectedRoute element={<AdminDashboard />} allowedRole="ROLE_ADMIN" />} 
            />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;

