import api from './api';
import type { Usuario } from '../types';

export const authService = {
  // Registro
  register: async (email: string, password: string, nombre?: string, telefono?: string, direccion?: string) => {
    const response = await api.post('/auth/register', {
      email,
      password,
      nombre,
      telefono,
      direccion,
    });
    return response.data;
  },

  // Login
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    return response.data;
  },

  // Logout
  logout: async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('authToken');
    localStorage.removeItem('np_current_user_v1');
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
  cambiarPassword: async (passwordActual: string, passwordNueva: string) => {
    const response = await api.post('/usuarios/cambiar-password', {
      passwordActual,
      passwordNueva,
    });
    return response.data;
  },

  // Agregar dirección
  agregarDireccion: async (direccion: string) => {
    const response = await api.post('/usuarios/direcciones', { direccion });
    return response.data;
  },

  // Listar direcciones
  listarDirecciones: async () => {
    const response = await api.get('/usuarios/direcciones');
    return response.data;
  },

  // Eliminar dirección
  eliminarDireccion: async (index: number) => {
    const response = await api.delete(`/usuarios/direcciones/${index}`);
    return response.data;
  },

  // Eliminar usuario
  eliminarUsuario: async (email: string) => {
    const response = await api.delete(`/usuarios/${email}`);
    return response.data;
  },
};
