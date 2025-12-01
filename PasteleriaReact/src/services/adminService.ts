import api from './api';
import type { Usuario } from '../types';

export const adminService = {
  // Listar todos los usuarios
  listarUsuarios: async (page = 1, limit = 20, rol?: string) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (rol) params.append('rol', rol);

    const response = await api.get(`/admin/usuarios?${params.toString()}`);
    return response.data;
  },

  // Actualizar usuario (Admin)
  actualizarUsuario: async (usuarioId: string, updates: Partial<Usuario>) => {
    const response = await api.patch(`/admin/usuarios/${usuarioId}`, updates);
    return response.data;
  },

  // Listar todos los pedidos (Admin)
  listarPedidos: async (estado?: string, page = 1, limit = 20) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (estado) params.append('estado', estado);

    const response = await api.get(`/admin/pedidos?${params.toString()}`);
    return response.data;
  },

  // Actualizar estado de pedido (Admin)
  actualizarEstadoPedido: async (pedidoId: string, estado: string) => {
    const response = await api.patch(`/admin/pedidos/${pedidoId}/estado`, { estado });
    return response.data;
  },
};
