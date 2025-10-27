import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { CATALOGO_PRODUCTOS, type Producto } from '../data/productos';

type ProductsContextValue = {
  products: Producto[];
  addProduct: (p: Omit<Producto, 'id' | 'codigo'> & Partial<Pick<Producto, 'id' | 'codigo'>>) => void;
  updateProduct: (id: string, patch: Partial<Producto>) => void;
  deleteProduct: (id: string) => void;
  refreshFromSeed: () => void;
};

const ProductsContext = createContext<ProductsContextValue | undefined>(undefined);

const KEY = 'np_products_v1';

function loadInitial(): Producto[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Producto[];
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  // Seed on first use
  try { localStorage.setItem(KEY, JSON.stringify(CATALOGO_PRODUCTOS)); } catch {}
  return CATALOGO_PRODUCTOS;
}

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Producto[]>(loadInitial);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(products));
    } catch {}
  }, [products]);

  const addProduct: ProductsContextValue['addProduct'] = (p) => {
    const id = (p.id && p.id.trim()) || `P-${Date.now().toString(36)}`;
    const codigo = (p.codigo && p.codigo.trim()) || id.toUpperCase();
    const nuevo: Producto = {
      id,
      codigo,
      categoria: p.categoria,
      nombre: p.nombre,
      precio: p.precio,
      descripcion: p.descripcion,
      esPersonalizable: !!p.esPersonalizable,
      imagen: p.imagen,
      stock: p.stock ?? 0,
    };
    setProducts(prev => [nuevo, ...prev]);
  };

  const updateProduct: ProductsContextValue['updateProduct'] = (id, patch) => {
    setProducts(prev => prev.map(pr => pr.id === id ? { ...pr, ...patch, id: pr.id, codigo: pr.codigo } : pr));
  };

  const deleteProduct: ProductsContextValue['deleteProduct'] = (id) => {
    setProducts(prev => prev.filter(pr => pr.id !== id));
  };

  const refreshFromSeed = () => {
    setProducts(CATALOGO_PRODUCTOS);
  };

  const value = useMemo(() => ({ products, addProduct, updateProduct, deleteProduct, refreshFromSeed }), [products]);

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
};

export const useProducts = () => {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts debe usarse dentro de ProductsProvider');
  return ctx;
};
