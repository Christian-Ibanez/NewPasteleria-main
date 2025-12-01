import { createBrowserRouter } from 'react-router-dom';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import Catalogo from '../components/catalogo';
import Cart from '../components/shop/Cart';
import Historia from '../components/Historia';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import Profile from '../pages/Profile';
import Promociones from '../pages/Promociones';
import SimpleDashboard from '../components/admin/SimpleDashboard';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/catalogo',
        element: <Catalogo />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
      {
        path: '/cart',
        element: <Cart />,
      },
      {
        path: '/nuestra-historia',
        element: <Historia />,
      },
      {
        path: '/promociones',
        element: <Promociones />,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
      {
        path: '/admin/dashboard',
        element: <SimpleDashboard />,
      },
    ],
  },
]);