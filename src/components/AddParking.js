import React, { useState } from 'react';
import { useUser } from '../context/UserContext'; // Para obtener el usuario autenticado

const AddParking = ({ onParkingCreated }) => {
  const { user } = useUser(); // Obtener el usuario logueado
  const [descripcion, setDescripcion] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [precio, setPrecio] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que todos los campos estén completos
    if (!descripcion || !ubicacion || !precio) {
      setError('Todos los campos son requeridos');
      return;
    }

    // Validar que el precio sea un número positivo
    if (isNaN(precio) || parseFloat(precio) <= 0) {
      setError('El precio debe ser un número válido y positivo');
      return;
    }

    // Enviar los datos al backend para crear el estacionamiento
    try {
      const response = await fetch('http://localhost:5000/api/parking/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          descripcion,
          ubicacion,
          precio,
          publicadorId: user._id, // Aquí debes enviar el _id de MongoDB del usuario
        }),
      });

      const data = await response.json();
      if (data.message === 'Estacionamiento creado exitosamente') {
        onParkingCreated(); // Callback para actualizar la lista de estacionamientos
        setDescripcion('');
        setUbicacion('');
        setPrecio('');
        setError('');
      } else {
        setError('Error al crear el estacionamiento');
      }
    } catch (error) {
      setError('Error de conexión');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Agregar Estacionamiento</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <input
            type="text"
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="ubicacion" className="block text-sm font-medium text-gray-700">
            Ubicación
          </label>
          <input
            type="text"
            id="ubicacion"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="precio" className="block text-sm font-medium text-gray-700">
            Precio
          </label>
          <input
            type="number"
            id="precio"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
          Crear Estacionamiento
        </button>
      </form>
    </div>
  );
};

export default AddParking;
