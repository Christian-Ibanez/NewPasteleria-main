import React, { createContext, useContext, useEffect, useState } from 'react';

type Role = 'user' | 'admin' | 'system';

type User = {
  email: string;
  password: string; // Nota: para demo queda en texto plano; en producción usar hash
  role: Role;
  immutable?: boolean; // si true no puede borrarse
  nombre?: string;
  direccion?: string;
  telefono?: string;
  direccionesEntrega?: string[];
  historialPedidos?: any[];
  fechaNacimiento?: string;
  descuentoEspecial?: number;
  codigoDescuento?: string;
  esDuoc?: boolean;
  cumpleanos?: boolean;
};

type UserContextValue = {
  users: User[];
  currentUser: User | null;
  // backward-compatible alias used across components
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  // register can accept optional initial user data to store along with credentials
  register: (email: string, password: string, data?: Partial<User>) => { success: boolean; message?: string };
  deleteUser: (email: string) => { success: boolean; message?: string };
  isAdmin: () => boolean;
  updateUser: (userData: Partial<User>) => void;
  adminUpdateUser: (email: string, patch: Partial<User>) => { success: boolean; message?: string };
  addDeliveryAddress: (address: string) => void;
  changePassword: (oldPassword: string, newPassword: string) => boolean;
  addPedido: (pedido: any) => void;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

const USERS_KEY = 'np_users_v1';
const CURRENT_KEY = 'np_current_user_v1';

const seedUsers: User[] = [
  { email: 'system@admin.cl', password: 'system', role: 'system', immutable: true },
  { email: 'admin@admin.cl', password: 'admin', role: 'admin' },
];

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const raw = localStorage.getItem(USERS_KEY);
      if (!raw) {
        localStorage.setItem(USERS_KEY, JSON.stringify(seedUsers));
        return seedUsers;
      }
      const parsed = JSON.parse(raw) as User[];
      // Ensure seed users exist (idempotente)
      const emails = parsed.map(u => u.email.toLowerCase());
      const toAdd = seedUsers.filter(s => !emails.includes(s.email.toLowerCase()));
      if (toAdd.length > 0) {
        const merged = [...parsed, ...toAdd];
        localStorage.setItem(USERS_KEY, JSON.stringify(merged));
        return merged;
      }
      return parsed;
    } catch {
      localStorage.setItem(USERS_KEY, JSON.stringify(seedUsers));
      return seedUsers;
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem(CURRENT_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) localStorage.setItem(CURRENT_KEY, JSON.stringify(currentUser));
    else localStorage.removeItem(CURRENT_KEY);
  }, [currentUser]);

  const login = (email: string, password: string) => {
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (found) {
      setCurrentUser(found);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const register = (email: string, password: string, data?: Partial<User>) => {
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'El email ya está registrado' };
    }
    const nuevo: User = { email, password, role: 'user', ...data };
    setUsers(prev => [...prev, nuevo]);
    return { success: true };
  };

  const deleteUser = (email: string) => {
    const target = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!target) return { success: false, message: 'Usuario no encontrado' };
    if (target.immutable || target.role === 'system' || target.email.toLowerCase() === 'system@admin.cl') {
      return { success: false, message: 'Este usuario no puede eliminarse' };
    }
    setUsers(prev => prev.filter(u => u.email.toLowerCase() !== email.toLowerCase()));
    // Si se borró el usuario logueado, cerramos sesión
    if (currentUser && currentUser.email.toLowerCase() === email.toLowerCase()) {
      logout();
    }
    return { success: true };
  };

  const isAdmin = () => {
    return !!currentUser && (currentUser.role === 'admin' || currentUser.role === 'system' || currentUser.email.toLowerCase().endsWith('@admin.cl'));
  };

  const updateUser = (userData: Partial<User>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...userData };
    setUsers(prev => prev.map(u => 
      u.email === currentUser.email ? updatedUser : u
    ));
    setCurrentUser(updatedUser);
  };

  // Admin-only: patch any user by email
  const adminUpdateUser: UserContextValue['adminUpdateUser'] = (email, patch) => {
    const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (!exists) return { success: false, message: 'Usuario no encontrado' };
    // Never allow changing system role away from system
    const isSystem = email.toLowerCase() === 'system@admin.cl';
    const safePatch = isSystem ? { ...patch, role: 'system' as Role } : patch;
    setUsers(prev => prev.map(u => u.email.toLowerCase() === email.toLowerCase() ? { ...u, ...safePatch } : u));
    if (currentUser && currentUser.email.toLowerCase() === email.toLowerCase()) {
      setCurrentUser(prev => prev ? { ...prev, ...safePatch } : prev);
    }
    return { success: true };
  };

  const addDeliveryAddress = (address: string) => {
    if (!currentUser) return;
    const direccionesEntrega = [...(currentUser.direccionesEntrega || []), address];
    updateUser({ direccionesEntrega });
  };

  const changePassword = (oldPassword: string, newPassword: string) => {
    if (!currentUser || currentUser.password !== oldPassword) return false;
    updateUser({ password: newPassword });
    return true;
  };

  const addPedido = (pedido: any) => {
    if (!currentUser) return;
    const historialPedidos = [...(currentUser.historialPedidos || []), pedido];
    updateUser({ historialPedidos });
  };

  return (
    <UserContext.Provider value={{ 
      users, 
      currentUser,
      user: currentUser,
      login, 
      logout, 
      register, 
      deleteUser, 
      isAdmin,
      updateUser,
      adminUpdateUser,
      addDeliveryAddress,
      changePassword,
      addPedido
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