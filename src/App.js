import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from './components/Navbar';
import ParkingList from "./components/ParkingList";
import Login from './components/Login';
import Register from './components/Register';
import MyParkings from './components/MyParkings'; // Importar el componente MyParkings
//import FileUpload from '../../FileUpload'; // Importar el componente FileUpload
import { UserProvider } from './context/UserContext'; // Importar el UserProvider

function App() {
  return (
    <UserProvider> {/* Envolver todo en el UserProvider */}
      <Router>
        <div className="font-sans bg-gray-100">
          <Navbar />
          <Routes>
            <Route path="/" element={<ParkingList />} /> {/* Ruta principal */}
            <Route path="/login" element={<Login />} /> {/* Ruta de Login */}
            <Route path="/register" element={<Register />} /> {/* Ruta de Registro */}
            <Route path="/my-parkings" element={<MyParkings />} /> {/* Ruta para MyParkings */}
            {/* Ruta para FileUpload  <Route path="/upload" element={<FileUpload />} /> */}
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
