import React, { useState } from 'react';
import { useUser } from '../context/UserContext'; // Para obtener el usuario autenticado

const AddParkingModal = ({ onParkingCreated, onClose }) => {
  const { user } = useUser(); // Obtener el usuario logueado
  const [descripcion, setDescripcion] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [precio, setPrecio] = useState('');
  const [imagen, setImagen] = useState(null); // Nuevo estado para la imagen
  const [previewImage, setPreviewImage] = useState(null); // Para vista previa de la imagen
  const [error, setError] = useState('');

  // Manejar el cambio de la imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
      setPreviewImage(URL.createObjectURL(file)); // Crear una URL para la vista previa
    }
  };

  // Manejar el envío del formulario
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

    // Crear un objeto FormData para enviar los datos al backend
    const formData = new FormData();
    formData.append('descripcion', descripcion);
    formData.append('ubicacion', ubicacion);
    formData.append('precio', precio);
    formData.append('publicadorId', user._id); // ID del usuario logueado
    if (imagen) {
      formData.append('imagen', imagen); // Agregar la imagen al FormData
    }

    // Enviar los datos al backend
    try {
      const response = await fetch('http://localhost:5000/api/parking/create', {
        method: 'POST',
        body: formData, // Enviar FormData
      });

      const data = await response.json();
      if (data.message === 'Estacionamiento creado exitosamente') {
        onParkingCreated(); // Callback para actualizar la lista de estacionamientos
        setDescripcion('');
        setUbicacion('');
        setPrecio('');
        setImagen(null);
        setPreviewImage(null);
        setError('');
        onClose(); // Cierra el modal
      } else {
        setError('Error al crear el estacionamiento');
      }
    } catch (error) {
      setError('Error de conexión');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Agregar Estacionamiento</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          {/* Campo de descripción */}
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

          {/* Campo de ubicación */}
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

          {/* Campo de precio */}
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

          {/* Campo para subir imagen */}
          <div className="mb-4">
            <label htmlFor="imagen" className="block text-sm font-medium text-gray-700">
              Imagen del estacionamiento
            </label>
            <input
              type="file"
              id="imagen"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            {/* Vista previa de la imagen */}
            {previewImage && (
              <div className="mt-2">
                <img
                  src={previewImage}
                  alt="Vista previa"
                  className="w-full h-40 object-cover rounded-md"
                />
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddParkingModal;
