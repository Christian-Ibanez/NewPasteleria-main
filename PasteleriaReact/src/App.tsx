import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login';
import Dashboard from './components/admin/Dashboard';
import Catalogo from './components/catalogo';
import { UserProvider } from './context/UserContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/globals.css';

console.log('App is rendering'); // Para debug

const App: React.FC = () => (
  <UserProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Catalogo />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        {/* otras rutas */}
      </Routes>
    </BrowserRouter>
  </UserProvider>
);

export default App;