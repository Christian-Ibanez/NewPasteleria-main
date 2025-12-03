import api from './api';
import type { Producto } from '../types';

export const productosService = {
  // Listar todos los productos
  listarProductos: async (
    categoria?: string,
    busqueda?: string,
    page: number = 1,
    limit: number = 100
  ) => {
    const params = new URLSearchParams();
    if (categoria) params.append('categoria', categoria);
    if (busqueda) params.append('busqueda', busqueda);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const response = await api.get(`/productos?${params.toString()}`);
    
    // El backend devuelve {success, message, data: {productos: []}, error}
    if (response.data && response.data.data) {
      // Primero intentar con data.productos
      if (Array.isArray(response.data.data.productos)) {
        return response.data.data.productos;
      }
      // Si data.content existe, es una respuesta paginada
      if (Array.isArray(response.data.data.content)) {
        return response.data.data.content;
      }
      // Si data es directamente un array
      if (Array.isArray(response.data.data)) {
        return response.data.data;
      }
    }
    
    // Fallback: retornar array vacío si no se encuentra la estructura esperada
    return [];
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
  crearProducto: async (data: {
    id: string;
    nombre: string;
    descripcion?: string;
    precio: number;
    imagen?: string;
    stock: number;
    categoria?: string;
    disponible?: boolean;
  }) => {
    // Preparar datos según el formato del backend
    const productData = {
      id: data.id,
      nombre: data.nombre,
      precio: data.precio,
      stock: data.stock,
      ...(data.descripcion && { descripcion: data.descripcion }),
      ...(data.imagen && { imagen: data.imagen }),
      ...(data.categoria && { categoria: data.categoria }),
      ...(data.disponible !== undefined && { disponible: data.disponible }),
    };
    
    console.log('Enviando datos al backend:', productData);
    
    const response = await api.post('/admin/productos', productData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  // Actualizar producto (Admin)
  actualizarProducto: async (productoId: string, data: Partial<Producto>) => {
    const response = await api.put(`/admin/productos/${productoId}`, data);
    return response.data;
  },

  // Eliminar producto (Admin)
  eliminarProducto: async (productoId: string) => {
    const response = await api.delete(`/admin/productos/${productoId}`);
    return response.data;
  },

  // Actualizar stock (Admin)
  actualizarStock: async (productoId: string, nuevoStock: number) => {
    const response = await api.patch(`/admin/productos/${productoId}/stock`, {
      nuevoStock,
    });
    return response.data;
  },
};
