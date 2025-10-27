import React, { createContext, useContext, useEffect, useState } from 'react';

type Role = 'user' | 'admin' | 'system';

type User = {
  email: string;
  password: string; // Nota: para demo queda en texto plano; en producción usar hash
  role: Role;
  immutable?: boolean; // si true no puede borrarse
};

type UserContextValue = {
  users: User[];
  currentUser: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (email: string, password: string) => { success: boolean; message?: string };
  deleteUser: (email: string) => { success: boolean; message?: string };
  isAdmin: () => boolean;
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

  const register = (email: string, password: string) => {
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'El email ya está registrado' };
    }
    const nuevo: User = { email, password, role: 'user' };
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

  return (
    <UserContext.Provider value={{ users, currentUser, login, logout, register, deleteUser, isAdmin }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser debe usarse dentro de UserProvider');
  return ctx;
};