import axios from 'axios';

// Configurar la URL base del backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8083/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('np_current_user_v1');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
