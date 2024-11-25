import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';

const MyParkings = () => {
  const { user } = useUser(); // Obtener el usuario logueado
  const [parkings, setParkings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedParking, setSelectedParking] = useState(null); // Estacionamiento seleccionado para editar
  const [isModalOpen, setIsModalOpen] = useState(false); // Controlar la visibilidad del modal

  useEffect(() => {
    if (user && user._id) {
      const sanitizedUserId = user._id;

      const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(sanitizedUserId);
      if (!isValidObjectId) {
        setError('ID de usuario inválido. No se pueden cargar los estacionamientos.');
        return;
      }

      setIsLoading(true);

      fetch(`http://localhost:5000/api/parking/user/${sanitizedUserId}/parkings`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Error al obtener los estacionamientos');
          }
          return response.json();
        })
        .then((data) => {
          setParkings(data.parkings || []);
          setError(null);
        })
        .catch((error) => {
          console.error('Error al obtener los estacionamientos:', error);
          setError('No se pudieron cargar los estacionamientos. Inténtalo nuevamente.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setError('No se encontró un usuario válido. Por favor, inicia sesión.');
    }
  }, [user]);

  // Manejar la apertura del modal de edición
  const handleEditClick = (parking) => {
    setSelectedParking(parking); // Establecer el estacionamiento seleccionado
    setIsModalOpen(true); // Abrir el modal
  };

  // Manejar el envío del formulario de edición
  const handleEditSubmit = async (e) => {
  e.preventDefault();

  if (!selectedParking) return;

  const formData = new FormData();
  formData.append('descripcion', selectedParking.descripcion);
  formData.append('ubicacion', selectedParking.ubicacion);
  formData.append('precio', selectedParking.precio);
  if (selectedParking.newImage) {
    formData.append('imagen', selectedParking.newImage);
  }

  try {
    const response = await fetch(`http://localhost:5000/api/parking/edit/${selectedParking._id}`, {
      method: 'PUT',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Error al actualizar el estacionamiento');
    }

    const data = await response.json();
    setParkings((prevParkings) =>
      prevParkings.map((parking) =>
        parking._id === data.parking._id ? data.parking : parking
      )
    );
    setIsModalOpen(false);
    setSelectedParking(null);
  } catch (error) {
    console.error('Error al actualizar el estacionamiento:', error);
    alert('No se pudo actualizar el estacionamiento. Inténtalo nuevamente.');
  }
};

  // Manejar la eliminación de un estacionamiento
  const handleDelete = (parkingId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este estacionamiento?')) {
      return;
    }

    fetch(`http://localhost:5000/api/parking/delete/${parkingId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${user.token}`, // Asegúrate de incluir el token de autenticación
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al eliminar el estacionamiento');
        }
        return response.json();
      })
      .then(() => {
        // Actualizar la lista de estacionamientos después de eliminar
        setParkings((prevParkings) => prevParkings.filter((parking) => parking._id !== parkingId));
      })
      .catch((error) => {
        console.error('Error al eliminar el estacionamiento:', error);
        alert('No se pudo eliminar el estacionamiento. Inténtalo nuevamente.');
      });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Mis Estacionamientos</h1>

      {isLoading && <p className="text-blue-600 text-center font-medium">Cargando estacionamientos...</p>}
      {error && <p className="text-red-600 text-center font-medium">{error}</p>}

      {!isLoading && !error && parkings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {parkings.map((parking) => (
            <div key={parking._id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">{parking.descripcion}</h2>
              <p className="text-gray-500">
                <strong>Ubicación:</strong> {parking.ubicacion}
              </p>
              <p className="text-gray-500">
                <strong>Precio:</strong> ${parking.precio}
              </p>
              <p className="text-gray-500">
                <strong>Disponible:</strong> {parking.disponible ? 'Sí' : 'No'}
              </p>
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={() => handleEditClick(parking)}
                  className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(parking._id)}
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !isLoading && !error && <p className="text-gray-600 text-center font-medium">No hay estacionamientos disponibles.</p>
      )}

      {/* Modal para editar estacionamiento */}
      {isModalOpen && selectedParking && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4">Editar Estacionamiento</h2>
      <form onSubmit={handleEditSubmit}>
        {/* Campos existentes */}
        {/* ... */}

        {/* Campo para actualizar la imagen */}
        <div className="mb-4">
          <label className="block text-gray-700">Imagen</label>
          {selectedParking.imagen && (
            <img
              src={`http://localhost:5000/${selectedParking.imagen}`}
              alt="Estacionamiento"
              className="w-full h-40 object-cover rounded-md mb-2"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              setSelectedParking({
                ...selectedParking,
                newImage: file,
                previewImage: URL.createObjectURL(file)
              });
            }}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Botones existentes */}
        {/* ... */}
      </form>
    </div>
  </div>
)}
    </div>
  );
};

export default MyParkings;
