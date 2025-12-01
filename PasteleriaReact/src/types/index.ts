export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: 'USER' | 'ADMIN' | 'SYSTEM';
  telefono?: string;
  direccion?: string;
  fechaNacimiento?: string;
  descuentoEspecial: number;
  esDuoc: boolean;
  codigoDescuento?: string;
  direccionesEntrega: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  error: string | null;
}

export interface Producto {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  imagen?: string;
  esPersonalizable?: boolean;
  stock: number;
}

export interface Pedido {
  id: string;
  usuarioId: string;
  usuarioEmail?: string; // Email del usuario, útil para mostrar en el dashboard admin
  productos: {
    productoId: string;
    cantidad: number;
    precio: number;
    nombre: string;
    imagen: string;
    personalizacion?: string;
  }[];
  subtotal: number;
  descuento: number;
  total: number;
  estado: 'PENDIENTE' | 'EN_PROCESO' | 'ENTREGADO' | 'CANCELADO' | 'EN_PREPARACION' | 'ENVIADO';
  fechaPedido: string;
  fechaEntrega?: string;
  fechaCancelacion?: string;
  direccionEnvio: string;
  metodoPago: string;
  tarjetaUltimos4?: string;
}

export interface CarritoItem {
  producto: Producto;
  cantidad: number;
  // Mensaje opcional de personalización para el producto (ej. dedicatoria en tortas)
  personalizacion?: string;
}

export interface AuthState {
  user: Usuario | null;
  loading: boolean;
  error: string | null;
}