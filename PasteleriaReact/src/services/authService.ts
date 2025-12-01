import api from './api';
import type { Usuario } from '../types';

export const authService = {
  // Registro
  register: async (email: string, password: string, data?: { nombre?: string; telefono?: string; direccion?: string }) => {
    try {
      // Validaciones básicas antes de enviar
      if (!email || !password) {
        throw new Error('Email y contraseña son obligatorios');
      }
      
      if (!data?.nombre || data.nombre.trim().length < 3) {
        throw new Error('El nombre debe tener al menos 3 caracteres');
      }
      
      // El backend requiere esta estructura exacta
      const payload = {
        email: email.trim(),
        password: password,
        nombre: data.nombre.trim(),
        telefono: data?.telefono?.trim() || '',
        direccion: data?.direccion?.trim() || '',
      };
      
      console.log('Enviando registro:', payload); // Debug
      
      const response = await api.post('/auth/register', payload);
      
      console.log('Respuesta del servidor:', response.data); // Debug
      
      if (response.data.success && response.data.data?.token) {
        localStorage.setItem('authToken', response.data.data.token);
        localStorage.setItem('usuario', JSON.stringify(response.data.data.usuario));
      }
      return response.data;
    } catch (error: any) {
      console.error('Error detallado:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      // Si el error viene del backend, extraer el mensaje
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      throw error;
    }
  },

  // Login
  login: async (email: string, password: string) => {
    try {
      const payload = { email: email.trim(), password };
      
      console.log('Intentando login:', { email: payload.email }); // Debug (sin password)
      
      const response = await api.post('/auth/login', payload);
      
      console.log('Respuesta login:', response.data); // Debug
      
      if (response.data.success && response.data.data?.token) {
        localStorage.setItem('authToken', response.data.data.token);
        localStorage.setItem('usuario', JSON.stringify(response.data.data.usuario));
      }
      return response.data;
    } catch (error: any) {
      console.error('Error en login:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      throw error;
    }
  },

  // Logout
  logout: async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('authToken');
    localStorage.removeItem('usuario');
  },

  // Verificar token
  verifyToken: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  },
};

export const usuarioService = {
  // Obtener perfil
  getPerfil: async () => {
    const response = await api.get('/usuarios/perfil');
    return response.data;
  },

  // Actualizar perfil
  updatePerfil: async (data: Partial<Usuario>) => {
    const response = await api.put('/usuarios/perfil', data);
    return response.data;
  },

  // Cambiar contraseña
  cambiarPassword: async (oldPassword: string, newPassword: string) => {
    const response = await api.put('/usuarios/perfil/password', {
      oldPassword,
      newPassword,
    });
    return response.data;
  },

  // Agregar dirección
  agregarDireccion: async (direccion: string) => {
    const response = await api.post('/usuarios/perfil/direcciones', { direccion });
    return response.data;
  },

  // Eliminar dirección
  eliminarDireccion: async (direccion: string) => {
    const response = await api.delete('/usuarios/perfil/direcciones', { 
      data: { direccion } 
    });
    return response.data;
  },
};
