import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Usuario, Pedido } from '../types';

interface UserContextType {
  user: Usuario | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  updateUser: (userData: Partial<Usuario>) => void;
  addDeliveryAddress: (address: string) => void;
  changePassword: (oldPassword: string, newPassword: string) => boolean;
  addPedido: (pedido: Pedido) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);

  // Cargar usuario del localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u: Usuario) => u.email === email && u.password === password);
    
    if (foundUser) {
      // No guardar la contraseña en el estado
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateUser = (userData: Partial<Usuario>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      
      // Actualizar en localStorage
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // Actualizar en la lista de usuarios
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map((u: Usuario) => 
        u.id === user.id ? { ...u, ...userData } : u
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    }
  };

  const addDeliveryAddress = (address: string) => {
    if (user) {
      const updatedAddresses = [...(user.direccionesEntrega || []), address];
      updateUser({ direccionesEntrega: updatedAddresses });
    }
  };

  const changePassword = (oldPassword: string, newPassword: string): boolean => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const currentUser = users.find((u: Usuario) => u.id === user?.id);
    
    if (currentUser && currentUser.password === oldPassword) {
      const updatedUsers = users.map((u: Usuario) => 
        u.id === user?.id ? { ...u, password: newPassword } : u
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      return true;
    }
    return false;
  };

  const addPedido = (pedido: Pedido) => {
    if (user) {
      const updatedUser = {
        ...user,
        historialPedidos: [...(user.historialPedidos || []), pedido]
      };
      setUser(updatedUser);
      
      // Actualizar en localStorage
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // Actualizar en la lista de usuarios
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map((u: Usuario) => 
        u.id === user.id ? updatedUser : u
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    }
  };

  const value = {
    user,
    login,
    logout,
    updateUser,
    addDeliveryAddress,
    changePassword,
    addPedido
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};