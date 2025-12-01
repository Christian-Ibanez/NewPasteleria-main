import api from './api';

export const descuentosService = {
  // Aplicar código de descuento
  aplicarDescuento: async (codigoDescuento: string, montoOriginal: number) => {
    const response = await api.post('/descuentos/aplicar', {
      codigoDescuento,
      montoOriginal,
    });
    return response.data;
  },

  // Validar código de descuento
  validarCodigo: async (codigo: string) => {
    const response = await api.get(`/descuentos/validar/${codigo}`);
    return response.data;
  },

  // Listar códigos (Admin)
  listarCodigos: async () => {
    const response = await api.get('/admin/descuentos');
    return response.data;
  },

  // Crear código (Admin)
  crearCodigo: async (data: {
    codigo: string;
    porcentaje: number;
    descripcion: string;
    activo: boolean;
  }) => {
    const response = await api.post('/admin/descuentos', data);
    return response.data;
  },
};
