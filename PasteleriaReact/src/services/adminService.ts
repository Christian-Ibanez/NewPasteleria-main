import api from './api';

export const adminService = {
  // Listar usuarios
  listarUsuarios: async (rol?: string, busqueda?: string, page: number = 1, limit: number = 10) => {
    const params = new URLSearchParams();
    if (rol) params.append('rol', rol);
    if (busqueda) params.append('busqueda', busqueda);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const response = await api.get(`/admin/usuarios?${params.toString()}`);
    return response.data;
  },

  // Obtener usuario
  obtenerUsuario: async (email: string) => {
    const response = await api.get(`/admin/usuarios/${email}`);
    return response.data;
  },

  // Actualizar usuario
  actualizarUsuario: async (email: string, data: any) => {
    const response = await api.put(`/admin/usuarios/${email}`, data);
    return response.data;
  },

  // Cambiar rol
  cambiarRol: async (email: string, rol: 'user' | 'admin') => {
    const response = await api.patch(`/admin/usuarios/${email}/rol`, { rol });
    return response.data;
  },

  // Estadísticas de ventas
  obtenerEstadisticasVentas: async (fechaInicio?: string, fechaFin?: string) => {
    const params = new URLSearchParams();
    if (fechaInicio) params.append('fechaInicio', fechaInicio);
    if (fechaFin) params.append('fechaFin', fechaFin);

    const response = await api.get(`/admin/estadisticas/ventas?${params.toString()}`);
    return response.data;
  },

  // Productos populares
  obtenerProductosPopulares: async (limite: number = 10) => {
    const response = await api.get(`/admin/estadisticas/productos-populares?limite=${limite}`);
    return response.data;
  },

  // Pedidos por estado
  obtenerPedidosPorEstado: async () => {
    const response = await api.get('/admin/estadisticas/pedidos-por-estado');
    return response.data;
  },
};
