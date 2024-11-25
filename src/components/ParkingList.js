import React, { useState, useEffect } from 'react';
import AddParkingModal from './AddParkingModal'; // Importar el modal
import { useUser } from '../context/UserContext'; // Importar el contexto para obtener el usuario logueado

const ParkingList = () => {
  const { user } = useUser(); // Obtener el usuario logueado desde el contexto
  const [parkings, setParkings] = useState([]);
  const [showAddParking, setShowAddParking] = useState(false); // Estado para controlar la visibilidad del modal
  const [error, setError] = useState('');

  // Cargar estacionamientos al iniciar
  useEffect(() => {
    fetch('http://localhost:5000/api/parking/list')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener los estacionamientos');
        }
        return response.json();
      })
      .then((data) => {
        setParkings(data.parkings); // Suponiendo que el backend devuelve un array llamado "parkings"
      })
      .catch((error) => {
        console.error('Error al obtener los estacionamientos:', error);
        setError('No se pudieron cargar los estacionamientos. Inténtalo nuevamente.');
      });
  }, []);

  // Función para manejar la creación de un nuevo estacionamiento
  const handleParkingCreated = () => {
    fetch('http://localhost:5000/api/parking/list')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener los estacionamientos');
        }
        return response.json();
      })
      .then((data) => setParkings(data.parkings))
      .catch((error) => {
        console.error('Error al actualizar la lista de estacionamientos:', error);
        setError('No se pudieron cargar los estacionamientos. Inténtalo nuevamente.');
      });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Lista de Estacionamientos</h1>

      {/* Solo mostrar el botón si el usuario está logueado */}
      {user && (
        <button
          onClick={() => setShowAddParking(true)}
          className="mb-6 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
        >
          Agregar Estacionamiento
        </button>
      )}

      {showAddParking && (
        <AddParkingModal
          onParkingCreated={handleParkingCreated}
          onClose={() => setShowAddParking(false)}
        />
      )}

      {error && <p className="text-red-500">{error}</p>}

      {parkings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {parkings.map((parking) => (
            <div key={parking._id} className="bg-white rounded-lg shadow-lg p-4">
              {/* Mostrar la imagen del estacionamiento si existe */}
              {parking.imagen && (
                <img
                  src={`http://localhost:5000${parking.imagen}`}
                  alt="Estacionamiento"
                  className="w-full h-48 object-cover rounded-t-lg mb-4"
                />
              )}
              <h2 className="text-xl font-semibold mb-2">{parking.descripcion}</h2>
              <p className="text-gray-600">Ubicación: {parking.ubicacion}</p>
              <p className="text-gray-800">Precio: ${parking.precio}</p>
              <p className="text-gray-600">
                Publicado por: <span className="font-medium">{parking.publicador?.nombre || 'Usuario desconocido'}</span>
              </p>
              <p className={`text-sm ${parking.disponible ? 'text-green-500' : 'text-red-500'}`}>
                {parking.disponible ? 'Disponible' : 'Reservado'}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center font-medium">No hay estacionamientos disponibles.</p>
      )}
    </div>
  );
};

export default ParkingList;
