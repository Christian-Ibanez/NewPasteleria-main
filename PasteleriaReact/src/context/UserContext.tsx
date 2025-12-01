import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, usuarioService } from '../services/authService';
import type { Usuario } from '../types';

type UserContextValue = {
  currentUser: Usuario | null;
  user: Usuario | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  register: (email: string, password: string, data?: { nombre?: string; telefono?: string; direccion?: string }) => Promise<{ success: boolean; message?: string }>;
  isAdmin: () => boolean;
  updateUser: (userData: Partial<Usuario>) => Promise<void>;
  addDeliveryAddress: (address: string) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
  refreshUser: () => Promise<void>;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificar token al montar
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await authService.verifyToken();
          if (response.success && response.data) {
            setCurrentUser(response.data);
          } else {
            localStorage.removeItem('authToken');
            localStorage.removeItem('usuario');
          }
        } catch (error) {
          console.error('Error verificando token:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('usuario');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('UserContext: Iniciando login para', email);
      const response = await authService.login(email, password);
      console.log('UserContext: Respuesta de authService:', response);
      
      if (response.success && response.data) {
        console.log('UserContext: Login exitoso, usuario:', response.data.usuario);
        setCurrentUser(response.data.usuario);
        return { success: true };
      }
      console.warn('UserContext: Login falló', response);
      return { success: false, message: response.message || 'Error al iniciar sesión' };
    } catch (error: any) {
      console.error('UserContext: Error en login:', error);
      return { success: false, message: error.response?.data?.message || error.message || 'Error de conexión' };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error en logout:', error);
    }
    setCurrentUser(null);
  };

  const register = async (email: string, password: string, data?: { nombre?: string; telefono?: string; direccion?: string }) => {
    try {
      const response = await authService.register(email, password, data);
      if (response.success && response.data) {
        setCurrentUser(response.data.usuario);
        return { success: true };
      }
      return { success: false, message: response.message || 'Error al registrar' };
    } catch (error: any) {
      console.error('Error en registro:', error);
      return { success: false, message: error.response?.data?.message || 'Error de conexión' };
    }
  };

  const isAdmin = () => {
    return !!currentUser && (currentUser.rol === 'ADMIN' || currentUser.rol === 'SYSTEM');
  };

  const updateUser = async (userData: Partial<Usuario>) => {
    try {
      const response = await usuarioService.updatePerfil(userData);
      if (response.success && response.data) {
        setCurrentUser(response.data);
      }
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      throw error;
    }
  };

  const addDeliveryAddress = async (address: string) => {
    try {
      const response = await usuarioService.agregarDireccion(address);
      if (response.success && response.data) {
        setCurrentUser(response.data);
      }
    } catch (error) {
      console.error('Error agregando dirección:', error);
      throw error;
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      const response = await usuarioService.cambiarPassword(oldPassword, newPassword);
      return response.success;
    } catch (error) {
      console.error('Error cambiando contraseña:', error);
      return false;
    }
  };

  const refreshUser = async () => {
    try {
      const response = await usuarioService.getPerfil();
      if (response.success && response.data) {
        setCurrentUser(response.data);
      }
    } catch (error) {
      console.error('Error refrescando usuario:', error);
    }
  };

  return (
    <UserContext.Provider value={{ 
      currentUser,
      user: currentUser,
      loading,
      login, 
      logout, 
      register, 
      isAdmin,
      updateUser,
      addDeliveryAddress,
      changePassword,
      refreshUser
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser debe usarse dentro de UserProvider');
  return ctx;
};