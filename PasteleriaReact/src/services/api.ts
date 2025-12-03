import axios from 'axios';

// Configurar la URL base del backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Importante para CORS con credenciales
});

// Interceptor para agregar el token JWT a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el token expiró (401), limpiar y redirigir al login
    // PERO solo si NO estamos en las rutas de autenticación
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      const isAuthRoute = currentPath === '/login' || currentPath === '/register';
      
      // Si no estamos en una ruta de autenticación, es que el token expiró
      if (!isAuthRoute) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('usuario');
        window.location.href = '/login';
      }
      // Si estamos en login/register, solo rechazar el error sin redirigir
    }
    return Promise.reject(error);
  }
);

export default api;
