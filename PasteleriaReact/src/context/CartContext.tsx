import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CarritoItem } from '../types';
import { useUser } from './UserContext';

interface CartContextType {
  items: CarritoItem[];
  addItem: (item: CarritoItem) => void;
  removeItem: (productoId: string) => void;
  updateQuantity: (productoId: string, quantity: number) => void;
  clearCart: () => void;
  itemsCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const GUEST_KEY = 'np_cart_v1';
  const { user } = useUser();

  const getKeyFor = (u: any | null) => u && u.email ? `np_cart_${u.email.toLowerCase()}` : GUEST_KEY;

  const [items, setItems] = useState<CarritoItem[]>(() => {
    try {
      const key = getKeyFor(null); // initialize from guest by default; will adjust on effect when user available
      const raw = localStorage.getItem(key);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as CarritoItem[];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  });

  // When user changes (login/logout), load that user's cart. If user logs in and has no cart but guest cart exists, migrate it.
  useEffect(() => {
    const key = getKeyFor(user);
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw) as CarritoItem[];
        setItems(Array.isArray(parsed) ? parsed : []);
        return;
      }

      // If user logged in and no saved cart, attempt to migrate guest cart
      if (user) {
        const guestRaw = localStorage.getItem(GUEST_KEY);
        if (guestRaw) {
          const guestParsed = JSON.parse(guestRaw) as CarritoItem[];
          if (Array.isArray(guestParsed) && guestParsed.length > 0) {
            // Save guest cart under user key and clear guest cart
            localStorage.setItem(key, JSON.stringify(guestParsed));
            localStorage.removeItem(GUEST_KEY);
            setItems(guestParsed);
            return;
          }
        }
      }

      // Otherwise start with empty cart
      setItems([]);
    } catch (e) {
      // ignore
    }
  }, [user]);

  // Persist cart to localStorage whenever items or user (key) change
  useEffect(() => {
    try {
      const key = getKeyFor(user);
      if (items.length > 0) localStorage.setItem(key, JSON.stringify(items));
      else localStorage.removeItem(key);
    } catch (e) {
      // ignore storage errors
    }
  }, [items, user]);

  const addItem = (item: CarritoItem) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(i => i.producto.id === item.producto.id);
      if (existingItem) {
        return currentItems.map(i =>
          i.producto.id === item.producto.id
            ? { ...i, cantidad: i.cantidad + item.cantidad }
            : i
        );
      }
      return [...currentItems, item];
    });
  };

  const removeItem = (productoId: string) => {
    setItems(currentItems => currentItems.filter(item => item.producto.id !== productoId));
  };

  const updateQuantity = (productoId: string, quantity: number) => {
    setItems(currentItems =>
      currentItems.map(item =>
        item.producto.id === productoId
          ? { ...item, cantidad: quantity }
          : item
      ).filter(item => item.cantidad > 0)
    );
  };

  const clearCart = () => {
    setItems([]);
    try {
      const key = getKeyFor(user);
      localStorage.removeItem(key);
      // also remove guest key to avoid stale data
      if (key !== GUEST_KEY) localStorage.removeItem(GUEST_KEY);
    } catch {}
  };

  const itemsCount = items.reduce((total, item) => total + item.cantidad, 0);

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    itemsCount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};