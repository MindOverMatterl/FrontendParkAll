import React, { useState } from 'react';
import { useUser } from '../context/UserContext'; // Para obtener el ID del usuario logueado

const ReservaParking = ({ parkingId, onReservaExito }) => {
  const { user } = useUser(); // Obtener el ID del usuario logueado
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReserva = async () => {
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/parking/reserve/${parkingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,  // El ID del usuario logueado
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
        onReservaExito();  // Llamamos a la función para actualizar la lista de estacionamientos
        setError('');
      } else {
        setError(data.message || 'No se pudo crear la reserva');
      }
    } catch (error) {
      setError('Error de conexión');
    }

    setLoading(false);
  };

  return (
    <div>
      {loading ? (
        <p>Reservando...</p>
      ) : (
        <button
          onClick={handleReserva}
          className="bg-blue-500 text-white py-2 px-4 rounded-md"
        >
          Reservar Estacionamiento
        </button>
      )}

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default ReservaParking;
