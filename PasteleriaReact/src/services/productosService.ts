import api from './api';
import type { Producto } from '../types';

export const productosService = {
  // Listar todos los productos
  listarProductos: async (
    categoria?: string,
    busqueda?: string,
    page: number = 1,
    limit: number = 10
  ) => {
    const params = new URLSearchParams();
    if (categoria) params.append('categoria', categoria);
    if (busqueda) params.append('busqueda', busqueda);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const response = await api.get(`/productos?${params.toString()}`);
    return response.data;
  },

  // Obtener producto por ID
  obtenerProducto: async (productoId: string) => {
    const response = await api.get(`/productos/${productoId}`);
    return response.data;
  },

  // Listar categorías
  listarCategorias: async () => {
    const response = await api.get('/productos/categorias');
    return response.data;
  },

  // Crear producto (Admin)
  crearProducto: async (formData: FormData) => {
    const response = await api.post('/productos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Actualizar producto (Admin)
  actualizarProducto: async (productoId: string, data: Partial<Producto>) => {
    const response = await api.put(`/productos/${productoId}`, data);
    return response.data;
  },

  // Eliminar producto (Admin)
  eliminarProducto: async (productoId: string) => {
    const response = await api.delete(`/productos/${productoId}`);
    return response.data;
  },

  // Actualizar stock (Admin)
  actualizarStock: async (productoId: string, nuevoStock: number) => {
    const response = await api.patch(`/productos/${productoId}/stock`, {
      nuevoStock,
    });
    return response.data;
  },
};
