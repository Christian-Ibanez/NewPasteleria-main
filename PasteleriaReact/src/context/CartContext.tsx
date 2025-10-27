import React, { createContext, useContext, useState } from 'react';
import type { CarritoItem } from '../types';

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
  const [items, setItems] = useState<CarritoItem[]>([]);

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