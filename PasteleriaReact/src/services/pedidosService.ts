import api from './api';
import type { Pedido } from '../types';

export const pedidosService = {
  // Crear pedido
  crearPedido: async (data: {
    productos: Array<{
      productoId: string;
      cantidad: number;
      personalizacion?: string;
    }>;
    direccionEnvio: string;
    metodoPago: string;
    tarjetaUltimos4?: string;
    codigoDescuento?: string;
  }) => {
    const response = await api.post('/pedidos', data);
    return response.data;
  },

  // Obtener pedido por ID
  obtenerPedido: async (pedidoId: string) => {
    const response = await api.get(`/pedidos/${pedidoId}`);
    return response.data;
  },

  // Listar pedidos del usuario
  listarPedidos: async (estado?: string, page: number = 1, limit: number = 10) => {
    const params = new URLSearchParams();
    if (estado) params.append('estado', estado);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const response = await api.get(`/pedidos?${params.toString()}`);
    return response.data;
  },

  // Cancelar pedido
  cancelarPedido: async (pedidoId: string) => {
    const response = await api.post(`/pedidos/${pedidoId}/cancelar`);
    return response.data;
  },

  // Listar todos los pedidos (Admin)
  listarTodosPedidos: async (
    estado?: string,
    email?: string,
    fechaInicio?: string,
    fechaFin?: string,
    page: number = 1,
    limit: number = 10
  ) => {
    const params = new URLSearchParams();
    if (estado) params.append('estado', estado);
    if (email) params.append('email', email);
    if (fechaInicio) params.append('fechaInicio', fechaInicio);
    if (fechaFin) params.append('fechaFin', fechaFin);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const response = await api.get(`/admin/pedidos?${params.toString()}`);
    return response.data;
  },

  // Actualizar estado de pedido (Admin)
  actualizarEstado: async (pedidoId: string, estado: string) => {
    const response = await api.patch(`/admin/pedidos/${pedidoId}/estado`, { estado });
    return response.data;
  },
};
