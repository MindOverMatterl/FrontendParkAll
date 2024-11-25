// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Importar useNavigate
import { useUser } from '../context/UserContext'; // Importar el hook del contexto

const Navbar = () => {
  const { user, logout } = useUser(); // Obtener el usuario logueado y la función de logout
  const navigate = useNavigate(); // Hook para manejar la redirección

  const handleLogout = () => {
    logout(); // Llama a la función de logout para limpiar el estado
    navigate('/'); // Redirige a la pestaña de estacionamientos publicados
  };

  return (
    <nav className="bg-white shadow-md py-4 px-8">
      <div className="flex items-center justify-between">
        <Link to="/" className="text-2xl font-semibold">ParkAll</Link>
        <div className="space-x-6">
          
          {user ? (
            <>
              <span className="text-sm text-gray-600">Hola, {user.nombre}</span>

              {/* Botón de "Mis Estacionamientos" visible solo si el usuario está logueado */}
              <Link to="/my-parkings" className="text-sm text-gray-600">
                Mis Estacionamientos
              </Link>

              {/* Botón de logout */}
              <button onClick={handleLogout} className="text-sm text-gray-600">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-600">Login</Link>
              <Link to="/register" className="text-sm text-gray-600">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;