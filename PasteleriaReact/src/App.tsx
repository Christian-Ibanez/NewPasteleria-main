import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/admin/Dashboard';
import Catalogo from './components/catalogo';
import Layout from './components/Layout';
import Home from './pages/Home';
import Cart from './components/shop/Cart';
import Historia from './components/Historia';
import Profile from './pages/Profile';
import { UserProvider } from './context/UserContext';
import { CartProvider } from './context/CartContext';
import { ProductsProvider } from './context/ProductsContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/globals.css';

console.log('App is rendering'); // Para debug

const App: React.FC = () => (
  <UserProvider>
    <CartProvider>
      <ProductsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="catalogo" element={<Catalogo />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="cart" element={<Cart />} />
            <Route path="nuestra-historia" element={<Historia />} />
            {/** Ruta de promociones eliminada por solicitud del usuario */}
            <Route path="profile" element={<Profile />} />
          </Route>
          {/* Dashboard admin SIN Layout (sin NavBar ni Footer) */}
          <Route path="/admin/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
      </ProductsProvider>
    </CartProvider>
  </UserProvider>
);

export default App;