// src/context/UserContext.js
import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Cargar el usuario desde localStorage si existe
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const register = (userData) => {
    setUser(userData); // Guardar los datos del usuario
    localStorage.setItem('user', JSON.stringify(userData)); // Persistir el usuario
  };

  const logout = () => {
    setUser(null); // Limpiar los datos del usuario al hacer logout
    localStorage.removeItem('user'); // Eliminar el usuario del almacenamiento
  };

  return (
    <UserContext.Provider value={{ user, register, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook personalizado para acceder al contexto
export const useUser = () => {
  return useContext(UserContext);
};
